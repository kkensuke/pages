---
title: "このブログの Markdown で使える Admonition"
date: "2024-10-31"
subtitle: "このブログの Markdown で Admonition とディレクティブを使う方法"
tags: [Markdown]
icon: message-square-warning
---


このガイドでは、記事を分かりやすく見せるために、このブログの Markdown で Admonition とディレクティブを使う方法を説明します。

## インラインディレクティブ `:name[label]{attributes}`
インラインディレクティブを使うと、文章の一部に特別な書式や機能を追加できます。
よくある用途の 1 つは、キーボードショートカットや UI 要素を表すボタンの作成です。

::::simple{title="ボタン"}
```markdown
:btn[cmd], :btn[shift], :btn[ctrl], :btn[opt], :btn[enter],
:btn[left], :btn[right], :btn[up], :btn[down], :btn[tab],
:btn[space], :btn[delete], :btn[esc], :btn[custom]
```
:::simple
:btn[cmd], :btn[shift], :btn[ctrl], :btn[opt], :btn[enter], :btn[left], :btn[right], :btn[up], :btn[down], :btn[tab], :btn[space], :btn[delete], :btn[esc], :btn[カスタム]
:::
::::

別の例として、文章中に YouTube へのリンクを埋め込めます。

::::simple{title="YouTube リンク"}
```markdown
YouTube で動画を見る：:youtube[ここをクリック]{#dQw4w9WgXcQ}
```
:::simple
YouTube で動画を見る：:youtube[ここをクリック]{#dQw4w9WgXcQ}
:::
::::


## ブロックディレクティブ `::name[label]{attributes}`
### YouTube 埋め込み
ブロックディレクティブを使うと、YouTube 動画を独立したブロックとして埋め込めます。
::::simple{title="YouTube 埋め込み"}
```markdown
::youtube[この動画を見る]{#dQw4w9WgXcQ}
```

::youtube[この動画を見る]{#dQw4w9WgXcQ}
::::


### アートブロック
装飾用の SVG パターンを埋め込む `::art` ディレクティブもあります。記事に視覚的なアクセントを加えられます。
::::simple{title="アートブロック"}
```markdown
::art{type="wave" color="blue"}
```

::art{type="wave" color="blue"}
::::


### GitHub からコードを読み込む
`github-code` ディレクティブに GitHub の `blob` URL を指定します。記事の表示時にコードが取得され、通常のコードブロックと同じシンタックスハイライト、コピーボタン、任意の行番号が適用されます。title を省略すると、ファイル名がタイトルとして使われます。

::::simple{title="GitHub Code Block"}
```markdown
::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true lines="2-8"}
```

::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true lines="2-8"}
::::


## リンクカード

::::simple
```markdown
:::linkcard
https://www.google.com/
:::
```

:::linkcard
https://www.google.com/
:::
::::

:::linkcard
https://www.mozilla.org
:::

:::linkcard
https://github.com
:::



## Admonition

Admonition は、重要な情報を目立たせるための特別な書式を持つコンテンツブロックです。

### 基本構文

```markdown
:::type
ここに内容を書きます
:::
```

### 使用できる種類

::::simple
```markdown
:::note
これは note の Admonition です。
:::
```
:::note
これは note の Admonition です。
:::
::::

:::overview
これは overview の Admonition です。
:::

:::warning
これは warning の Admonition です。
:::

:::important
これは important の Admonition です。
:::

:::tip
これは tip の Admonition です。
:::

:::example
これは example の Admonition です。
:::

:::comment
これは comment の Admonition です。
:::

:::quote
これは quote の Admonition です。
:::

:::question
これは question の Admonition です。
:::

:::simple{title="タイトル付きの Simple Admonition"}
これは独自タイトルを指定した simple の Admonition です。
:::

:::simple
これはタイトルを指定していない simple の Admonition です。
:::

### 独自タイトル

::::simple
```markdown
:::note{title="知っていましたか？"}
どの Admonition にも独自のタイトルを設定できます。
:::
```

:::note{title="知っていましたか？"}
どの Admonition にも独自のタイトルを設定できます。
:::
::::

### Admonition の入れ子

開始タグと終了タグのコロンを増やすと、Admonition を入れ子にできます。

::::note{title="外側の Admonition"}
これは 外側 の Admonition です。

:::important{title="内側のAdmonition"}
これは入れ子になった important の Admonition です。
:::
::::

## 使用上のポイント

1. 文章の流れに含まれる要素にはインラインディレクティブ（`:`）を使います。
2. 埋め込みなどの独立した要素にはブロックディレクティブ（`::`）を使います。
3. 内容に合った Admonition の種類を選びます。
4. Admonition には、内容が分かる明確なタイトルを付けます。
5. Admonition を使いすぎず、本当に重要な情報を強調するために使います。
