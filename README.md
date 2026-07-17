
# Features added
- Header, Footer, Homepage
- Sort blog posts by date
- Pagination
- Markdown image
- Table of contents
- Tags
- Preview image
- Code block with highlighting, line numbers and copy button, file name
- Directives
    - Admonitions (tip, note, warning, etc.)
    - button shortcode
    - Link card
    - Youtube link
    - Youtube embedding
    - Art block (decorative SVG patterns)
- Latex math
- remark-gfm package (footnote, strikethrough, tasklist, table, etc.)
- Buy me a coffee widget
- Stripe payment
- Comment section (utterances)
- Analytics (Vercel Analytics)
- Download or show markdown of the blog post
- import code from github repository

## GitHub code embedding

Add a leaf directive with a GitHub `blob` URL to a post:

```md
::github-code{url="https://github.com/kkensuke/dotfiles/blob/main/zsh/.zshrc" language="zsh" showLineNumbers=true}
```

`language`, `title`, and `showLineNumbers` are optional. The source file is fetched
when the post is rendered, and a link to the original GitHub file is shown below it.
