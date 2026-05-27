---
title: "Finder, Terminal, VScode 間を簡単に移動する方法"
date: "2024-10-31"
subtitle: "Finder, Terminal, VScode 間を簡単に移動する方法"
tags: [MacOS, Finder, Terminal]
---


## 1 Terminal から Finder
Terminal のカレントディレクトリを Finder で開くには、`open　.` を使います。`open` コマンドを使えば、他のディレクトリやファイルも開けたり、アプリを起動したりできるので便利です。


## 2 Finder から Terminal
ここでは、Finder 上のディレクトリを Terminal で開くためのショートカットキーを登録します。まずシステム設定から[System settings > Keyboard > Keyboard Shotcuts > Services]を開きます。

![Untitled.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/9e5188ae-4048-9423-35c2-f52ef1ccb5f0.png)

そして、以下の赤枠内にチェックマークをつけ、適当なショートカットキー（ここでは :btn[cmd] + :btn[shift] + :btn[E]）を登録します。
![SCR-20230225-4ok.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/f5f80cbd-d13e-0efe-4df1-e4068f8a7789.png)

実際に Finder から Terminal を開くには、Finder 上でディレクトリを選択して先ほどのショートカットキーを使うか、右クリックから下の赤枠部分のどちらかを選択して開きます。
![SCR-20230225-4sf.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/a0b03cf8-9c42-8f95-b7e6-ed91af3f04c4.png "width=500px")



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
![screenshot 1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/7ca6f1ac-dac7-0e32-1506-b0037e594595.png)



## 4 Finder から VScode
Finder 上のフォルダを VScode で開きたいことは常々あると思います。そんな時に選択したフォルダをショートカットキーで開けたら便利ですよね。ここでは、Automator.app の Quick Action を使って簡単にそのショートカットキーを作ります。

まず、Automator.app を開き Quick Action を選択します。
![screenshot 1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/508228c3-9048-07dc-91bb-61d0f8559167.png)

次に、赤枠の部分を「files and folders」in「Finder」に変更します。
![screenshot 2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/e33ab371-bc0d-59dc-22a1-35eaabde3578.png)

次に、左の検索ボックスで「open」を入力すると「Open Finder Items」が候補に出てくるので、それをドラッグ&ドロップで右に持ってきます。そして、その中では、VScode を選択します。
![screenshot 3.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/8aacd3b1-73db-6fc6-3490-6a086289f803.png)

以上の作業が完了したら、「Open in VScode」などと名前をつけて保存してください。

最後に、この Quick Action にショートカットキーを割り当てます。
システム設定を開き、[System Settings > Keyboard > Keyboard Shotcuts > Services > Files and Folders] と進んでいくと次の画面が現れ、先ほど作成した「Open in VScode」が見つかると思います。それに適当なショートカットキー（ここでは :btn[cmd] + :btn[shift] + :btn[W]）を割り当てます。

![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/0ea10088-9c7c-8bd9-69ba-b3a969f1dc41.png)

作業が完了したら、Finder であるフォルダを選択して、ショートカットキーを押してみてください。一発で VScode が開きましたね。