---
title: "Code blocks in This Blog’s Markdown"
date: "2024-5-5"
subtitle: "A guide to using code blocks in this blog’s markdown"
tags: [Markdown, Code]
---


## Inline code

This is an `inline code` block.

## Code blocks

:::simple
````md[title=markdown]
```
import numpy as np
import matplotlib.pyplot as plt
```
````

Output:
```
import numpy as np
import matplotlib.pyplot as plt
```
:::


:::simple
````md[title=markdown]
```python[title=code.py]
import numpy as np
import matplotlib.pyplot as plt
```
````

Output:
```python[title=code.py]
import numpy as np
import matplotlib.pyplot as plt
```
:::


:::simple
````md[title=markdown]
```python[title=code.py,showLineNumbers=true]
import numpy as np
import matplotlib.pyplot as plt
```
````

Output:
```python[title=code.py,showLineNumbers=true]
import numpy as np
import matplotlib.pyplot as plt
```
:::



:::important
No spaces are allowed after commas in the code attributes.
✅ [title=asdf.py,showLineNumbers=true]
❌ [title=asdf.py, showLineNumbers=true]
:::


```js[title=code.js,showLineNumbers=true]
function createStyleObject(classNames, style) {
  return classNames.reduce((styleObject, className) => {
    return {...styleObject, ...style[className]};
  }, {});
}

function createClassNameString(classNames) {
  return classNames.join(' ');
}


function createChildren(style, useInlineStyles) {
  let childrenCount = 0;
  return children => {
    childrenCount += 1;
    return children.map((child, i) => createElement({
      node: child,
      style,
      useInlineStyles,
      key:`code-segment-${childrenCount}-${i}`
    }));
  }
}

function createElement({ node, style, useInlineStyles, key }) {
  const { properties, type, tagName, value } = node;
  if (type === "text") {
    return value;
  } else if (tagName) {
    const TagName = tagName;
    const childrenCreator = createChildren(style, useInlineStyles);
    const props = (
      useInlineStyles
      ? { style: createStyleObject(properties.className, style) }
      : { className: createClassNameString(properties.className) }
    );
    const children = childrenCreator(node.children);
    return <TagName key={key} {...props}>{children}</TagName>;
  }
}
```

## Import code from GitHub

Use a GitHub `blob` URL in a `github-code` directive. The code is fetched when the
post is rendered and uses the same highlighting, copy button, and optional line
numbers as a regular code block.

````md[title=markdown]
# If title is not specified, the filename is used as the title.
::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true}
````

Output:

::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true}
