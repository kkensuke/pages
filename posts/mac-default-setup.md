---
title: "MacOS Default Setup"
date: "2024-5-5"
subtitle: "A guide to setting up MacOS with a shell script"
tags: [MacOS]
---


## Introduction
MacOS hides hundreds of settings behind the `defaults` command. Instead of clicking through System Settings, the following script allows you to configure your Mac with a single run.


```bash
#!/bin/bash

set -e
set -u


# ref:
# - https://github.com/rootbeersoup/dotfiles
# - https://github.com/skwp/dotfiles
# - https://github.com/sobolevn/dotfiles
# - https://github.com/webpro/dotfiles
# - https://apple.stackexchange.com/questions/14001/how-to-turn-off-all-animations-on-os-x
# - https://macos-defaults.com/


echo 'Configuring your mac. Hang tight.'
osascript -e 'tell application "System Preferences" to quit'


## General ##
# Disable the sound effects on boot
sudo nvram SystemAudioVolume=" "
sudo nvram StartupMute=%01

# Disable the “Are you sure you want to open this application?” dialog
defaults write com.apple.LaunchServices LSQuarantine -bool false

# Disable Notifcations
launchctl unload -w /System/Library/LaunchAgents/com.apple.notificationcenterui.plist


## Keyboard
# deactivate the CapsLockDelay
hidutil property --set '{"CapsLockDelayOverride":0}'

# Deley until repeat and Key repeat rate
defaults write -g InitialKeyRepeat -int 15
defaults write -g KeyRepeat -int 2

# Capitalize
defaults write -g "NSAutomaticCapitalizationEnabled" -bool false

# Double-space to period
defaults write -g "NSAutomaticPeriodSubstitutionEnabled" -bool false

# Smart quotes and dashes
defaults write -g "NSAutomaticDashSubstitutionEnabled" -bool false
defaults write -g "NSAutomaticQuoteSubstitutionEnabled" -bool false


defaults write -g KB_DoubleQuoteOption -string '"abc"'
defaults write -g KB_SingleQuoteOption -string "'abc'"

# Full-width numeric characters (true: Full-width, false: Half-width)
defaults write com.apple.inputmethod.Kotoeri "JIMPrefFullWidthNumeralCharactersKey" -bool false

# Shift key action (0: Katakana, 1: Romaji)
defaults write com.apple.inputmethod.Kotoeri "JIMPrefShiftKeyActionKey" -int 0


## Trackpad
# Cursor speed
defaults write -g com.apple.trackpad.scaling -float "3"

# Tap to click
defaults write com.apple.AppleMultitouchTrackpad "Clicking" -bool true

# Click (0: light, 1: medium, 2: firm)
defaults write com.apple.AppleMultitouchTrackpad "FirstClickThreshold" -int 0
defaults write com.apple.AppleMultitouchTrackpad "SecondClickThreshold" -int 0


## Menu bar
# Change the spacing between icons in menu bar
defaults -currentHost write -g NSStatusItemSpacing -int 6


## Dock ##
# delete an array of items located on the Applications side of the Dock
defaults delete com.apple.dock persistent-apps

# delete an array of items located on the Documents side of the Dock
defaults delete com.apple.dock persistent-others

# Disable show-process-indicators (dot below the icons)
defaults write com.apple.dock show-process-indicators -bool false
defaults write com.apple.dock show-recents -bool false

# Showing the Dock
defaults write com.apple.dock "autohide-delay" -float "0"

# animation
defaults write com.apple.dock "mineffect" -string "scale"

# Minimize windows into application icon
defaults write com.apple.dock minimize-to-application -bool true

# change the size of icons in the dock
defaults write com.apple.dock "tilesize" -int 43

# put favorite apps in the dock
apps=("/System/Applications/Utilities/Terminal" "/Applications/CotEditor" "/Applications/Visual Studio Code" "/Applications/Google Chrome" "/Applications/Zotero" "/System/Applications/Mail")

for app in "${apps[@]}"
do
	defaults write com.apple.dock persistent-apps -array-add "<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$app.app</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>"
done



## Finder ##
# Keep folders on top when sorting by name:
defaults write com.apple.finder _FXSortFoldersFirst -bool true

# Show Finder path bar:
defaults write com.apple.finder ShowPathbar -bool true

# Do not show status bar in Finder:
defaults write com.apple.finder ShowStatusBar -bool false

# Show hidden files in Finder: cmd + shift + .
defaults write com.apple.finder AppleShowAllFiles -bool true

# Show file extensions in Finder:
defaults write NSGlobalDomain AppleShowAllExtensions -bool true

# Disable the warning when changing a file extension
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

# Disable the warning when opening unconfirmed apps
defaults write com.apple.LaunchServices LSQuarantine -bool false

# Use column view in all Finder windows by default
# View modes:
# Flwv - Cover Flow View
# Nlsv - List View
# clmv - Column View
# icnv - Icon View
defaults write com.apple.finder FXPreferredViewStyle -string "clmv"

# Auto adjust column width
defaults write com.apple.finder "_FXEnableColumnAutoSizing" -bool true

# Avoid creating .DS_Store files
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# set coteditor as default editor for any .txt file
defaults write com.apple.LaunchServices LSHandlers -array-add '{LSHandlerContentType=public.plain-text;LSHandlerRoleAll=com.coteditor.CotEditor;}'

# Spring Loading
defaults write NSGlobalDomain com.apple.springing.delay -float 0

# Show Library folder
chflags nohidden ~/Library

# Stop using default folders
chflags hidden ~/{Documents,Movies,Music}
chmod 000 ~/{Documents,Movies,Music}



## Others
# showing and hiding Launchpad
defaults write com.apple.dock springboard-show-duration -float 0
defaults write com.apple.dock springboard-hide-duration -float 0

# Click in the scroll bar to (false: Jump to the next page, true: Jump to the spot that's clicked)
defaults write -g "AppleScrollerPagingBehavior" -bool true



## Screenshot ##
defaults write com.apple.screencapture name "screenshot"
defaults write com.apple.screencapture show-thumbnail -bool false
defaults write com.apple.screencapture include-date -bool false
defaults write com.apple.screencapture disable-shadow -bool true
defaults write com.apple.screencapture showsCursor -bool true
defaults write com.apple.screencapture location ~/Desktop/
defaults write com.apple.screencapture type png # png, gif, jpeg, pdf, bmp, tiff, psd, jpeg 2000, etc.
# defaults read com.apple.screencapture # See all settings about screenshot



## Restarting apps ##
echo 'Restarting apps...'
killall Finder
killall Dock

echo 'Done!'
```