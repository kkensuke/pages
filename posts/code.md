---
title: "このブログのMarkdownにおけるコードブロック"
date: "2024-5-5"
subtitle: "このブログのMarkdownでコードブロックを使う方法"
tags: [Markdown, Code]
---


## インラインコード

これは `インラインコード` です。

## コードブロック

:::simple
````md[title=markdown]
```
import numpy as np
import matplotlib.pyplot as plt
```
````

出力：
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

出力：
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

出力：
```python[title=code.py,showLineNumbers=true]
import numpy as np
import matplotlib.pyplot as plt
```
:::



:::important
コード属性のカンマの後には空白を入れられません。
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

## GitHubからコードを読み込む

`github-code` ディレクティブにGitHubの `blob` URLを指定します。記事の表示時にコードが取得され、通常のコードブロックと同じシンタックスハイライト、コピーボタン、任意の行番号が適用されます。

````md[title=markdown]
# titleを省略すると、ファイル名がタイトルとして使われます。
::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true lines="2-8"}
````

出力：

::github-code{url="https://github.com/kkensuke/pages/blob/main/next.config.js" title="next.config.js" language="javascript" showLineNumbers=true lines="2-8"}
