---
title: "Homebrew CLI ツール"
date: "2026-06-20"
subtitle: "MacOS ターミナルを快適にする Homebrew CLI アプリ解説"
tags: [MacOS, CLI, Productivity]
---


## Introduction
[MacOS セットアップスクリプト](mac-dev-setup)の記事では、MacOS のセットアップを完全に自動化するためのシェルスクリプト群を紹介し、その中で、Homebrew を使用してインストールする CLI ツールのリストを掲載しました。

ターミナル環境を開発者により快適な環境に変えるためには、標準搭載のコマンドだけでは不十分です。Rust や Go で書かれたモダンな代替ツールから、Git の拡張、Zsh のプラグインまで、私がセットアップスクリプトに組み込んでいる **Homebrew CLI アプリ** について、カテゴリ別に解説していきます。



## 1. Modern Terminal Utilities (Rust/Go Alternatives)
まずは、従来の UNIX コマンド（`cat`, `find`, `df` など）をモダンに置き換える、高速で高機能なツール群です。

- `bat`: 公式が「翼の生えた `cat`」と呼ぶモダンな代替ツールです。シンタックスハイライト機能やGitの変更行の表示機能（左端に `+` や `-` が出る）を備えており、ターミナル上でコードを読む体験が劇的に向上します。
    ```bash
    brew install bat
    ```
    :::linkcard
    https://github.com/sharkdp/bat
    :::
- `fd`: `find` コマンドの代替ツールです。記述がシンプルで直感的な上、Rust 製のため動作が非常に高速です。デフォルトで `.gitignore` を尊重し、隠しファイルをスキップしてくれます。
    ```bash
    brew install fd
    ```
    :::linkcard
    https://github.com/sharkdp/fd
    :::
- `fzf`: コマンドライン用の「あいまい検索（Fuzzy Finder）」ツールです。履歴の検索（`Ctrl + R`）やファイルの検索など、ターミナル上のあらゆるリストをインタラクティブに絞り込むことができます。これなしのターミナル操作は考えられません。
    ```bash
    brew install fzf
    ```
    :::linkcard
    https://junegunn.github.io/fzf/
    :::
- `duf`: `df` コマンドのモダン版です。ディスクの空き容量や使用状況を、見やすいカラフルな表形式で表示してくれます。
    ```bash
    brew install duf
    ```
    :::linkcard
    https://github.com/muesli/duf
    :::
- `scc` (Sloc, Cloc and Code): 指定したディレクトリ内のソースコードの行数（空白、コメント、コード）を言語別に超高速でカウントしてくれるツールです。
    ```bash
    brew install scc
    ```
    :::linkcard
    https://github.com/boyter/scc
    :::



## 2. Git & GitHub Enhancements
Git周辺の操作を快適にし、ターミナルからブラウザを開く回数を減らすためのツール群です。

- `gh` (GitHub CLI): ターミナルから直接プルリクエストを作成したり、Issueを確認したり、リポジトリを管理できる GitHub 公式の CLI ツールです。独自のエイリアス（`gh repo-delete` など）を設定するベースにもなります。
    ```bash
    brew install gh
    ```
    :::linkcard
    https://cli.github.com/manual/
    :::
- `git-delta`: `git diff` や `git show` の出力を圧倒的に見やすくするページャーです。シンタックスハイライト付きで、GitHub のブラウザ画面のような美しい差分表示（Side-by-side 表示など）をターミナル上で実現します。
    ```bash
    brew install git-delta
    ```
    :::linkcard
    https://dandavison.github.io/delta/
    :::
- `git-filter-repo`: Git のコミット履歴を高速かつ安全に書き換えるための公式推奨ツールです。過去に誤ってコミットしてしまった巨大なファイルや機密情報をリポジトリから完全に消し去る際などに使用します。
    ```bash
    brew install git-filter-repo
    ```
    :::linkcard
    https://github.com/newren/git-filter-repo
    :::



## 3. Development Environments & Runtimes
プログラミング言語の実行環境や、開発に必須のコアツールです。

- `neovim`: Vim からフォークされ、拡張性とモダンな機能（Luaによる設定、LSP の標準サポートなど）に特化したテキストエディタです。ターミナル上でのちょっとしたファイル編集から、本格的な IDE としての運用まで幅広く活躍します。
    ```bash
    brew install neovim
    ```
    :::linkcard
    https://neovim.io/
    :::
- `node` & `pnpm`: JavaScript ランタイムである Node.js と、高速でディスク容量に優しいパッケージマネージャーである `pnpm` です。Web 開発には欠かせません。
    ```bash
    brew install node
    brew install pnpm
    ```
    :::linkcard
    https://nodejs.org/en
    :::
    :::linkcard
    https://pnpm.io/
    :::
- `uv`: Rustで書かれた、超高速な Python パッケージ・プロジェクトマネージャーです。従来の `pip` や `virtualenv` の何倍もの速度で動作し、Python 環境の管理を劇的に快適にしてくれます。
    ```bash
    brew install uv
    ```
    :::linkcard
    https://docs.astral.sh/uv/
    :::
- `gcc` & `libomp`: C/C++ のコンパイラ（GNU Compiler Collection）と、OpenMP のランタイムです。MacOS 標準の Apple Clang はデフォルトで OpenMP（マルチスレッド処理）をサポートしていないため、並列計算を伴う C/C++ コードをコンパイルする際に必要になります。
    ```bash
    brew install gcc
    brew install libomp
    ```
    :::linkcard
    https://gcc.gnu.org/
    :::
- `sqlite`: 軽量なリレーショナルデータベースエンジンです。ローカルでのデータ分析や、小規模なアプリケーションのバックエンドとして手軽に使えます。
    ```bash
    brew install sqlite
    ```
    :::linkcard
    https://www.sqlite.org/index.html
    :::



## 4. System & File Management
MacOSのシステム設定や、ファイル操作を高度化するユーティリティです。

- `coreutils`: MacOS 標準の BSD 系コマンド（`ls`, `cp`, `rm` など）ではなく、Linux で一般的な GNU 版のコマンド群をインストールします。Linux 環境とスクリプトの互換性を持たせたい場合に重宝します。
    ```bash
    brew install coreutils
    ```
    :::linkcard
    https://www.gnu.org/software/coreutils/
    :::
- `duti`: ファイルの拡張子に対する「デフォルトのアプリケーション」を CLI から設定するツールです。Mac の標準機能では、それぞれの拡張子について、ファイル情報から開くアプリを個別に変更する必要がありますが、`duti` を使用することで、すべてのスクリプトファイルを VS Code で開くように設定することが可能です。
    ```bash
    brew install duti
    ```
    :::linkcard
    https://github.com/moretension/duti
    :::
    ```bash
    #!/bin/bash
    # VS Code をデフォルトのエディタに設定する例

    EDITOR_ID="com.microsoft.VSCode"

    # Basic text types
    duti -s $EDITOR_ID public.plain-text all
    duti -s $EDITOR_ID public.text all
    duti -s $EDITOR_ID public.data all
    duti -s $EDITOR_ID public.source-code all

    # Common file extensions
    extensions=("txt" "md" "tex" "js" "jsx" "ts" "tsx" "py" "go" "rs" "c" "cpp" "h" "hpp" "css" "json" "yaml" "yml" "xml" "sh" "zsh" "bash")

    for ext in "${extensions[@]}"; do
        duti -s $EDITOR_ID $ext all
    done

    echo "Default editor associations updated!"
    ```
- `mas`: Mac App Store の CLI ツールです。ブラウザや App Store アプリを開くことなく、ターミナルから `mas install [App ID]` を実行するだけで LINE や Kindle などの GUI アプリをインストールできます。
    ```bash
    brew install mas
    ```
    :::linkcard
    https://github.com/mas-cli/mas
    :::
- `mole`: Mac のシステムをクリーンアップ・最適化・監視するための強力な CLI ツール（`tw93/Mole`）です。CleanMyMac や AppCleaner のような GUI アプリが持つ機能を1つに統合したようなツールで、`mo` コマンドを使って不要なキャッシュの削除やアプリの完全なアンインストールをターミナルから一括で行えます。
    ```bash
    brew install mole
    ```
    :::linkcard
    https://github.com/tw93/Mole
    :::
- `rename`: 正規表現を使って、複数のファイル名を一括で変更できる強力なツールです。大量の画像ファイルやログファイルの整理に役立ちます。
    ```bash
    brew install rename
    ```
- `tree`: ディレクトリの階層構造をツリー状に表示する古典的ですが必須のコマンドです。ディレクトリ構成を Markdown やドキュメントに貼り付ける際によく使います。
    ```bash
    brew install tree
    ```



## 5. Zsh Plugins
MacOSのデフォルトシェルである `zsh` を、最強のプロンプトに進化させるプラグイン群です。
（※これらを有効化するには、`.zshrc` に設定を追記する必要があります）

- `zsh-autosuggestions`: コマンドの入力中に、過去の履歴に基づいたサジェストを薄いグレーの文字で表示してくれます。右矢印キー（または :btn[Ctrl + F]）で確定できるため、タイピング量が激減します。
    ```bash
    brew install zsh-autosuggestions
    ```
- `zsh-syntax-highlighting`: ターミナルに入力しているコマンドが正しい（インストールされている）場合は緑色に、間違っている場合は赤色にハイライトしてくれます。実行前にタイポに気づける必須プラグインです。
    ```bash
    brew install zsh-syntax-highlighting
    ```
- `zsh-completions`: Zsh の標準補完機能をさらに強化し、何千もの追加コマンド（Homebrewのツールなど）に対するタブ補完を提供します。
    ```bash
    brew install zsh-completions
    ```
- `zsh-git-prompt`: ターミナルのプロンプトに、現在の Git ブランチ名や、未コミットの変更があるかどうかのステータスを表示してくれるツールです。
    ```bash
    brew install zsh-git-prompt
    ```

:::tip{title="🛠️ Zsh Plugins with Homebrew"}
Homebrew 経由で Zsh プラグインをインストールした場合、お使いの環境（Intel Mac か Apple Silicon Mac か）によってインストール先のパスが変わります。
`.zshrc` に `source` コマンドを追記する際は、パスの指定に注意してください。

**Apple Silicon (M1/M2/M3) の場合:**
```bash
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
```
:::



## 6. Miscellaneous & Fun
実用性だけでなく、ターミナルライフを少し豊かにするツールや、特定用途のユーティリティです。

- `yt-dlp`: 有名な `youtube-dl` のフォーク（改良版）です。動画サイトからのダウンロード速度が大幅に向上しており、機能の更新も非常に活発です。ローカルに動画資料を保存したい時に使用します。
    ```bash
    brew install yt-dlp
    ```
    :::linkcard
    https://github.com/yt-dlp/yt-dlp
    :::
- `ghostscript`: PDF や PostScript ファイルを操作・変換するためのインタープリタです。コマンドラインから PDF を結合したり、圧縮したりするスクリプトの裏側でよく使用されます。
    ```bash
    brew install ghostscript
    ```
    :::linkcard
    https://ghostscript.readthedocs.io/en/latest/index.html
    :::
- `cmatrix`: 映画『マトリックス』のような緑色の文字が上から下へ流れるアニメーションをターミナルに表示するジョークアプリです。離席時のスクリーンセーバー代わりに使うとハッカー気分を味わえます。
    ```bash
    brew install cmatrix
    ```
    :::linkcard
    https://github.com/abishekvashok/cmatrix/
    :::



## Conclusion
ここで紹介したCLIツールは、ターミナルでの作業効率を根本から底上げしてくれます。
最初からすべてを使いこなす必要はありません。気になったツールを一つずつ `brew install` して、自分のワークフローに合うか試してみてください。あなたのターミナル環境がより快適なものになることを願っています！