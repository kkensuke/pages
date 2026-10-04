---
title: "Finder, Terminal, VScode 間を簡単に移動する方法"
date: "2024-10-31"
subtitle: "Finder, Terminal, VScode 間を簡単に移動する方法"
tags: [MacOS, Productivity]
icon: square-terminal
---


## 1 Terminal から Finder
Terminal のカレントディレクトリを Finder で開くには、`open　.` を使います。`open` コマンドを使えば、他のディレクトリやファイルも開けたり、アプリを起動したりできるので便利です。


## 2 Finder から Terminal
ここでは、Finder 上のディレクトリを Terminal で開くためのショートカットキーを登録します。まずシステム設定から[System settings > Keyboard > Keyboard Shotcuts > Services]を開きます。
![OpenTerminal1.jpeg](/images/finder-terminal/OpenTerminal1.jpeg)

そして、以下の赤枠内にチェックマークをつけ、適当なショートカットキー（ここでは :btn[cmd] + :btn[shift] + :btn[E]）を登録します。
![OpenTerminal2.jpeg](/images/finder-terminal/OpenTerminal2.jpeg)

実際に Finder から Terminal を開くには、Finder 上でディレクトリを選択して先ほどのショートカットキーを使うか、右クリックから下の赤枠部分のどちらかを選択して開きます。
![OpenTerminal3.jpeg](/images/finder-terminal/OpenTerminal3.jpeg)



## 3 Finder で開かれているフォルダに Terminal 上で移動する
ここでは、便利なシェル関数を紹介します。Terminal を使っているときに、ちょうど Finder で開いているディレクトリに Terminal 上で移動したい場合に使います。それは以下の `cdf` コマンドによって実現できます。([このページ](https://github.com/webpro/dotfiles/blob/master/system/.function.macos)から引用しました。)
使いたい方は、`.zhsrc` や `.bashrc` に追加してみてください。

```bash
# Change working directory to the top-most Finder window location
cdf() {
	cd "$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')";
}
```

例えば下の画像では、初めは Terminal 上で `Desktop` にいましたが、`cdf` を実行することで、Finder 上で開いていた `Google` フォルダに移動していることがわかります。
![cdf.jpeg](/images/finder-terminal/cdf.jpeg)



## 4 Finder から VScode
Finder 上のフォルダを VScode で開きたいことは常々あると思います。そんな時に選択したフォルダをショートカットキーで開けたら便利ですよね。ここでは、Automator.app の Quick Action を使って簡単にそのショートカットキーを作ります。

まず、Automator.app を開き Quick Action を選択します。
![OpenVScode1.jpeg](/images/finder-terminal/OpenVScode1.jpeg)

次に、赤枠の部分を「files and folders」in「Finder」に変更します。
![OpenVScode2.jpeg](/images/finder-terminal/OpenVScode2.jpeg)

次に、左の検索ボックスで「open」を入力すると「Open Finder Items」が候補に出てくるので、それをドラッグ&ドロップで右に持ってきます。そして、その中では、VScode を選択します。
![OpenVScode3.jpeg](/images/finder-terminal/OpenVScode3.jpeg)

以上の作業が完了したら、「Open in VScode」などと名前をつけて保存してください。

最後に、この Quick Action にショートカットキーを割り当てます。
システム設定を開き、[System Settings > Keyboard > Keyboard Shotcuts > Services > Files and Folders] と進んでいくと次の画面が現れ、先ほど作成した「Open in VScode」が見つかると思います。それに適当なショートカットキー（ここでは :btn[cmd] + :btn[shift] + :btn[W]）を割り当てます。
![OpenVScode4.jpeg](/images/finder-terminal/OpenVScode4.jpeg)

作業が完了したら、Finder であるフォルダを選択して、ショートカットキーを押してみてください。一発で VScode が開きましたね。