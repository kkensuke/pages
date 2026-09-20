---
title: "slink"
date: "2026-09-16"
subtitle: "A macOS & Linux CLI for easily creating and managing symbolic links"
tags: [MacOS, CLI, Productivity]
---

## 1. Introduction

Symbolic links are very convenient because they allow you to increase the "entrances from other locations" to a file or directory while keeping the actual data in one place.

As the number of symlinks grows, you may want to keep track of:

* Where you created them
* What each one points to
* Whether their targets still exist
* How to restore deleted or broken symlinks

`slink` is a **CLI for macOS and Linux that allows for the safe and intuitive creation of symbolic links while simultaneously recording the link's location and referral destination in a management TOML file**.

You can list your symlinks, check their status, and restore them from the command line. You can also register existing symlinks. It works for symlinks to files and directories beyond just dotfiles.

## 2. Installation

Install slink with Homebrew:

```bash
brew install kkensuke/tap/slink
```

If the following command displays a version number, the installation is complete.

```bash
slink --version
```

## 3. Getting Started

You do not need to prepare a configuration file in advance. Let's start with a sample file.

### 3.1. Create a Symlink

Create a directory and a text file to try it out:

```bash
mkdir -p ~/slink-demo
cd ~/slink-demo
printf 'Hello, slink!\n' > hello.txt
```

Create a symlink pointing to `hello.txt`:

```bash
slink hello.txt hello-link.txt
```

The basic syntax is:

```bash
slink <target> <link>
```

In this example, `hello.txt` is the actual file, and `hello-link.txt` provides another way to access it.

Read the file through the symlink:

```bash
cat hello-link.txt
```

Output:

```text
Hello, slink!
```

The contents of the original file are displayed. If you edit `hello.txt`, the contents you read through the symlink will change as well.

You can create symlinks to directories using the same syntax.

### 3.2. List Registered Symlinks

Symlinks created with slink are automatically registered.

```bash
slink list
```

This displays the locations and targets of your registered symlinks.

### 3.3. Check Symlink Status

Check that a symlink matches its registration and that its target is accessible:

```bash
slink check ~/slink-demo/hello-link.txt
```

If there are no problems, you will see:

```text
OK 1 links
```

To check all registered symlinks, omit the path:

```bash
slink check
```

**Use `list` to view registrations and `check` to inspect the actual state of your symlinks.**

## 4. The Registry File

### 4.1. Find Its Location

Symlink registrations are normally saved in the following TOML file:

```text
~/.config/slink/links.toml
```

To find the registry file slink is currently using, run:

```bash
slink --config
```

The registry file is created automatically when you create a symlink or register one with `adopt`.

### 4.2. Open the Registry File

To open it with the default macOS application, run:

```bash
open "$(slink --config)"
```

If the VS Code `code` command is available, you can also open it with:

```bash
code "$(slink --config)"
```

### 4.3. Registry File Contents

If your home directory is `/Users/you`, the symlink from our example is recorded as follows:

```toml[title=links.toml]
[[link]]
link   = "/Users/you/slink-demo/hello-link.txt"
target = "/Users/you/slink-demo/hello.txt"
```

| Field    | Description                 |
| -------- | --------------------------- |
| `link`   | Where the symlink is placed |
| `target` | What the symlink points to  |

A `[[link]]` block is added for each registration.

By default, slink stores the target of a newly created symlink as an absolute path. If you use `-r` / `--relative`, however, the `target` can instead be stored as a path relative to the symlink's location.

The registry also supports `${HOME}` for paths based on your home directory:

```toml[title=links.toml]
[[link]]
link   = "${HOME}/slink-demo/hello-link.txt"
target = "${HOME}/slink-demo/hello.txt"
```

Only `${HOME}` and values beginning with `${HOME}/` are interpreted as HOME expressions. `~`, `$HOME`, other variables, and `${HOME}` appearing later in a path remain literal path text.

If you also want absolute paths under HOME that slink creates or updates to be written using `${HOME}`, add the following setting to the registry:

```toml[title=links.toml]
[format]
home = "expression"
```

If this setting is omitted, slink uses concrete absolute paths as before.

With `home = "expression"`, the preference applies only to entries that slink creates or updates. Existing untouched entries are not automatically rewritten. Relative targets also remain relative rather than being converted into `${HOME}` expressions.

You can handle everyday operations with slink commands, or open the registry file to view and edit the relationships between symlinks and their targets directly.

## 5. Command Reference

| Command                       | Description                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `slink <target> <link>`       | Create a symlink and register its target and location                                    |
| `slink --config`              | Display the registry file's location                                                     |
| `slink list`                  | List registered symlinks                                                                 |
| `slink check [link ...]`      | Compare symlinks with their registrations and check whether their targets are accessible |
| `slink fix [link ...]`        | Create or repair symlinks to match their registrations                                   |
| `slink unregister <link ...>` | Unregister symlinks while leaving them in place                                          |
| `slink remove <link ...>`     | Delete symlinks that match their registrations and unregister them                       |
| `slink adopt <link ...>`      | Register existing symlinks                                                               |
| `slink scan [directory ...]`  | Find symlinks directly inside the specified directories                                  |

Arguments in square brackets, such as `[link ...]`, are optional. `...` indicates that you can provide multiple paths.

* `check` and `fix` operate on all registered symlinks when no paths are specified.
* `unregister` and `remove` require paths to registered symlinks.
* `adopt` takes paths to existing symlinks and adds or updates their registrations.
* `scan` searches the current directory when no directory is specified.

## 6. Option Reference

| Short | Long                | Description                                                                                                                     |
| ----- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `-c`  | `--config`          | Display the registry file's location                                                                                            |
| `-f`  | `--force`           | When creating symlinks or running `fix`, replace conflicting symlinks or enforce the requested/registered target representation |
| `-r`  | `--relative`        | When creating a symlink, store and create its target as a path relative to the symlink's location                               |
| `-p`  | `--parents`         | When creating symlinks or running `fix`, create any missing parent directories for the symlinks                                 |
| `-n`  | `--dry-run`         | Preview changes without writing when creating symlinks or running `fix`, `unregister`, `remove`, or `adopt`                     |
| `-R`  | `--recursive`       | Include subdirectories when running `scan`                                                                                      |
| `-o`  | `--format <format>` | Set the output format for `list`, `check`, and `scan`. Supports `human` and `tsv`; defaults to `human`                          |
| `-h`  | `--help`            | Display help                                                                                                                    |
| `-V`  | `--version`         | Display the version                                                                                                             |

Short options can be combined, as in `-np` or `-rf`.

Use `--config`, `--help`, and `--version` on their own. `--config` displays the location of the current registry file; it does not specify an alternative configuration file.

```bash
slink --help
```

## 7. Common Tasks

### 7.1. Link Configuration Files from Your Dotfiles

Suppose you keep your Neovim configuration in `~/dotfiles/nvim` and want to access it from `~/.config/nvim`, where Neovim looks for its configuration.

Once you have placed your configuration in `~/dotfiles/nvim`, run:

```bash
slink -p ~/dotfiles/nvim ~/.config/nvim
```

The `-p` option creates the parent directory `~/.config` if needed. It does not create the target directory `~/dotfiles/nvim` itself.

Your configuration in `~/dotfiles/nvim` is now accessible through `~/.config/nvim`.

To preview the changes before applying them, add `-n`:

```bash
slink -np ~/dotfiles/nvim ~/.config/nvim
```

After reviewing the planned changes, run the command again without `-n`.

### 7.2. Create a Symlink with a Relative Target

By default, slink uses an absolute target when creating a symlink. Add `-r` / `--relative` to store and create an equivalent target relative to the symlink's location.

For example, suppose you have:

```text
~/slink-demo/
├── hello.txt
└── links/
```

Move to `~/slink-demo` and run:

```bash
cd ~/slink-demo
slink -r hello.txt links/hello-link.txt
```

Both `hello.txt` and `links/hello-link.txt` are still interpreted relative to the current working directory.

`--relative` changes only the representation used for the target stored in the symlink and registry.

The resulting symlink is:

```text
links/hello-link.txt -> ../hello.txt
```

The registry also stores the relative target:

```toml
[[link]]
link   = "/Users/you/slink-demo/links/hello-link.txt"
target = "../hello.txt"
```

If you register an existing symlink with `adopt`, slink can also preserve its relative target representation.

### 7.3. Restore a Deleted Symlink

You can recreate registered symlinks with `fix`.

Let's try this with the sample symlink. First, delete only the symlink:

```bash
rm ~/slink-demo/hello-link.txt
```

The target file, `hello.txt`, remains in place.

Next, restore the symlink from its registration:

```bash
slink fix ~/slink-demo/hello-link.txt
```

Check that you can read the file through the symlink again:

```bash
cat ~/slink-demo/hello-link.txt
```

```text
Hello, slink!
```

To restore multiple symlinks at once, omit the path. Add `-n` to see what would happen without making any changes:

```bash
slink fix -n
```

After reviewing the preview, apply the changes:

```bash
slink fix
```

### 7.4. Find and Register Existing Symlinks

You can also bring symlinks previously created with tools such as `ln -s` under slink's management.

For example, to find symlinks directly inside `~/.config`, run:

```bash
slink scan ~/.config
```

To include subdirectories, add `-R`:

```bash
slink scan -R ~/.config
```

`scan` can also find symlinks that have not been registered.

Use `adopt` to register a symlink you find. For example, if `~/.config/nvim` is already a symlink, register it with:

```bash
slink adopt ~/.config/nvim
```

This records its location and current target without changing the symlink itself.

If the existing symlink uses a relative target, slink keeps that relative representation when possible.

Once registered, you can view and check it alongside your other symlinks with `list` and `check`.

```bash
slink check ~/.config/nvim
```

### 7.5. Delete or Unregister a Symlink

When you no longer need the sample symlink, choose one of the following operations.

**To delete both the symlink and its registration**, use `remove`:

```bash
slink remove ~/slink-demo/hello-link.txt
```

The target file, `hello.txt`, is not deleted.

**To keep the symlink and stop managing it with slink**, use `unregister`:

```bash
slink unregister ~/slink-demo/hello-link.txt
```

This leaves the symlink in place and removes it from the symlinks included in `list`, `check`, and `fix`.


---

For more detailed usage, please check the README on GitHub.

:::linkcard
https://github.com/kkensuke/slink
:::
