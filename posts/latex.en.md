---
title: "Latex in This Blog’s Markdown"
date: "2024-7-5"
subtitle: "A guide to using Latex in this blog’s markdown"
tags: [Markdown, Latex]
---

## Basic Latex Usage

1. **Simple Inline Equations:**
    :::simple
    ```latex[title=markdown]
    Here are some inline equations:
    - Area of a circle: $A = \pi r^2$
    - Quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
    - Einstein's famous equation: $E = mc^2$
    ```
    Output:
    
    Here are some inline equations:
    - Area of a circle: $A = \pi r^2$
    - Quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
    - Einstein's famous equation: $E = mc^2$
    :::

2. **Basic Block Equations:**
    :::simple
    ```latex[title=markdown]
    The Gaussian integral:
    $$
    \int_{-\infty}^\infty e^{-x^2} dx = \sqrt{\pi}
    $$
    ```
    Output:
    
    The Gaussian integral:
    $$
    \int_{-\infty}^\infty e^{-x^2} dx = \sqrt{\pi}
    $$
    :::

## Advanced Mathematical Expressions

1. **Matrix Operations:**
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
    Output:
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

2. **Multi-line Equations with Alignment:**
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
    Output:
    $$
    \begin{align}
        (x + y)^3 &= (x + y)(x + y)^2 \\
        &= (x + y)(x^2 + 2xy + y^2) \\
        &= x^3 + 3x^2y + 3xy^2 + y^3
    \end{align}
    $$
    :::


## Other examples

:::simple
```latex[title=markdown]
$$
    A \cap (B \cup C) = (A \cap B) \cup (A \cap C)
$$
```
Output:
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
Output:
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
Output:
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
Output:
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
Output:
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
Output:
$$
    \lim_{x \to 0} \frac{\sin x}{x} = 1
$$
:::


:::simple
```latex[title=markdown]
The most beautiful equation in mathematics:
$$
    e^{i\pi} + 1 = 0
$$
```
Output:

The most beautiful equation in mathematics:
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
Output:
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
Output:
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
Output:
$$
    \vartheta(z) = \sum_{n=-\infty}^{\infty} e^{-\pi n^2 z} \quad \text{(Theta function)}
$$
:::



:::note{title="Spacing in LaTeX"}
| Feature | Notation | Output |
| - | - | - |
| Negative space | `$a \! b$` | $a\!b$ |
| Small space | `$a \, b$` | $a\,b$ |
| Medium space | `$a \; b$` | $a\;b$ |
| Large space | `$a \quad b$` | $a\quad b$ |
| Extra large space | `$a \qquad b$` | $a\qquad b$ |
:::