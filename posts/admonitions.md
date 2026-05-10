---
title: "Admonitions in This Blog’s Markdown"
date: "2024-10-31"
subtitle: "A guide to using admonitions and directives in this blog’s markdown"
tags: [Markdown, Admonitions]
---


This guide shows how to use admonitions and directives in this blog’s markdown to improve content presentation.

## Inline Directives `:name[label]{attributes}`
You can use inline directives to add special formatting or functionality to specific parts of your text.
One common use case is to create styled buttons for keyboard shortcuts or UI elements:
::::simple{title="Button"}
```markdown
:btn[cmd], :btn[shift], :btn[ctrl], :btn[opt], :btn[enter],
:btn[left], :btn[right], :btn[up], :btn[down], :btn[tab],
:btn[space], :btn[delete], :btn[esc], :btn[custom]
```
:::simple
:btn[cmd], :btn[shift], :btn[ctrl], :btn[opt], :btn[enter], :btn[left], :btn[right], :btn[up], :btn[down], :btn[tab], :btn[space], :btn[delete], :btn[esc], :btn[Custom]
:::
::::

Another example is embedding YouTube links directly in your text:
::::simple{title="YouTube Link"}
```markdown
Watch this video on YouTube: :youtube[Click here]{#dQw4w9WgXcQ}.
```
:::simple
Watch this video on YouTube: :youtube[Click here]{#dQw4w9WgXcQ}.
:::
::::


## Block Directives `::name[label]{attributes}`
You can also embed YouTube videos as standalone blocks using block directives:
::::simple{title="YouTube Embed"}
```markdown
::youtube[Watch this amazing video]{#dQw4w9WgXcQ}
```
::youtube[Watch this amazing video]{#dQw4w9WgXcQ}
::::

We also have a `::art` directive for embedding decorative SVG patterns, which can be used to add visual interest to your posts:
::::simple{title="Art Block"}
```markdown
::art{type="wave" color="blue"}
```
::art{type="wave" color="blue"}
::::


## Link card
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


## Admonitions

Admonitions are specially formatted content blocks that help highlight important information.

### Basic Syntax
```markdown
:::type
Your content here
:::
```

### Available Types

::::simple
```markdown
:::note
This is a note admonition.
:::
```
:::note
This is a note admonition.
:::
::::

:::overview
This is an overview admonition.
:::

:::warning
This is a warning admonition.
:::

:::important
This is an important admonition.
:::

:::tip
This is a tip admonition.
:::

:::example
This is an example admonition.
:::

:::comment
This is a comment admonition.
:::

:::quote
This is a quote admonition.
:::

:::question
This is a question admonition.
:::

:::simple{title="Simple Admonition"}
This is a simple admonition with a custom title.
:::

:::simple
This is a simple admonition without a title.
:::

### Custom Titles
::::simple
```markdown
:::note{title="Did you know?"}
You can customize the title of any admonition!
:::
```

:::note{title="Did you know?"}
You can customize the title of any admonition!
:::
::::

### Nested Admonitions
You can nest admonitions by using more colons in the opening and closing tags:

::::note{title="Outer Admonition"}
This is the outer admonition.

:::important{title="Inner Admonition"}
This is a nested important admonition.
:::
::::

## Best Practices

1. Use inline directives (`:`) for elements that are part of your text flow
2. Use block directives (`::`) for standalone elements like embeds
3. Choose appropriate admonition types based on your content
4. Use clear, descriptive titles for your admonitions
5. Don't overuse admonitions - use them to highlight truly important information

