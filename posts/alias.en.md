---
title: "Alias in Zsh"
date: "2022-10-18"
subtitle: "A Guide to Setting Up Aliases for Efficient Command Line Operations"
tags: [Zsh]
---



If you use the command line, there are probably some commands you run frequently.
Some of these commands can be quite long, and copying or typing them each time can be tedious. In such cases, you can create an **alias** for a command.

For example, if you want to use `h` as a shortcut for `cd ~`, you can define it in your shell configuration file:
```bash
alias h='cd ~'
```

Add this line to your `~/.zshrc` (or `~/.bashrc`).
If you don’t see such a file in your home directory, you can create one with:
```bash
touch ~/.zshrc
```
If you find any useful aliases below, add them to your `~/.zshrc` file.


## Basic

### change directory

```bash
cs() { cd $@ && la }
alias cd='cs'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias cb='cd -'
alias d='cd ~/Desktop'
alias dl="cd ~/Downloads"
alias h='cd ~'
alias /='cd /'

# Change working directory to the topmost Finder window location.
cdf() { cd "$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')" }
```

### show files
```bash
alias ls='gls --color --group-directories-first -F'
alias l='ls'
alias la='ls -A'
alias ll='ls -AhlS'
alias ds='du -d 1 -h 2>/dev/null | sort -h'
alias pwd='sed "s/ /\\\ /g" <<< ${PWD/#$HOME/"~"}'
alias p='pwd'
alias path='echo -e ${PATH//:/\\n}'
```
- `ls`: To use `gls`, you need to install `coreutils` with `brew install coreutils`. You can use the same colorization as the `tree` command.
    - `--color` option colorize the output of `gls` command.
    - `--group-directories-first` option puts directories first.
    - `-F` option adds a trailing `/` to directory names, `@` to symbolic links, and so on.

- `la`, `ll`: `ls` is defined as `gls --color --group-directories-first -F` before `la='ls -A'`. This means `la='gls --color --group-directories-first -F -A'` and the same for `ll`.
    - `-A` option shows all files and directories except `.` and `..`.
    - `-h` option shows the size in human readable format.
    - `-l` option shows the file size, owner, group, and permissions.
    - `-S` option sorts by file size.

- `ds`: `du -d 1` shows the size of directories in the current directory.
    - `-h` option shows the size in human readable format.
    - `2>/dev/null` hides error messages.
    - `sort -h` sorts by file size using [pipe](./linux.en.md#pipeline-and-redirect).

- `pwd`: `sed "s/ /\\\ /g"` puts `\` before every space. `<<<` is a "here string". `${PWD/#$HOME/"~"}` replaces `$HOME` with `~` in the current directory path.

:::tip
When you specify options, you can use `ls -AhlS` instead of `ls -A -h -l -S`.
:::


### edit files
```bash
alias v='vi'
alias cp='cp -iv'
alias mv='mv -iv'
alias rm='rm -iv'
alias rf='rm -rf'
```
- `-i` option asks you before overwriting a file.
- `-v` option shows the name of the file being copied, moved, or removed.


### search
```bash
fb() { find . -size +$2M -type f -name $1 -exec ls -lhS "{}" +}
rn() { for filename in *.$1; do mv -f "$filename" $(echo "$filename" | sed -e "s/$2//g"); done }
dif(){ diff --color -u $1 $2 }
alias imgopt='open -a ImageOptim .'
alias grep='grep --color'
```
:::note{title="Function"}
You can make an alias with arguments, which is called a function. Functions are defined as `function_name() { commands }`. For example, `fb` takes two arguments, `$1` and `$2`. `$1` is the first argument and `$2` is the second argument. Use it like `fb "*.pdf" 10` to find files with the name `pdf` larger than 10 MB.

In addition to `$1` and `$2`, there are other special variables:
- `$0` is the function name.
- `$@` is all arguments.
- `$#` is the number of arguments.
- `$?` is the exit status of the last command.
- `$$` is the process ID of the current shell.
- `$!` is the process ID of the last command run in the background.
:::

- `fb` finds files larger than `$2` MB with the name `$1` in the current directory.
    - `-size +$2M` option finds files larger than `$2` MB.
    - `-type f` option finds only files (`-type d` finds only directories).
    - `-name $1` option finds files with the name `$1`.
    - `-exec ls -lhS "{}" +` option executes `ls -lhS` command for each file found.
- `rn` renames files with the extension `$1` by removing `$2` from the file name. For example, `rn txt asdf` renames `aaasdfff.txt` to `aaff.txt`.

:::note
`-exec <command> {} +` is a common syntax to execute `<command>` for each file found. `{}` is a placeholder for the file name. `+` is a delimiter to tell the end of the command.
:::

### open apps
```bash
alias hr='open .'
alias c='open /Applications/CotEditor.app'
alias vs='code'
alias chrome='open /Applications/Google\ Chrome.app'
```

- `hr` opens the current directory.
- `c` opens CotEditor.
- `vs` opens Visual Studio Code.
- `chrome` opens Google Chrome.

### others
```bash
alias his='history'
alias rl='exec ${SHELL} -l' #reload
```


### zip encryption
```bash
zipen(){
    zip -er enc.zip "$@"
}
```

`zipen` zips files and encrypts them with a password into `enc.zip`. Use like `zipen file1 file2 dir1`.

:::note
`"$@"` is a special variable that expands to all arguments. For example, `"$@"` is expanded to `file1 file2 dir1` in the above example.
:::


## Mac OS settings
### Show/hide hidden files in Finder
```bash
alias show="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias hide="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"
```

:::tip
You can also use `Command + Shift + .` to show/hide hidden files in Finder.
:::

### Hide/show all desktop icons
```bash
alias dhide="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias dshow="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"
```

### Screenshot settings
```bash
alias dwl='defaults write com.apple.screencapture location'
alias ddl='defaults delete com.apple.screencapture location'
alias drl='defaults read com.apple.screencapture location'
```
You can change the location of screenshots by `dwl ~/path/to/dir`.


### sleep setting
```bash
alias sleepon='sudo pmset -a disablesleep 0'
alias sleepoff='sudo pmset -a disablesleep 1'
```


## Python
```bash
alias wpy='which python'

alias pip='pip3'
alias pin='pip install'
alias puin='pip uninstall'
alias pup='pip install --upgrade pip'
alias pinreq='pip install -r requirements.txt'
alias pf='pip list --format=freeze'
alias pfr='pip list --format=freeze > requirements.txt'
```

### Activate, deactivate venv
```bash
alias acv='source venv/bin/activate'
alias deac='deactivate'
```


## GitHub
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

### Create a new GitHub repository and make the initial commit
You can define a function to make a new repository with just one command.
```bash
# Usage: ginit private[public]
ginit() {
    git init
    git add .
    git commit -m "🎉  Initial commit"
    gh repo create --"$1" --source=. --push
}
```
You need to install [GitHub CLI](https://cli.github.com/) to use the `gh` command.


### Commit Messages with Emoji

```bash
# Git Commit, Add all and Push — in one step.
gacp() { git add . && git commit -m "$*" && git push origin main }

gini() { gacp "🎉 Initial commit"}
gnew() { gacp "✨ NEW: $@" }
gimp() { gacp "👌 IMPROVE: $@" }
gprg() { gacp "🚧 PROGRESS: $@" }

gmtn() { gacp "🔧 MAINTAIN: $@" }
gfix() { gacp "🐛 FIX: $@" }
ghot() { gacp "🚑 HOTFIX: $@" }
gbrk() { gacp "‼️ BREAKING: $@" }
grem() { gacp "🗑️ REMOVE: $@" }

gmrg() { gacp "🔀 MERGE: $@" }
gref() { gacp "♻️ REFACTOR: $@" }
gtst() { gacp "🧪 TEST: $@" }
gdoc() { gacp "📚 DOC: $@" }
grls() { gacp "🚀 RELEASE: $@" }
gsec() { gacp "👮 SECURITY: $@" }

# Show commit type
gtyp() {
NORMAL='\033[0;39m'
GREEN='\033[0;32m'
echo "$GREEN gini$NORMAL — 🎉 Initial commit
$GREEN gnew$NORMAL — ✨ NEW
$GREEN gimp$NORMAL — 👌 IMPROVE
$GREEN gprg$NORMAL — 🚧 PROGRESS
$GREEN gmtn$NORMAL — 🔧 MAINTAIN
$GREEN gfix$NORMAL — 🐛 FIX
$GREEN ghot$NORMAL — 🚑 HOTFIX
$GREEN gbrk$NORMAL — ‼️  BREAKING
$GREEN grem$NORMAL — 🗑️  REMOVE
$GREEN gmrg$NORMAL — 🔀 MERGE
$GREEN gref$NORMAL — ♻️  REFACTOR
$GREEN gtst$NORMAL — 🧪 TEST
$GREEN gdoc$NORMAL — 📚 DOC
$GREEN grls$NORMAL — 🚀 RELEASE
$GREEN gsec$NORMAL — 👮 SECURITY"
}

```


### gitignore.io
`gitignore.io` enables us to make .gitignore file easily
```bash
function gi() { curl -sLw n https://www.toptal.com/developers/gitignore/api/$@ ;}
```


## Extra: Customize and colorize PROMPT
```bash
PS1="%F{082}%n%f %F{051}%~%f %# "
RPROMPT='%T'
```

- `PS1` is the main (left) prompt and `RPROMPT` is the right prompt.
- `%n` means username
- `%~` means current directory
- `%#` shows `#` if you are root, `%` if not.
- `%T` shows the current time in 24-hour format (`%t` for 12-hour format).
- you can colorize your prompt by using `%F{color number}` ~ `%f`. You can find color numbers [here](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit).

Read more about Prompt Expansion in this [link](https://zsh.sourceforge.io/Doc/Release/Prompt-Expansion.html).

If you want to put a blank line before every prompt except the first one, you can use the following code:
```bash
precmd() { precmd() { echo } }
```


## Reference
- [jupyterbook Development Conventions](https://github.com/executablebooks/.github/blob/master/CONTRIBUTING.md#commit-messages)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Emoji-Log](https://github.com/ahmadawais/Emoji-Log)
- [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)
- [emoji-cheat-sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- [Complete list of github markdown emoji markup ](https://gist.github.com/rxaviers/7360908)
- [Commit message examples](https://gist.github.com/mono0926/e6ffd032c384ee4c1cef5a2aa4f778d7)

