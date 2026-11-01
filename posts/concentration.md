---
title: "集中不等式入門：Markov から McDiarmid まで"
date: "2026-09-20"
subtitle: "有限個のデータから作った量が期待値からどれだけ外れうるかを評価する、基本的な不等式とその使い分け"
tags: [Math]
icon: sigma
---


## 0. イントロ
確率論や統計学では、ランダムな量の値そのものよりも、その量が典型的な値からどの程度ずれうるかを知りたい場面がよくあります。

例として、独立同分布（independent and identically distributed; i.i.d.）な確率変数 $X_1, \dots, X_n$ の標本平均
$$
    \bar{X}_n := \frac{1}{n} \sum_{i=1}^n X_i
$$
を考えます。
$\mathbb{E}[|X_1|] < \infty$ なら、大数の法則により、$n \to \infty$ で $\bar{X}_n$ は期待値 $\mu := \mathbb{E}[X_1]$ に確率 $1$ で収束します。
しかし、実際のデータ解析では $n$ は有限です。
そこで知りたいのは、与えられた $n$ と $\varepsilon > 0$ に対して、次の確率がどれだけ小さいかです。
$$
    \Pr\left(|\bar{X}_n - \mu| \geq \varepsilon\right)
$$
この確率を、$n$、$\varepsilon$、分布の性質（値域や分散など）を使って上から評価する不等式を **集中不等式（concentration inequality）** と呼びます。

中心極限定理も $\bar{X}_n$ のゆらぎを記述しますが、その主張は $n \to \infty$ の極限における分布の形であり、有限の $n$ での誤差の大きさは含みません。
集中不等式は、有限の $n$ でそのまま成り立つ上界を与えます。


### 本記事で使う例：成功確率の推定
本記事では、次の問題を例にして各不等式を比較します。

:::question{title="例：成功確率の推定"}
成功確率 $p$ の試行を独立に $n$ 回行い、$i$ 回目が成功なら $X_i = 1$、失敗なら $X_i = 0$ とします。
$p$ を成功割合 $\hat{p} := \frac{1}{n} \sum_{i=1}^n X_i$ で推定するとき、誤差が $\varepsilon$ 以上になる確率を $\delta$ 以下にするには、$n$ をいくつ以上にすればよいでしょうか。
:::

条件は次の 2 つとし、それぞれ $\delta = 0.05$ と $\delta = 10^{-6}$ の場合を考えます。
- **(A)** $p = 0.5$, $\varepsilon = 0.05$：1 回の試行の分散 $p(1-p)$ が最大の $1/4$ になる場合
- **(B)** $p = 0.01$, $\varepsilon = 0.005$：成功がまれで、分散 $p(1-p) \approx 0.0099$ が小さい場合

まず、(A) の条件で $\hat{p}$ の分布を Python で調べます。
次のコードは、$n = 10, 100, 1000$ のそれぞれについて $\hat{p}$ を $10^5$ 回生成し、ヒストグラムを描きます。

```python[title=concentration.py]
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
p, eps, trials = 0.5, 0.05, 100_000

for n in [10, 100, 1000]:
    # 成功確率 p の試行を n 回行ったときの成功割合を trials 回分生成する
    p_hat = rng.binomial(n, p, size=trials) / n
    # 誤差が eps 以上になった割合（1e-12 は浮動小数点の丸め誤差対策）
    miss = np.mean(np.abs(p_hat - p) >= eps - 1e-12)
    bins = (np.arange(n + 2) - 0.5) / n  # 各 k/n を中心とする幅 1/n のビン
    plt.hist(p_hat, bins=bins, density=True, histtype="step", lw=2,
             label=f"$n = {n}$ ({miss:.3f})")

plt.axvspan(p - eps, p + eps, color="gray", alpha=0.2)
plt.xlim(0.2, 0.8)
plt.xlabel(r"$\hat p$")
plt.ylabel("Density")
plt.legend(loc="upper left")
plt.show()
```

![Image](/images/concentration/concentration_hist.png "width=560px caption='図 1：(A) の条件（p = 0.5）での成功割合の分布。灰色の帯は |p̂ − p| < 0.05 の範囲、凡例の括弧内は誤差が 0.05 以上になった割合。'")

図 1 のように、$n$ を増やすと $\hat{p}$ の分布は $p = 0.5$ の周りに集中し、誤差が $0.05$ 以上になる割合は $n = 10$ で $0.752$、$n = 100$ で $0.367$、$n = 1000$ で $0.002$ と減少します。
集中不等式は、分布を細かく計算せずに、この割合の上界を与えます。

記事中にコードを載せていない図 2 と図 5 も含め、本記事のすべての図は [code/concentration/make_figures.py](https://github.com/kkensuke/pages/blob/main/code/concentration/make_figures.py) で再生成できます。


### 本記事のロードマップ
各節で扱う不等式と、その不等式が使う情報は次のとおりです。

1. **Markov の不等式**（第 2 節）：非負性と期待値
2. **Chebyshev の不等式**（第 3 節）：分散
3. **Chernoff 法**（第 4 節）：積率母関数
4. **Hoeffding の不等式**（第 5 節）：独立性と値域
5. **Bernstein の不等式**（第 6 節）：独立性、値域、分散
6. **McDiarmid の不等式**（第 7 節）：独立性と、1 つの入力を変えたときの出力の変化の上限

第 8 節で例の結果を比較し、第 9 節で仮定が満たされない場合の道具を紹介します。
後の節の不等式ほど常に強いわけではありません。
どの不等式が小さい上界を与えるかは、使える仮定と問題の条件によって変わります。


## 1. 記法と基本事項

:::note{title="記法"}
- $\Pr(A)$ は事象 $A$ の確率、$\mathbb{E}[X]$ は確率変数 $X$ の期待値、$\operatorname{Var}(X) := \mathbb{E}[(X - \mathbb{E}[X])^2]$ は分散を表します。
- $\mathbf{1}_A$ は事象 $A$ の指示関数で、$A$ が起きれば $1$、起きなければ $0$ をとります。
- 「$X \geq 0$ a.s.」は、確率 $1$ で $X \geq 0$ が成り立つこと（almost surely）を表します。
- 確率変数 $X_1, \dots, X_n$ の和を $S_n := \sum_{i=1}^n X_i$、標本平均を $\bar{X}_n := S_n / n$ と書きます。
- $\log$ は自然対数を表します。
:::

### 裾確率と union bound
確率変数 $X$ が期待値から $t > 0$ 以上離れる確率を **裾確率（tail probability）** と呼びます。
離れる向きによって、次の 3 種類があります。
- 上側の裾確率：$\Pr(X - \mathbb{E}[X] \geq t)$
- 下側の裾確率：$\Pr(X - \mathbb{E}[X] \leq -t)$
- 両側の裾確率：$\Pr(|X - \mathbb{E}[X]| \geq t)$

集中不等式は、これらの裾確率の上界（tail bound）を与えます。
任意の事象 $A, B$ について $\Pr(A \cup B) \leq \Pr(A) + \Pr(B)$ が成り立つので（union bound）、両側の裾確率は上側と下側の裾確率の上界の和で抑えられます。
そのため、上側と下側で同じ上界が成り立つ場合、両側の上界には係数 $2$ が付きます。


## 2. Markov の不等式
Markov の不等式は、非負性と期待値だけから裾確率を評価します。
本記事の残りの不等式は、いずれも証明のどこかでこの不等式を使います。

:::tip{title="定理 1（Markov の不等式）"}
$X \geq 0$ a.s. かつ $\mathbb{E}[X] < \infty$ とします。
このとき、任意の $t > 0$ に対して
$$
    \Pr(X \geq t) \leq \frac{\mathbb{E}[X]}{t}
$$
が成り立ちます。
:::

**証明**　$X \geq 0$ a.s. なので、確率 $1$ で $X \geq t \mathbf{1}_{\{X \geq t\}}$ が成り立ちます（$X \geq t$ のとき右辺は $t$、それ以外のとき右辺は $0$ です）。
両辺の期待値をとると $\mathbb{E}[X] \geq t \Pr(X \geq t)$ となり、両辺を $t$ で割ると定理 1 を得ます。$\square$

$t = c\, \mathbb{E}[X]$（$c > 0$）とおくと、$\Pr(X \geq c\, \mathbb{E}[X]) \leq 1/c$ です。
例えば、非負の確率変数が期待値の $10$ 倍以上になる確率は $1/10$ 以下です。
仮定が弱い代わりに、上界は $t$ について $1/t$ の速さでしか減少しません。

### 指示関数を非負の関数で抑える
証明で使ったのは、指示関数 $\mathbf{1}_{\{X \geq t\}}$ を非負の関数で上から抑え、その期待値をとる、という手順です。
一般に、確率変数 $Y$ と非負の関数 $\varphi$ が、$Y$ のとりうるすべての値 $y$ で $\varphi(y) \geq \mathbf{1}_{\{y \geq t\}}$ を満たせば、
$$
    \Pr(Y \geq t) = \mathbb{E}\left[\mathbf{1}_{\{Y \geq t\}}\right] \leq \mathbb{E}[\varphi(Y)]
$$
が成り立ちます。
$\varphi$ の選び方によって、異なる不等式が得られます（図 2）。

![Image](/images/concentration/indicator_bounds.png "width=100% caption='図 2：指示関数 1{y ≥ t}（黒、t = 1）を上から抑える非負の関数。(a) は t の近く、(b) は広い範囲で、(b) の破線の枠が (a) の範囲。Markov の不等式は y/t（y ≥ 0 の場合）、Chebyshev の不等式は y²/t²、Chernoff 法は exp(λ(y − t)) を使う。'")

- **Markov の不等式**（第 2 節）：非負の $Y = X$ に $\varphi(y) = y/t$ を使います。
- **Chebyshev の不等式**（第 3 節）：$Y = X - \mathbb{E}[X]$ に $\varphi(y) = y^2/t^2$ を使います。この $\varphi$ は $y \leq -t$ でも $1$ 以上なので、両側の裾確率を一度に抑えます。
- **Chernoff 法**（第 4 節）：$Y = X - \mathbb{E}[X]$ に $\varphi(y) = e^{\lambda(y - t)}$（$\lambda > 0$）を使います。

$Y$ が値をとりやすい範囲で $\varphi$ が指示関数に近いほど、上界は小さくなります。
Chernoff 法では $\lambda$ によって $\varphi$ の形を調整できます。
図 2 (a) の $t$ の近くでは、$\lambda = 4$ の曲線は $\lambda = 1.5$ の曲線と比べて、$y < t$ で指示関数に近い代わりに、$y > t$ で速く増加します。
第 4 節では、この $\lambda$ を最適化します。

図 2 (b) の広い範囲では、遠くでの増え方の違いが分かります。
Markov の不等式の $y/t$ は $y$ の 1 次関数で、Chebyshev の不等式の $y^2/t^2$ は $0$ から左右どちらに離れても増加します。
Chernoff 法の $e^{\lambda(y - t)}$ は、$y$ が小さくなるほど $0$ に近づく一方、$y > t$ では指数関数的に増加します。
そのため、Chernoff 法で $\mathbb{E}[\varphi(Y)]$ が有限になるには、$Y$ の積率母関数（第 4 節）が有限であること、つまり $Y$ の上側の裾が指数関数以上の速さで減衰することが必要です。


## 3. Chebyshev の不等式
Chebyshev の不等式は、分散を使って期待値の周りへの集中を評価します。

:::tip{title="定理 2（Chebyshev の不等式）"}
$X$ の分散 $\operatorname{Var}(X)$ が有限とします。
このとき、任意の $t > 0$ に対して
$$
    \Pr(|X - \mathbb{E}[X]| \geq t) \leq \frac{\operatorname{Var}(X)}{t^2}
$$
が成り立ちます。
:::

**証明**　非負の確率変数 $(X - \mathbb{E}[X])^2$ に Markov の不等式を適用すると、
$$
    \begin{aligned}
    \Pr(|X - \mathbb{E}[X]| \geq t)
    &= \Pr\left((X - \mathbb{E}[X])^2 \geq t^2\right) \\
    &\leq \frac{\mathbb{E}\left[(X - \mathbb{E}[X])^2\right]}{t^2}
    = \frac{\operatorname{Var}(X)}{t^2}
    \end{aligned}
$$
を得ます。$\square$

### 標本平均への適用
$X_1, \dots, X_n$ が互いに無相関で、期待値 $\mu$ と分散 $\sigma^2$ が共通とします。
このとき $\operatorname{Var}(\bar{X}_n) = \sigma^2/n$ なので、定理 2 より
$$
    \Pr(|\bar{X}_n - \mu| \geq \varepsilon) \leq \frac{\sigma^2}{n\varepsilon^2}
$$
です。
$\operatorname{Var}(\bar{X}_n)$ の計算に使ったのは分散の加法性だけなので、独立性より弱い無相関性で足ります。

**例への適用**　1 回の試行の分散は $\sigma^2 = p(1-p)$ なので、右辺を $\delta$ 以下にするには
$$
    n \geq \frac{p(1-p)}{\varepsilon^2 \delta}
$$
とすれば十分です。
(A) で $\delta = 0.05$ なら $n \geq 2{,}000$ です。
必要な $n$ は $1/\delta$ に比例するため、$\delta = 10^{-6}$ では $n \geq 10^8$ になります。


## 4. Chernoff 法
Chebyshev の不等式の上界は $t$ の多項式でしか減少しません。
指数関数を使うと、$t$ について指数的に減少する上界が得られます。
この手法を Chernoff 法、または Cramér–Chernoff 法と呼びます（Chernoff, 1952; Boucheron et al., 2013, §2.2）。

### 一般形
$\lambda \in \mathbb{R}$ の関数 $\mathbb{E}[e^{\lambda X}]$ を、$X$ の **積率母関数（moment generating function; MGF）** と呼びます。
本記事では、中心化した確率変数の MGF の対数
$$
    \psi_X(\lambda) := \log \mathbb{E}\left[e^{\lambda (X - \mathbb{E}[X])}\right]
$$
を使います。
$\lambda > 0$ で $\psi_X(\lambda)$ が有限なら、$x \mapsto e^{\lambda x}$ は単調増加なので、Markov の不等式より
$$
    \begin{aligned}
    \Pr(X - \mathbb{E}[X] \geq t)
    &= \Pr\left(e^{\lambda (X - \mathbb{E}[X])} \geq e^{\lambda t}\right) \\
    &\leq e^{-\lambda t}\, \mathbb{E}\left[e^{\lambda (X - \mathbb{E}[X])}\right]
    = \exp\left(-\lambda t + \psi_X(\lambda)\right)
    \end{aligned}
$$
が成り立ちます。
この式は $\psi_X(\lambda)$ が有限なすべての $\lambda > 0$ で成り立つので、右辺を $\lambda$ について最小化して
$$
    \Pr(X - \mathbb{E}[X] \geq t) \leq \exp\left(-\sup_{\lambda > 0} \left\{\lambda t - \psi_X(\lambda)\right\}\right)
$$
を得ます。
この上界を Chernoff bound と呼びます。
$\psi_X$ を上から評価できれば、具体的な上界が得られます。
下側の裾確率は、$-X$ に同じ議論を適用して評価します。

### 独立な確率変数の和
指数関数を使うと、独立な確率変数の和の MGF は、各変数の MGF の積に分解されます。
$X_1, \dots, X_n$ が独立なら
$$
    \mathbb{E}\left[e^{\lambda (S_n - \mathbb{E}[S_n])}\right] = \prod_{i=1}^n \mathbb{E}\left[e^{\lambda (X_i - \mathbb{E}[X_i])}\right]
$$
であり、両辺の対数をとると $\psi_{S_n}(\lambda) = \sum_{i=1}^n \psi_{X_i}(\lambda)$ です。
したがって、各 $X_i$ の $\psi_{X_i}$ を評価すれば、和 $S_n$ の裾確率を評価できます。
第 5 節の Hoeffding の不等式と第 6 節の Bernstein の不等式は、この手順で導かれます。

### sub-Gaussian

:::note{title="定義：sub-Gaussian"}
ある $\nu > 0$ が存在して、すべての $\lambda \in \mathbb{R}$ で
$$
    \psi_X(\lambda) \leq \frac{\nu \lambda^2}{2}
$$
が成り立つとき、$X$ は分散パラメータ $\nu$ の **sub-Gaussian** であるといいます。
:::

分散 $\nu$ の正規分布に従う確率変数では、$\psi_X(\lambda) = \nu\lambda^2/2$ が等号で成り立ちます。
つまり sub-Gaussian とは、中心化した MGF が正規分布の MGF 以下に収まる確率変数です。
sub-Gaussian な $X$ に Chernoff 法を適用すると、$\lambda t - \nu\lambda^2/2$ は $\lambda = t/\nu$ で最大値 $t^2/(2\nu)$ をとるので、
$$
    \Pr(X - \mathbb{E}[X] \geq t) \leq \exp\left(-\frac{t^2}{2\nu}\right)
$$
を得ます。
定義は $\lambda < 0$ も含むので、下側の裾確率にも同じ上界が成り立ち、両側では係数 $2$ が付きます（Boucheron et al., 2013, §2.3）。

また、独立な $X_i$ がそれぞれ分散パラメータ $\nu_i$ の sub-Gaussian なら、$\psi_{S_n} = \sum_i \psi_{X_i}$ より、$S_n$ は分散パラメータ $\sum_{i=1}^n \nu_i$ の sub-Gaussian です。
第 5 節では、この性質を使って Hoeffding の不等式を導きます。

### Bernoulli 確率変数の和に対する相対誤差の上界
Chernoff 法を Bernoulli 確率変数の和に適用すると、期待値に対する相対誤差の上界が得られます（Mitzenmacher & Upfal, 2017, 第 4 章）。

:::tip{title="定理 3（相対誤差の Chernoff bound）"}
$X_1, \dots, X_n$ を独立な確率変数とし、$X_i \in \{0, 1\}$、$\Pr(X_i = 1) = p_i$ とします。
$m := \mathbb{E}[S_n] = \sum_{i=1}^n p_i$ とおくと、任意の $\eta > 0$ に対して
$$
    \begin{aligned}
    \Pr\left(S_n \geq (1 + \eta) m\right)
    &\leq \left(\frac{e^{\eta}}{(1 + \eta)^{1 + \eta}}\right)^m \\
    &\leq \exp\left(-\frac{\eta^2 m}{2 + \eta}\right)
    \end{aligned}
$$
が成り立ちます。
また、$0 < \eta < 1$ に対して
$$
    \Pr\left(S_n \leq (1 - \eta) m\right) \leq \exp\left(-\frac{\eta^2 m}{2}\right)
$$
が成り立ちます。
:::

1 つ目の式の 2 番目の不等号は、$\eta \geq 0$ で成り立つ $\log(1 + \eta) \geq 2\eta/(2 + \eta)$ から従います。
この定理は、誤差を期待値 $m$ との比 $\eta$ で測ります。
$m$ が $n$ に比べて小さいとき、第 5 節の Hoeffding の不等式より小さい上界を与えることがあります（第 8 節）。

**例への適用**　$p_i = p$ なら $m = np$ です。
事象 $|\hat{p} - p| \geq \varepsilon$ は、相対誤差 $\eta := \varepsilon/p$ が上側または下側に生じる事象です。
$\eta < 1$ のとき、下側の指数 $\eta^2 m/2$ は上側の指数 $\eta^2 m/(2 + \eta)$ 以上なので、両側を合わせて
$$
    \Pr(|\hat{p} - p| \geq \varepsilon) \leq 2\exp\left(-\frac{\eta^2 np}{2 + \eta}\right)
$$
です。
右辺を $\delta$ 以下にする条件は $n \geq (2 + \eta)\log(2/\delta) / (\eta^2 p)$ で、(B)（$\eta = 0.5$）で $\delta = 0.05$ なら $n \geq 3{,}689$ です。


## 5. Hoeffding の不等式
独立な確率変数がそれぞれ既知の有界区間に値をとるとき、Chernoff 法から Hoeffding の不等式が導かれます（Hoeffding, 1963）。
鍵になるのは、有界な確率変数が sub-Gaussian であることを示す次の補題です。

:::tip{title="補題（Hoeffding の補題）"}
$a \leq X \leq b$ a.s. なら、すべての $\lambda \in \mathbb{R}$ で
$$
    \psi_X(\lambda) \leq \frac{\lambda^2 (b - a)^2}{8}
$$
が成り立ちます。
つまり、$X$ は分散パラメータ $(b - a)^2/4$ の sub-Gaussian です。
:::

証明は Boucheron et al. (2013) の第 2 章を参照してください。

:::tip{title="定理 4（Hoeffding の不等式）"}
$X_1, \dots, X_n$ を独立な確率変数とし、各 $i$ で $a_i \leq X_i \leq b_i$ a.s. とします。
このとき、任意の $t > 0$ に対して
$$
    \Pr(S_n - \mathbb{E}[S_n] \geq t) \leq \exp\left(-\frac{2t^2}{\sum_{i=1}^n (b_i - a_i)^2}\right)
$$
が成り立ちます。
下側の裾確率にも同じ上界が成り立ち、両側の裾確率の上界は右辺の 2 倍です。
:::

**証明**　Hoeffding の補題より、各 $X_i$ は分散パラメータ $(b_i - a_i)^2/4$ の sub-Gaussian です。
第 4 節で見たように、独立な和 $S_n$ は分散パラメータ $\nu := \sum_{i=1}^n (b_i - a_i)^2/4$ の sub-Gaussian なので、
$$
    \begin{aligned}
    \Pr(S_n - \mathbb{E}[S_n] \geq t)
    &\leq \exp\left(-\frac{t^2}{2\nu}\right) \\
    &= \exp\left(-\frac{2t^2}{\sum_{i=1}^n (b_i - a_i)^2}\right)
    \end{aligned}
$$
を得ます。$\square$

### 標本平均と必要な標本数
各 $X_i \in [a, b]$ a.s. で、期待値 $\mu$ が共通なら、定理 4 で $t = n\varepsilon$ とおいて
$$
    \Pr(|\bar{X}_n - \mu| \geq \varepsilon) \leq 2\exp\left(-\frac{2n\varepsilon^2}{(b - a)^2}\right)
$$
を得ます。
$\varepsilon$ を固定すると、この上界は $n$ について指数的に減少します。
第 3 節の Chebyshev の上界 $\sigma^2/(n\varepsilon^2)$ は、$1/n$ の速さでしか減少しません。

右辺を $\delta$ とおいて解くと、次の 2 つの形が得られます。
- $n \geq \dfrac{(b - a)^2}{2\varepsilon^2} \log\dfrac{2}{\delta}$ なら、$\Pr(|\bar{X}_n - \mu| \geq \varepsilon) \leq \delta$ が成り立ちます。
- 任意の $n$ について、確率 $1 - \delta$ 以上で $|\bar{X}_n - \mu| < (b - a)\sqrt{\dfrac{\log(2/\delta)}{2n}}$ が成り立ちます。

**例への適用**　$X_i \in [0, 1]$ なので、条件は $n \geq \log(2/\delta)/(2\varepsilon^2)$ です。
(A) で $\delta = 0.05$ なら $n \geq 738$、$\delta = 10^{-6}$ でも $n \geq 2{,}902$ です。
必要な $n$ は $\log(1/\delta)$ に比例して増えるので、$1/\delta$ に比例して増える Chebyshev の不等式との差は、$\delta$ が小さいほど広がります。
一方、(B) では $\delta = 0.05$ でも $n \geq 73{,}778$ が必要です。
Hoeffding の不等式は値域 $[0, 1]$ しか使わないため、(B) の分散 $p(1-p) \approx 0.0099$ が、値域 $[0, 1]$ の確率変数の分散の最大値 $1/4$ の約 $1/25$ であることを反映できません。
この点を改善するのが、第 6 節の Bernstein の不等式です。

:::warning{title="値域は観測値ではなく、分布について既知の値を使う"}
定理 4 の $a_i, b_i$ は、分布について事前に分かっている値域です。
手元の標本で観測された最小値 $\min_i X_i$ と最大値 $\max_i X_i$ を代わりに使うと、まだ観測されていない値の可能性を無視することになり、上界は保証されません。
:::


## 6. Bernstein の不等式
Hoeffding の不等式は値域しか使いません。
値域が広くても、ほとんどの値が期待値の近くに集まる確率変数では、分散も使う Bernstein の不等式がより小さい上界を与えます（Boucheron et al., 2013, §2.8）。

:::tip{title="定理 5（Bernstein の不等式）"}
$X_1, \dots, X_n$ を独立な確率変数とし、ある $M > 0$ について、各 $i$ で $|X_i - \mathbb{E}[X_i]| \leq M$ a.s. とします。
$V := \sum_{i=1}^n \operatorname{Var}(X_i)$ とおくと、任意の $t > 0$ に対して
$$
    \Pr(S_n - \mathbb{E}[S_n] \geq t) \leq \exp\left(-\frac{t^2}{2(V + Mt/3)}\right)
$$
が成り立ちます。
下側の裾確率にも同じ上界が成り立ち、両側の裾確率の上界は右辺の 2 倍です。
:::

### 2 つの減衰の速さ
分母の $V + Mt/3$ の 2 つの項のどちらが大きいかで、上界の減衰の速さが変わります。
$V + Mt/3 \leq 2\max\{V, Mt/3\}$ より、
$$
    \exp\left(-\frac{t^2}{2(V + Mt/3)}\right) \leq \exp\left(-\min\left\{\frac{t^2}{4V}, \frac{3t}{4M}\right\}\right)
$$
が成り立ちます。
- $t \leq 3V/M$ のとき、指数は $t^2/(4V)$ 以上です。上界は、分散 $V$ の正規分布と同じく $t^2$ に比例する指数で減衰します。
- $t > 3V/M$ のとき、指数は $3t/(4M)$ 以上です。上界は、指数分布と同じく $t$ に比例する指数で減衰します。

### 標本平均と Hoeffding の不等式との比較
$X_1, \dots, X_n$ が i.i.d. で、$\mathbb{E}[X_i] = \mu$、$\operatorname{Var}(X_i) = \sigma^2$、$|X_i - \mu| \leq M$ a.s. とします。
定理 5 に $V = n\sigma^2$、$t = n\varepsilon$ を代入すると、
$$
    \Pr(|\bar{X}_n - \mu| \geq \varepsilon) \leq 2\exp\left(-\frac{n\varepsilon^2}{2(\sigma^2 + M\varepsilon/3)}\right)
$$
を得ます。
$X_i \in [a, b]$ のとき、分散は最大で $(b - a)^2/4$ です。
上式の $\sigma^2$ をこの最大値で置き換え、$M\varepsilon/3$ を無視すると、指数は $2n\varepsilon^2/(b - a)^2$ となり、第 5 節の Hoeffding の上界の指数と一致します。
つまり、Hoeffding の不等式は分散が最大の場合を想定した上界と見なせます。
2 つの指数を比べると、$\sigma^2 + M\varepsilon/3 < (b - a)^2/4$ のとき、Bernstein の上界のほうが小さくなります。

**例への適用**　$\sigma^2 = p(1-p)$、$M = \max\{p, 1 - p\}$ とすると、条件は
$$
    n \geq \frac{2(\sigma^2 + M\varepsilon/3)}{\varepsilon^2} \log\frac{2}{\delta}
$$
です。
(B) で $\delta = 0.05$ なら $n \geq 3{,}409$ で、Hoeffding の不等式の $73{,}778$ の約 $1/22$ です。
(A) では $\sigma^2 = 1/4$ が最大値なので、$n \geq 763$ となり、Hoeffding の不等式の $738$ よりわずかに大きくなります。


## 7. McDiarmid の不等式
第 5 節と第 6 節では、確率変数の和を扱いました。
McDiarmid の不等式（有界差分不等式、bounded differences inequality）は、和に限らず、独立な確率変数の関数 $f(X_1, \dots, X_n)$ を扱います（McDiarmid, 1989; Boucheron et al., 2013, §6.1）。

:::note{title="定義：有界差分条件"}
関数 $f: \mathcal{X}_1 \times \cdots \times \mathcal{X}_n \to \mathbb{R}$ と定数 $c_1, \dots, c_n \geq 0$ が、すべての $i$ と、$i$ 番目の入力だけが異なる任意の 2 点について
$$
    \left|f(x_1, \dots, x_i, \dots, x_n) - f(x_1, \dots, x_i', \dots, x_n)\right| \leq c_i
$$
を満たすとき、$f$ は **有界差分条件（bounded differences condition）** を満たすといいます。
:::

有界差分条件は、$i$ 番目の入力だけを変えても出力は $c_i$ 以下しか変わらない、という安定性を表します。

:::tip{title="定理 6（McDiarmid の不等式）"}
$X_1, \dots, X_n$ を独立な確率変数とし、$X_i$ は $\mathcal{X}_i$ に値をとるとします。
$f$ が定数 $c_1, \dots, c_n$ で有界差分条件を満たすとき、$Z := f(X_1, \dots, X_n)$ について、任意の $t > 0$ に対して
$$
    \Pr(Z - \mathbb{E}[Z] \geq t) \leq \exp\left(-\frac{2t^2}{\sum_{i=1}^n c_i^2}\right)
$$
が成り立ちます。
下側の裾確率にも同じ上界が成り立ち、両側の裾確率の上界は右辺の 2 倍です。
:::

### Hoeffding の不等式との関係
$f$ が和 $f(x_1, \dots, x_n) = \sum_{i=1}^n x_i$ で、$x_i \in [a_i, b_i]$ の場合を考えます。
$i$ 番目の入力を変えたときの和の変化は $b_i - a_i$ 以下なので、$c_i = b_i - a_i$ を定理 6 に代入すると、定理 4（Hoeffding の不等式）と同じ式になります。
McDiarmid の不等式は、Hoeffding の不等式の「独立な有界確率変数の和」という仮定を、「各入力の変化に対して安定な関数」に広げた結果です。

### 例：経験分布関数の一様な誤差
和ではない関数の例として、$X_1, \dots, X_n$ が i.i.d. で累積分布関数 $F$ に従うとき、経験分布関数 $F_n(x) := \frac{1}{n} \sum_{i=1}^n \mathbf{1}_{\{X_i \leq x\}}$ と $F$ の差の最大値
$$
    Z := \sup_{x \in \mathbb{R}} |F_n(x) - F(x)|
$$
を考えます。
$Z$ は Kolmogorov–Smirnov 統計量と呼ばれ、標本が分布 $F$ に従うかどうかの検定に使われます。
$X_i$ を 1 個変えると、各 $x$ で $F_n(x)$ は $1/n$ 以下しか変わらないので、その上限 $Z$ も $1/n$ 以下しか変わりません。
$c_i = 1/n$ より $\sum_{i=1}^n c_i^2 = 1/n$ なので、定理 6 より
$$
    \Pr(Z - \mathbb{E}[Z] \geq t) \leq e^{-2nt^2}
$$
です。
$Z$ の分布を有限の $n$ で正確に求めるのは容易ではありませんが、この上界は $F$ によらず成り立ちます。

この上界を Python で確かめます。
次のコードは、一様分布 $\mathrm{Uniform}(0, 1)$（$F(x) = x$）から $n = 100, 1000$ 個の標本を $10^4$ 回生成して $Z$ を計算し、$\Pr(Z - \mathbb{E}[Z] \geq t)$ を推定します。
$\mathbb{E}[Z]$ には $10^4$ 回の平均を使います。

```python[title=mcdiarmid.py]
import numpy as np
import matplotlib.pyplot as plt

rng = np.random.default_rng(0)
reps = 10_000
s = np.linspace(0, 1.5, 151)  # 横軸は sqrt(n) * t

for n in [100, 1000]:
    # Uniform(0, 1) の標本を reps 組生成し、各組を昇順に並べる
    u = np.sort(rng.random((reps, n)), axis=1)
    i = np.arange(1, n + 1)
    # Z = sup_x |F_n(x) - x|（経験分布関数と真の分布関数 F(x) = x の差の最大値）
    z = np.maximum(i / n - u, u - (i - 1) / n).max(axis=1)
    tail = [np.mean(z - z.mean() >= x / np.sqrt(n)) for x in s]
    plt.semilogy(s, tail, lw=2, label=f"Simulation ($n = {n}$)")

plt.semilogy(s, np.exp(-2 * s**2), "k--", lw=2,
             label=r"McDiarmid bound $e^{-2nt^2}$")
plt.ylim(1e-4, 1.5)
plt.xlabel(r"$\sqrt{n}\,t$")
plt.ylabel(r"$\Pr(Z - \mathbb{E}[Z] \geq t)$")
plt.legend()
plt.show()
```

![Image](/images/concentration/mcdiarmid_ks.png "width=560px caption='図 3：Kolmogorov–Smirnov 統計量 Z の上側の裾確率（シミュレーション）と McDiarmid の上界。横軸を √n t とすると、上界は n によらない 1 本の曲線になる。縦軸は対数目盛。'")

横軸を $\sqrt{n}\, t$ にとると、上界 $e^{-2nt^2} = e^{-2(\sqrt{n}\, t)^2}$ は $n$ によらない 1 本の曲線になります。
図 3 では、$n = 100$ と $n = 1000$ のシミュレーション結果がほぼ重なり、どちらも上界より下にあります。
つまり、$Z - \mathbb{E}[Z]$ のゆらぎは $1/\sqrt{n}$ の大きさで、McDiarmid の不等式はその大きさを正しく捉えています。

機械学習でも同じ構造が現れます。
値が $[0, 1]$ に収まる損失関数の集合を $\mathcal{G}$ とし、$\sup_{g \in \mathcal{G}} \left|\frac{1}{n} \sum_{i=1}^n g(X_i) - \mathbb{E}[g(X_1)]\right|$ を考えると、上と同じ議論で $c_i = 1/n$ の有界差分条件が成り立ちます。
この量は、訓練データ上の平均損失と期待損失の差の上限であり、汎化誤差の評価に使われます。
Rademacher 複雑度による汎化誤差の評価では、McDiarmid の不等式でこの量をその期待値の近くに抑え、期待値を Rademacher 複雑度で評価します（Bartlett & Mendelson, 2002）。

:::example{title="コラム：証明の考え方（martingale による分解）"}
McDiarmid の不等式は、$Z - \mathbb{E}[Z]$ を、$X_1, X_2, \dots$ を 1 つずつ明らかにしたときの変化の和に分解して証明します。
$Y_0 := \mathbb{E}[Z]$ とし、$k = 1, \dots, n$ について
$$
    Y_k := \mathbb{E}[Z \mid X_1, \dots, X_k]
$$
とおくと、$Y_n = Z$ なので
$$
    Z - \mathbb{E}[Z] = \sum_{k=1}^n (Y_k - Y_{k-1})
$$
と書けます。
$X_1, \dots, X_{k-1}$ が与えられたもとで、増分 $Y_k - Y_{k-1}$ の条件付き期待値は $0$ です。
このような性質をもつ確率変数の列 $(Y_k)$ を **martingale** と呼びます。

さらに、独立性と有界差分条件から、$X_1, \dots, X_{k-1}$ を固定すると、$Y_k$ は $X_k$ の関数として長さ $c_k$ 以下の区間に値をとります。
そこで、Hoeffding の補題を条件付きで各増分に適用し、$k = n, n-1, \dots, 1$ の順に条件付き期待値をとると、
$$
    \mathbb{E}\left[e^{\lambda (Z - \mathbb{E}[Z])}\right] \leq \exp\left(\frac{\lambda^2}{8} \sum_{k=1}^n c_k^2\right)
$$
を得ます。
つまり、$Z$ は分散パラメータ $\sum_k c_k^2/4$ の sub-Gaussian であり、第 5 節と同様に Chernoff 法を適用すると定理 6 が得られます。
:::


## 8. 比較と使い分け

### 例の結果
第 3 節から第 6 節で求めた、$\Pr(|\hat{p} - p| \geq \varepsilon) \leq \delta$ を保証する標本数を表 1 にまとめます。
比較のため、二項分布から数値計算した、実際に必要な標本数も示します。
Chebyshev と Bernstein の不等式には真の分散 $p(1-p)$ を使っています。
実際には $p$ は未知なので、分散の上界（例えば $p \leq 0.01$ が分かっていれば $0.0099$）を使います。

**表 1**：$\Pr(|\hat{p} - p| \geq \varepsilon) \leq \delta$ を保証する標本数 $n$ の下限

| 不等式 | 使う情報 | (A) $\delta = 0.05$ | (A) $\delta = 10^{-6}$ | (B) $\delta = 0.05$ | (B) $\delta = 10^{-6}$ |
| --- | --- | ---: | ---: | ---: | ---: |
| Chebyshev（第 3 節） | 分散 | 2,000 | 100,000,000 | 7,920 | 396,000,000 |
| 相対誤差の Chernoff bound（第 4 節） | Bernoulli 和の期待値 | 1,550 | 6,094 | 3,689 | 14,509 |
| Hoeffding（第 5 節） | 値域 | 738 | 2,902 | 73,778 | 290,174 |
| Bernstein（第 6 節） | 値域、分散 | 763 | 2,999 | 3,409 | 13,406 |
| 二項分布から計算した値 | 分布そのもの | 約 400 | 約 2,400 | 約 1,600 | 約 10,400 |

最終行は、その値以上のすべての $n$ で $\Pr(|\hat{p} - p| \geq \varepsilon) \leq \delta$ となる最小の $n$ です。
$n(p \pm \varepsilon)$ が整数になる $n$ では、$|\hat{p} - p| = \varepsilon$ となる境界上の値が事象に含まれるため、二項分布から計算した確率は $n$ について単調には減少しません。
そのため、概数で示しています。

次のコードは、二項分布から計算した $\Pr(|\hat{p} - p| \geq \varepsilon)$ と、各不等式による上界を $n$ の関数として描きます。

```python[title=tail_bounds.py]
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import binom

def exact_tail(n, p, eps):
    """S ~ Bin(n, p) について Pr(|S/n - p| >= eps) を計算する"""
    # 1e-9 は浮動小数点の丸め誤差対策
    upper = np.ceil(n * (p + eps) - 1e-9)
    lower = np.floor(n * (p - eps) + 1e-9)
    return binom.sf(upper - 1, n, p) + binom.cdf(lower, n, p)

def bounds(n, p, eps):
    """各不等式による Pr(|p_hat - p| >= eps) の上界"""
    var, M, eta = p * (1 - p), max(p, 1 - p), eps / p
    return {
        "Chebyshev": var / (n * eps**2),
        "Chernoff (relative)": 2 * np.exp(-eta**2 * n * p / (2 + eta)),
        "Hoeffding": 2 * np.exp(-2 * n * eps**2),
        "Bernstein": 2 * np.exp(-n * eps**2 / (2 * (var + M * eps / 3))),
    }

settings = [("A", 0.5, 0.05, 4000), ("B", 0.01, 0.005, 20000)]
fig, axes = plt.subplots(1, 2, figsize=(14, 5.6), sharey=True)
for ax, (label, p, eps, n_max) in zip(axes, settings):
    n = np.arange(10, n_max + 1, 10)
    ax.semilogy(n, exact_tail(n, p, eps), "k", lw=1.2, label="Exact (binomial)")
    for name, value in bounds(n, p, eps).items():
        ax.semilogy(n, np.minimum(value, 1), lw=2.2, label=name)
    ax.axhline(0.05, color="gray", ls="--")
    ax.set(title=rf"({label}) $p = {p}$, $\varepsilon = {eps}$",
           xlabel="$n$", xlim=(0, n_max), ylim=(1e-10, 2))
axes[0].set_ylabel(r"$\Pr(|\hat p - p| \geq \varepsilon)$")
axes[1].legend(loc="lower left")
plt.show()
```

![Image](/images/concentration/tail_bounds.png "width=100% caption='図 4：誤差確率 Pr(|p̂ − p| ≥ ε) の正確な値（黒）と、各不等式による上界。左が (A)、右が (B)。灰色の破線は δ = 0.05。縦軸は対数目盛。'")

表 1 と図 4 から、次の 3 点が読み取れます。

1. **$\delta$ を小さくしたときの増え方**：$\delta$ を $0.05$ から $10^{-6}$ にすると、Chebyshev の不等式による $n$ は $1/\delta$ に比例して $5 \times 10^4$ 倍になります。指数的な上界（Chernoff、Hoeffding、Bernstein）による $n$ は $\log(2/\delta)$ に比例し、約 $3.9$ 倍にとどまります。図 4 では、この違いが直線（指数的な減衰）と、なだらかな曲線（$1/n$ の減衰）の違いとして現れます。
2. **分散が小さいとき**：(B) では、分散を使う Bernstein の不等式と、期待値に対する相対誤差を使う Chernoff bound が、値域だけを使う Hoeffding の不等式より約 $20$ 倍小さい $n$ を与えます。$\delta = 0.05$ では、Chebyshev の不等式も Hoeffding の不等式より小さい $n$ を与えます。
3. **保守性**：どの上界も実際に必要な $n$ より大きく、最も小さい上界でも (A) で約 $1.2$〜$1.8$ 倍、(B) で約 $1.3$〜$2.1$ 倍です。集中不等式は分布の形を細かく使わない代わりに、その分だけ保守的になります。

### 使い分け
表 2 に、各不等式の仮定と上界をまとめます。

**表 2**：各不等式の仮定と上界

| 不等式 | 主な仮定 | 対象 | 上界 |
| --- | --- | --- | --- |
| Markov | 非負、期待値が有限 | 非負の確率変数 $X$ | $\mathbb{E}[X]/t$ |
| Chebyshev | 分散が有限 | 一般の確率変数 $X$ | $\operatorname{Var}(X)/t^2$ |
| Chernoff 法 | MGF が有限 | 一般の確率変数 $X$ | $\exp(-\sup_{\lambda > 0}\{\lambda t - \psi_X(\lambda)\})$ |
| Hoeffding | 独立、有界 | 和 $S_n$ | $\exp(-2t^2/\sum_i (b_i - a_i)^2)$ |
| Bernstein | 独立、有界、分散 | 和 $S_n$ | $\exp(-t^2/(2(V + Mt/3)))$ |
| McDiarmid | 独立、有界差分条件 | 関数 $f(X_1, \dots, X_n)$ | $\exp(-2t^2/\sum_i c_i^2)$ |

状況に応じた選び方の目安は次のとおりです。
- 非負性と期待値しか分からない → Markov の不等式
- 分散は分かるが、独立性を仮定できない → Chebyshev の不等式（無相関なら標本平均にも使えます）
- MGF を計算できる → Chernoff 法で直接評価する
- 独立な Bernoulli 確率変数の和で、期待値に対する相対誤差を評価したい → 相対誤差の Chernoff bound
- 独立な有界確率変数の和で、分散の情報がない → Hoeffding の不等式
- 独立な有界確率変数の和で、分散が値域に比べて小さい → Bernstein の不等式
- 和ではない関数で、各入力の影響が小さい → McDiarmid の不等式


## 9. 仮定が満たされないとき

### 独立でない場合
Markov の不等式と Chebyshev の不等式は、独立性を必要としません。
一方、本記事で示した形の Hoeffding、Bernstein、McDiarmid の不等式は独立性を仮定しており、依存のある確率変数にはそのまま適用できません。
ただし例外もあり、Hoeffding (1963) は、有限母集団からの非復元抽出（各標本は独立ではない）でも、復元抽出の場合と同じ上界が成り立つことを示しています。
また、増分が有界な martingale には Azuma–Hoeffding の不等式が使えます（Azuma, 1967）。
第 7 節のコラムの証明は、この不等式と同じ martingale の議論に基づいています。

### 有界でない場合
有界でない確率変数も集中しえます。
例えば、正規分布は有界ではありませんが、第 4 節で見たように sub-Gaussian です。
sub-Gaussian を含み、より重い裾も許す確率変数のクラスとして sub-exponential があり、Bernstein 型の上界が成り立ちます（Vershynin, 2018, 第 2 章）。
MGF が有限でない分布でも、高次のモーメントが有限なら、第 2 節の方法で $t$ の多項式で減少する上界が得られます。


## 10. まとめ
本記事で扱った不等式は、図 5 のように Markov の不等式から 2 つの経路で導かれます。

![Image](/images/concentration/relations.png "width=520px caption='図 5：本記事で扱った不等式の関係。各箱の下段は、その不等式が使う主な仮定や情報。'")

- **Markov → Chebyshev**：二乗偏差に Markov の不等式を適用し、分散で裾確率を評価します。
- **Markov → Chernoff 法 → Hoeffding、Bernstein、McDiarmid**：指数関数に Markov の不等式を適用し、MGF を評価して指数的に減少する上界を得ます。McDiarmid の不等式は、martingale による分解によって、和以外の関数にも適用できるようにした結果です。

どの不等式も、有限個のデータから作った量が期待値からどれだけ外れうるか、という問いに答えます。
第 8 節の例が示すように、どの不等式が最も小さい上界を与えるかは、使える仮定（分散、値域、独立性、関数の安定性）と問題の条件によって変わります。


## References
- Azuma, K. (1967). [Weighted sums of certain dependent random variables](https://doi.org/10.2748/tmj/1178243286). Tohoku Mathematical Journal, 19(3), 357–367.
- Bartlett, P. L., & Mendelson, S. (2002). [Rademacher and Gaussian complexities: Risk bounds and structural results](https://jmlr.org/papers/v3/bartlett02a.html). Journal of Machine Learning Research, 3, 463–482.
- Boucheron, S., Lugosi, G., & Massart, P. (2013). [Concentration Inequalities: A Nonasymptotic Theory of Independence](https://academic.oup.com/book/26549). Oxford University Press.
- Chernoff, H. (1952). [A measure of asymptotic efficiency for tests of a hypothesis based on the sum of observations](https://doi.org/10.1214/aoms/1177729330). The Annals of Mathematical Statistics, 23(4), 493–507.
- Hoeffding, W. (1963). [Probability inequalities for sums of bounded random variables](https://doi.org/10.1080/01621459.1963.10500830). Journal of the American Statistical Association, 58(301), 13–30.
- McDiarmid, C. (1989). [On the method of bounded differences](https://doi.org/10.1017/CBO9781107359949.008). In Surveys in Combinatorics, 1989 (London Mathematical Society Lecture Note Series 141), 148–188. Cambridge University Press.
- Mitzenmacher, M., & Upfal, E. (2017). [Probability and Computing: Randomization and Probabilistic Techniques in Algorithms and Data Analysis](https://doi.org/10.1017/9781316651124) (2nd ed.). Cambridge University Press.
- Vershynin, R. (2018). [High-Dimensional Probability: An Introduction with Applications in Data Science](https://doi.org/10.1017/9781108231596). Cambridge University Press.
