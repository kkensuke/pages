---
title: "Must-Have Homebrew CLI Tools"
date: "2026-06-20"
subtitle: "Enhancing your macOS Terminal experience with Homebrew CLI apps"
tags: [MacOS, CLI, Productivity]
---

## Introduction
In my previous article about the [MacOS Setup Script](mac-dev-setup), I shared a series of shell scripts to fully automate macOS configuration. In that post, I briefly listed several CLI tools installed via Homebrew.

To transform your terminal into a high-performance development environment, the built-in macOS commands are often not enough. From modern alternatives written in Rust or Go to Git extensions and Zsh plugins, here is a detailed breakdown of the **Homebrew CLI apps** I include in my setup scripts, categorized by their utility.

## 1. Modern Terminal Utilities (Rust/Go Alternatives)
These tools replace traditional UNIX commands (`cat`, `find`, `df`, etc.) with faster, more feature-rich alternatives.

- `bat`: Often described as "a `cat` clone with wings." It provides syntax highlighting and Git integration (showing `+` or `-` in the margins), drastically improving the code-reading experience directly in the terminal.
    ```bash
    brew install bat
    ```
    :::linkcard
    https://github.com/sharkdp/bat
    :::
- `fd`: A simple, fast, and user-friendly alternative to `find`. Written in Rust, it is incredibly quick and respects your `.gitignore` while skipping hidden files by default.
    ```bash
    brew install fd
    ```
    :::linkcard
    https://github.com/sharkdp/fd
    :::
- `fzf`: A general-purpose command-line fuzzy finder. It allows you to interactively filter lists, search command history (`Ctrl + R`), and find files. It is an indispensable tool for any modern terminal workflow.
    ```bash
    brew install fzf
    ```
    :::linkcard
    https://junegunn.github.io/fzf/
    :::
- `duf`: A modern replacement for `df`. It displays disk usage and free space in a clean, colorful, and easy-to-read tabular format.
    ```bash
    brew install duf
    ```
    :::linkcard
    https://github.com/muesli/duf
    :::
- `scc` (Sloc, Cloc and Code): An incredibly fast tool for counting lines of code, blank lines, and comments across hundreds of programming languages.
    ```bash
    brew install scc
    ```
    :::linkcard
    https://github.com/boyter/scc
    :::



## 2. Git & GitHub Enhancements
Tools designed to streamline Git operations and reduce the need to switch back and forth to your browser.

- `gh` (GitHub CLI): The official CLI for GitHub. It lets you create pull requests, check issues, and manage repositories directly from the command line.
    ```bash
    brew install gh
    ```
    :::linkcard
    https://cli.github.com/manual/
    :::
- `git-delta`: A syntax-highlighting pager for `git diff` and `git show`. It makes diffs look beautiful (including side-by-side views) and much easier to read, similar to the GitHub UI.
    ```bash
    brew install git-delta
    ```
    :::linkcard
    https://dandavison.github.io/delta/
    :::
- `git-filter-repo`: The officially recommended tool for rewriting Git history. It is essential for tasks like permanently removing large files or sensitive information accidentally committed to a repository.
    ```bash
    brew install git-filter-repo
    ```
    :::linkcard
    https://github.com/newren/git-filter-repo
    :::


## 3. Development Environments & Runtimes
Core tools and runtimes required for various programming environments.

- `neovim`: A fork of Vim focused on extensibility and modern features like native LSP support and Lua-based configuration. It serves as both a quick editor and a full-blown IDE.
    ```bash
    brew install neovim
    ```
    :::linkcard
    https://neovim.io/
    :::
- `node` & `pnpm`: The Node.js runtime and `pnpm`, a fast, disk-space-efficient package manager. Essential for modern web development.
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
- `uv`: An extremely fast Python package and project manager written in Rust. It serves as a replacement for `pip` and `virtualenv`, offering significantly better performance.
    ```bash
    brew install uv
    ```
    :::linkcard
    https://docs.astral.sh/uv/
    :::
- `gcc` & `libomp`: The GNU Compiler Collection and the OpenMP runtime. Since Apple Clang does not support OpenMP (multi-threading) by default, these are necessary for compiling C/C++ code that requires parallel processing.
    ```bash
    brew install gcc
    brew install libomp
    ```
    :::linkcard
    https://gcc.gnu.org/
    :::
- `sqlite`: A lightweight relational database engine. Perfect for local data analysis or as a backend for small-scale applications.
    ```bash
    brew install sqlite
    ```
    :::linkcard
    https://www.sqlite.org/index.html
    :::



## 4. System & File Management
Utilities to automate macOS system settings and enhance file manipulation.

- `coreutils`: Installs the GNU version of standard commands (`ls`, `cp`, `rm`, etc.). This is vital if you want to ensure script compatibility between macOS and Linux environments.
    ```bash
    brew install coreutils
    ```
    :::linkcard
    https://www.gnu.org/software/coreutils/
    :::
- `duti`: A command-line tool to set default applications for specific file extensions. While macOS usually requires manual configuration via the "Get Info" pane, `duti` allows you to script these associations.
    ```bash
    brew install duti
    ```
    :::linkcard
    https://github.com/moretension/duti
    :::
    ```bash
    #!/bin/bash
    # Example: Setting VS Code as the default editor for all text files

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
- `mas`: A CLI for the Mac App Store. It allows you to install GUI apps like LINE, Kindle, or Xcode using `mas install [App ID]` without ever opening the App Store app.
    ```bash
    brew install mas
    ```
    :::linkcard
    https://github.com/mas-cli/mas
    :::
- `mole`: A powerful system cleanup and optimization CLI tool (`tw93/Mole`). It integrates functions found in GUI apps like CleanMyMac or AppCleaner, allowing you to purge caches and uninstall apps cleanly via the `mo` command.
    ```bash
    brew install mole
    ```
    :::linkcard
    https://github.com/tw93/Mole
    :::
- `rename`: A powerful utility to rename multiple files at once using regular expressions. Great for organizing large batches of photos or log files.
    ```bash
    brew install rename
    ```
- `tree`: A classic but essential command that displays directory structures in a tree-like format. Frequently used for documentation and README files.
    ```bash
    brew install tree
    ```

## 5. Zsh Plugins
Plugins that turn your default macOS shell into a high-productivity environment.
*(Note: These require manual lines in your `.zshrc` to be activated.)*

- `zsh-autosuggestions`: Suggests commands as you type based on your history in a subtle grey text. You can complete them with the right arrow key (or `Ctrl + F`), drastically reducing typing.
    ```bash
    brew install zsh-autosuggestions
    ```
- `zsh-syntax-highlighting`: Highlights commands in green if they are valid and red if they are not. It helps you catch typos before hitting enter.
    ```bash
    brew install zsh-syntax-highlighting
    ```
- `zsh-completions`: Extends the built-in Zsh completion system with thousands of additional definitions for common commands and Homebrew tools.
    ```bash
    brew install zsh-completions
    ```
- `zsh-git-prompt`: Displays the current Git branch and repository status (modified files, staged files, etc.) directly in your terminal prompt.
    ```bash
    brew install zsh-git-prompt
    ```
:::tip{title="🛠️ Zsh Plugins with Homebrew"}
When installing Zsh plugins via Homebrew, the installation path differs depending on your architecture (Intel vs. Apple Silicon). Be sure to use the correct path when adding the `source` command to your `.zshrc`.

**For Apple Silicon (M1/M2/M3):**
```bash
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
```
:::


## 6. Miscellaneous & Fun
Tools that add flavor to your terminal or serve specific niche purposes.

- `yt-dlp`: A feature-rich fork of `youtube-dl`. It is actively maintained and offers much faster download speeds for saving video content locally.
    ```bash
    brew install yt-dlp
    ```
    :::linkcard
    https://github.com/yt-dlp/yt-dlp
    :::
- `ghostscript`: An interpreter for PDF and PostScript files. It is often used behind the scenes in scripts to merge or compress PDF files via the command line.
    ```bash
    brew install ghostscript
    ```
    :::linkcard
    https://ghostscript.readthedocs.io/en/latest/index.html
    :::
- `cmatrix`: A joke app that displays the scrolling green text from *The Matrix*. Use it as a terminal screensaver to look like a Hollywood hacker when you step away from your desk.
    ```bash
    brew install cmatrix
    ```
    :::linkcard
    https://github.com/abishekvashok/cmatrix/
    :::



## Conclusion
The CLI tools listed here form the foundation of a highly efficient terminal workflow. You don't need to master all of them at once—try installing one or two that catch your eye and see how they fit into your daily routine. Happy hacking!