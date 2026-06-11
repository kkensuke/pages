---
title: "計算機が描く自然の美：数式とアルゴリズムが生み出すパターン"
date: "2026-05-23"
subtitle: "チューリング・パターンからフラクタルまで、自然界の模様を数式とコードで視覚的に読み解く"
previewImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Mandel_zoom_00_mandelbrot_set.jpg/1920px-Mandel_zoom_00_mandelbrot_set.jpg"
tags: [Algorithm, Python, Art]
---

シマウマの美しい縞模様、雪の結晶の対称性、海岸線の複雑な入り組み方——。
自然界に存在するこれらの美しいパターンは、一見すると無作為で複雑怪奇に見えますが、実は**非常にシンプルな数式とアルゴリズム**から生成されていることをご存知でしょうか。

本記事では、自然界に潜む「美のアルゴリズム」を、実際のビジュアルと数学的な説明を交えて解説していきます。**「自然の美しさは、単純なルールの繰り返しから生まれる」という驚くべき真実**を、ぜひ一緒に体験してみましょう。

![Image](https://upload.wikimedia.org/wikipedia/commons/2/29/Emperor_Angelfish%2C_Western_form_-_Pomacanthus_imperator_1.jpg "width=600px caption='タテジマキンチャクダイ。この縞模様もチューリング・パターンの結果であると考えられている。'")

## 1. チューリング・パターン：生命の模様を描く方程式

動物の体表に見られる規則的な模様（斑点や縞々）は、どのようにして形成されるのでしょうか。この謎に数学的アプローチで挑んだのが、現代計算機科学の父であるアラン・チューリングです。

![Image](https://upload.wikimedia.org/wikipedia/commons/7/79/Alan_Turing_az_1930-as_%C3%A9vekben.jpg "width=300px caption='アラン・チューリング（1912-1954）。コンピュータの基礎を築いただけでなく、自然界の模様形成のメカニズムも数式で解明した。'")

彼は 2 種類の化学物質（アクティベーターとインヒビター）が「拡散」しながら「反応」する過程で、自発的に空間的な波の模様が生まれることを数式で示しました。これが**反応拡散方程式**です。

:::note{title="反応拡散方程式"}
$$
\begin{align}
    \frac{\partial u}{\partial t} &= D_u \nabla^2 u + f(u, v) \\
    \frac{\partial v}{\partial t} &= D_v \nabla^2 v + g(u, v)
\end{align}
$$

- $u, v$：2種類の化学物質の濃度
- $D_u, D_v$：物質が広がるスピード（拡散係数）
- $\nabla^2$：空間における濃度の広がり（ラプラシアン）
- $f, g$：2つの物質がどう反応するかを示す関数

つまり、**「物質がじわじわ広がる力」** と **「物質同士が化学反応する力」** のバランスだけで、シミュレーション上にも生体と同じような模様が描き出されるのです。
:::

![Image](https://upload.wikimedia.org/wikipedia/commons/a/a1/TuringPattern.PNG "width=600px caption='計算機シミュレーションによって生成されたチューリング・パターンの例。'")

![Image](https://upload.wikimedia.org/wikipedia/commons/a/a4/Giant_Pufferfish_skin_pattern_detail.jpg "width=300px caption='フグの皮膚の実際の模様。チューリング・パターンの理論が自然界の模様形成を説明する有力なモデルであることがわかる。'")


### Pythonでチューリング・パターンをシミュレーションする

実際にPythonを使って、反応拡散方程式（ここではよく用いられるGray-Scottモデル）を計算してみましょう。以下のコードを実行すると、単純な数式の反復から、生き物の皮膚のような複雑な模様が浮かび上がる様子を確認できます。

```python[title=pufferfish_pattern.py,showLineNumbers=true]
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap

def laplacian(Z):
    # 空間の広がり（ラプラシアン）を上下左右のセルから計算
    return (np.roll(Z, 1, axis=0) + np.roll(Z, -1, axis=0) +
            np.roll(Z, 1, axis=1) + np.roll(Z, -1, axis=1) - 4 * Z)

# ★ここが重要！ ラビリンス（迷路）模様を作るパラメータ
Du, Dv = 0.16, 0.08  # 拡散係数はそのまま
F, k = 0.042, 0.061  # Fとkのバランスを変えることで迷路模様になる
iterations = 10000   # 模様が画面全体に広がるようにステップ数を増やす
size = 200           # 網目状の細かさを表現するためにサイズを拡大

# 初期状態のセットアップ
U = np.ones((size, size))
V = np.zeros((size, size))

# 画面全体にランダムな「種」を撒く（全体から模様を成長させるため）
np.random.seed(42) # 再現性のためのシード値
U += 0.05 * np.random.random((size, size))
V += 0.05 * np.random.random((size, size))

# 中央付近に初期のきっかけを配置
r = 20
U[size//2-r:size//2+r, size//2-r:size//2+r] = 0.50
V[size//2-r:size//2+r, size//2-r:size//2+r] = 0.25

# 時間発展の計算
for i in range(iterations):
    Lu = laplacian(U)
    Lv = laplacian(V)
    
    uvv = U * V * V
    
    U += Du * Lu - uvv + F * (1 - U)
    V += Dv * Lv + uvv - (F + k) * V

# ★画像のフグの色合いに似せたオリジナル・カラーマップを作成
colors = ["#132226", "#2c4a45", "#81a166", "#d9e8b3"] # 暗い緑〜明るい黄緑
puffer_cmap = LinearSegmentedColormap.from_list("puffer", colors)

# 画像の生成と表示
plt.figure(figsize=(6, 6))
plt.imshow(V, cmap=puffer_cmap, interpolation='bicubic')
plt.axis('off')
plt.title("Labyrinth Pattern (Pufferfish Style)", fontsize=14)
plt.tight_layout()
plt.show()
```


## 2. フラクタル：無限に続く「自己相似」
自然界のもう一つの重要なパターンが **フラクタル（Fractal）** です。
リアス式海岸、雪の結晶、血管の分岐などは、全体を拡大していくと、その一部が再び全体と同じ形をしている「自己相似性」を持っています。

その代表例として、自然界に存在する美しいフラクタルである「ロマネスコ・ブロッコリー」を見てみましょう。

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Romanesco_broccoli_%28Brassica_oleracea%29.jpg/500px-Romanesco_broccoli_%28Brassica_oleracea%29.jpg "width=400px caption='ロマネスコ・ブロッコリー。小さな円錐が集まって大きな円錐を作り、それがさらに大きな円錐を作っている。'")

また、数学の世界で最も有名なフラクタルである「マンデルブロ集合」は、驚くほど単純な複素数の漸化式から生まれます。

$$
z_{n+1} = z_n^2 + c
$$

この単純な計算を無限に繰り返したとき、$z$ の値が発散しないような初期値 $c$ をプロットすると、あの息を呑むような無限の図形が浮かび上がります。

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Mandel_zoom_00_mandelbrot_set.jpg/1920px-Mandel_zoom_00_mandelbrot_set.jpg "width=500px caption='マンデルブロ集合。境界部分をどれだけ拡大しても、元の図形と似た複雑な模様が永遠に現れ続ける。'")

### Pythonでマンデルブロ集合を描く

実際にPythonを使って、この図形を計算してみましょう。

```python[title=mandelbrot.py,showLineNumbers=true]
import numpy as np
import matplotlib.pyplot as plt

def generate_mandelbrot(width, height, x_min, x_max, y_min, y_max, max_iter):
    # 複素数平面のグリッドを作成
    x = np.linspace(x_min, x_max, width)
    y = np.linspace(y_min, y_max, height)
    X, Y = np.meshgrid(x, y)
    C = X + 1j * Y
    Z = np.zeros_like(C)
    
    # 発散するまでの繰り返し回数を記録する配列
    escape_time = np.zeros(C.shape, dtype=int)
    mask = np.ones(C.shape, dtype=bool)

    for i in range(max_iter):
        Z[mask] = Z[mask]**2 + C[mask]
        
        # 閾値（半径2）を超えたら発散とみなす
        diverged = np.abs(Z) > 2
        escape_time[diverged & mask] = i
        mask[diverged] = False

    return escape_time

# 画像の生成と表示
image = generate_mandelbrot(800, 800, -2.0, 0.5, -1.25, 1.25, 100)
plt.imshow(image, cmap='magma', extent=[-2.0, 0.5, -1.25, 1.25])
plt.axis('off')
plt.show()
```

::art{type="mandala"}


## 3. ライフゲーム：単純なルールから生まれる複雑系
最後にご紹介するのは、1970年にイギリスの数学者ジョン・コンウェイが考案した **ライフゲーム（Game of Life）** です。
これは「セル・オートマトン」と呼ばれる計算モデルの一種で、碁盤の目のようなグリッド上の細胞が、隣接する周囲8マスの状態（生・死）に応じて、次の世代の生死を決定します。

ルールは以下の4つだけです。

1. **誕生**：死んでいるセルの周囲に生きているセルがちょうど3つあれば、誕生する。
2. **生存**：生きているセルの周囲に生きているセルが2つか3つあれば、生き残る。
3. **過疎**：生きているセルの周囲に生きているセルが1つ以下ならば、過疎により死滅する。
4. **過密**：生きているセルの周囲に生きているセルが4つ以上ならば、過密により死滅する。

このたった4つのルールから、自ら移動し続ける「グライダー」や、細胞を無限に生み出し続ける「グライダー銃」など、まるで意思を持っているかのような生命的な挙動が生まれます。

![Image](https://upload.wikimedia.org/wikipedia/commons/e/e5/Gospers_glider_gun.gif "width=600px caption='ゴスパーのグライダー銃。固定されたブロックから、右下に向かって進む細胞の塊（グライダー）が永遠に生成され続ける。'")


## おわりに
自然界の美しさは、神がひとつひとつ筆で緻密に描いたものではなく、**「単純な物理的ルール（数式）や反復演算（アルゴリズム）」が織りなす創発の結果**です。

数学やプログラミングを学ぶことは、単にアプリを作ったり計算をしたりするためだけのものではありません。「世界がどのようにできているか」を理解し、シミュレーションによってその美しさを自らの手で再現するための強力なツールなのです。

次に自然界の模様を見たとき、そこに隠された数式やアルゴリズムの存在に思いを馳せてみてください。見慣れているはずの世界が、まるで新しい芸術作品のように見えてくるかもしれません。

::art{type="grid"}
