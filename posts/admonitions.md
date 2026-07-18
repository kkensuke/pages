---
title: "このブログのMarkdownで使えるAdmonition"
date: "2024-10-31"
subtitle: "このブログのMarkdownでAdmonitionとディレクティブを使う方法"
tags: [Markdown]
---


このガイドでは、記事を分かりやすく見せるために、このブログのMarkdownでAdmonitionとディレクティブを使う方法を説明します。

## インラインディレクティブ `:name[label]{attributes}`

インラインディレクティブを使うと、文章の一部に特別な書式や機能を追加できます。
よくある用途の1つは、キーボードショートカットやUI要素を表すボタンの作成です。

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

別の例として、文章中にYouTubeへのリンクを埋め込めます。

::::simple{title="YouTubeリンク"}
```markdown
YouTubeで動画を見る：:youtube[ここをクリック]{#dQw4w9WgXcQ}
```
:::simple
YouTubeで動画を見る：:youtube[ここをクリック]{#dQw4w9WgXcQ}
:::
::::


## ブロックディレクティブ `::name[label]{attributes}`

ブロックディレクティブを使うと、YouTube動画を独立したブロックとして埋め込めます。

::::simple{title="YouTube埋め込み"}
```markdown
::youtube[この動画を見る]{#dQw4w9WgXcQ}
```
::youtube[この動画を見る]{#dQw4w9WgXcQ}
::::

装飾用のSVGパターンを埋め込む `::art` ディレクティブもあります。記事に視覚的なアクセントを加えられます。

::::simple{title="アートブロック"}
```markdown
::art{type="wave" color="blue"}
```
::art{type="wave" color="blue"}
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


## GitHubからコードを読み込む

`github-code` ディレクティブにGitHubの `blob` URLを指定します。記事の表示時にコードが取得され、通常のコードブロックと同じシンタックスハイライト、コピーボタン、任意の行番号が適用されます。

````md[title=markdown]
# titleを省略すると、ファイル名がタイトルとして使われます。
::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true lines="2-8"}
````

出力：

::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true lines="2-8"}



## Admonition

Admonitionは、重要な情報を目立たせるための特別な書式を持つコンテンツブロックです。

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
これはnoteのAdmonitionです。
:::
```
:::note
これはnoteのAdmonitionです。
:::
::::

:::overview
これはoverviewのAdmonitionです。
:::

:::warning
これはwarningのAdmonitionです。
:::

:::important
これはimportantのAdmonitionです。
:::

:::tip
これはtipのAdmonitionです。
:::

:::example
これはexampleのAdmonitionです。
:::

:::comment
これはcommentのAdmonitionです。
:::

:::quote
これはquoteのAdmonitionです。
:::

:::question
これはquestionのAdmonitionです。
:::

:::simple{title="タイトル付きのSimple Admonition"}
これは独自タイトルを指定したsimpleのAdmonitionです。
:::

:::simple
これはタイトルを指定していないsimpleのAdmonitionです。
:::

### 独自タイトル

::::simple
```markdown
:::note{title="知っていましたか？"}
どのAdmonitionにも独自のタイトルを設定できます。
:::
```

:::note{title="知っていましたか？"}
どのAdmonitionにも独自のタイトルを設定できます。
:::
::::

### Admonitionの入れ子

開始タグと終了タグのコロンを増やすと、Admonitionを入れ子にできます。

::::note{title="外側のAdmonition"}
これは外側のAdmonitionです。

:::important{title="内側のAdmonition"}
これは入れ子になったimportantのAdmonitionです。
:::
::::

## 使用上のポイント

1. 文章の流れに含まれる要素にはインラインディレクティブ（`:`）を使います。
2. 埋め込みなどの独立した要素にはブロックディレクティブ（`::`）を使います。
3. 内容に合ったAdmonitionの種類を選びます。
4. Admonitionには、内容が分かる明確なタイトルを付けます。
5. Admonitionを使いすぎず、本当に重要な情報を強調するために使います。
