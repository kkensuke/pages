---
title: "remark-gfm"
date: "2024-05-03"
subtitle: "自動リンク、脚注、取り消し線、表、タスクリスト"
tags: [Markdown]
icon: file-text
---


[remark-gfm](https://github.com/remarkjs/remark-gfm) は、GitHub で使われている Markdown 拡張である自動リンクリテラル、脚注、取り消し線、表、タスクリストを [remark](https://github.com/remarkjs/remark) で扱えるようにするプラグインです。

このプラグインは、これらの構文を解析し、Markdown として出力できるようにします。MarkdownからHTMLへの変換や、表示結果のスタイル設定は行いません。その処理には、[react-markdown](https://github.com/remarkjs/react-markdown) や [remark-rehype](https://github.com/remarkjs/remark-rehype) などのレンダラーを使用します。


## インストール

`remark-gfm` バージョン 4 は ESM 専用です。すでに `react-markdown` または remark を使っているプロジェクトでは、npm でプラグインをインストールします。

```bash
npm install remark-gfm
```


## `react-markdown` で使う

`remarkPlugins` プロパティへプラグインを渡します。

```javascript
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const content = 'Visit www.example.com or email support@example.com.'

export default function MarkdownExample() {
  return <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
}
```

プラグインへオプションを渡すには、プラグインとオプションを格納した配列を使います。

```javascript
<Markdown remarkPlugins={[[remarkGfm, {singleTilde: false}]]}>
  {content}
</Markdown>
```


## `unified`で使う

単独の unified パイプラインでは、`remark-gfm` に加えて、パーサー、HTML 変換プラグイン、HTML シリアライザーが必要です。

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

この例は `.mjs` ファイルとして保存するか、プロジェクトで ESM を使うように設定してください。


## 自動リンクリテラル

自動リンクリテラルは、対応するプロトコルを持つ URL、`www.` で始まるアドレス、メールアドレスを、明示的な Markdown リンク構文なしでリンクへ変換します。

:::simple
```markdown
Webサイト： www.example.com
ドキュメント： https://example.com/docs
問い合わせ先： support@example.com
```

Webサイト： www.example.com
ドキュメント： https://example.com/docs
問い合わせ先： support@example.com
:::

自動リンクが認識される位置には制限があります。行頭、空白の後、対応する区切り文字の後などで認識されます。`example.com` のようなドメイン名だけの表記は、`www.example.com` やプロトコル付きの URL ほど確実には認識されません。

日本語の文章では、URL の直後に読点や文字を続けると、それらがリンク先の一部として扱われる場合があります。URL を行末に置くか、明示的なリンク構文を使うと確実です。

リンク先が曖昧な場合や、リンクに独自のテキストを付ける場合は、明示的なリンク構文を使います。

```markdown
[インストールガイド](https://example.com/docs/install)を参照してください。
```


## 脚注

脚注を使うと、本文の流れから補足情報を分離できます。参照と定義には同じラベルを指定します。

:::simple
```markdown
この結果は公開された報告書に基づいています[^report]。

[^report]: Example Research Group、*年次報告書*、2024 年。
```

この結果は公開された報告書に基づいています[^report]。

[^report]: Example Research Group、*年次報告書*、2024 年。
:::

継続する行をインデントすると、脚注へ複数のブロックを含められます。

```markdown
この設定には 2 つの要件があります[^requirements]。

[^requirements]: 最初に必要なパッケージをインストールします。

    - 対応するバージョンの Node.js を使う。
    - ES モジュールとしてコードを実行する。
```

- ソースでは内容の分かるラベルを使います。表示時にはラベルが番号へ置き換えられます。
- 脚注では一つの内容だけを簡潔に説明し、空行の後に各定義を記述します。
- 上で示した参照と定義の構文を使います。`^[note]` のようなインライン形式は `remark-gfm` ではサポートされていません。


## 取り消し線

削除された内容や、現在は使われていない内容を示すには、テキストを 2 つのチルダで囲みます。

:::simple
```markdown
~~この機能は非推奨です。~~ 代わりに新しい API を使ってください。
```

~~この機能は非推奨です。~~ 代わりに新しい API を使ってください。
:::

取り消し線の内側には、ほかのインライン書式も含められます。

- ~~**太字の取り消し線**~~
- ~~*斜体の取り消し線*~~
- ~~`コードの取り消し線`~~

入れ子のリスト内で使う場合は、子リストが番号付き項目の内側に入るよう、十分にインデントします。

```markdown
1. **価格の変更**

    - 元の価格：~~99.99 米ドル~~
    - 現在の価格：79.99 米ドル

2. **リリースの進捗**

    - ~~最初の草稿を完成させる~~
    - チームでレビューする
```

`remark-gfm` は、デフォルトでは 1 つのチルダも取り消し線として認識します。2 つのチルダだけを取り消し線として扱う場合は、`{singleTilde: false}` を指定します。


## 表

GFM の表には、ヘッダー行と区切り行が必要です。区切り行のコロンで配置を指定します。

:::simple
```markdown
| パッケージ | 用途 | ダウンロード数 |
| :--- | :---: | ---: |
| `remark-gfm` | GFM 構文 | 1200 |
| `remark-rehype` | HTML への変換 | 950 |
```

| パッケージ | 用途 | ダウンロード数 |
| :--- | :---: | ---: |
| `remark-gfm` | GFM 構文 | 1200 |
| `remark-rehype` | HTML への変換 | 950 |
:::

| 区切り | 配置 |
| --- | --- |
| `---` または `:---` | 左寄せ |
| `:---:` | 中央寄せ |
| `---:` | 右寄せ |

- 幅の狭い画面でも読める大きさに表を収めます。
- 特別な理由がなければ、テキストは左寄せ、数値の列は右寄せにします。
- セル内にパイプを文字として記述する場合は、`\|` のようにエスケープします。
- Markdown ソースをそろえるために入れた空白は、表示される列幅には影響しません。表示時のレイアウトは内容と CSS によって決まります。


## タスクリスト

タスクリストは、チェック済みまたは未チェックのチェックボックス付きリストとして表示されます。

:::simple
```markdown
- [x] リポジトリを初期化する
- [ ] 継続的インテグレーションを設定する
    - [x] テストコマンドを追加する
    - [ ] デプロイジョブを追加する
```

- [x] リポジトリを初期化する
- [ ] 継続的インテグレーションを設定する
    - [x] テストコマンドを追加する
    - [ ] デプロイジョブを追加する
:::

生成されるチェックボックスは、デフォルトでは無効化されています。状態を示すための表示であり、操作できる入力欄ではありません。編集可能にするには、`remark-gfm` とは別にアプリケーションの状態管理とイベント処理が必要です。


## オプション

プラグインを格納する配列の 2 番目の値、または `.use()` の第 2 引数としてオプションを渡します。

| オプション | デフォルト | 用途 |
| --- | --- | --- |
| `singleTilde` | `true` | 2 つのチルダに加え、1 つのチルダも取り消し線として解析する |
| `stringLength` | `value => value.length` | 配置をそろえた表を出力するときに、セルの内容の長さを測る |
| `tableCellPadding` | `true` | 表を出力するときに、セルの内容とパイプの間へ空白を追加する |
| `tablePipeAlign` | `true` | 表を出力するときに、パイプの位置をそろえる |
| `firstLineBlank` | `false` | 脚注の定義を出力するときに、最初の継続行を空行にする |

表の書式に関するオプションの多くは、表示される HTML ではなく、Markdown として出力するときに作用します。CJK 文字や絵文字を含む表でソースの配置もそろえる場合は、`stringLength` へ表示幅を測る関数を渡します。


## 表示とアクセシビリティ

`remark-gfm` は構文へ対応させますが、CSS は提供しません。レンダラーは `<del>`、`<table>`、無効化されたチェックボックスなどの標準要素を生成します。必要に応じて、表の罫線と横方向のスクロール、タスクリストのマーカー、脚注のスタイルを追加します。

脚注の見出しと本文へ戻るリンクのラベルは、支援技術へ伝えられます。`remark-rehype` で英語以外の内容を表示する場合は、`remark-rehype` のオプションで `footnoteLabel` と `footnoteBackLabel` を翻訳してください。

:::note
ブラウザが受け取るのは、レンダラーが生成した HTML または React 要素です。そのため、ブラウザでの動作は、元の Markdown を `remark-gfm` が解析したかどうかではなく、レンダラーと CSS によって決まります。
:::


## 互換性

現在の `remark-gfm` バージョン 4 のリリース系列には、次の要件があります。

| コンポーネント | 対応バージョン |
| --- | --- |
| モジュールシステム | ESM |
| Node.js | 16 以降 |
| `remark-parse` | 11 以降 |
| `remark` | 15 以降 |

プロジェクトが古いバージョンの remark を使っている場合は、互換性のないリリース系列を組み合わせず、対応する以前のメジャーバージョンの `remark-gfm` を選択してください。


## 関連機能

GitHub に似た動作の一部は、ほかのプラグインやレンダリングツールが担当します。

| 機能 | ツール |
| --- | --- |
| Markdown を HTML へ変換する | [`remark-rehype`](https://github.com/remarkjs/remark-rehype) |
| React で Markdown を表示する | [`react-markdown`](https://github.com/remarkjs/react-markdown) |
| YAML フロントマターを解析する | [`remark-frontmatter`](https://github.com/remarkjs/remark-frontmatter) |
| 通常の改行を強制改行へ変換する | [`remark-breaks`](https://github.com/remarkjs/remark-breaks) |
| リポジトリの参照、Issue、ユーザーをリンクにする | [`remark-github`](https://github.com/remarkjs/remark-github) |


## 関連資料

- [remark-gfmの ドキュメント](https://github.com/remarkjs/remark-gfm)
- [GitHub Flavored Markdown の仕様](https://github.github.com/gfm/)
- [GitHubでのMarkdown の書き方](https://docs.github.com/ja/get-started/writing-on-github)
- [react-markdown のドキュメント](https://github.com/remarkjs/react-markdown)
- [remark-rehype のドキュメント](https://github.com/remarkjs/remark-rehype)
