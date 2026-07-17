---
title: "macOS Default Setup"
date: "2024-05-05"
subtitle: "A guide to configuring macOS with a shell script"
tags: [MacOS]
-------------

## Introduction

macOS exposes hundreds of system preferences through the `defaults` command. Instead of configuring each option manually in System Settings, the following shell script applies a set of preferences in a single run.

```bash
#!/bin/bash

set -e
set -u


# References:
# - https://github.com/rootbeersoup/dotfiles
# - https://github.com/skwp/dotfiles
# - https://github.com/sobolevn/dotfiles
# - https://github.com/webpro/dotfiles
# - https://apple.stackexchange.com/questions/14001/how-to-turn-off-all-animations-on-os-x
# - https://macos-defaults.com/


echo 'Configuring your Mac. Hang tight.'
osascript -e 'tell application "System Preferences" to quit'


## General

# Mute the startup chime
sudo nvram SystemAudioVolume=" "
sudo nvram StartupMute=%01

# Disable the quarantine warning shown when opening downloaded applications
defaults write com.apple.LaunchServices LSQuarantine -bool false

# Disable Notification Center
launchctl unload -w /System/Library/LaunchAgents/com.apple.notificationcenterui.plist

# Do not automatically rearrange Spaces based on most recent use
defaults write com.apple.dock mru-spaces -bool false


## Keyboard

# Remove the delay before Caps Lock is activated
hidutil property --set '{"CapsLockDelayOverride":0}'

# Set the delay before key repeat and the key repeat rate
defaults write -g InitialKeyRepeat -int 15
defaults write -g KeyRepeat -int 2

# Disable automatic capitalization
defaults write -g NSAutomaticCapitalizationEnabled -bool false

# Disable inserting a period after pressing Space twice
defaults write -g NSAutomaticPeriodSubstitutionEnabled -bool false

# Disable automatic smart dashes and smart quotes
defaults write -g NSAutomaticDashSubstitutionEnabled -bool false
defaults write -g NSAutomaticQuoteSubstitutionEnabled -bool false

# Use straight double and single quotation marks
defaults write -g KB_DoubleQuoteOption -string '"abc"'
defaults write -g KB_SingleQuoteOption -string "'abc'"

# Use half-width numeric characters in the Japanese input method
# true: full-width numerals, false: half-width numerals
defaults write com.apple.inputmethod.Kotoeri JIMPrefFullWidthNumeralCharactersKey -bool false

# Configure the Shift-key action in the Japanese input method
# 0: Katakana, 1: Romaji
defaults write com.apple.inputmethod.Kotoeri JIMPrefShiftKeyActionKey -int 0


## Trackpad

# Set the trackpad pointer-tracking speed
defaults write -g com.apple.trackpad.scaling -float 3

# Enable tap to click
defaults write com.apple.AppleMultitouchTrackpad Clicking -bool true

# Set the force required for the first and second force-click stages
# 0: light, 1: medium, 2: firm
defaults write com.apple.AppleMultitouchTrackpad FirstClickThreshold -int 0
defaults write com.apple.AppleMultitouchTrackpad SecondClickThreshold -int 0


## Menu Bar

# Reduce the spacing between menu-bar status icons
defaults -currentHost write -g NSStatusItemSpacing -int 6


## Dock

# Remove all application icons from the Dock
defaults delete com.apple.dock persistent-apps

# Remove all folders, files, and shortcuts from the right side of the Dock
defaults delete com.apple.dock persistent-others

# Hide the indicator dots below running applications
defaults write com.apple.dock show-process-indicators -bool false

# Hide recently used applications in the Dock
defaults write com.apple.dock show-recents -bool false

# Remove the delay before showing the auto-hidden Dock
defaults write com.apple.dock autohide-delay -float 0

# Use the scale effect when minimizing windows
defaults write com.apple.dock mineffect -string scale

# Minimize windows into their application icons
defaults write com.apple.dock minimize-to-application -bool true

# Set the size of application icons in the Dock
defaults write com.apple.dock tilesize -int 43

# Add the selected applications to the Dock
apps=(
	"/System/Applications/Utilities/Terminal"
	"/Applications/CotEditor"
	"/Applications/Visual Studio Code"
	"/Applications/Google Chrome"
	"/Applications/Zotero"
	"/System/Applications/Mail"
)

for app in "${apps[@]}"
do
	defaults write com.apple.dock persistent-apps -array-add \
		"<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$app.app</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"
done


## Finder

# Keep folders at the top when sorting by name
defaults write com.apple.finder _FXSortFoldersFirst -bool true

# Show the path bar at the bottom of Finder windows
defaults write com.apple.finder ShowPathbar -bool true

# Hide the status bar at the bottom of Finder windows
defaults write com.apple.finder ShowStatusBar -bool false

# Always show hidden files in Finder
# Keyboard shortcut to toggle visibility: Command-Shift-.
defaults write com.apple.finder AppleShowAllFiles -bool true

# Always show filename extensions
defaults write NSGlobalDomain AppleShowAllExtensions -bool true

# Disable the warning shown when changing a filename extension
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

# Use column view as the default Finder view
# Flwv: Cover Flow view
# Nlsv: List view
# clmv: Column view
# icnv: Icon view
defaults write com.apple.finder FXPreferredViewStyle -string clmv

# Automatically resize columns in Finder's column view
defaults write com.apple.finder _FXEnableColumnAutoSizing -bool true

# Prevent .DS_Store files from being created on network and USB volumes
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# Optionally set CotEditor as the default application for plain-text files
# defaults write com.apple.LaunchServices LSHandlers -array-add \
#     '{LSHandlerContentType=public.plain-text;LSHandlerRoleAll=com.coteditor.CotEditor;}'

# Open folders immediately when dragging an item over them
defaults write NSGlobalDomain com.apple.springing.delay -float 0

# Make the user's Library folder visible
chflags nohidden ~/Library

# Optionally hide and restrict access to selected default folders
# chflags hidden ~/{Documents,Movies,Music}
# chmod 000 ~/{Documents,Movies,Music}


## Other Settings

# Disable the Launchpad show and hide animations
defaults write com.apple.dock springboard-show-duration -float 0
defaults write com.apple.dock springboard-hide-duration -float 0

# Make a scroll-bar click jump directly to the clicked position
# false: jump to the next page
# true: jump to the clicked position
defaults write -g AppleScrollerPagingBehavior -bool true


## Screenshots

# Set the screenshot filename prefix
defaults write com.apple.screencapture name screenshot

# Hide the floating thumbnail shown after taking a screenshot
defaults write com.apple.screencapture show-thumbnail -bool false

# Do not include the date and time in screenshot filenames
defaults write com.apple.screencapture include-date -bool false

# Disable shadows around captured windows
defaults write com.apple.screencapture disable-shadow -bool true

# Include the mouse pointer in screenshots
defaults write com.apple.screencapture showsCursor -bool true

# Save screenshots to the Desktop
defaults write com.apple.screencapture location ~/Desktop/

# Save screenshots in PNG format
# Other supported formats may include GIF, JPEG, PDF, BMP, TIFF,
# PSD, and JPEG 2000, depending on the macOS version
defaults write com.apple.screencapture type png

# Print the currently stored screenshot preferences
# defaults read com.apple.screencapture


## Restart Affected Applications

echo 'Restarting affected applications...'
killall Finder
killall Dock

echo 'Done!'
```
