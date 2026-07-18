---
title: "Organizing Zsh Configuration"
date: "2022-06-12"
subtitle: "Use ZDOTDIR, modularize .zshrc, and customize the prompt"
tags: [Zsh]
---


## 1. Introduction

As you customize Zsh, the home directory can fill with `.zsh*` files and `.zshrc` can grow into a long, difficult-to-maintain configuration.

This guide shows how to:

1. keep Zsh configuration files in a dedicated directory with `$ZDOTDIR`;
2. divide `.zshrc` into smaller files by purpose; and
3. customize the Zsh prompt without mixing prompt code into unrelated alias files.

![Image](/images/zsh.png)

The complete configuration and directory structure used in these examples is available on GitHub:

:::linkcard
https://github.com/kkensuke/dotfiles/tree/main/zsh
:::


## 2. What Is Zsh?

Zsh, or Z shell, is an interactive command-line shell with features such as completion, advanced globbing, prompt customization, plugins, and themes. It is largely compatible with Bourne-style shell syntax while also providing features found in Bash, ksh, and tcsh.

macOS uses Zsh as its default interactive shell. You can confirm the current shell and Zsh version with:

```bash
echo "$SHELL"
zsh --version
```


## 3. Understand Zsh Startup Files

Zsh reads different configuration files depending on how the shell starts. The most commonly edited files are:

| File | When it is read | Typical contents |
| --- | --- | --- |
| `.zshenv` | Every Zsh invocation | Essential environment variables such as `ZDOTDIR` |
| `.zprofile` | Login shells | Login-session environment setup |
| `.zshrc` | Interactive shells | Aliases, functions, completion, plugins, and prompt setup |
| `.zlogin` | Login shells, after `.zshrc` | Commands that should run near the end of login setup |

Keep `.zshenv` small because it is read even for non-interactive Zsh commands. Interactive settings normally belong in `.zshrc` or files sourced from it.


## 4. Keep Zsh Files in a Dedicated Directory

Without additional configuration, files such as `.zshenv`, `.zprofile`, `.zshrc`, and `.zsh_history` usually appear directly in the home directory. Setting `$ZDOTDIR` lets Zsh look for most user startup files in another directory.

For example, the configuration can be organized like this:

```text
zsh/
├── aliases/
│   ├── files.zsh
│   ├── git.zsh
│   └── python.zsh
├── settings/
│   ├── completion.zsh
│   ├── plugins.zsh
│   └── prompt.zsh
├── .zprofile
├── .zshrc
└── .zshenv
```

### 4.1 Set `ZDOTDIR` in `.zshenv`

The initial `.zshenv` must be discoverable from the home directory. Put the following setting in the managed `.zshenv` file:

```bash
export ZDOTDIR="$HOME/path/to/zsh"
```

Quote the value so that the path remains one argument if a directory name contains spaces.

### 4.2 Link `.zshenv` from the Home Directory

Create a symbolic link at `~/.zshenv` that points to the managed file:

```bash
ln -s "$HOME/path/to/zsh/.zshenv" "$HOME/.zshenv"
```

The startup sequence is then:

```text
~/.zshenv
    -> $HOME/path/to/zsh/.zshenv
    -> export ZDOTDIR=$HOME/path/to/zsh
    -> $ZDOTDIR/.zprofile and $ZDOTDIR/.zshrc
```

:::warning
If `~/.zshenv` already exists, inspect and back it up before creating the link. Do not overwrite an existing configuration without moving its required settings into the managed file.
:::

`ZDOTDIR` controls the location of startup files, but not the history file by itself. Set `HISTFILE` separately in `.zshrc` if you also want to store history in the managed directory:

```bash
HISTFILE="$ZDOTDIR/.zsh_history"
```


## 5. Modularize `.zshrc`

A single `.zshrc` becomes difficult to maintain when it contains aliases, functions, completion settings, plugins, and prompt definitions together. Divide these settings into purpose-specific files and source them from `.zshrc`.

```bash
# $ZDOTDIR/.zshrc

# General settings
[[ -f "$ZDOTDIR/settings/completion.zsh" ]] && source "$ZDOTDIR/settings/completion.zsh"
[[ -f "$ZDOTDIR/settings/plugins.zsh" ]]    && source "$ZDOTDIR/settings/plugins.zsh"
[[ -f "$ZDOTDIR/settings/prompt.zsh" ]]     && source "$ZDOTDIR/settings/prompt.zsh"

# Aliases and functions
[[ -f "$ZDOTDIR/aliases/files.zsh" ]]       && source "$ZDOTDIR/aliases/files.zsh"
[[ -f "$ZDOTDIR/aliases/git.zsh" ]]         && source "$ZDOTDIR/aliases/git.zsh"
[[ -f "$ZDOTDIR/aliases/python.zsh" ]]      && source "$ZDOTDIR/aliases/python.zsh"
```

:::tip{title="Why Check with [[ -f ... ]]?"}
`[[ -f "$file" ]] && source "$file"` loads a file only when it exists. This prevents startup errors when an optional configuration file is moved or temporarily removed.
:::

Choose one filename extension, such as `.zsh`, for sourced Zsh fragments. A consistent naming rule makes it clear that these files are configuration fragments rather than standalone executable scripts.

For practical files to place under `aliases/`, see [Useful Zsh Aliases and Functions](./alias.en.md).


## 6. Customize the Prompt

Prompt configuration belongs in a settings file such as `$ZDOTDIR/settings/prompt.zsh`, rather than in an alias collection.

```bash
PS1='%F{082}%n%f %F{051}%~%f %# '
RPROMPT='%T'
```

The prompt escapes used above mean:

| Escape | Meaning |
| --- | --- |
| `%n` | Username |
| `%~` | Current directory, with the home directory shortened to `~` |
| `%#` | `#` for a privileged shell, otherwise `%` |
| `%T` | Current time in 24-hour format; `%t` uses 12-hour format |
| `%F{number}` ... `%f` | Start and end a foreground color |

The color values follow the terminal's color palette. See the [ANSI escape code color table](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) and the [Zsh Prompt Expansion documentation](https://zsh.sourceforge.io/Doc/Release/Prompt-Expansion.html) for more options.

To print a blank line before each prompt except the first one:

```bash
precmd() { precmd() { echo } }
```


## 7. Apply and Test Changes

After editing the configuration, start a fresh login shell:

```bash
exec zsh -l
```

For syntax checking without starting a new interactive shell:

```bash
zsh -n "$ZDOTDIR/.zshrc"

for file in "$ZDOTDIR"/aliases/*.zsh(N) "$ZDOTDIR"/settings/*.zsh(N); do
    zsh -n "$file" || break
done
```

`zsh -n` parses the files without executing their commands. It detects syntax errors but cannot detect every runtime problem.


## 8. Conclusion

Use `$ZDOTDIR` to keep Zsh startup files together, split `.zshrc` into focused settings and alias files, and keep prompt configuration in its own module. This structure keeps the home directory clean and makes each part of the shell configuration easier to understand, test, and update.

Continue with [Useful Zsh Aliases and Functions](./alias.en.md) for practical alias and function examples.
