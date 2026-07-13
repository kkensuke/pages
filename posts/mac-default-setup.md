---
title: "macOS の初期設定"
date: "2024-05-05"
subtitle: "シェルスクリプトを使って macOS を設定するためのガイド"
tags: [MacOS]
-------------

## はじめに

macOS では、数多くのシステム設定を `defaults` コマンドから変更できます。システム設定の各項目を手作業で変更する代わりに、以下のシェルスクリプトを実行することで、複数の設定をまとめて適用できます。

```bash
#!/bin/bash

set -e
set -u


# 参考資料:
# - https://github.com/rootbeersoup/dotfiles
# - https://github.com/skwp/dotfiles
# - https://github.com/sobolevn/dotfiles
# - https://github.com/webpro/dotfiles
# - https://apple.stackexchange.com/questions/14001/how-to-turn-off-all-animations-on-os-x
# - https://macos-defaults.com/


echo 'Macを設定しています。しばらくお待ちください。'
osascript -e 'tell application "System Preferences" to quit'


## 一般設定

# 起動音を消音する
sudo nvram SystemAudioVolume=" "
sudo nvram StartupMute=%01

# ダウンロードしたアプリケーションを開く際の隔離警告を無効にする
defaults write com.apple.LaunchServices LSQuarantine -bool false

# 通知センターを無効にする
launchctl unload -w /System/Library/LaunchAgents/com.apple.notificationcenterui.plist


## キーボード

# Caps Lockが有効になるまでの遅延をなくす
hidutil property --set '{"CapsLockDelayOverride":0}'

# キーリピート開始までの待ち時間とキーリピート速度を設定する
defaults write -g InitialKeyRepeat -int 15
defaults write -g KeyRepeat -int 2

# 英文入力時の自動大文字化を無効にする
defaults write -g NSAutomaticCapitalizationEnabled -bool false

# スペースキーを2回押したときのピリオド自動入力を無効にする
defaults write -g NSAutomaticPeriodSubstitutionEnabled -bool false

# スマートダッシュとスマート引用符への自動変換を無効にする
defaults write -g NSAutomaticDashSubstitutionEnabled -bool false
defaults write -g NSAutomaticQuoteSubstitutionEnabled -bool false

# ダブルクォートとシングルクォートに直線型の引用符を使用する
defaults write -g KB_DoubleQuoteOption -string '"abc"'
defaults write -g KB_SingleQuoteOption -string "'abc'"

# 日本語入力で数字を半角文字として入力する
# true: 全角数字、false: 半角数字
defaults write com.apple.inputmethod.Kotoeri JIMPrefFullWidthNumeralCharactersKey -bool false

# 日本語入力時のShiftキーの動作を設定する
# 0: カタカナ、1: ローマ字
defaults write com.apple.inputmethod.Kotoeri JIMPrefShiftKeyActionKey -int 0


## トラックパッド

# トラックパッドのポインタ移動速度を設定する
defaults write -g com.apple.trackpad.scaling -float 3

# タップによるクリックを有効にする
defaults write com.apple.AppleMultitouchTrackpad Clicking -bool true

# 1段階目と2段階目の強めのクリックに必要な押し込みの強さを設定する
# 0: 弱い、1: 中程度、2: 強い
defaults write com.apple.AppleMultitouchTrackpad FirstClickThreshold -int 0
defaults write com.apple.AppleMultitouchTrackpad SecondClickThreshold -int 0


## メニューバー

# メニューバーのステータスアイコン間の余白を狭くする
defaults -currentHost write -g NSStatusItemSpacing -int 6


## Dock

# Dockからすべてのアプリケーションアイコンを削除する
defaults delete com.apple.dock persistent-apps

# Dock右側からすべてのフォルダ、ファイル、ショートカットを削除する
defaults delete com.apple.dock persistent-others

# 起動中のアプリケーションアイコンの下に表示されるインジケータを非表示にする
defaults write com.apple.dock show-process-indicators -bool false

# 最近使用したアプリケーションをDockに表示しない
defaults write com.apple.dock show-recents -bool false

# 自動的に隠したDockが表示されるまでの遅延をなくす
defaults write com.apple.dock autohide-delay -float 0

# ウインドウを最小化するときにスケールエフェクトを使用する
defaults write com.apple.dock mineffect -string scale

# 最小化したウインドウをアプリケーションアイコンに格納する
defaults write com.apple.dock minimize-to-application -bool true

# Dockのアプリケーションアイコンのサイズを設定する
defaults write com.apple.dock tilesize -int 43

# 指定したアプリケーションをDockに追加する
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

# 名前順で並べ替えるときにフォルダを上部に表示する
defaults write com.apple.finder _FXSortFoldersFirst -bool true

# Finderウインドウの下部にパスバーを表示する
defaults write com.apple.finder ShowPathbar -bool true

# Finderウインドウの下部にあるステータスバーを非表示にする
defaults write com.apple.finder ShowStatusBar -bool false

# Finderで隠しファイルを常に表示する
# 表示を切り替えるキーボードショートカット: Command + Shift + .
defaults write com.apple.finder AppleShowAllFiles -bool true

# ファイル名の拡張子を常に表示する
defaults write NSGlobalDomain AppleShowAllExtensions -bool true

# ファイル名の拡張子を変更するときの警告を無効にする
defaults write com.apple.finder FXEnableExtensionChangeWarning -bool false

# Finderのデフォルト表示形式をカラム表示にする
# Flwv: Cover Flow表示
# Nlsv: リスト表示
# clmv: カラム表示
# icnv: アイコン表示
defaults write com.apple.finder FXPreferredViewStyle -string clmv

# Finderのカラム表示で列幅を自動調整する
defaults write com.apple.finder _FXEnableColumnAutoSizing -bool true

# ネットワークボリュームとUSBボリュームに.DS_Storeファイルを作成しない
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool true
defaults write com.apple.desktopservices DSDontWriteUSBStores -bool true

# 必要に応じて、プレーンテキストファイルのデフォルトアプリをCotEditorに設定する
# defaults write com.apple.LaunchServices LSHandlers -array-add \
#     '{LSHandlerContentType=public.plain-text;LSHandlerRoleAll=com.coteditor.CotEditor;}'

# ファイルをドラッグしたままフォルダに重ねたとき、フォルダを即座に開く
defaults write NSGlobalDomain com.apple.springing.delay -float 0

# ユーザーのLibraryフォルダを表示する
chflags nohidden ~/Library

# 必要に応じて、指定した標準フォルダを非表示にし、アクセスを制限する
# chflags hidden ~/{Documents,Movies,Music}
# chmod 000 ~/{Documents,Movies,Music}


## その他の設定

# Launchpadを表示・非表示にするときのアニメーションを無効にする
defaults write com.apple.dock springboard-show-duration -float 0
defaults write com.apple.dock springboard-hide-duration -float 0

# スクロールバーをクリックした位置へ直接移動する
# false: 次のページへ移動する
# true: クリックした位置へ移動する
defaults write -g AppleScrollerPagingBehavior -bool true


## スクリーンショット

# スクリーンショットのファイル名の接頭辞を設定する
defaults write com.apple.screencapture name screenshot

# スクリーンショット撮影後に表示されるフローティングサムネイルを非表示にする
defaults write com.apple.screencapture show-thumbnail -bool false

# スクリーンショットのファイル名に日時を含めない
defaults write com.apple.screencapture include-date -bool false

# ウインドウのスクリーンショットに影を含めない
defaults write com.apple.screencapture disable-shadow -bool true

# スクリーンショットにマウスポインタを含める
defaults write com.apple.screencapture showsCursor -bool true

# スクリーンショットをデスクトップに保存する
defaults write com.apple.screencapture location ~/Desktop/

# スクリーンショットをPNG形式で保存する
# macOSのバージョンによっては、GIF、JPEG、PDF、BMP、TIFF、
# PSD、JPEG 2000などの形式も使用できる
defaults write com.apple.screencapture type png

# 現在保存されているスクリーンショット関連の設定を表示する
# defaults read com.apple.screencapture


## 設定を反映するためのアプリケーション再起動

echo '設定の影響を受けるアプリケーションを再起動しています...'
killall Finder
killall Dock

echo '完了しました。'
```
