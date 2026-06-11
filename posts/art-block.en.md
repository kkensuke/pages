---
title: "Art Blocks — Decorative Patterns in Markdown"
date: "2026-05-10"
subtitle: "How to add visual accents to your posts with the art directive"
tags: [Markdown, Art]
---


The `::art` directive lets you embed SVG decorative patterns anywhere in a blog post with a single line. No images, no external assets — just a short directive and the pattern renders inline.

## Basic Syntax

```markdown
::art{type="pattern" color="palette"}
```

Two attributes, `type` and `color`, are all you need. Both are optional — omitting them falls back to `wave` and `blue`.


## Five Patterns

### wave

Layered gradient waves that flow across the block. Works well as a soft section break or at the end of an introduction.

```markdown
::art{type="wave" color="blue"}
```

::art{type="wave" color="blue"}

---

### mandala

Radially symmetric geometric shapes arranged like a kaleidoscope. Striking at the start or end of an article, or as a chapter divider.

```markdown
::art{type="mandala" color="purple"}
```

::art{type="mandala" color="purple"}

---

### flow

Organic ribbon curves that drift across the canvas. Soft and modern — good for essays, personal writing, or wherever you want breathing room without a hard break.

```markdown
::art{type="flow" color="teal"}
```


::art{type="flow" color="teal"}

---

### grid

A dot grid with algorithmically placed accent points. The structured, technical feel pairs naturally with programming or engineering posts.

```markdown
::art{type="grid" color="slate"}
```

::art{type="grid" color="slate"}

---

### mosaic

Tiles colored by a sine-wave algorithm that produces varied, non-repeating arrangements. Bold and eye-catching — useful when you want energy and contrast.

```markdown
::art{type="mosaic" color="amber"}
```

::art{type="mosaic" color="amber"}


## Eight Color Palettes

The same pattern reads very differently depending on the palette. Here is every option applied to `wave`.

### blue (default)

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


## Custom Height

The default height is `160px`. Override it with the `height` attribute.

```markdown
::art{type="mandala" color="indigo" height="240px"}
```

::art{type="mandala" color="indigo" height="240px"}

```markdown
::art{type="flow" color="rose" height="100px"}
```

::art{type="flow" color="rose" height="100px"}


## Mixing Patterns and Colors

Combining different patterns and palettes throughout a post gives each section its own character.

::art{type="mosaic" color="purple"}

::art{type="grid" color="green"}

::art{type="mandala" color="rose"}

::art{type="flow" color="amber"}


## Pairing with Admonitions

`::art` and admonition blocks complement each other well. Use an art block as a visual header above a note, or as a footer beneath a tip.

:::note{title="Using art as a section header"}
Place `::art` just before a major section heading to give it a banner-like presence. Keep the same color throughout a single post for a consistent look.
:::

::art{type="wave" color="teal"}

:::tip{title="Choosing a palette"}
Stick to one or two colors per post to maintain coherence. Technical articles feel at home with `slate` or `blue`; personal essays tend to suit `amber`, `rose`, or `teal`.
:::


## Composing a Full Section Break

A common pattern is to sandwich a short admonition between two art blocks to mark a major transition in the article.

::art{type="flow" color="indigo"}

:::quote{title="Richard Feynman"}
The first principle is that you must not fool yourself — and you are the easiest person to fool.
:::

::art{type="flow" color="indigo"}


## Attribute Reference

| Attribute | Values | Default |
| :- | :- | :- |
| `type` | `wave` / `mandala` / `flow` / `grid` / `mosaic` | `wave` |
| `color` | `blue` / `indigo` / `purple` / `teal` / `green` / `amber` / `rose` / `slate` | `blue` |
| `height` | Any CSS length — e.g. `200px`, `12rem` | `160px` |

:::simple
```markdown
::art{type="mandala" color="purple" height="200px"}
```
:::


## Summary

::art{type="mosaic" color="indigo"}

Art blocks are a lightweight way to add visual rhythm to long-form writing without reaching for image files or custom HTML. Because they render as inline SVG, they stay sharp at any screen size and require no extra assets. Try them as section dividers, banner headers, or decorative footers — wherever the prose needs a moment to breathe.