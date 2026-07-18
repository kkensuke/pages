---
title: "Useful Zsh Aliases and Functions"
date: "2022-10-18"
subtitle: "Practical shortcuts for files, macOS, Python, and Git"
tags: [Zsh]
---


Aliases give short names to commands that you run frequently. For example, the following definition lets you enter `h` instead of `cd ~`:

```bash
alias h='cd ~'
```

An alias is best for a simple command replacement. Use a shell function when the shortcut needs arguments, multiple commands, or conditional logic.

:::note
These examples are written for Zsh. Many simple aliases also work in Bash, but functions, prompt syntax, and command options can differ between shells and operating systems.
:::


## Where to Define Aliases

For a small configuration, add aliases directly to `~/.zshrc`:

```bash
alias h='cd ~'
```

Reload the file after editing it, or start a new shell:

```bash
source ~/.zshrc
```

For a larger configuration, keep aliases in purpose-specific files such as `$ZDOTDIR/aliases/git.zsh` and load them from `.zshrc`:

```bash
[[ -f "$ZDOTDIR/aliases/git.zsh" ]] && source "$ZDOTDIR/aliases/git.zsh"
```

See [Organizing Zsh Configuration](./zsh.en.md) for a complete example using `$ZDOTDIR` and a modular `.zshrc`.


## Basic Commands

### Change Directories

```bash
cs() { builtin cd "$@" && command ls -A }
alias cd='cs'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias cb='cd -'
alias d='cd ~/Desktop'
alias dl='cd ~/Downloads'
alias h='cd ~'
alias /='cd /'

# Change to the location shown in the frontmost Finder window.
cdf() {
    builtin cd "$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')"
}
```

The `cs` function changes directory and then runs `ls -A`. `builtin cd` ensures that the function calls Zsh's built-in `cd` command rather than recursively calling the alias.

:::note
Replacing a shell built-in such as `cd` changes its behavior everywhere in the interactive shell. If you prefer to preserve the original command, omit `alias cd='cs'` and call `cs` explicitly.
:::


### List Files

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

- `ls`: To use `gls`, install GNU core utilities with `brew install coreutils`.
    - `--color` colorizes the output.
    - `--group-directories-first` puts directories before files.
    - `-F` adds `/` to directory names, `@` to symbolic links, and other type indicators.
- `la`, `ll`: Because `ls` is defined first, these aliases expand to `gls` with the shared options.
    - `-A` shows all entries except `.` and `..`.
    - `-h` uses human-readable file sizes.
    - `-l` shows size, owner, group, permissions, and other details.
    - `-S` sorts by file size.
- `ds`: `du -d 1` shows the size of entries one level below the current directory.
    - `2>/dev/null` hides error messages.
    - `sort -h` sorts human-readable sizes through a [pipe](./linux.en.md#pipes).
- `pwd`: `sed` escapes spaces with `\`, while `${PWD/#$HOME/"~"}` replaces the home-directory prefix with `~`.

:::tip
Short options can usually be combined: `ls -AhlS` is equivalent to `ls -A -h -l -S`.
:::


### Edit and Remove Files

```bash
alias v='vi'
alias cp='cp -iv'
alias mv='mv -iv'
alias rm='rm -iv'
alias rf='rm -rf'
```

- `-i` asks before overwriting or removing a file.
- `-v` prints the names being copied, moved, or removed.

:::warning
`rf` removes directories recursively without confirmation. Inspect the target carefully before using it, or omit this alias if an easy-to-type destructive shortcut is not worth the risk.
:::


### Search and Compare

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
alias grep='grep --color'
```

`fb "*.pdf" 10` finds PDF files larger than 10 MB below the current directory:

- `-size "+${2}M"` selects files larger than the second argument in MiB.
- `-type f` selects regular files.
- `-name "$1"` matches the first argument as a filename pattern.
- `-exec ls -lhS {} +` prints the results with readable sizes, largest first.

`rn txt asdf` renames `.txt` files by removing `asdf` from each filename. For example, `aaasdfff.txt` becomes `aaff.txt`.

:::note{title="Functions and Arguments"}
Functions are defined as `name() { commands }` and can receive positional arguments:

- `$0` is the function name.
- `$1`, `$2`, and so on are individual arguments.
- `"$@"` expands to all arguments while preserving them as separate strings.
- `$#` is the number of arguments.
- `$?` is the exit status of the previous command.
- `$$` is the current shell's process ID.
- `$!` is the process ID of the most recent background command.
:::


### Open Applications

```bash
alias hr='open .'
alias c='open /Applications/CotEditor.app'
alias vs='code'
alias chrome='open /Applications/Google\ Chrome.app'
```

- `hr` opens the current directory in Finder.
- `c` opens CotEditor.
- `vs` opens Visual Studio Code.
- `chrome` opens Google Chrome.


### Other Shortcuts

```bash
alias his='history'
alias rl='exec ${SHELL} -l'       # Reload the login shell
```


### Create an Encrypted ZIP Archive

```bash
zipen() {
    zip -er enc.zip "$@"
}
```

`zipen file1 file2 dir1` creates the password-protected archive `enc.zip`. Quoted `"$@"` preserves each supplied path as a separate argument, including paths that contain spaces.


## macOS Settings

### Show or Hide Hidden Files in Finder

```bash
alias show='defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder'
alias hide='defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder'
```

:::tip
You can also press `Command + Shift + .` in Finder to show or hide hidden files.
:::


### Hide or Show Desktop Icons

```bash
alias dhide='defaults write com.apple.finder CreateDesktop -bool false && killall Finder'
alias dshow='defaults write com.apple.finder CreateDesktop -bool true && killall Finder'
```


### Screenshot Settings

```bash
alias dwl='defaults write com.apple.screencapture location'
alias ddl='defaults delete com.apple.screencapture location'
alias drl='defaults read com.apple.screencapture location'
```

For example, `dwl ~/Desktop` changes the screenshot destination to the Desktop.


### Sleep Settings

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

### Activate or Deactivate a Virtual Environment

```bash
alias acv='source venv/bin/activate'
alias deac='deactivate'
```


## Git and GitHub

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

### Create a GitHub Repository and Its Initial Commit

The following function initializes the current directory and creates a repository through GitHub CLI:

```bash
# Usage: ginit private
#        ginit public
ginit() {
    local visibility=${1:-private}

    git init
    git add .
    git commit -m "🎉 Initial commit"
    gh repo create --"$visibility" --source=. --push
}
```

Install [GitHub CLI](https://cli.github.com/) before using the `gh` command.


### Commit Messages with Emoji

```bash
# Add all changes, commit, and push the current branch.
gacp() { git add . && git commit -m "$*" && git push }

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

# Show the available commit types.
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
`gacp` stages every change in the repository. Run `git status` and review the diff before using it.
:::


### Generate `.gitignore`

The following function downloads a `.gitignore` template from the gitignore.io API. The name `gignore` avoids conflicting with the `gi='git init'` alias above.

```bash
gignore() {
    local IFS=,
    curl -sL "https://www.toptal.com/developers/gitignore/api/$*"
}
```

For example, run `gignore macos python visualstudiocode > .gitignore`.


## Related Article

For the recommended file layout, `$ZDOTDIR`, modular configuration files, and Zsh prompt customization, see [Organizing Zsh Configuration](./zsh.en.md).


## References

- [Jupyter Book Development Conventions](https://github.com/executablebooks/.github/blob/master/CONTRIBUTING.md#commit-messages)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Emoji-Log](https://github.com/ahmadawais/Emoji-Log)
- [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- [Complete List of GitHub Markdown Emoji Markup](https://gist.github.com/rxaviers/7360908)
- [Commit Message Examples](https://gist.github.com/mono0926/e6ffd032c384ee4c1cef5a2aa4f778d7)
