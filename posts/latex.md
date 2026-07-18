---
title: "このブログのMarkdownでLaTeXを使う"
date: "2024-7-5"
subtitle: "このブログのMarkdownでLaTeXを使う方法"
tags: [Markdown, Latex]
---

## LaTeXの基本的な使い方

1. **簡単なインライン数式：**
    :::simple
    ```latex[title=markdown]
    インライン数式の例：
    - 円の面積：$A = \pi r^2$
    - 二次方程式の解の公式：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
    - アインシュタインの有名な式：$E = mc^2$
    ```
    出力：
    
    インライン数式の例：
    - 円の面積：$A = \pi r^2$
    - 二次方程式の解の公式：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
    - アインシュタインの有名な式：$E = mc^2$
    :::

2. **基本的なブロック数式：**
    :::simple
    ```latex[title=markdown]
    ガウス積分：
    $$
    \int_{-\infty}^\infty e^{-x^2} dx = \sqrt{\pi}
    $$
    ```
    出力：
    
    ガウス積分：
    $$
    \int_{-\infty}^\infty e^{-x^2} dx = \sqrt{\pi}
    $$
    :::

## 高度な数式

1. **行列の演算：**
    :::simple
    ```latex[title=markdown]
    $$
    \begin{pmatrix}
        a & b \\
        c & d
    \end{pmatrix}
    \begin{pmatrix}
        x \\
        y
    \end{pmatrix} =
    \begin{pmatrix}
        ax + by \\
        cx + dy
    \end{pmatrix}
    $$
    ```
    出力：
    $$
    \begin{pmatrix}
        a & b \\
        c & d
    \end{pmatrix}
    \begin{pmatrix}
        x \\
        y
    \end{pmatrix} =
    \begin{pmatrix}
        ax + by \\
        cx + dy
    \end{pmatrix}
    $$
    :::

2. **複数行の数式と位置合わせ：**
    :::simple
    ```latex[title=markdown]
    $$
    \begin{align}
        (x + y)^3 &= (x + y)(x + y)^2 \\
        &= (x + y)(x^2 + 2xy + y^2) \\
        &= x^3 + 3x^2y + 3xy^2 + y^3
    \end{align}
    $$
    ```
    出力：
    $$
    \begin{align}
        (x + y)^3 &= (x + y)(x + y)^2 \\
        &= (x + y)(x^2 + 2xy + y^2) \\
        &= x^3 + 3x^2y + 3xy^2 + y^3
    \end{align}
    $$
    :::


## その他の例

:::simple
```latex[title=markdown]
$$
    A \cap (B \cup C) = (A \cap B) \cup (A \cap C)
$$
```
出力：
$$
    A \cap (B \cup C) = (A \cap B) \cup (A \cap C)
$$
:::

:::simple
```latex[title=markdown]
$$
    \forall x \in \mathbb{R}, \exists y : y > x
$$
```
出力：
$$
    \forall x \in \mathbb{R}, \exists y : x < y
$$
:::

:::simple
```latex[title=markdown]
$$
    P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$
```
出力：
$$
    P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$
:::


:::simple
```latex[title=markdown]
$$
    \frac{d}{dx}\left[\int_a^x f(t)dt\right] = f(x)
$$
```
出力：
$$
    \frac{d}{dx}\left[\int_a^x f(t)dt\right] = f(x)
$$
:::

:::simple
```latex[title=markdown]
$$
    \sum_{n=0}^{\infty} x^n = \frac{1}{1-x}, |x| < 1
$$
```
出力：
$$
    \sum_{n=0}^{\infty} x^n = \frac{1}{1-x}, |x| < 1
$$
:::

:::simple
```latex[title=markdown]
$$
    \lim_{x \to 0} \frac{\sin x}{x} = 1
$$
```
出力：
$$
    \lim_{x \to 0} \frac{\sin x}{x} = 1
$$
:::


:::simple
```latex[title=markdown]
数学で最も美しい方程式：
$$
    e^{i\pi} + 1 = 0
$$
```
出力：

数学で最も美しい方程式：
$$
    e^{i\pi} + 1 = 0
$$
:::


:::simple
```latex[title=markdown]
$$
    \zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} \quad \text{(Riemann zeta function)}
$$
```
出力：
$$
    \zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} \quad \text{(Riemann zeta function)}
$$
:::

:::simple
```latex[title=markdown]
$$
    \Gamma(z) = \int_0^{\infty} t^{z-1}e^{-t}dt \quad \text{(Gamma function)}
$$
```
出力：
$$
    \Gamma(z) = \int_0^{\infty} t^{z-1}e^{-t}dt \quad \text{(Gamma function)}
$$
:::

:::simple
```latex[title=markdown]
$$
    \vartheta(z) = \sum_{n=-\infty}^{\infty} e^{-\pi n^2 z} \quad \text{(Theta function)}
$$
```
出力：
$$
    \vartheta(z) = \sum_{n=-\infty}^{\infty} e^{-\pi n^2 z} \quad \text{(Theta function)}
$$
:::



:::note{title="LaTeXにおける空白"}
| 種類 | 記法 | 出力 |
| - | - | - |
| 負の空白 | `$a \! b$` | $a\!b$ |
| 小さい空白 | `$a \, b$` | $a\,b$ |
| 中程度の空白 | `$a \; b$` | $a\;b$ |
| 大きい空白 | `$a \quad b$` | $a\quad b$ |
| さらに大きい空白 | `$a \qquad b$` | $a\qquad b$ |
:::
