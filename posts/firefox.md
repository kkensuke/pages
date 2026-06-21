---
title: "Firefox"
date: "2024-10-31"
subtitle: "Firefox の便利な機能と設定"
tags: [Productivity]
---


## 0　Firefox も結構使いやすい
最近は新しいブラウザがもてはやされていますが、全てのブラウザを使ってきた上で、Firefox はかなり便利なブラウザだなと思っているので、開発者への感謝としてこの記事を書かせていただきます。
まだ使ったことが無い方は、ぜひ一度インストールして試してみてください。

:::linkcard
https://www.mozilla.org/ja/firefox/new/
:::


## 1　設定を変更する
:btn[cmd] + :btn[,] で環境設定ページを開くことができます。初めは、デフォルトで使っているブラウザからデータをインポートするのが良いでしょう。その他、このページで好みの設定に変更してください。

![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/e1d72bc2-3ec1-2a16-bbce-7a1917f1eaac.png)



## 2　便利な機能
以下に Firefox の便利な機能を簡単に列挙しました。そのうちいくつかについては、以降でより詳しく説明しています。

1. [豊富な拡張機能（アドオン）](https://addons.mozilla.org/ja/firefox/)

2. カスタマイズしやすいツールバー。ツールバー上で右クリックして「ツールバーをカスタマイズ」を選ぶと、次の画面が出てきます。ドラック&ドロップでアイコンを追加&削除できます。
    ![screenshot-1.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/a9a7b421-b8ce-c5df-6ccf-66c7e65bcd22.png)
    
3. サイドバー：以下の様々な情報へのアクセスが簡単になります。
    - ブックマーク
    - 閲覧履歴
    - Synced tabs
    - `Simple Tab Groups`（拡張機能）
    タブをグループ化して整理できます。ウィンドウを閉じてもタブは保存されます。
    - AI Chatbot: 設定ページの `Firefox Labs` にて、`AI chatbot` にチェックをつけてください。`Show prompts on text select` をチェックすると、任意のサイトで選択した文字列を指定している言語モデルにすぐに投げることができます。
![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/1cf9631d-ee94-7fa8-a753-b69aede5628b.png)

4. マルチアカウントコンテナ
同じサイトに異なるアカウントで同時にログインできます。例えば、一つのタブでは仕事用のアカウントを用いてあるサイトにログインし、もう一つのタブでは、私的なアカウントで同一のサイトにログインできます。

5. スクリーンショット: :btn[cmd] + :btn[shift] + :btn[S]
スクリーンショットの範囲を以下の四つの方法で選択できます。
    - 自分で範囲を選択
    - カーソルが乗っているページの一部を自動的に選択
    - 見えている範囲全体を選択
    - スクロールできる範囲全体を選択
![SCR-20230625-muis.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/90edc24f-23d0-6f96-520c-d8a829745611.png)

6. Reader View: :btn[opt] + :btn[cmd] + :btn[R]
Webページの無駄を取り除き、読みやすさを向上させます。

7. デバイスの同期

8. `userChrome.css` でブラウザの見た目をカスタマイズできます。



## 3 [アドオン（拡張機能）](https://addons.mozilla.org/ja/firefox/)
:::warning
アドオンの組み合わせによっては予期しない動作が起こり得ます。この場合は、問題を起こしていそうなアドオンを一旦無効にし、再度 Firefox を起動し直すことで、どのアドオンが問題を起こしているかわかります。どのアドオンが衝突しているか分かったら、GitHub のリポジトリで問題を報告すると良いです。
:::

### 3-1　生産性関連

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/bitwarden-password-manager/
:::

Bitwarden は、無料で便利なオープンソースのパスワードマネージャーです。この拡張機能を使用するには、デスクトップアプリをインストールする必要があります。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/9983d16d-9b5b-8f03-7683-9c3831f45387.png "width=300px")
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/darkreader/
:::

Dark Reader は、ウェブサイトをダークモードで表示し、読みやすくします。:btn[opt] + :btn[D] で切り替え可能です。

:::note
Dark Reader は、Firefox の PDF には機能しません。なので次のアドオン `doqment` を使うか、下の Bookmarklet (ブックマークのリンク先として Javascript の関数を登録したもの) を使って対応することができます。ここで紹介する Bookmarklet は、普通の Web ページの場合はページ全体の色を反転し、PDF の場合は、PDF のみの色を反転します（2回実行すると元に戻ります）。PDFビューアーの背景のダークモードは `4　about:config` 節を参照してください。
```
javascript:(function(){var L='style_combined',S='#viewerContainer>#viewer.pdfViewer>.page{filter:%20invert(93%)}',E=document.querySelector('style[id="'+L+'"]');if(E){E.disabled=!E.disabled}else{var%20css='html%20{-webkit-filter:%20invert(90%);-moz-filter:%20invert(100%);-o-filter:%20invert(100%);-ms-filter:%20invert(100%);%20}',head=document.getElementsByTagName('head')[0],style=document.createElement('style');if(!window.counter){window.counter=1}else{window.counter++;if(window.counter%2==0){css='html%20{-webkit-filter:%20invert(0%);-moz-filter:%20invert(0%);-o-filter:%20invert(0%);-ms-filter:%20invert(0%);%20}'}}style.type='text/css';style.id=L;style.innerHTML=document.querySelector('#viewerContainer>#viewer.pdfViewer')?S:css;head.appendChild(style)}})()
```
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/doqment/
:::

doqment はPDF ビューアで PDF を見やすい色に変更できます。
:::warning
この拡張機能を有効にして PDF を閲覧している際は後述の `Zotero Connector` を使うことができません。PDF 以外を開いている場合は問題ありません。
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/duplicate-tab-shortcut/
:::

Duplicate Tabs Shortcut を使用すると、Windows / Linux では :btn[Alt] + :btn[shift] + :btn[D]、Mac では :btn[opt] + :btn[shift] + :btn[D] のキーボードショートカットでタブを複製できます。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/google-shortcuts-all-google-se/
:::

G App Launcher は、Gmail、Google Drive、Google カレンダー、Google マップ、Google 翻訳など、すべての Google サービスへのショートカットを表示します。
::::


::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/languagetool/
:::

Grammar and Spell Checker - LanguageTool は、ウェブ上のどこでもスペルや文法の問題をチェックします。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/keepa/
:::

Keepa.com - Amazon Price Tracker は、Amazon製品の価格履歴グラフを表示します。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/
:::

Multi-Account Containers を使用すると、同じウェブサイトで複数のアカウントを同時に使用できます。後述のSimple Tab Groupsと互換性があります。(このアドオンを使わなくてもコンテナの最低限の機能は使えるかもしれません。）
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/open_in_sidebar/
:::

Open in Sidebar を使用すると、サイドバーに別のウェブサイトを表示できます。デフォルトで開くページを登録したり[:btn[cmd] + :btn[,] -> Extensions & Themes -> `Open in Sidebar` -> Preferences]、この拡張機能をサイドバーで開くためのショートカットを登録すると便利です。登録方法は後述の項目 3-4 を参照してください。

:::warning
同様のアドオンに `Side View` というものもありますが、これを使用すると YouTube Music のバックグラウンド再生ができなくなります。
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/print-edit-we/
:::

Print Edit WE を使用すると、プリントプレビューモードでWebページのコンテンツを編集できます。例えば、広告の部分だけ削除してからプリントアウトすることが可能です。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/simple-tab-groups/
:::

Simple Tab Groups はアドオンの中で最も便利なものだと思います。これにより、タブをグループ化して整理できます。グループ間を素早く切り替えることができ、たくさんのタブの中で迷子になることがありません。また、ブラウザを閉じてもグループと中のタブは保持されます。
また `Multi-Account Containers` と互換性があり、それぞれのグループ内のタブをどのコンテナで開くか設定することもできます。この拡張機能をサイドバーで開くためのショートカットを登録すると便利です。登録方法は後述の項目 3-4 を参照してください。
![SCR-20240503-edyg.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/956c38a0-bf42-a3ab-3100-e4346319772c.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/simple-translate/
:::

Simple Translate は、シンプルで軽量な翻訳ツールです。選択したテキストをポップアップウィンドウ上で翻訳して表示します。日本語に翻訳する場合は、設定画面で「ターゲットの言語」を日本語に変更します。
![SCR-20230624-oicn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/b69b195f-07bc-5d2d-a655-92ca875a0983.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/single-file/
:::

SingleFile は、CSS、画像、フォント、フレームなどを含めた完全なページを1つのHTMLファイルとして保存することを可能にします。アノテーションしてから保存したり、ページ全体だけでなく、選択した範囲だけを保存することも可能です。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/swift-selection-search/
:::

Swift Selection Search を使用すると、選択したテキストに対してポップアップが表示されるので、使いたい検索エンジンで検索できます。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/tabliss/
:::

Tabliss は、美しい背景と複数のウィジェットを備えた新しいタブの拡張機能です。背景は `Unsplash` がおすすめです。
![SCR-20230624-oilx.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/859d212e-b3ba-5c20-ec0c-3b573da2024f.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
:::

Tampermonkey は、ユーザーが独自の JavaScript を実行するための拡張機能です。[既に他のユーザーによって作られた機能](https://openuserjs.org/)をインストールすることもできます。例えば、この [tumpio / Endless Google](https://openuserjs.org/scripts/tumpio/Endless_Google) は、Google の検索結果を、下方向に追加的に自動でロードしてくれるため、次のページのリンクを押す必要がなくなります。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/
:::

Wappalyzer はウェブサイトで用いられている技術を表示します。
::::

::::simple
:::linkcard
https://www.zotero.org/download/connectors
:::

Zotero Connector は、ウェブブラウザー内のコンテンツを自動的に検出し、1クリックでZoteroライブラリに追加できます。[Zotero](https://www.zotero.org/) というアプリ自体は文献管理にとても役立ちます。
![zotero-connector.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/fb3c63c1-6de7-2236-ddd8-7ea5f2189985.png#center)
::::

### 3-2　YouTube 関連
::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/enhancer-for-youtube/
:::

Enhancer for YouTube は、ビデオの再生速度制御、シネマモード、スクリーンショットなど、多くの便利な機能をYouTubeに追加します。ビデオの速度を0.05から(0.01、0.02、0.05、0.1、0.2、0.25、0.5、1)の間隔で微調整でき、2倍以上の速度にすることも可能です。
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/0d3eb5df-c088-e883-d43b-67e94801d644.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/videospeed/
:::

Video Speed Controller この拡張機能は動画の再生速度制御、スキップ機能、一時停止程度ですが、`Enhancer for YouTube`と異なり、YouTube だけでなくAmazonプライムなど、どんな動画でも簡単なショートカットキーで機能して便利です。ビデオの速度は細かく調整でき、2倍速以上にすることも可能です。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/youtube-audio/
:::

Youtube Audio を使用すると、YouTubeビデオの音声のみを再生でき、メモリの消費を抑えることができます。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/youtube-comment-translate/
:::

YouTube™ Comment Translate を使うと、YouTube の各コメントの右上にアイコンが表示され、それを押すとコメントが翻訳されます。
::::

::::simple
広告ブロック: 次のセキュリティの項目にも載せていますが、以下のどちらでも YouTube の広告を消せます。
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/adblocker-ultimate/
:::

:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/
:::
::::


### 3-3　セキュリティ関連
::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/adblocker-ultimate/
:::

AdBlocker Ultimate は、すべての広告とトラッキングをウェブページから削除します。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/canvasblocker/
:::

CanvasBlocker は、ウェブサイトが Javascript API を使ってフィンガープリントするのを防ぐことができます。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/clearurls/
:::
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/neat-url/
:::

ClearURLs または Neat URL は URL から不要な情報を削除します。 

:::warning
前者は Simple tab groups と併用すると問題が発生します。(コンテナ上で開く新しいタブが複製される)
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/cookie-autodelete/
:::

Cookie AutoDelete は、開いているブラウザタブで使用されなくなったときに自動的にCookieを削除します。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/decentraleyes/
:::

Decentraleyes は、Google Hosted Librariesなどからのリクエストを大幅に減らします。通常のコンテンツブロッカーを補完します。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/private-relay/
:::

Firefox Relay によって、自分のメールアドレスに紐付いたエイリアスメールアドレスを作ることができます。エイリアスメールアドレスに送信されたメッセージは、自分のメールアドレスの受信トレイに転送されます。いつでも削除でき、自分のメールアドレスを公開せずに済みます。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/10-minutes-disposable-email/
:::

10 minute mail は、10分間だけ有効な一時的なメールアドレスを生成します。一時的に試してみたいサービスのサインアップに便利です。

![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/4e632eb5-dcb7-6cff-2d40-0e926b0b0535.png 'width=300px')
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/flagfox/
:::

Flagfox は、現在のウェブサイトのサーバーの場所を示す国旗をサーチバーに表示します。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/privacy-badger17/
:::

Privacy Badger は、見えないトラッカーを自動的にブロックします。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/
:::

uBlock Origin は、低メモリ使用量と高パフォーマンスを備えた広告ブロッカーです。
広告ブロッカーとして意外にも、任意のウェブサイトの任意の要素を表示させないように設定することができます。右クリックから `Block element` を選択して表示させたくない要素を選ぶことができます。
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/webrtc-leak-shield/
:::

WebRTC Leak Shieldは、WebRTCリークを防止します。
![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/5c8fad46-3714-d3d2-f967-c47a6a30a683.png 'width=300px')

:::note
WebRTC は Web Real-Time Communication（Web リアルタイム通信）の略で、ブラウザ間で外部ソフトウェアやプラグインを必要とせずにインターネットを通じて音声やビデオ通信を直接行う技術です。ビデオ会議やリアルタイム通信には便利ですが、プライバシー上の問題として IP アドレスの漏洩も懸念されます。ブラウザで WebRTC を無効にすると、IP の漏洩を防ぐことができます。
:::
::::


### 3-4　アドオンショートカットの設定
![SCR-20230624-lyil.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/434920cc-7118-bc9a-30b0-55931cc9f72d.png)
![Untitled.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/d7613215-5a9b-b969-bbdf-c1fbce9329ea.png)
![SCR-20230624-lyxa-2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/f75baf1b-151c-67ce-a244-bbb39ef4fd99.png)


## 4　about:config
`about:config` ではさまざまな細かい設定を変更できます。

:::warning
`about:config` の項目はバージョンアップによって変更される場合があります。古いサイトにはすでに存在しない項目が挙げられている場合があります。
:::

1. まず、検索バーに `about:config` と入力してEnterキーを押してください。
2. 警告ページが表示されますが、そのままクリックして進めます。

- PDFプレビューをダークテーマにするには以下の設定を `2` に変更する
    ```
    pdfjs.viewerCssTheme    2
    ```
    
- ピンチ機能を有効にするには、以下の設定を `true` に変更する
    ```
    browser.gesture.pinch.latched    true
    ```

- ブックマークを新しいタブで開く
    ```
    browser.tabs.loadBookmarksInTabs    true
    ```
    
- 全てのテキストボックスでスペルチェックが有効になるように設定する
    ```
    layout.spellcheckDefault    2
    ```
    
- 最後のタブを閉じてもウィンドウは開いたままにする
    ```
    browser.tabs.closeWindowWithLastTab    false
    ```

- `userChrome.css` の適用を許可する
    ```
    toolkit.legacyUserProfileCustomizations.stylesheets    true
    ```

- `Compact view` を適用可能にする
    ```
    browser.compactmode.show    true
    ```

- アドオンを全てのサイトで利用可能にする
    ```
    extensions.webextensions.restrictedDomains （全部消す）
    ```
- フルスクリーンの遷移をスムーズにする
    ```
    full-screen-api.macos-native-full-screen	false
    full-screen-api.transition-duration.enter	0 0
    full-screen-api.transition-duration.leave	0 0
    ```

他にも色々変更できますので、各自で調べてみてください。



## 5　セキュリティ設定
### 5-1　安全なインターネット接続
- VPNを使用する
- [Cloudfare](https://developers.cloudflare.com/1.1.1.1/setup/)を有効にする
- ECHを有効にする
- WebRTCを無効にする

参考　[Firefox プライバシー - ArchWiki](https://wiki.archlinux.jp/index.php/Firefox_%E3%83%97%E3%83%A9%E3%82%A4%E3%83%90%E3%82%B7%E3%83%BC)

#### 5-1-1　VPN
仮想プライベートネットワーク（VPN）は、IPアドレスを隠したり、インターネットトラフィックを暗号化したり、地域制限のあるコンテンツにアクセスできるなどのメリットがあります。

#### 5-1-2　CloudflareでDoH（DNS-over-HTTPS）を有効にする
1. :btn[cmd] + :btn[,] で環境設定ページにアクセスします。
2. 「ネットワーク設定」までスクロールし、「設定...」をクリックします。
3. 「DNS over HTTPSを有効にする」を選択し、プロバイダーとして「Cloudflare」or「NextDNS」を選択します。
4. 「OK」をクリックしてタブを閉じます。

#### 5-1-3　ECH（Encrypted Client Hello）を有効にする
1. Firefoxを開き、`about:config` にアクセスします。
2. `network.dns` を検索します。
3. `network.dns.echconfig.enabled` を `true` に設定します。
4. `network.dns.http3_echconfig.enabled` を `true` に設定します。

#### 5-1-4　WebRTCを無効にする
:::note
WebRTCはWebリアルタイム通信の略で、ブラウザ間で外部ソフトウェアやプラグインを必要とせずにインターネットを通じて音声やビデオ通信を直接行う技術です。ビデオ会議やリアルタイム通信には便利ですが、プライバシー上の問題としてIPアドレスの漏洩も懸念されます。ブラウザでWebRTCを無効にすると、IPの漏洩を防ぐことができます。
:::

WebRTCを無効にする：
1. Firefoxを開き、`about:config` にアクセスします。
2. `media.peerconnection.enabled` を検索し、`false` に設定します。

[WebRTC Leak Shield](https://addons.mozilla.org/en-US/firefox/addon/webrtc-leak-shield/)：この拡張機能を使用すると、上記の設定を簡単に切り替えることができます。


### 5-2　テスト
- [Cloudflare Browser Check](https://www.cloudflare.com/ssl/encrypted-sni/#results)
- [WebRTC Test](https://ip8.com/webrtc-test)
- [DNS Leak Test](https://dnsleaktest.org/dns-leak-test)

[Cloudflare Browser Check](https://www.cloudflare.com/ssl/encrypted-sni/#results) をパスすると、以下のように表示されます。

![Untitled.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/e8831a94-67c6-524f-2c8f-a95637dd9cbb.png)



## 6　コンパクトビューの設定
### 6-1　コンパクトツールバー
最新のバージョンでは、`Compact view` を適用可能にするために、まず検索バーに `about:config` と入力して進み、次の設定に変更してください。
```
browser.compactmode.show    true
```

ツールバー上で右クリックして「ツールバーをカスタマイズ」を選び、下の画像で左下の「Density」をクリックして「コンパクト」を選択します。

![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/c595966f-bed6-f2cb-0a3e-528d5ab60bf3.png)


### 6-2　`userChrome.css` をカスタマイズする
`userChrome.css` を用いることで、ウィンドウの表示を自分の好みにカスタマイズできます。

1. まず、`userChrome.css` が適用されるように次の設定を変更します。
    1. 検索バーに `about:config` と入力して、Enter キーを押します。
    2. 警告ページが表示されますが、そのままクリックして進めます。
    3. `toolkit.legacyUserProfileCustomizations.stylesheets` を検索します。
    4. `false` になっていたら `true` に変更します。

2. 次に `chrome/userChrome.css` を作成します。
    1. まず以下のコードをターミナルで実行して、デスクトップ上に`chrome/userChrome.css` を作ります。
        ```bash
        mkdir ~/Desktop/chrome; cd ~/Desktop/chrome; touch userChrome.css
        ```
    2. 下の `/* compact view settings */` 以降のコードを `userChrome.css` に貼り付けます。
    3. Mac の場合、ファイルの場所が次のパスになるように配置します。
    `~/Library/Application\ Support/Firefox/Profiles/<****>.default-release/chrome/userChrome.css` (<****> は 8桁の英数字です)
サーチバーに about:support と入力すると下の画面が現れ、赤枠の部分の  Show in Finder をクリックすると開くことができます。
![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/21764530-dcd2-6d1d-adfa-40d04cbf0724.png)

    4. Firefox を再起動します。

```css[title=chrome/userChrome.css,showLineNumbers=true]
/* compact view settings */
/* compact bookmarks popup panel in toolbar */
#personal-bookmarks .bookmark-item,
#bookmarksMenuPopup .bookmark-item { max-width: 210px !important; }

/* compact "Show tabs from other devices" view in toolbar*/
#PanelUI-remotetabs,
#PanelUI-remotetabs-tabslist{
  height: flex !important;
  min-width: 100px !important;
  max-width: 210px !important;
}

/* compact library panel view in toolbar */
#appMenu-libraryView,
#PanelUI-history,
#PanelUI-bookmarks {
  min-width: 210px !important;
  max-width: 210px !important;
  max-height: 400px !important;
}

/* compact extensions panel view in toolbar */
#unified-extensions-panel panelview
{
  width: 210px !important;
  max-height: 500px !important;
}

/* compact 3-bar icon panel view in toolbar */
#appMenu-popup panelview,
#PanelUI-fxa {
  width: 210px !important;
}

/* compact alltabs button at top right corner */
#allTabsMenu-allTabsView {
  min-width: 100px !important;
  max-width: 210px !important;
}
```

その他：
```css
/* bring tabs below search bar */
#titlebar {
  order: 1 !important;
}

/* remove maximum/minimum width restriction of sidebar */
#sidebar-box {
  min-width: 0px !important;
  max-width: none !important;
}
```

以下のリンクには、さらに多くのカスタマイズがあります。
:::linkcard
https://github.com/MrOtherGuy/firefox-csshacks
:::

:::linkcard
https://github.com/Aris-t2/CustomCSSforFx
:::

## 7　その他
- [Firefox のキーボードショートカット](https://support.mozilla.org/ja/kb/keyboard-shortcuts-perform-firefox-tasks-quickly)
- :btn[cmd] を押しながら、リンクをクリックすると必ず新しいタブでリンクを開きます。


## 8　最後に
以上、僕が使っている範囲で Firefox の紹介をしてみました。他にもいい機能などあればコメントで教えていただけると嬉しいです。
ちなみに、Firefox のアドオンとして紹介したもののなかには Chrome の拡張機能としても提供されているものもあるので、Chrome をよく使っている方は探してみてください。

