---
title: "集中不等式入門：Markov から McDiarmid まで"
date: "2026-09-20"
subtitle: "有限標本で「期待値からどれだけ外れるか」を定量化するための基本原理と使い分け"
tags: [Math]
---

## 0. イントロ

確率論や統計学では、ランダムな量そのものよりも、

> **そのランダムな量が、典型的な値からどの程度ずれるのか**

を知りたい場面が頻繁に現れます。

例えば、独立なデータ $X_1,\dots,X_n$ の標本平均

$$
\bar X_n := \frac{1}{n}\sum_{i=1}^n X_i
$$

を考えます。

大数の法則は、適切な仮定のもとで

$$
\bar X_n \to \mathbb{E}X_1
$$

と収束することを教えてくれます。しかし、実際の統計解析や機械学習では $n$ は有限です。

そこで知りたいのは、

$$
\Pr\left(
\left|\bar X_n-\mathbb{E}X_1\right|
\ge \varepsilon
\right)
$$

が具体的にどれくらい小さいか、ということです。

このような**有限標本における確率的なずれを定量的に評価する道具**が、集中不等式（Concentration Inequality）です。

集中不等式には多くの種類がありますが、本記事では次の流れで基本的なものを整理します。

1. **Markov の不等式**：非負性と期待値だけを使う
2. **Chebyshev の不等式**：分散まで使う
3. **Chernoff 法**：指数変換によって指数的な評価を作る
4. **Hoeffding の不等式**：独立かつ有界な確率変数の和を扱う
5. **Bernstein の不等式**：分散も利用して Hoeffding を精密化する
6. **McDiarmid の不等式**：和に限らず、独立変数の安定な関数を扱う

これらは単純に「後に出てくるほど強い」という関係ではありません。それぞれが利用する仮定と、扱える対象が異なります。


## 1. 集中不等式を読むための基本事項

まず、本記事で繰り返し現れる記法を整理しておきます。

確率変数 $X_1,\dots,X_n$ の和を

$$
S_n := \sum_{i=1}^n X_i
$$

とし、標本平均を

$$
\bar X_n := \frac{S_n}{n}
$$

と書きます。

また、

$$
X\ge 0 \quad \text{almost surely}
$$

とは、「確率 $1$ で $X\ge 0$ が成り立つ」という意味です。以下ではこれを **a.s.** と略記することがあります。

### 上側・下側・両側確率

集中不等式では、主に次の 3 種類の確率を扱います。

上側偏差：

$$
\Pr(X-\mathbb{E}X\ge t)
$$

下側偏差：

$$
\Pr(X-\mathbb{E}X\le -t)
$$

両側偏差：

$$
\Pr(|X-\mathbb{E}X|\ge t)
$$

上側と下側の評価が得られれば、和事象に対する

$$
\Pr(A\cup B)\le \Pr(A)+\Pr(B)
$$

という union bound によって、両側評価を作ることができます。そのため、両側版ではしばしば前に係数 $2$ が現れます。


## 2. Markov の不等式：すべての出発点

最も基本的な tail bound が Markov の不等式です。

### 定理

$X$ を非負確率変数とし、

$$
X\ge 0 \quad \text{a.s.},
\qquad
\mathbb{E}X<\infty
$$

とします。

このとき、任意の $a>0$ に対して

$$
\Pr(X\ge a)
\le
\frac{\mathbb{E}X}{a}
$$

が成り立ちます。

### 証明

事象 ${X\ge a}$ の指示関数を $\mathbf{1}_{{X\ge a}}$ とすると、非負性から

$$
X
\ge
a\mathbf{1}_{\{X\ge a\}}
$$

です。

両辺の期待値を取れば、

$$
\mathbb{E}X
\ge
a\mathbb{E}\mathbf{1}_{\{X\ge a\}}
=
a\Pr(X\ge a)
$$

となるので、

$$
\Pr(X\ge a)
\le
\frac{\mathbb{E}X}{a}
$$

を得ます。

### Markov の不等式は何を言っているのか

例えば $a=c\mathbb{E}X$ と置けば、

$$
\Pr(X\ge c\mathbb{E}X)
\le
\frac{1}{c}
$$

です。

つまり、非負確率変数が平均の $10$ 倍以上になる確率は高々 $1/10$、平均の $100$ 倍以上になる確率は高々 $1/100$ です。

仮定が極めて弱い代わりに、評価も一般には粗くなります。

### 高次モーメントを使う

Markov の不等式は $X$ 自身に適用する必要はありません。

例えば $\mathbb{E}|X|^p<\infty$ なら、非負確率変数 $|X|^p$ に適用して

$$
\Pr(|X|\ge t)
=
\Pr(|X|^p\ge t^p)
\le
\frac{\mathbb{E}|X|^p}{t^p}
$$

を得ます。

この「**扱いたい事象を、別の非負確率変数に変換して Markov を適用する**」という考え方は極めて重要です。

Chebyshev の不等式も Chernoff bound も、本質的にはこの発想から生まれます。



## 3. Chebyshev の不等式：分散から平均周辺への集中を見る

Markov が期待値だけを使ったのに対して、Chebyshev の不等式は分散を使います。

### 定理

$X$ が平均

$$
\mu := \mathbb{E}X
$$

と有限な分散

$$
\sigma^2 := \operatorname{Var}(X)<\infty
$$

を持つとします。

このとき、任意の $t>0$ に対して

$$
\Pr(|X-\mu|\ge t)
\le
\frac{\sigma^2}{t^2}
$$

が成り立ちます。

特に $\sigma>0$ に対して $t=k\sigma$ とすると、

$$
\Pr(|X-\mu|\ge k\sigma)
\le
\frac{1}{k^2}
$$

です。

### Markov からの導出

非負確率変数

$$
Y := (X-\mu)^2
$$

を考えます。

すると

$$
\begin{aligned}
\Pr(|X-\mu|\ge t)
&=
\Pr((X-\mu)^2\ge t^2)\\
&\le
\frac{\mathbb{E}(X-\mu)^2}{t^2}\\
&=
\frac{\sigma^2}{t^2}.
\end{aligned}
$$

したがって、Chebyshev の不等式は Markov の不等式を二乗偏差に適用したものだと理解できます。

### 標本平均への適用

$X_1,\dots,X_n$ が独立同分布で、

$$
\mathbb{E}X_i=\mu,
\qquad
\operatorname{Var}(X_i)=\sigma^2
$$

とします。

独立性から

$$
\operatorname{Var}(\bar X_n)
=
\frac{\sigma^2}{n}
$$

なので、Chebyshev の不等式より

$$
\Pr(|\bar X_n-\mu|\ge \varepsilon)
\le
\frac{\sigma^2}{n\varepsilon^2}
$$

を得ます。

ここで重要なのは、$n$ が増えるにつれて誤差確率が

$$
O\left(\frac{1}{n}\right)
$$

で減少することです。

ただし、これは後で見る Hoeffding の

$$
\exp(-cn)
$$

型の評価と比べるとかなり遅い減衰です。



## 4. Chernoff 法：指数的集中を作る基本原理

Markov や Chebyshev では、多項式的な tail bound しか得られませんでした。

指数的に小さな確率を得るための中心的なアイデアが **Chernoff 法（Chernoff method）** です。

Chernoff bound という名前は特定の公式を指して使われることもありますが、より本質的には、

> **指数関数で確率変数を変換し、Markov の不等式を適用して、その指数パラメータを最適化する方法**

だと考えると理解しやすくなります。

### 一般形

確率変数 $X$ に対して

$$
\psi_X(\lambda)
:=
\log
\mathbb{E}
\exp\left(
\lambda(X-\mathbb{E}X)
\right)
$$

を中心化された log moment generating function（log-MGF）とします。

$\lambda>0$ に対して MGF が有限なら、

$$
\begin{aligned}
\Pr(X-\mathbb{E}X\ge t)
&=
\Pr\left(
e^{\lambda(X-\mathbb{E}X)}
\ge
e^{\lambda t}
\right)\\
&\le
e^{-\lambda t}
\mathbb{E}
e^{\lambda(X-\mathbb{E}X)}\\
&=
\exp\left(
-\lambda t+\psi_X(\lambda)
\right).
\end{aligned}
$$

これは任意の許される $\lambda>0$ について成立するので、

$$
\Pr(X-\mathbb{E}X\ge t)
\le
\inf_{\lambda>0}
\exp\left(
-\lambda t+\psi_X(\lambda)
\right)
$$

です。

同値に、

$$
\Pr(X-\mathbb{E}X\ge t)
\le
\exp\left(
-
\sup_{\lambda>0}
\left\{
\lambda t-\psi_X(\lambda)
\right\}
\right)
$$

と書けます。

この $\lambda$ の最適化こそが Chernoff 法の核心です。

### なぜ指数的な評価になるのか

指数関数には、独立な確率変数の和を積に変換できるという重要な性質があります。

独立な $X_1,\dots,X_n$ に対して

$$
\begin{aligned}
\mathbb{E}
\exp\left(
\lambda\sum_{i=1}^n X_i
\right)
&=
\mathbb{E}
\prod_{i=1}^n e^{\lambda X_i}\\
&=
\prod_{i=1}^n
\mathbb{E}e^{\lambda X_i}.
\end{aligned}
$$

したがって、各変数の MGF を制御できれば、その和の MGF も簡単に制御できます。

これが Hoeffding や Bernstein など多くの指数型集中不等式の基本原理です。

### sub-Gaussian という共通パターン

もし中心化確率変数 $X-\mathbb{E}X$ が、すべての $\lambda\in\mathbb{R}$ に対して

$$
\mathbb{E}
e^{\lambda(X-\mathbb{E}X)}
\le
\exp\left(
\frac{\sigma^2\lambda^2}{2}
\right)
$$

を満たすなら、Chernoff 法から

$$
\Pr(X-\mathbb{E}X\ge t)
\le
\exp\left(
-\frac{t^2}{2\sigma^2}
\right)
$$

を得ます。

同様に下側も評価できるため、

$$
\Pr(|X-\mathbb{E}X|\ge t)
\le
2\exp\left(
-\frac{t^2}{2\sigma^2}
\right)
$$

です。

このように Gaussian 分布と同程度の tail を持つ確率変数を **sub-Gaussian** と呼びます。

Hoeffding の不等式は、「有界な確率変数は適切な意味で sub-Gaussian である」という事実を利用したものと見ることができます。

### Bernoulli 和に対する multiplicative Chernoff bound

Chernoff bound という言葉は、特に Bernoulli 確率変数の和に対する次の評価を指すこともあります。

独立な

$$
X_i\in\{0,1\}
$$

に対して

$$
S_n:=\sum_{i=1}^n X_i,
\qquad
\mu:=\mathbb{E}S_n
$$

とします。

任意の $\delta>0$ に対して

$$
\Pr(S_n\ge (1+\delta)\mu)
\le
\left(
\frac{e^\delta}{(1+\delta)^{1+\delta}}
\right)^\mu
$$

であり、より扱いやすい形として

$$
\Pr(S_n\ge (1+\delta)\mu)
\le
\exp\left(
-\frac{\delta^2}{2+\delta}\mu
\right)
$$

が得られます。

また $0<\delta<1$ では、

$$
\Pr(S_n\le (1-\delta)\mu)
\le
\exp\left(
-\frac{\delta^2}{2}\mu
\right)
$$

です。

Hoeffding が「平均からの**加法的な誤差**」を扱うのに対して、この形の Chernoff bound は「期待値に対する**相対誤差**」を扱う場面で特に便利です。



## 5. Hoeffding の不等式：有界性から指数的集中を得る

$X_1,\dots,X_n$ が独立で、それぞれ既知の有限区間に収まっている場合に使える代表的な集中不等式が Hoeffding の不等式です。

### Hoeffding's lemma

まず、Hoeffding の不等式の核となる補題を見ます。

確率変数 $X$ が

$$
a\le X\le b
\quad\text{a.s.}
$$

を満たすとき、任意の $\lambda\in\mathbb{R}$ に対して

$$
\mathbb{E}
e^{\lambda(X-\mathbb{E}X)}
\le
\exp\left(
\frac{\lambda^2(b-a)^2}{8}
\right)
$$

が成り立ちます。

つまり、有界な確率変数はその分布の細かな形にかかわらず sub-Gaussian 的な MGF を持ちます。

### 定理

$X_1,\dots,X_n$ を独立な確率変数とし、各 $i$ について

$$
a_i\le X_i\le b_i
\quad\text{a.s.}
$$

とします。

$$
S_n:=\sum_{i=1}^n X_i
$$

とすると、任意の $t>0$ に対して

$$
\Pr(S_n-\mathbb{E}S_n\ge t)
\le
\exp\left(
-\frac{2t^2}
{\sum_{i=1}^n(b_i-a_i)^2}
\right)
$$

が成り立ちます。

さらに両側版として、

$$
\Pr(|S_n-\mathbb{E}S_n|\ge t)
\le
2\exp\left(
-\frac{2t^2}
{\sum_{i=1}^n(b_i-a_i)^2}
\right)
$$

が成り立ちます。

### Chernoff 法からの導出

Hoeffding's lemma と独立性を使うと、

$$
\begin{aligned}
\mathbb{E}
e^{\lambda(S_n-\mathbb{E}S_n)}
&=
\prod_{i=1}^n
\mathbb{E}
e^{\lambda(X_i-\mathbb{E}X_i)}\\
&\le
\exp\left(
\frac{\lambda^2}{8}
\sum_{i=1}^n(b_i-a_i)^2
\right).
\end{aligned}
$$

ここで

$$
A:=
\sum_{i=1}^n(b_i-a_i)^2
$$

と置くと、Chernoff 法より

$$
\Pr(S_n-\mathbb{E}S_n\ge t)
\le
\exp\left(
-\lambda t+\frac{\lambda^2A}{8}
\right).
$$

右辺を $\lambda$ について最小化すると、

$$
\lambda^\ast=\frac{4t}{A}
$$

なので、

$$
\Pr(S_n-\mathbb{E}S_n\ge t)
\le
\exp\left(
-\frac{2t^2}{A}
\right)
$$

を得ます。

この導出を見ると、

> **Markov $\rightarrow$ Chernoff 法 $\rightarrow$ Hoeffding's lemma $\rightarrow$ Hoeffding の不等式**

という関係が明確になります。

### 標本平均への適用

特に $X_1,\dots,X_n$ が独立同分布で、

$$
X_i\in[a,b]
\quad\text{a.s.}
$$

とします。

標本平均

$$
\bar X_n=\frac1n\sum_{i=1}^nX_i
$$

に対して $t=n\varepsilon$ と置けば、

$$
\Pr(
|\bar X_n-\mathbb{E}X_1|
\ge\varepsilon
)
\le
2\exp\left(
-\frac{2n\varepsilon^2}{(b-a)^2}
\right)
$$

です。

Chebyshev の

$$
O\left(\frac1n\right)
$$

という評価に対して、Hoeffding では

$$
\exp(-cn)
$$

という指数的な減衰が得られています。

### Bernoulli 推定の例

例えば

$$
X_i\sim\operatorname{Bernoulli}(p)
$$

なら、

$$
X_i\in[0,1],
\qquad
\mathbb{E}X_i=p
$$

です。

$$
\hat p:=\frac1n\sum_{i=1}^nX_i
$$

とすると、

$$
\Pr(|\hat p-p|\ge\varepsilon)
\le
2e^{-2n\varepsilon^2}.
$$

したがって、失敗確率を $\delta$ 以下にしたければ、

$$
2e^{-2n\varepsilon^2}\le\delta
$$

すなわち

$$
n
\ge
\frac{1}{2\varepsilon^2}
\log\frac{2}{\delta}
$$

だけの標本数を取れば十分です。

同じ式を逆に解けば、確率少なくとも $1-\delta$ で

$$
|\hat p-p|
\le
\sqrt{
\frac{\log(2/\delta)}{2n}
}
$$

という有限標本保証が得られます。

これが、集中不等式が統計学や機械学習で頻繁に使われる理由の一つです。



## 6. Bernstein の不等式：分散を利用してさらに精密に見る

Hoeffding の不等式は、各 $X_i$ がどの区間に入るかという情報しか使いません。

しかし、実際には

> 「値域は広いが、ほとんどの場合は平均の近くにいる」

という確率変数もあります。

そのような場合には、分散の情報も使う Bernstein の不等式が有効です。

### 定理

$X_1,\dots,X_n$ を独立な確率変数とし、

$$
\mathbb{E}X_i=0
$$

とします。

また、ある $M>0$ が存在して、

$$
|X_i|\le M
\quad\text{a.s.}
$$

がすべての $i$ について成り立つとします。

和の分散を

$$
v
:=
\sum_{i=1}^n\mathbb{E}X_i^2
=
\sum_{i=1}^n\operatorname{Var}(X_i)
$$

とすると、任意の $t>0$ に対して

$$
\Pr\left(
\sum_{i=1}^nX_i\ge t
\right)
\le
\exp\left(
-\frac{t^2}{2(v+Mt/3)}
\right)
$$

が成り立ちます。

両側版として、

$$
\Pr\left(
\left|\sum_{i=1}^nX_i\right|\ge t
\right)
\le
2\exp\left(
-\frac{t^2}{2(v+Mt/3)}
\right)
$$

も得られます。

### 小偏差では Gaussian 型、大偏差では exponential 型

Bernstein の式で重要なのは、分母に

$$
v+\frac{Mt}{3}
$$

という 2 種類の項が入っていることです。

$t$ が比較的小さい領域では $v$ が支配的なので、

$$
\Pr\left(
\sum_iX_i\ge t
\right)
\approx
\exp\left(
-c\frac{t^2}{v}
\right)
$$

という Gaussian 型、すなわち sub-Gaussian 的な減衰を示します。

一方、$t$ が大きくなると $Mt$ が支配的になり、

$$
\Pr\left(
\sum_iX_i\ge t
\right)
\approx
\exp\left(
-c\frac{t}{M}
\right)
$$

という exponential 型の減衰に移行します。

この

$$
\text{quadratic regime}
\quad\longrightarrow\quad
\text{linear regime}
$$

という 2 つのスケールを持つのが Bernstein 型評価の特徴です。

### 標本平均への適用

独立同分布な $X_1,\dots,X_n$ に対し、

$$
\mathbb{E}X_i=\mu,
\qquad
\operatorname{Var}(X_i)=\sigma^2
$$

かつ

$$
|X_i-\mu|\le M
\quad\text{a.s.}
$$

とします。

$$
Z_i:=X_i-\mu
$$

に Bernstein の不等式を適用すると、

$$
\Pr(
|\bar X_n-\mu|\ge\varepsilon
)
\le
2\exp\left(
-\frac{n\varepsilon^2}
{2(\sigma^2+M\varepsilon/3)}
\right)
$$

となります。

Hoeffding は値域のみを見るのに対して、Bernstein では実際の分散 $\sigma^2$ が直接現れます。

そのため、分散が値域から想定される最大値よりかなり小さい場合には、Bernstein の方が大幅に鋭いことがあります。



## 7. McDiarmid の不等式：和ではなく「安定な関数」を集中させる

Hoeffding や Bernstein は主として確率変数の「和」を扱ってきました。

しかし、実際に興味を持つ統計量やアルゴリズムの出力は、必ずしも単純な和ではありません。

そこで使われる代表的な結果が **McDiarmid の不等式**、別名 **bounded differences inequality** です。

### 有界差分条件

独立な確率変数

$$
X_1,\dots,X_n
$$

と関数

$$
f:
\mathcal X_1\times\cdots\times\mathcal X_n
\to\mathbb{R}
$$

を考えます。

各 $i$ について、$i$ 番目の入力だけを $x_i$ から $x_i'$ に変更したとき、

$$
\left|
f(x_1,\dots,x_i,\dots,x_n)
-
f(x_1,\dots,x_i',\dots,x_n)
\right|
\le c_i
$$

が常に成り立つとします。

この条件を **bounded differences condition（有界差分条件）** と呼びます。

直感的には、

> **1 個の入力だけを変更しても、出力は高々 $c_i$ しか変化しない**

という安定性を仮定しています。

### 定理

上の条件のもとで、任意の $t>0$ に対して

$$
\Pr\left(
f(X_1,\dots,X_n)
-
\mathbb{E}f(X_1,\dots,X_n)
\ge t
\right)
\le
\exp\left(
-\frac{2t^2}{\sum_{i=1}^nc_i^2}
\right)
$$

が成り立ちます。

同様に、

$$
\Pr\left(
\left|
f(X_1,\dots,X_n)
-
\mathbb{E}f(X_1,\dots,X_n)
\right|
\ge t
\right)
\le
2\exp\left(
-\frac{2t^2}{\sum_{i=1}^nc_i^2}
\right)
$$

です。

### Hoeffding との関係

$f$ が単純な和

$$
f(x_1,\dots,x_n)
=
\sum_{i=1}^n x_i
$$

で、各 $x_i$ が

$$
x_i\in[a_i,b_i]
$$

を満たす場合を考えます。

$i$ 番目の値だけを変更したとき、和の変化は最大でも

$$
c_i=b_i-a_i
$$

です。

したがって McDiarmid の不等式は、

$$
\Pr(
|S_n-\mathbb{E}S_n|\ge t
)
\le
2\exp\left(
-\frac{2t^2}
{\sum_i(b_i-a_i)^2}
\right)
$$

を与えます。

これはまさに Hoeffding の両側評価です。

この意味で McDiarmid の不等式は、

> **Hoeffding の「独立な有界確率変数の和」という構造を、「各入力に対して十分安定な一般の関数」へ拡張した結果**

と見ることができます。

### 標本平均も有界差分関数である

例えば

$$
f(X_1,\dots,X_n)
=
\frac1n\sum_{i=1}^nX_i
$$

で、

$$
0\le X_i\le1
$$

なら、1 個の入力を変更したときに $f$ が変わる量は高々

$$
c_i=\frac1n
$$

です。

したがって

$$
\sum_{i=1}^nc_i^2
=
\frac1n
$$

なので、

$$
\Pr(
|f-\mathbb{E}f|\ge t
)
\le
2e^{-2nt^2}
$$

を得ます。

しかし McDiarmid の真価は、このような単純な平均ではなく、例えばランダムなデータセット全体から計算される複雑な統計量についても、

> 各サンプル 1 個が結果に与える影響が小さい

ことさえ証明できれば集中を導ける点にあります。

### 証明の考え方

McDiarmid の不等式の背景には martingale があります。

$$
Z:=f(X_1,\dots,X_n)
$$

として、

$$
M_i
:=
\mathbb{E}
[
Z\mid X_1,\dots,X_i
]
$$

を考えると、

$$
M_0=\mathbb{E}Z,
\qquad
M_n=Z
$$

です。

したがって、

$$
Z-\mathbb{E}Z
=
\sum_{i=1}^n(M_i-M_{i-1})
$$

と分解できます。

有界差分条件によって各 martingale difference の変動幅を制御し、Hoeffding 型の指数モーメント評価を適用することで McDiarmid の不等式が導かれます。



## 8. それぞれの不等式は何が違うのか

ここまでの関係を整理すると次のようになります。

| 不等式・手法     | 主な仮定         | 扱う対象                     | 典型的な tail                   |
| ---------- | ------------ | ------------------------ | --------------------------- |
| Markov     | 非負性、1 次モーメント | 非負確率変数                   | $O(1/t)$                    |
| Chebyshev  | 有限分散         | 一般の確率変数                  | $O(1/t^2)$                  |
| Chernoff 法 | MGF を評価可能    | 一般の確率変数                  | MGF に依存                     |
| Hoeffding  | 独立性、有界性      | 確率変数の和                   | $\exp(-ct^2)$               |
| Bernstein  | 独立性、有界性、分散   | 確率変数の和                   | $\exp(-c\min(t^2/v,t/M))$ 型 |
| McDiarmid  | 独立入力、有界差分性   | 一般の関数 $f(X_1,\dots,X_n)$ | $\exp(-ct^2)$ 型             |

ただし、この表の $c$ は問題設定に依存する正の定数を表しています。

### どれを使えばよいか

大まかな判断基準は次のようになります。

* **非負性と期待値しか分からない**
  → Markov

* **平均と分散まで分かる**
  → Chebyshev

* **MGF を直接計算・評価できる**
  → Chernoff 法

* **独立な確率変数の和で、各変数が有界**
  → Hoeffding

* **独立な和で、有界性に加えて分散が小さいことも利用したい**
  → Bernstein

* **独立変数の和ではなく、一般の関数を扱いたいが、1 入力の変更による影響が小さい**
  → McDiarmid



## 9. よくある注意点

### 独立性を暗黙に仮定しない

Markov や Chebyshev の不等式そのものには独立性は不要です。

一方で、本記事で述べた標準的な Hoeffding、Bernstein、McDiarmid では独立性が本質的な仮定になっています。

依存する確率変数に対して同じ式をそのまま適用することはできません。

依存構造を扱う場合には martingale の Azuma-Hoeffding inequality や、mixing 条件に基づく集中不等式など別の道具が必要になります。

### 「有界」は観測した最大値・最小値とは違う

Hoeffding で必要なのは、

$$
a_i\le X_i\le b_i
\quad\text{a.s.}
$$

という**分布そのものに対する既知の範囲**です。

手元の標本でたまたま観測された

$$
\min_iX_i,\qquad\max_iX_i
$$

を、そのまま確率変数の真の上下限として使えるわけではありません。

この違いは実際のデータ解析で特に重要です。

### 有界でないから集中しない、とは限らない

Gaussian 分布は有界ではありませんが、非常に強い集中を持ちます。

したがって、

> Hoeffding が使えない $\Rightarrow$ 集中不等式が使えない

ではありません。

有界性は MGF を制御するための一つの十分条件にすぎず、sub-Gaussian、sub-exponential、有限高次モーメントなど、より一般的な tail 条件に対応した集中不等式が存在します。

### 集中不等式は分布を再現するものではない

中心極限定理は、適切に正規化された和の**分布そのもの**が Gaussian に近づくことを述べます。

一方、集中不等式の主目的は

$$
\Pr(|X-\mathbb{E}X|\ge t)
$$

を上から抑えることです。

両者は関連していますが、目的が異なります。

集中不等式は有限標本での保証に強く、中心極限定理は分布の漸近的な形を記述することに強い、という違いがあります。



## 10. まとめ

集中不等式の基本的な流れを一つの図式として書くと、

$$
\boxed{
\text{Markov}
\longrightarrow
\text{Chebyshev}
}
$$

と

$$
\boxed{
\text{Markov}
\longrightarrow
\text{Chernoff method}
\longrightarrow
\text{Hoeffding / Bernstein}
}
$$

という 2 つの流れが見えてきます。

Markov の不等式は非常に弱い仮定から tail probability を制御する最も基本的な道具です。

Chebyshev は二乗偏差に Markov を適用し、分散によって平均からのずれを評価します。

Chernoff 法では確率変数を指数変換し、MGF とパラメータ最適化を使うことで指数的な tail bound を作ります。

Hoeffding はその枠組みに有界性を組み合わせ、

$$
\exp(-cn\varepsilon^2)
$$

という強い有限標本保証を与えます。

Bernstein はさらに分散を利用することで、小偏差領域ではよりデータの実際の変動に即した評価を可能にします。

そして McDiarmid は、「和」という構造さえ捨て、「各入力を 1 個変えても出力が大きく変わらない」という安定性だけから一般の関数の集中を導きます。

結局、集中不等式が答えようとしている問いは一貫しています。


> 有限個のランダムなデータから作られた量は、どの程度その典型値の周りに安定しているのか？

統計推定、機械学習の汎化解析、ランダム行列、ランダムグラフ、アルゴリズム解析などで集中不等式が繰り返し現れるのは、この問いが確率的な問題のほぼあらゆる場所に現れるからです。

---

## 参考文献

* W. Hoeffding, *Probability Inequalities for Sums of Bounded Random Variables*, Journal of the American Statistical Association, 58(301), pp. 13–30, 1963. DOI: 10.1080/01621459.1963.10500830
* C. McDiarmid, *On the Method of Bounded Differences*, Surveys in Combinatorics, 1989, London Mathematical Society Lecture Note Series 141, pp. 148–188. DOI: 10.1017/CBO9781107359949.008
* S. Boucheron, G. Lugosi, P. Massart, *Concentration Inequalities: A Nonasymptotic Theory of Independence*, Oxford University Press, 2013.
