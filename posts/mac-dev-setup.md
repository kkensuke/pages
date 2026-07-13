---
title: "MacOS セットアップスクリプト"
date: "2025-10-9"
subtitle: "MacOSの開発環境セットアップを自動化しよう"
tags: [MacOS]
---


## はじめに
新しいMacのセットアップは骨の折れる作業です。アプリのダウンロード、システム設定の変更、ターミナル環境の構築などを行っていると、あっという間に1日が終わってしまいます。

私はこれまで時間をかけて、一連のシェルスクリプトを使用した自動のセットアップ手順を練り上げてきました。これらのスクリプトを順番に実行するだけで、まっさらな macOS を、完全にカスタマイズされた自分専用の開発マシンへと短時間で変身させることができます。
本記事では、macOS をゼロからセットアップするための設計図をステップバイステップで解説します。

この記事で紹介しているスクリプトはすべて、私の GitHub リポジトリで公開しています：
:::linkcard
https://github.com/kkensuke/dotfiles/tree/main/setup
:::


---
## フェーズ1：最初の手動ステップ
スクリプトを実行する前に、箱から出してすぐにいくつかの手動ステップを行う必要があります。

1. **iCloud へのサインイン:** 基本的なデータと設定を同期します。
2. **ブラウザとクラウドストレージのインストール:** 私は通常、すぐに（Safari 経由で）**Google Chrome** と **Google Drive** をインストールします。これでアカウント認証の準備をします。*（注：完全に iCloud Drive, Safari に依存する方がシステムとの統合性やシンプルさの観点から良いかもしれませんが、これは個人の好みです）。*
3. **メールのセットアップ:** Gmailや普段使っているメールプロバイダにログインします。

これらの基本作業が終わったら、**ターミナル**を開いて、面倒な作業をスクリプトに任せましょう。



---
## フェーズ2：自動化スクリプトの実行

依存関係が正しい順番でインストールされるように、セットアッププロセスを6つの番号付きスクリプトに分割しています。

*（注：この記事に沿って進める場合、dotfilesの場所など、スクリプト内のファイルパスをご自身のディレクトリ構造に合わせて変更する必要があります）。*

### ステップ1：Xcodeコマンドラインツールのインストール
開発ツールをインストールする前に、macOS には Xcode コマンドラインツールが必要です。これにより、`git` が使用できるようになります。

```bash[title=1_xcode.sh]
# install to use git
xcode-select --install
```
*ポップアップが表示されます。「インストール」をクリックし、完了するのを待ってからステップ2に進んでください。*


### ステップ2：Homebrewのインストール
Homebrew は macOS に欠かせないパッケージマネージャーです。これを使えば、CLI ツールや GUI アプリケーションをターミナルから直接インストールできます。

```bash[title=2_homebrew.sh]
#!/bin/bash

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

exec ${SHELL} -l # Reload the shell
```


### ステップ3：アプリとパッケージのインストール
Homebrew の準備ができたら、すべてのアプリケーションを一括でインストールします。私のスクリプトは以下の3つのカテゴリを処理します：
1. **CLI ツール（`brew install`）:** `bat`（進化した`cat`）、`fzf`（あいまい検索）、`neovim`、`node`、`uv`（Python ツールチェーン）、そしてシンタックスハイライトや自動補完のための各種 Zsh プラグインなどのモダンなツール。個々のツールの詳細については、[こちらの記事](./brew_CLI) を参照してください。
2. **GUI アプリ（`brew install --cask`）:** ブラウザ、IDE、ユーティリティツール。**Visual Studio Code**、**Rectangle**（ウィンドウ管理）、**Shottr**（スクリーンショット）などなど。
3. **Mac App Storeアプリ（`mas`）:** `mas` CLI を使用すると、App Store のアプリをアプリ ID 経由でインストールできます。たとえば、`mas install 302584613` で Kindle がインストールされます。
4. *おまけ:* このスクリプトは GitHub CLI（`gh`）の認証も処理し、リポジトリをターミナルから直接削除するショートカットなどのカスタムエイリアスも設定します。

Homebrew による CLI ツールと GUI アプリのインストール：
```bash[title=3_brew_install.sh]
#!/bin/bash

set -e
set -u


# CLI
brew install bat
brew install cmatrix
brew install coreutils
brew install duf
brew install duti
brew install fd
brew install fzf
brew install gcc
brew install libomp
brew install gh
brew install git-delta
brew install git-filter-repo
brew install ghostscript
brew install mas
brew install mole
brew install neovim
brew install node
brew install pnpm
brew install rename
brew install scc
brew install sqlite
brew install tree
brew install uv
brew install yt-dlp
brew install zsh-autosuggestions
brew install zsh-completions
brew install zsh-git-prompt
brew install zsh-syntax-highlighting

# C++
#sudo ln -s /opt/homebrew/bin/gcc-14 /usr/local/bin/gcc
#sudo ln -s /opt/homebrew/bin/g++-14 /usr/local/bin/g++

# GUI
brew install --cask nikitabobko/tap/aerospace
brew install --cask anki
brew install --cask appcleaner
brew install --cask betterdisplay
brew install --cask coconutbattery
brew install --cask coteditor
brew install --cask clipy
brew install --cask cryptomator
brew install --cask drawio
brew install --cask espanso
brew install --cask handy
brew install --cask iina
brew install --cask jupyter-notebook-viewer
brew install --cask google-chrome
brew install --cask google-drive
brew install --cask keyboardcleantool
brew install --cask keycastr
brew install --cask mathpix-snipping-tool
brew install --cask MonitorControl
brew install --cask qlmarkdown
brew install --cask rectangle
brew install --cask shottr
brew install --cask stats
brew install --cask stay
brew install --cask syntax-highlight
brew install --cask visual-studio-code
brew install --cask timac/vpnstatus/vpnstatus
brew install --cask xbar
brew install --cask zoom
brew install --cask zotero
```

App Store からの `mas` CLI を使ったインストール：
```bash
# LINE
mas install 539883307
# hand-mirror
mas install 1502839586
# kindle
mas install 302584613
```

GitHub CLI のエイリアスの登録：
```bash
----------------------------------------------------
gh alias set repo-delete 'api -X DELETE "repos/$1"'
gh auth refresh -h github.com -s delete_repo

## check alias
# gh alias list
## usage (WARNING: no confirmation!)
# gh repo-delete user/myrepo

# Authenticate Git
gh auth login -s delete_repo
----------------------------------------------------
```

シェルの再読み込み：
```bash
exec ${SHELL} -l
```


:::tip{title="🚀 次のステップ: `Brewfile` への移行"}
もし、`Homebrew` によるセットアップをさらに自動化したいのであれば、`Brewfile` への移行を検討してください。`Brewfile` は、数十行の `brew install` コマンドをシェルスクリプトにハードコードする代わりに、以下のコマンドで簡単に現在の環境設定をエクスポート（バックアップ）できます：
```bash
brew bundle dump
```

そして、新しい Mac をセットアップする際には、以下のコマンドでその `Brewfile` を読み込んで一括でインストールできます：
```bash
brew bundle --file=Brewfile
```
:::


### ステップ4：Dotfilesのシンボリックリンク作成
設定ファイル（`.gitconfig`、`.zshenv` など）の管理は、一元化されたGitリポジトリに保存し、ホームディレクトリにシンボリックリンクを張るようにすると非常に簡単になります。

このスクリプトは dotfiles リポジトリ内をループ処理し、`home/` ディレクトリ内のすべてに対してシンボリックリンク（`ln -sf`）を作成します。また、`.zshenv` ファイルは別の場所に保存しているため、個別に処理しています。

```bash[title=4_lns.sh]
#!/bin/bash

set -e
set -u


# dotfiles
cd ~/Desktop/github/dotfiles/home/
for i in .[a-z]*
do
    ln -sf ~/Desktop/github/dotfiles/home/"$i" ~/"$i"
done

# .zshenv
ln -sf ~/Desktop/github/dotfiles/zsh/.zshenv ~/.zshenv
```



### ステップ5：macOSのシステム環境設定
このスクリプト `5_mac.sh` については、専用の別の記事を書いているのでそちらをご覧ください：[MacOS デフォルトセットアップ](./mac-default-setup)


### ステップ6：デフォルトのファイル関連付けを設定する
デフォルトでは、Mac は `.txt` や `.md` などのファイルをテキストエディット（TextEdit）で開きます。正直、このアプリはかなり使い勝手が悪いです。`duti` というCLIツールを使うことで、このスクリプトは一般的なテキストやプログラミング関連の拡張子を強制的に **Visual Studio Code** (`com.microsoft.VSCode`) に紐付けます。これで、いちいち :btn[右クリック -> このアプリケーションで開く] をする必要がなくなります！

```bash[title=6_extension.sh]
#!/bin/bash

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



---
## フェーズ3：QoL（生活の質）の向上
コアシステムのインストールが完了したら、環境を完璧にするための2つの最後の調整を行います。

### 1. `sudo` で Touch ID を有効にする
`sudo` コマンドを実行するたびにパスワードを入力するのはすぐにうんざりしてきます。PAM（Pluggable Authentication Modules）の設定を変更することで、ターミナルで Mac の指紋認証リーダーを使用できるようになります。

必要な設定を追記する以下のスクリプトを実行します：
```bash[title=enable_TouchID_for_sudo.sh]
#!/bin/sh

cd /etc/pam.d

sudo tee -a sudo_local >/dev/null <<'EOF'
# sudo_local: local config file which survives system update and is included for sudo
# uncomment following line to enable Touch ID for sudo
auth       sufficient     pam_tid.so
EOF

```


### 2. 最後のシステム手動設定（日本のユーザー向け）
システム設定で手動での介入が必要な項目がいくつか残っています：
* キーボード設定で、入力ソースを **「日本語 - ローマ字入力」のみ** に設定します。
* プログラミングに不可欠なバックスラッシュ（`\`）を入力できるように、`¥`（円）キーの割り当てなどを変更します。



---
## トラブルシューティング：Zshのcompinitエラー
（Homebrew 経由でインストールした）Zshの補完機能を使用している場合、新しいターミナルウィンドウを開いたときに以下のエラーが表示されることがあります：

```text
zsh compinit: insecure directories, run compaudit for list.
Ignore insecure directories and continue [y] or abort compinit [n]?
```

これは、Homebrew がフォルダの権限を変更することがあり、Zsh がそれらを「安全でない（insecure）」と判断するために起こります。

**解決策:**
1. ターミナルで `compaudit` を実行して、問題のあるディレクトリ（通常は `/opt/homebrew/share` のようなパス）をリストアップします。
2. `chmod` を使用して、それらのディレクトリの権限を修正します。例：
    ```bash
    chmod 755 /opt/homebrew/share
    ```



---
## おわりに
マシンの設定をコードとして扱うことで、新しいデバイスをセットアップする際の時間と労力を大幅に削減できます。
もし今日私の Mac が壊れたとしても、自分のエイリアスやウィンドウマネージャーの設定、開発ツールが完全に揃った状態を30分で復元できます。

もしまだ Mac のセットアップを自動化していないのであれば、dotfiles 用の Git リポジトリを作成し、必須ツールやアプリのインストールを処理するスクリプトを書くことを強くお勧めします。
未来の自分がきっと感謝するはずです。（2ヶ月前に MacbookPro が突然壊れて、新しく買い替えせざるを得なかった時の私のように！）
