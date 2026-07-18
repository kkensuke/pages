import path from 'path';

type DirectiveAttributes = Record<string, string>;

const GITHUB_BLOB_URL = /^\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/;

const languages: Record<string, string> = {
  bash: 'bash',
  css: 'css',
  html: 'html',
  js: 'javascript',
  jsx: 'jsx',
  json: 'json',
  md: 'markdown',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  sh: 'bash',
  ts: 'typescript',
  tsx: 'tsx',
  yaml: 'yaml',
  yml: 'yaml',
  zsh: 'zsh',
};

function parseAttributes(value: string): DirectiveAttributes {
  const attributes: DirectiveAttributes = {};
  const pattern = /(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    attributes[match[1]] = match[2] ?? match[3] ?? match[4];
  }

  return attributes;
}

function getGitHubFile(urlString: string) {
  const url = new URL(urlString);
  const match = url.protocol === 'https:' && url.hostname === 'github.com'
    ? url.pathname.match(GITHUB_BLOB_URL)
    : null;

  if (!match) {
    throw new Error(`GitHub code URL must be an https://github.com/.../blob/... URL: ${urlString}`);
  }

  const [, owner, repository, ref, filePath] = match;

  return {
    filePath,
    rawUrl: `https://raw.githubusercontent.com/${owner}/${repository}/${ref}/${filePath}`,
  };
}

function inferLanguage(filePath: string) {
  const fileName = path.posix.basename(filePath).toLowerCase();

  if (fileName === '.zshrc') return 'zsh';
  if (fileName === '.bashrc') return 'bash';
  if (fileName === 'dockerfile') return 'docker';

  return languages[path.posix.extname(fileName).slice(1)] ?? 'plaintext';
}

function selectLines(code: string, range?: string) {
  if (!range) return { code, startingLineNumber: 1 };

  const match = /^(\d+)-(\d+)$/.exec(range);
  const start = match ? Number(match[1]) : 0;
  const end = match ? Number(match[2]) : 0;
  const lines = code.split('\n');

  if (!match || start < 1 || end < start || end > lines.length) {
    throw new Error(`github-code lines must be within the file and use "start-end": ${range}`);
  }

  return {
    code: lines.slice(start - 1, end).join('\n'),
    startingLineNumber: start,
  };
}

async function renderDirective(attributes: DirectiveAttributes) {
  if (!attributes.url) {
    throw new Error('github-code directive requires a url attribute');
  }

  const { filePath, rawUrl } = getGitHubFile(attributes.url);
  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub code (${response.status}): ${attributes.url}`);
  }

  const fetchedCode = (await response.text()).replace(/\n$/, '');
  const { code, startingLineNumber } = selectLines(fetchedCode, attributes.lines);
  const backtickRuns: string[] = code.match(/`+/g) || [];
  const longestBacktickRun = backtickRuns
    .reduce((longest, run) => Math.max(longest, run.length), 2);
  const fence = '`'.repeat(longestBacktickRun + 1);
  const language = attributes.language || inferLanguage(filePath);
  const title = (attributes.title || decodeURIComponent(path.posix.basename(filePath)))
    .replace(/[,\]]/g, '_');
  const properties = [
    `title=${title}`,
    attributes.showLineNumbers === 'true' ? 'showLineNumbers=true' : null,
    attributes.showLineNumbers === 'true' && startingLineNumber > 1
      ? `startingLineNumber=${startingLineNumber}`
      : null,
  ].filter(Boolean).join(',');

  return [
    `${fence}${language}[${properties}]`,
    code,
    fence,
    '',
    `[Source on GitHub](${attributes.url})`,
  ].join('\n');
}

export default async function embedGitHubCode(markdown: string) {
  const lines = markdown.split('\n');
  let openFence: { character: string; length: number } | null = null;

  const rendered = lines.map((line) => {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);

    if (fence) {
      const marker = fence[1];

      if (!openFence) {
        openFence = { character: marker[0], length: marker.length };
      } else if (marker[0] === openFence.character && marker.length >= openFence.length) {
        openFence = null;
      }

      return line;
    }

    if (openFence) return line;

    const directive = line.match(/^\s*::github-code\{(.+)\}\s*$/);
    return directive ? renderDirective(parseAttributes(directive[1])) : line;
  });

  return (await Promise.all(rendered)).join('\n');
}
