---
title: "Art Blocks — マークダウンで描く装飾パターン"
date: "2026-05-10"
subtitle: "art ディレクティブを使って記事に視覚的なアクセントを加える方法"
tags: [Markdown, Design]
---


ブログ記事の中に、SVG で描かれた装飾パターンをワンライナーで埋め込める `::art` ディレクティブの使い方を紹介します。

## 基本的な書き方

```markdown
::art{type="パターン名" color="カラー名"}
```

`type` と `color` の 2 つの属性を指定するだけで、記事内に装飾ブロックが現れます。どちらも省略可能で、省略した場合は `wave` / `blue` が使われます。


## 5 種類のパターン

### wave — 波

海の波のように重なり合うグラデーション層を描きます。セクションの締めくくりや、読者に一息ついてもらいたい場所に合います。

```markdown
::art{type="wave" color="blue"}
```

::art{type="wave" color="blue"}

---

### mandala — 曼荼羅

同じ形を放射状に並べた幾何学模様です。章の区切りや、記事の冒頭・末尾に置くと印象的な見た目になります。

```markdown
::art{type="mandala" color="purple"}
```

::art{type="mandala" color="purple"}

---

### flow — フロー

有機的に流れるリボン状の曲線です。やわらかい雰囲気が欲しいときや、文章の流れを途切れさせずに区切りを入れたいときに使えます。

```markdown
::art{type="flow" color="teal"}
```

::art{type="flow" color="teal"}

---

### grid — グリッド

規則正しいドットグリッドに、ランダムに配置されたアクセント点が加わります。技術系・プログラミング系の記事との相性が良いパターンです。

```markdown
::art{type="grid" color="slate"}
```

::art{type="grid" color="slate"}

---

### mosaic — モザイク

サイン波に基づく配色アルゴリズムでタイルを塗り分けたパターンです。カラフルで目を引きやすく、賑やかさを出したいときに向いています。

```markdown
::art{type="mosaic" color="amber"}
```


::art{type="mosaic" color="amber"}

## 8 種類のカラー

同じパターンでも、カラーを変えると雰囲気が大きく変わります。

### blue（デフォルト）

::art{type="wave" color="blue"}

### indigo

::art{type="wave" color="indigo"}

### purple

::art{type="wave" color="purple"}

### teal

::art{type="wave" color="teal"}

### green

::art{type="wave" color="green"}

### amber

::art{type="wave" color="amber"}

### rose

::art{type="wave" color="rose"}

### slate

::art{type="wave" color="slate"}


## 高さの変更

デフォルトの高さは `160px` です。`height` 属性で変更できます。

```markdown
::art{type="mandala" color="indigo" height="240px"}
```

::art{type="mandala" color="indigo" height="240px"}

```markdown
::art{type="flow" color="rose" height="300px"}
```

::art{type="flow" color="rose" height="300px"}


## 組み合わせの例

パターンとカラーを組み合わせると、記事ごとに異なる個性を持たせられます。以下はいくつかの組み合わせ例です。

::art{type="mosaic" color="purple"}

::art{type="grid" color="green"}

::art{type="mandala" color="rose"}

::art{type="flow" color="amber"}


## admonition と組み合わせる

`::art` は admonition ブロックと組み合わせても使えます。

:::note{title="ヒント"}
`::art` の直後に admonition を置くと、視覚的なリズムが生まれます。パターンを「見出し画像」のように使う方法もおすすめです。
:::

::art{type="wave" color="teal"}

:::tip{title="カラー選びのコツ"}
記事全体を通して 1〜2 色に絞って使うと、統一感が出ます。技術記事なら `slate` や `blue`、エッセイ系なら `amber` や `rose` がよく合います。
:::


## 属性一覧

| 属性 | 値 | デフォルト |
| :- | :- | :- |
| `type` | `wave` / `mandala` / `flow` / `grid` / `mosaic` | `wave` |
| `color` | `blue` / `indigo` / `purple` / `teal` / `green` / `amber` / `rose` / `slate` | `blue` |
| `height` | 任意の CSS 高さ（例: `200px`） | `160px` |

:::simple
```markdown
::art{type="mandala" color="purple" height="200px"}
```
:::


## まとめ

::art{type="mosaic" color="indigo"}

`::art` ディレクティブは、記事の構造を壊さずに視覚的なアクセントを加えられる軽量な手段です。SVG で描画されているため、どの画面サイズでも鮮明に表示されます。セクションの区切り、章の見出し前後、記事の冒頭や末尾など、様々な場所に試してみてください。