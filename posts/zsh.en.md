---
title: "Organizing Zsh Configuration"
date: "2022-06-12"
subtitle: "Use ZDOTDIR, modularize .zshrc, and customize the prompt"
tags: [CLI]
---


## Introduction

Zsh, or Z shell, is an interactive command-line shell with completion, advanced globbing, prompt customization, plugins, and themes. macOS uses Zsh as its default interactive shell.

You can check the configured login shell and the installed Zsh version with:

```bash
print -r -- "$SHELL"
zsh --version
```

When you are already running Zsh, `print -r -- "$ZSH_VERSION"` shows the version of the current shell. `$SHELL` can differ because it records the configured login shell rather than the shell process currently running.

As you customize Zsh, the home directory can fill with `.zsh*` files and `.zshrc` can grow into a long, difficult-to-maintain configuration. This guide shows how to:

1. keep Zsh configuration files in a dedicated directory with `$ZDOTDIR`;
2. divide `.zshrc` into smaller files by purpose;
3. verify the new configuration safely; and
4. optionally customize the prompt in its own module.

![Example of a customized Zsh prompt](/images/zsh.png)

The complete configuration and directory structure used in these examples is available on GitHub:

:::linkcard
https://github.com/kkensuke/dotfiles/tree/main/zsh
:::


## Zsh Startup Files

Zsh reads different configuration files depending on how the shell starts. The most commonly edited files are:

| File | When it is read | Typical contents |
| --- | --- | --- |
| `.zshenv` | Every Zsh invocation | Essential environment variables such as `ZDOTDIR` |
| `.zprofile` | Login shells | Login-session environment setup |
| `.zshrc` | Interactive shells | Aliases, functions, completion, plugins, and prompt setup |
| `.zlogin` | Login shells, after `.zshrc` | Commands that should run near the end of login setup |
| `.zlogout` | When a login shell exits | Login-session cleanup |

Keep `.zshenv` small because it is read even for non-interactive Zsh commands. Interactive settings normally belong in `.zshrc` or files sourced from it.


## Move Configuration to `ZDOTDIR`

Without additional configuration, startup files such as `.zshenv`, `.zprofile`, and `.zshrc` normally appear directly in the home directory. Setting `$ZDOTDIR` tells Zsh to look for most user startup files in another directory.

The final configuration will look like this:

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
├── .zshenv
├── .zprofile
├── .zshrc
├── .zlogin
└── .zlogout
```

### Create the Configuration Directory

Choose a permanent location and create directories for aliases and settings:

```bash
config_dir="$HOME/path/to/zsh"
mkdir -p "$config_dir"/{aliases,settings}
```

Replace `$HOME/path/to/zsh` with the actual location of your managed configuration.

### Copy Existing Startup Files

Copy existing files first instead of moving them. This keeps the current configuration available while you prepare and test the new one.

```bash
for file in .zshenv .zprofile .zshrc .zlogin .zlogout; do
    [[ -f "$HOME/$file" ]] && cp -p "$HOME/$file" "$config_dir/$file"
done

touch "$config_dir/.zshenv" "$config_dir/.zshrc"
```

`touch` creates `.zshenv` and `.zshrc` only when they do not already exist; existing contents are preserved.

### Set `ZDOTDIR` in the Managed `.zshenv`

Add the following setting to `$config_dir/.zshenv`:

```bash
export ZDOTDIR="$HOME/path/to/zsh"
```

The initial `.zshenv` must still be discoverable from the home directory. Quote the value so that it remains one path if a directory name contains spaces.

### Link `.zshenv` from the Home Directory

Back up the original `.zshenv`, if present, and create a symbolic link to the managed file:

```bash
config_dir="$HOME/path/to/zsh"
backup="$HOME/.zshenv.backup"

if [[ -e "$HOME/.zshenv" || -L "$HOME/.zshenv" ]]; then
    if [[ -e "$backup" || -L "$backup" ]]; then
        print -u2 -- "Backup already exists: $backup"
    else
        mv "$HOME/.zshenv" "$backup"
    fi
fi

if [[ ! -e "$HOME/.zshenv" && ! -L "$HOME/.zshenv" ]]; then
    ln -s "$config_dir/.zshenv" "$HOME/.zshenv"
fi
```

If the backup already exists, the original `.zshenv` remains in place and the symbolic link is not created. Rename or archive the existing backup before running the commands again.

For an interactive login shell, the startup sequence is now:

```text
~/.zshenv
    -> $HOME/path/to/zsh/.zshenv
    -> export ZDOTDIR=$HOME/path/to/zsh
    -> $ZDOTDIR/.zprofile
    -> $ZDOTDIR/.zshrc
    -> $ZDOTDIR/.zlogin
```

When the login shell exits normally, Zsh reads `$ZDOTDIR/.zlogout`.

:::warning
Do not remove the original `.zprofile`, `.zshrc`, `.zlogin`, or `.zlogout` until the managed configuration has passed the checks below and a new login shell starts successfully.
:::

:::note{title="History Is Configured Separately"}
`ZDOTDIR` controls startup-file locations, but it does not move the history file by itself. To preserve existing history, close other Zsh sessions and copy the history file before starting the new configuration:

```bash
config_dir="$HOME/path/to/zsh"

if [[ -f "$HOME/.zsh_history" && ! -e "$config_dir/.zsh_history" ]]; then
    cp -p "$HOME/.zsh_history" "$config_dir/.zsh_history"
fi
```

Active shells can continue writing to the old history file, so repeat the copy if another session remained open during the migration. Then add the following line to `.zshrc`:

```bash
HISTFILE="$ZDOTDIR/.zsh_history"
```
:::


## Modularize `.zshrc`

A single `.zshrc` becomes difficult to maintain when aliases, functions, completion settings, plugins, and prompt definitions are mixed together. Divide them into purpose-specific files and source them from `.zshrc`.

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

Source order matters when one file depends on settings defined by another. Load general environment and completion settings before plugins or aliases that use them, and load prompt configuration after any plugin that modifies the prompt.

Choose one filename extension, such as `.zsh`, for sourced fragments. A consistent naming rule makes it clear that these files are configuration modules rather than standalone executable scripts.

For practical files to place under `aliases/`, see [Useful Zsh Aliases and Functions](./alias.en).


## Verify and Troubleshoot

### Check Syntax

Run `zsh -n` on the main startup files and each sourced module:

```bash
for file in \
    "$ZDOTDIR/.zshenv" \
    "$ZDOTDIR/.zprofile" \
    "$ZDOTDIR/.zshrc" \
    "$ZDOTDIR/.zlogin" \
    "$ZDOTDIR/.zlogout" \
    "$ZDOTDIR"/aliases/*.zsh(N) \
    "$ZDOTDIR"/settings/*.zsh(N); do
    [[ -f "$file" ]] || continue
    zsh -n -f "$file" || break
done
```

`zsh -n` parses the files without executing their commands. The `-f` option prevents the check from loading user startup files automatically. Syntax checks cannot detect every runtime problem.

### Start a Fresh Login Shell

After the syntax check succeeds, start a new login shell:

```bash
zsh -l
```

This starts a nested login shell, so you can run `exit` to return to the previous shell if the configuration is not working as expected.

Confirm that Zsh loaded the expected directory and history path:

```bash
print -r -- "$ZDOTDIR"
print -r -- "$HISTFILE"
```

If either value is unexpected, inspect the link and the managed `.zshenv`:

```bash
ls -l "$HOME/.zshenv"
cat "$HOME/.zshenv"
```

After the new setup works, run `exit` to return to the previous shell. You can then archive or remove the old home-directory copies of `.zprofile`, `.zshrc`, `.zlogin`, and `.zlogout`.

To replace the current shell with the verified login shell, run:

```bash
exec zsh -l
```


## Optional: Customize the Prompt

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
autoload -Uz add-zsh-hook

typeset -gi _prompt_count=0

_blank_line_before_prompt() {
    if (( _prompt_count > 0 )); then
        print
    fi

    (( ++_prompt_count ))
    return 0
}

add-zsh-hook precmd _blank_line_before_prompt
```

Using `add-zsh-hook` preserves other `precmd` hooks registered by plugins or framework code.


## Next Steps

The configuration is now organized under `$ZDOTDIR`, divided into focused modules, and verified with a fresh login shell. Continue with [Useful Zsh Aliases and Functions](./alias.en) for practical files to place under `aliases/`.
