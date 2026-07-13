---
title: "MacOS Setup Script"
date: "2025-10-9"
subtitle: "The Ultimate Guide to Automating Your macOS Developer Setup"
tags: [MacOS]
---


## Introduction
Setting up a fresh Mac can be a tedious process. Downloading apps, configuring system preferences, and setting up terminal environments can easily eat up an entire day. 

Over time, I’ve refined a fully automated setup process using a series of shell scripts. By executing these scripts in order, I can transform a vanilla macOS installation into a fully customized, high-performance developer machine in minutes.
I will walk you through the step-by-step blueprint for setting up macOS from scratch.

All the scripts mentioned in this post are available in my GitHub repository:
:::linkcard
https://github.com/kkensuke/dotfiles/tree/main/setup
:::


---
## Phase 1: The Initial Manual Steps
Before running any scripts, there are a few manual steps required right out of the box:

1. **Sign in to iCloud:** Sync your basic data and settings.
2. **Install a Browser & Cloud Drive:** I usually install **Google Chrome** (via Safari) and **Google Drive** immediately. This will prepare the account for authentication. *(Note: While relying entirely on iCloud Drive and Safari might be better in terms of system integration and simplicity, this is a matter of personal preference.)*
3. **Mail Setup:** Log into Gmail or your preferred email provider.

Once these basics are out of the way, it’s time to open the **Terminal** and let the scripts do the heavy lifting.



---
## Phase 2: The Automated Script Execution

I’ve divided my setup process into six numbered scripts to ensure dependencies are installed in the correct order. 

*(Note: If you are following along, you'll need to adapt the file paths in the scripts—like dotfile locations—to match your own directory structure).*

### Step 1: Install Xcode Command Line Tools
Before installing any developer tools, macOS requires the Xcode Command Line tools. This allows you to use `git`.

```bash[title=1_xcode.sh]
# install to use git
xcode-select --install
```
*A prompt will appear. Click "Install" and wait for it to finish before moving to Step 2.*


### Step 2: Install Homebrew
Homebrew is the missing package manager for macOS. It allows us to install CLI tools and GUI applications directly from the terminal.

```bash[title=2_homebrew.sh]
#!/bin/bash

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

exec ${SHELL} -l # Reload the shell
```


### Step 3: Install Apps and Packages
With Homebrew ready, we can batch-install all our applications. My script handles three categories:
1. **CLI Tools (`brew install`):** Modern tools like `bat` (a better `cat`), `fzf` (fuzzy finder), `neovim`, `node`, `uv` (Python toolchain), and various Zsh plugins for syntax highlighting and autosuggestions.
2. **GUI Apps (`brew install --cask`):** Browsers, IDEs, and utilities. My must-haves include **Visual Studio Code**, **Rectangle** (window management), and **Shottr** (screenshots).
3. **Mac App Store Apps (`mas`):** Using the `mas` CLI, you can install App Store apps via their App ID. For example, `mas install 302584613` installs Kindle.
4. *Bonus:* This script also handles GitHub CLI (`gh`) authentication and sets up custom aliases, like a shortcut to delete repos directly from the terminal.

Installing CLI Tools and GUI Apps with Homebrew:
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

Installing from App Store with `mas` CLI:
```bash
# LINE
mas install 539883307
# hand-mirror
mas install 1502839586
# kindle
mas install 302584613
```

Registering GitHub CLI Aliases:
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

Reloading the Shell:
```bash
exec ${SHELL} -l
```


:::tip{title="🚀 Next Steps: Evolving to a `Brewfile`"}
If you want to take your `Homebrew` setup to the absolute highest level of automation, consider migrating your long list of `brew install` commands into a **`Brewfile`**—a clean blueprint of your environment.

Instead of hardcoding dozens of installation commands in a shell script, a `Brewfile` allows you to manage everything in two simple steps:

**1. Export (Backup):** You can generate a `Brewfile` blueprint of your current machine right now by running:
```bash
brew bundle dump
```

**2. Import (Restore):** When setting up a fresh Mac, you can read that blueprint and install everything at once with a single command:

```bash
brew bundle --file=Brewfile
```
:::



### Step 4: Symlink Dotfiles
Managing configuration files (`.gitconfig`, `.zshenv`, etc.) is much easier if you keep them in a centralized Git repository and symlink them to your home directory.

This script iterates through my dotfiles repo and creates symbolic links (`ln -sf`) for everything in the `home/` directory. It also handles the `.zshenv` file separately since I keep it in a different location.

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



### Step 5: Configure macOS System Preferences
Check out another post I wrote specifically about this script `5_mac.sh`: [MacOS Default Setup](./mac-default-setup.en).
This script uses the defaults command to deeply configure macOS without touching the UI.


### Step 6: Set Default File Associations
By default, Mac opens files like `.txt` or `.md` in TextEdit.
Honestly, this app is not useful for programming.
Using a CLI tool called `duti`, this script forcefully binds all common text and programming extensions to **Visual Studio Code** (`com.microsoft.VSCode`). No more :btn[Right Click -> Open With]!

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
## Phase 3: Quality of Life Improvements

With the core system installed, there are two final tweaks to perfect the environment.

### 1. Enable Touch ID for `sudo`
Typing your password every time you run a `sudo` command gets old fast. By modifying the PAM (Pluggable Authentication Modules) configuration, you can use your Mac's fingerprint reader for the terminal.

I run a script that appends the required configuration:
```bash[title=enable_TouchID_for_sudo.sh]
#!/bin/sh

cd /etc/pam.d

sudo tee -a sudo_local >/dev/null <<'EOF'
# sudo_local: local config file which survives system update and is included for sudo
# uncomment following line to enable Touch ID for sudo
auth       sufficient     pam_tid.so
EOF

```


### 2. Final Manual System Settings (For Japanese Users)
A few things still require manual intervention in System Settings:
* Under Keyboard settings, set the input source to **only** `Japanese - Romaji`.
* Map the `¥` (Yen) key to output a backslash (`\`), which is crucial for programming.



---
## Troubleshooting: The Zsh Compinit Error

If you rely on Zsh completions (installed via Homebrew), you might occasionally see this error when opening a new terminal window:

```text
zsh compinit: insecure directories, run compaudit for list.
Ignore insecure directories and continue [y] or abort compinit [n]?
```

This happens because Homebrew sometimes changes folder permissions, making Zsh flag them as insecure. 

**The Fix:**
1. Run `compaudit` in the terminal to list the problematic directories (usually something like `/opt/homebrew/share`).
2. Fix the permissions for those directories using `chmod`. For example:
   ```bash
   chmod 755 /opt/homebrew/share
   ```



---
## Conclusion
By treating your machine's configuration as code, you eliminate the friction of setting up a new device. If my Mac breaks today, I know I can be back up and running with my exact aliases, window manager configurations, and developer tools in less than 30 minutes.

If you haven't automated your Mac setup yet, I highly recommend creating a Git repository for your dotfiles and writing scripts to handle the installation of your essential tools and apps.
Your future self will thank you.