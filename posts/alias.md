---
title: "便利なZshのエイリアスと関数"
date: "2022-10-18"
subtitle: "ファイル操作、macOS、Python、Gitで使える実用的なショートカット"
tags: [CLI]
---


エイリアスと関数を使うと、頻繁に実行するコマンドに短い名前を付けられます。この記事では、ディレクトリ移動、ファイル操作、macOS、Python、Git、GitHubで役立つ実用的なショートカットを紹介します。


## エイリアスと関数の使い分け

固定したコマンドやオプションにはエイリアスを使います。エイリアスの実行時には、後ろに追加の引数を渡すこともできます。引数の検証、並べ替え、再利用が必要な場合や、複数のコマンドや条件分岐を扱う場合は関数を使います。

| | エイリアス | 関数 |
| --- | --- | --- |
| 適した用途 | 固定したコマンドやオプション | 引数の処理、複数のコマンド、条件分岐 |
| 使用例 | `cd ~` の代わりに `h` を使う | ディレクトリを作成して、その中へ移動する |
| 定義 | `alias h='cd ~'` | `mkcd() { mkdir -p "$1" && cd "$1"; }` |

```bash
alias h='cd ~'

mkcd() {
    mkdir -p "$1" && builtin cd "$1"
}
```

`h`を実行するとホームディレクトリへ移動し、`mkcd new-project`を実行するとディレクトリを作成して、その中へ移動します。

:::note
これらの例は、シェルスクリプトではなく、対話的なZshセッションで使うことを想定しています。単純なエイリアスの多くはBashでも使用できますが、関数やコマンドのオプションは、シェルやオペレーティングシステムによって異なる場合があります。
:::


## エイリアスと関数を定義する場所

設定が少ない場合は、エイリアスを`~/.zshrc`に直接追加します。

```bash
alias h='cd ~'
```

編集後にファイルを再読み込みするか、新しいシェルを起動します。

```bash
source ~/.zshrc
```

設定が多い場合は、`$ZDOTDIR/aliases/git.zsh`のように用途別のファイルへ分け、`.zshrc`から読み込みます。

```bash
[[ -f "$ZDOTDIR/aliases/git.zsh" ]] && source "$ZDOTDIR/aliases/git.zsh"
```

`$ZDOTDIR`と分割した`.zshrc`を使う構成全体については、[Zsh設定を整理する](./zsh)を参照してください。


## 依存関係と互換性

ほとんどの例ではmacOSまたはUnixの標準コマンドを使いますが、この記事の一部のコマンドには追加のソフトウェアが必要です。

| コマンドまたは機能 | 必要なもの |
| --- | --- |
| `gls` | GNU core utilities：`brew install coreutils` |
| `open`、`osascript`、`defaults`、`pmset` | macOS |
| `code` | Visual Studio Codeのコマンドラインランチャー |
| `imgopt` | ImageOptim |
| `gh` | GitHub CLI |
| `git`、`curl`、`zip` | 使用できない場合は別途インストール |

使用しているツールや作業手順に合うショートカットだけを取り入れてください。追加した設定は、実際に使い始める前に新しいターミナルで一つずつ動作を確認しましょう。


## ディレクトリ移動とファイル操作

### ディレクトリを移動する

```bash
cs() { builtin cd "$@" && command ls -A }
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias cb='cd -'
alias d='cd ~/Desktop'
alias dl='cd ~/Downloads'
alias h='cd ~'
alias /='cd /'

# 最前面のFinderウインドウに表示されている場所へ移動する。
cdf() {
    builtin cd "$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')"
}
```

`cs`関数はディレクトリを移動した後に`ls -A`を実行します。`builtin cd`を使うことで、常にZshの組み込みコマンドを呼び出します。そのほかのエイリアスは、よく使う移動先に短い名前を付けています。


### ファイルを一覧表示する

```bash
alias l='gls --color --group-directories-first -F'
alias la='gls --color --group-directories-first -F -A'
alias ll='gls --color --group-directories-first -F -AhlS'
alias ds='du -d 1 -h 2>/dev/null | sort -h'
alias p='pwd'
path() { print -l -- "${path[@]}" }
```

- `l`、`la`、`ll`：`gls`を使うには、`brew install coreutils`でGNU core utilitiesをインストールします。
    - `--color`：出力を色分けする。
    - `--group-directories-first`：ディレクトリをファイルより先に表示する。
    - `-F`：ディレクトリ名に`/`、シンボリックリンクに`@`など、種類を示す記号を付ける。
    - `-A`：`.`と`..`を除くすべての項目を表示する。
    - `-h`：ファイルサイズを読みやすい単位で表示する。
    - `-l`：サイズ、所有者、グループ、権限などの詳細を表示する。
    - `-S`：ファイルサイズ順に並べる。
- `ds`：`du -d 1`で、現在のディレクトリから1階層下にある項目のサイズを表示します。
    - `2>/dev/null`：エラーメッセージを非表示にする。
    - `sort -h`：[パイプ](./linux#パイプ)を使い、読みやすい単位のサイズを並べ替える。
- `p`は現在のディレクトリを表示し、`path`関数はバックスラッシュをエスケープとして解釈せず、`$PATH`の各項目を1行ずつ表示します。

:::tip
短いオプションは通常まとめて記述できます。`ls -AhlS`は`ls -A -h -l -S`と同じ意味です。
:::


### ファイルを編集する

```bash
alias v='vi'
```

必要に応じて`vi`を好みのエディタへ変更してください。


## 検索とユーティリティ

### 検索と比較

```bash
fb() {
    find . -size "+${2}M" -type f -name "$1" -exec ls -lhS {} +
}

rn() {
    local extension=$1
    local text=$2
    local filename

    for filename in *."$extension"; do
        command mv -i -- "$filename" "${filename//$text/}"
    done
}

dif() { git diff --no-index --color=always -- "$1" "$2" }
alias imgopt='open -a ImageOptim .'
```

`fb "*.pdf" 10`は、現在のディレクトリ以下にある10 MBより大きいPDFファイルを検索します。

- `-size "+${2}M"`：2番目の引数より大きいMiB単位のファイルを選ぶ。
- `-type f`：通常のファイルを選ぶ。
- `-name "$1"`：最初の引数をファイル名のパターンとして照合する。
- `-exec ls -lhS {} +`：結果を読みやすいサイズで、大きい順に表示する。

`rn txt asdf`は、`.txt`ファイルの名前から`asdf`を削除します。例えば、`aaasdfff.txt`は`aaff.txt`になります。

:::note{title="関数と引数"}
関数は`name() { commands }`の形式で定義し、位置引数を受け取れます。

- `$0`：関数名。
- `$1`、`$2`など：個別の引数。
- `"$@"`：すべての引数を、それぞれ独立した文字列として保持したまま展開する。
- `$#`：引数の数。
- `$?`：直前のコマンドの終了ステータス。
- `$$`：現在のシェルのプロセスID。
- `$!`：最後にバックグラウンドで実行したコマンドのプロセスID。
:::


### その他のショートカット

```bash
alias his='history'
alias rl='exec ${SHELL} -l'       # ログインシェルを再起動する
```


### 暗号化ZIPアーカイブを作成する

```bash
zipen() {
    zip -er enc.zip "$@"
}
```

`zipen file1 file2 dir1`は、パスワードで保護された`enc.zip`を作成します。引用符で囲んだ`"$@"`により、空白を含むパスも含め、渡された各パスを別々の引数として保持します。

:::warning
`zip -e`による暗号化は、基本的なパスワード保護を目的としています。機密性の高いデータには、より強力な暗号化ツールを使用してください。
:::


## 任意のコマンド上書き

次のエイリアスは、新しい名前を追加するのではなく、既存のコマンドを置き換えます。便利ですが、対話シェル全体でコマンドの動作が変わります。

```bash
alias cd='cs'
alias ls='gls --color --group-directories-first -F'
alias pwd='sed "s/ /\\\ /g" <<< ${PWD/#$HOME/"~"}'
alias cp='cp -iv'
alias mv='mv -iv'
alias rm='rm -iv'
alias grep='grep --color'
alias pip='pip3'

# 破壊的なショートカット：危険性を理解した場合だけ使用する。
alias rf='rm -rf'
```

- `cd`エイリアスは、移動に成功するたびにディレクトリの内容を表示します。
- `ls`エイリアスはGNU版`ls`を使い、色分けしてディレクトリを先に表示します。
- `pwd`エイリアスは、現在のディレクトリに含まれる空白をエスケープし、ホームディレクトリを`~`へ置き換えて表示します。例えば、macOSの`/Users/<USERNAME>/My Drive`は`~/My\ Drive`になります。
- `cp`、`mv`、`rm`エイリアスは、確認と詳細表示を追加します。
- `pip`の置き換えは、Pythonの仮想環境で選択された実行ファイルに干渉する場合があります。`python -m pip`の方が、使用するPythonを明確に指定できます。

:::warning
`rf`は確認せずにディレクトリを再帰的に削除します。使用前に対象を注意深く確認してください。簡単に入力できる破壊的なショートカットが危険だと感じる場合は、このエイリアスを追加しないでください。
:::


## macOSのアプリケーションと設定

### アプリケーションを開く

```bash
alias hr='open .'
alias c='open /Applications/CotEditor.app'
alias vs='code'
alias chrome='open /Applications/Google\ Chrome.app'
```

- `hr`：現在のディレクトリをFinderで開く。
- `c`：CotEditorを開く。
- `vs`：Visual Studio Codeを開く。
- `chrome`：Google Chromeを開く。

### Finderで隠しファイルを表示または非表示にする

```bash
alias show='defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder'
alias hide='defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder'
```

:::tip
Finderで`Command + Shift + .`を押しても、隠しファイルの表示と非表示を切り替えられます。
:::


### デスクトップアイコンを非表示または表示する

```bash
alias dhide='defaults write com.apple.finder CreateDesktop -bool false && killall Finder'
alias dshow='defaults write com.apple.finder CreateDesktop -bool true && killall Finder'
```


### スクリーンショットの設定

```bash
alias dwl='defaults write com.apple.screencapture location'
alias ddl='defaults delete com.apple.screencapture location'
alias drl='defaults read com.apple.screencapture location'
```

例えば、`dwl ~/Desktop`を実行すると、スクリーンショットの保存先をデスクトップへ変更できます。


### スリープ設定

Macをスリープさせたくない場合は、次のエイリアスを使用します。

```bash
alias sleepon='sudo pmset -a disablesleep 0'
alias sleepoff='sudo pmset -a disablesleep 1'
```


## Python

```bash
alias wpy='command -v python'
alias pin='python -m pip install'
alias puin='python -m pip uninstall'
alias pup='python -m pip install --upgrade pip'
alias pinreq='python -m pip install -r requirements.txt'
alias pf='python -m pip freeze'
alias pfr='python -m pip freeze > requirements.txt'
```

`python -m pip`を使うと、選択した`pip`がどのPythonインタープリタに属するかを明確にできます。

`pfr`は`requirements.txt`を上書きします。生成されるパッケージ一覧を先に確認したい場合は、`pf`を実行してください。

### 仮想環境を有効化または無効化する

```bash
alias acv='source venv/bin/activate'
alias deac='deactivate'
```


## GitとGitHub

```bash
alias g='git'
alias ga='git add'
alias gb='git branch'
alias gc='git commit'
alias gch='git checkout'
alias gcl='git clone'
alias gd='git diff'
alias gf='git fetch'
alias gi='git init'
alias gm='git merge'
alias gps='git push'
alias gpl='git pull'
alias gpom='git push origin main'
alias gs='git status'
```

### GitHubリポジトリと最初のコミットを作成する

次の関数は、現在のディレクトリを初期化し、GitHub CLIを使ってリポジトリを作成します。

```bash
# 使用例：ginit private
#         ginit public
ginit() {
    local visibility=${1:-private}

    git init
    git add .
    git commit -m "🎉 Initial commit"
    gh repo create --"$visibility" --source=. --push
}
```

`gh`コマンドを使う前に、[GitHub CLI](https://cli.github.com/)をインストールしてください。


### 絵文字付きコミットメッセージ

```bash
# リポジトリ内のすべての変更をステージし、コミットして現在のブランチをプッシュする。
gacp() {
    if (( $# == 0 )); then
        print -u2 -- "Usage: gacp commit message"
        return 2
    fi

    git add -A && git commit -m "$*" && git push
}

gini() { gacp "🎉 Initial commit" }
gnew() { gacp "✨ NEW: $*" }
gimp() { gacp "👌 IMPROVE: $*" }
gprg() { gacp "🚧 PROGRESS: $*" }

gmtn() { gacp "🔧 MAINTAIN: $*" }
gfix() { gacp "🐛 FIX: $*" }
ghot() { gacp "🚑 HOTFIX: $*" }
gbrk() { gacp "‼️ BREAKING: $*" }
grem() { gacp "🗑️ REMOVE: $*" }

gmrg() { gacp "🔀 MERGE: $*" }
gref() { gacp "♻️ REFACTOR: $*" }
gtst() { gacp "🧪 TEST: $*" }
gdoc() { gacp "📚 DOC: $*" }
grls() { gacp "🚀 RELEASE: $*" }
gsec() { gacp "👮 SECURITY: $*" }

# 使用できるコミット種別を表示する。
gtyp() {
    local normal='\033[0;39m'
    local green='\033[0;32m'

    echo "$green gini$normal — 🎉 Initial commit
$green gnew$normal — ✨ NEW
$green gimp$normal — 👌 IMPROVE
$green gprg$normal — 🚧 PROGRESS
$green gmtn$normal — 🔧 MAINTAIN
$green gfix$normal — 🐛 FIX
$green ghot$normal — 🚑 HOTFIX
$green gbrk$normal — ‼️ BREAKING
$green grem$normal — 🗑️ REMOVE
$green gmrg$normal — 🔀 MERGE
$green gref$normal — ♻️ REFACTOR
$green gtst$normal — 🧪 TEST
$green gdoc$normal — 📚 DOC
$green grls$normal — 🚀 RELEASE
$green gsec$normal — 👮 SECURITY"
}
```

:::warning
`gacp`は、リポジトリ全体の変更、削除、未追跡ファイルをステージします。実行前に`git status`で状態を確認し、差分を見直してください。また、`git push`を実行するには、上流ブランチが設定されている必要があります。
:::

#### コミットメッセージの参考文献

- [Jupyter Book Development Conventions](https://github.com/executablebooks/.github/blob/master/CONTRIBUTING.md#commit-messages)
- [How to Write a Git Commit Message](https://chris.beams.io/git-commit)
- [Emoji-Log](https://github.com/ahmadawais/Emoji-Log)
- [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- [Complete List of GitHub Markdown Emoji Markup](https://gist.github.com/rxaviers/7360908)
- [Commit Message Examples](https://gist.github.com/mono0926/e6ffd032c384ee4c1cef5a2aa4f778d7)


### `.gitignore`を生成する

次の関数は、gitignore.io APIから`.gitignore`テンプレートをダウンロードします。`gignore`という名前にすることで、上で定義した`gi='git init'`エイリアスとの衝突を避けています。

```bash
gignore() {
    local IFS=,
    curl -sL "https://www.toptal.com/developers/gitignore/api/$*"
}
```

例えば、`gignore macos python visualstudiocode > .gitignore`を実行します。


## 次のステップ

推奨するファイル構成、`$ZDOTDIR`、設定ファイルの分割、Zshプロンプトのカスタマイズについては、[Zsh設定を整理する](./zsh)を参照してください。ショートカット内で使っているコマンドについては、[コマンドラインガイド](./linux)を参照してください。
