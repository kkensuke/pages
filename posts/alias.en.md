---
title: "Useful Zsh Aliases and Functions"
date: "2022-10-18"
subtitle: "Practical shortcuts for files, macOS, Python, and Git"
tags: [CLI]
---


Aliases and functions give short names to commands that you run frequently. This article is a collection of practical shortcuts for navigation, files, macOS, Python, Git, and GitHub.


## Aliases vs. Functions

Use an alias for a fixed command or fixed options. Additional arguments can still be appended when the alias is used. Use a function when you need to validate, reorder, or reuse arguments; run multiple commands; or add conditional logic.

| | Alias | Function |
| --- | --- | --- |
| Best for | A fixed command or fixed options | Argument handling, multiple commands, or conditional logic |
| Example use | Use `h` instead of `cd ~` | Create a directory and enter it |
| Definition | `alias h='cd ~'` | `mkcd() { mkdir -p "$1" && cd "$1"; }` |

```bash
alias h='cd ~'

mkcd() {
    mkdir -p "$1" && builtin cd "$1"
}
```

Use `h` to go to the home directory and `mkcd new-project` to create and enter a directory.

:::note
These examples are intended for interactive Zsh sessions, not shell scripts. Many simple aliases also work in Bash, but functions and command options can differ between shells and operating systems.
:::


## Where to Define Aliases and Functions

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

See [Organizing Zsh Configuration](./zsh.en) for a complete example using `$ZDOTDIR` and a modular `.zshrc`.


## Dependencies and Compatibility

Most examples use standard macOS or Unix commands, but some commands in this article may require additional software.

| Command or feature | Requirement |
| --- | --- |
| `gls` | GNU core utilities: `brew install coreutils` |
| `open`, `osascript`, `defaults`, `pmset` | macOS |
| `code` | Visual Studio Code command-line launcher |
| `imgopt` | ImageOptim |
| `gh` | GitHub CLI |
| `git`, `curl`, `zip` | Install separately if unavailable |

Copy only the shortcuts that match your tools and workflow. Test each addition in a new terminal before relying on it.


## Navigation and Files

### Change Directories

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

# Change to the location shown in the frontmost Finder window.
cdf() {
    builtin cd "$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')"
}
```

The `cs` function changes directory and then runs `ls -A`. `builtin cd` ensures that it always calls Zsh's built-in command. The other aliases provide short names for common destinations.


### List Files

```bash
alias l='gls --color --group-directories-first -F'
alias la='gls --color --group-directories-first -F -A'
alias ll='gls --color --group-directories-first -F -AhlS'
alias ds='du -d 1 -h 2>/dev/null | sort -h'
alias p='pwd'
path() { print -l -- "${path[@]}" }
```

- `l`, `la`, `ll`: To use `gls`, install GNU core utilities with `brew install coreutils`.
    - `--color` colorizes the output.
    - `--group-directories-first` puts directories before files.
    - `-F` adds `/` to directory names, `@` to symbolic links, and other type indicators.
    - `-A` shows all entries except `.` and `..`.
    - `-h` uses human-readable file sizes.
    - `-l` shows size, owner, group, permissions, and other details.
    - `-S` sorts by file size.
- `ds`: `du -d 1` shows the size of entries one level below the current directory.
    - `2>/dev/null` hides error messages.
    - `sort -h` sorts human-readable sizes through a [pipe](./linux.en#pipes).
- `p` prints the working directory, and the `path` function prints one `$PATH` entry per line without interpreting backslash escapes.

:::tip
Short options can usually be combined: `ls -AhlS` is equivalent to `ls -A -h -l -S`.
:::


### Edit Files

```bash
alias v='vi'
```

Replace `vi` with your preferred editor if necessary.


## Search and Utilities

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

:::warning
The encryption provided by `zip -e` is intended for basic password protection. Use a stronger encryption tool for sensitive data.
:::


## Optional Command Overrides

The following aliases replace existing commands rather than introducing new names. They are convenient, but they change command behavior throughout the interactive shell.

```bash
alias cd='cs'
alias ls='gls --color --group-directories-first -F'
alias pwd='sed "s/ /\\\ /g" <<< ${PWD/#$HOME/"~"}'
alias cp='cp -iv'
alias mv='mv -iv'
alias rm='rm -iv'
alias grep='grep --color'
alias pip='pip3'

# Destructive shortcut: use only if you accept the risk.
alias rf='rm -rf'
```

- The `cd` alias lists directory contents after every successful move.
- The `ls` alias uses GNU `ls` with color and directory grouping.
- The `pwd` alias prints the current directory with spaces escaped and the home directory replaced by `~`. For example, `/Users/<USERNAME>/My Drive` becomes `~/My\ Drive` in macOS.
- The `cp`, `mv`, and `rm` aliases add confirmation and verbose output.
- Replacing `pip` can interfere with the executable selected by a Python virtual environment; `python -m pip` is more explicit.

:::warning
`rf` removes directories recursively without confirmation. Inspect the target carefully before using it, or omit this alias if an easy-to-type destructive shortcut is not worth the risk.
:::


## macOS Applications and Settings

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

If you want to prevent your Mac from sleeping, use the following aliases:

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

Using `python -m pip` makes it explicit which Python interpreter owns the selected `pip` installation.

`pfr` overwrites `requirements.txt`. Run `pf` first if you want to review the generated package list.

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
# Stage all changes in the repository, commit, and push the current branch.
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
`gacp` stages modified, deleted, and untracked files throughout the repository. Run `git status` and review the diff before using it. `git push` also requires an upstream branch to be configured.
:::

#### Commit-message References

- [Jupyter Book Development Conventions](https://github.com/executablebooks/.github/blob/master/CONTRIBUTING.md#commit-messages)
- [How to Write a Git Commit Message](https://chris.beams.io/git-commit)
- [Emoji-Log](https://github.com/ahmadawais/Emoji-Log)
- [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- [Complete List of GitHub Markdown Emoji Markup](https://gist.github.com/rxaviers/7360908)
- [Commit Message Examples](https://gist.github.com/mono0926/e6ffd032c384ee4c1cef5a2aa4f778d7)


### Generate `.gitignore`

The following function downloads a `.gitignore` template from the gitignore.io API. The name `gignore` avoids conflicting with the `gi='git init'` alias above.

```bash
gignore() {
    local IFS=,
    curl -sL "https://www.toptal.com/developers/gitignore/api/$*"
}
```

For example, run `gignore macos python visualstudiocode > .gitignore`.


## Next Steps

For the recommended file layout, `$ZDOTDIR`, modular configuration files, and Zsh prompt customization, see [Organizing Zsh Configuration](./zsh.en). For the commands used inside these shortcuts, see the [Command Line Guide](./linux.en).
