---
title: "GitHub Flavored Markdown with remark-gfm"
date: "2024-05-03"
subtitle: "Autolinks, footnotes, strikethrough, tables, and task lists"
tags: [Markdown]
---


[remark-gfm](https://github.com/remarkjs/remark-gfm) is a plugin for [remark](https://github.com/remarkjs/remark) that adds support for the Markdown extensions used by GitHub: autolink literals, footnotes, strikethrough, tables, and task lists.

The plugin parses and serializes these constructs. It does not turn Markdown into HTML or style the rendered result. Use a renderer such as [react-markdown](https://github.com/remarkjs/react-markdown) or [remark-rehype](https://github.com/remarkjs/remark-rehype) for that part of the pipeline.


## Installation

`remark-gfm` version 4 is ESM only. If a project already uses `react-markdown` or remark, install the plugin with npm.

```bash
npm install remark-gfm
```


## Use with `react-markdown`

Pass the plugin through the `remarkPlugins` property.

```javascript
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const content = 'Visit www.example.com or email support@example.com.'

export default function MarkdownExample() {
  return <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
}
```

To pass options to the plugin, use an array containing the plugin and its options.

```javascript
<Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>
  {content}
</Markdown>
```


## Use with `unified`

A standalone unified pipeline needs the parser, HTML transformer, and HTML serializer in addition to `remark-gfm`.

```bash
npm install unified remark-parse remark-gfm remark-rehype rehype-stringify
```

```javascript
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

const markdown = 'Visit www.example.com or email support@example.com.'

const file = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(markdown)

console.log(String(file))
```

Save this example as an `.mjs` file, or configure the project to use ESM.


## Autolink literals

Autolink literals turn URLs with a supported protocol, addresses beginning with `www.`, and email addresses into links without explicit Markdown link syntax.

:::simple
```markdown
Open (www.example.com), read https://example.com/docs,
or email support@example.com.
```

Open (www.example.com), read https://example.com/docs,
or email support@example.com.
:::

Autolinks are recognized only in certain positions, including at the beginning of a line and after whitespace or supported delimiter characters. A bare domain such as `example.com` is not as reliable as `www.example.com` or a URL with a protocol.

Use an explicit link when the destination is ambiguous or when the link needs custom text.

```markdown
Read the [installation guide](https://example.com/docs/install).
```


## Footnotes

Footnotes keep supporting information outside the main flow of a paragraph. A reference points to a definition with the same label.

:::simple
```markdown
The result is based on the published report[^report].

[^report]: Example Research Group, *Annual Report*, 2024.
```

The result is based on the published report[^report].

[^report]: Example Research Group, *Annual Report*, 2024.
:::

A footnote can contain multiple blocks when continuation lines are indented.

```markdown
The configuration has two requirements[^requirements].

[^requirements]: Install the required packages first.

    - Use a supported Node.js version.
    - Run the code as an ES module.
```

- Use descriptive labels in the source. The labels are replaced with numbers in the rendered output.
- Keep footnotes focused and place each definition after a blank line.
- Use the reference-and-definition syntax shown above. Inline forms such as `^[note]` are not supported by `remark-gfm`.


## Strikethrough

Wrap text in two tildes to mark it as deleted or no longer current.

:::simple
```markdown
~~This feature is deprecated.~~ Use the new API instead.
```

~~This feature is deprecated.~~ Use the new API instead.
:::

Strikethrough can contain other inline formatting.

- ~~**Bold strikethrough**~~
- ~~*Italic strikethrough*~~
- ~~`code strikethrough`~~

When it appears inside a nested list, indent the child list far enough to keep it inside the numbered item.

```markdown
1. **Price change**

    - Original price: ~~USD 99.99~~
    - Current price: USD 79.99

2. **Release progress**

    - ~~Complete the initial draft~~
    - Review with the team
```

`remark-gfm` also recognizes a single tilde by default. Use `{singleTilde: false}` when only the double-tilde form should create strikethrough text.


## Tables

A GFM table needs a header row and a delimiter row. Colons in the delimiter row control alignment.

:::simple
```markdown
| Package | Purpose | Downloads |
| :--- | :---: | ---: |
| `remark-gfm` | GFM syntax | 1200 |
| `remark-rehype` | HTML transformation | 950 |
```

| Package | Purpose | Downloads |
| :--- | :---: | ---: |
| `remark-gfm` | GFM syntax | 1200 |
| `remark-rehype` | HTML transformation | 950 |
:::

| Delimiter | Alignment |
| --- | --- |
| `---` or `:---` | Left |
| `:---:` | Center |
| `---:` | Right |

- Keep tables small enough to read on narrow screens.
- Align text to the left and numeric columns to the right unless the content requires something different.
- Escape a literal pipe inside a cell as `\|`.
- Spaces used to align the Markdown source do not control column widths in the rendered table. Content and CSS control the rendered layout.


## Task lists

Task lists render list items with checked or unchecked checkboxes.

:::simple
```markdown
- [x] Initialize the repository
- [ ] Configure continuous integration
    - [x] Add the test command
    - [ ] Add the deployment job
```

- [x] Initialize the repository
- [ ] Configure continuous integration
    - [x] Add the test command
    - [ ] Add the deployment job
:::

The generated checkboxes are disabled by default. They communicate status but are not interactive controls. Making them editable requires application state and event handling outside `remark-gfm`.


## Options

Pass options as the second value in the plugin tuple or as the second argument to `.use()`.

| Option | Default | Purpose |
| --- | --- | --- |
| `singleTilde` | `true` | Parse single-tilde strikethrough in addition to double tildes |
| `stringLength` | `value => value.length` | Measure table cell content when serializing aligned tables |
| `tableCellPadding` | `true` | Add spaces between table cell content and pipes when serializing |
| `tablePipeAlign` | `true` | Align table pipes when serializing |
| `firstLineBlank` | `false` | Add a blank first continuation line when serializing footnote definitions |

Most table-formatting options affect Markdown serialization rather than rendered HTML. For tables containing CJK characters or emoji, pass a visual-width function through `stringLength` if source alignment matters.


## Rendering and accessibility

`remark-gfm` adds syntax support but does not provide CSS. The renderer produces standard elements such as `<del>`, `<table>`, and disabled checkbox inputs. Add styles for table borders, horizontal overflow, task-list markers, and footnotes as needed.

Footnote labels and back-reference labels are exposed to assistive technology. When rendering non-English content with `remark-rehype`, translate `footnoteLabel` and `footnoteBackLabel` in the `remark-rehype` options.

:::note
The browser receives HTML or React elements produced by the renderer. Browser behavior therefore depends on the renderer and CSS, not on whether `remark-gfm` parsed the original Markdown.
:::


## Compatibility

The current `remark-gfm` version 4 release line has the following requirements.

| Component | Supported version |
| --- | --- |
| Module system | ESM |
| Node.js | 16 or later |
| `remark-parse` | 11 or later |
| `remark` | 15 or later |

If a project uses older versions of remark, select the corresponding earlier major version of `remark-gfm` rather than mixing incompatible release lines.


## Related features

Several GitHub-like behaviors are handled by other plugins or rendering tools.

| Feature | Tool |
| --- | --- |
| Convert Markdown to HTML | [`remark-rehype`](https://github.com/remarkjs/remark-rehype) |
| Render Markdown in React | [`react-markdown`](https://github.com/remarkjs/react-markdown) |
| Parse YAML front matter | [`remark-frontmatter`](https://github.com/remarkjs/remark-frontmatter) |
| Turn soft line endings into hard breaks | [`remark-breaks`](https://github.com/remarkjs/remark-breaks) |
| Link repository references, issues, and users | [`remark-github`](https://github.com/remarkjs/remark-github) |


## Additional resources

- [remark-gfm documentation](https://github.com/remarkjs/remark-gfm)
- [GitHub Flavored Markdown specification](https://github.github.com/gfm/)
- [GitHub Markdown syntax](https://docs.github.com/en/get-started/writing-on-github)
- [react-markdown documentation](https://github.com/remarkjs/react-markdown)
- [remark-rehype documentation](https://github.com/remarkjs/remark-rehype)
