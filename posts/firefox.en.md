---
title: "Firefox"
date: "2024-10-31"
subtitle: "A Comprehensive Guide to Firefox"
tags: [Productivity]
---

## 0. Firefox is Quite User-Friendly
While new browsers are constantly being hyped, after using all available browsers, I find Firefox to be quite convenient. I'm writing this article as a thank you to the developers. If you haven't tried it yet, please install it and give it a try.

:::linkcard
https://www.mozilla.org/en-US/firefox/new/
:::


## 1. Changing Settings
You can open the preferences page with :btn[cmd] + :btn[,]. Initially, it's good to import data from the browser you're currently using. You can also adjust other settings to your preference on this page.

![Settings Screenshot](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/e1d72bc2-3ec1-2a16-bbce-7a1917f1eaac.png)



## 2. Useful Features
Below is a simple list of Firefox's useful features. Some of these are explained in more detail later.

1. [Rich extensions (add-ons)](https://addons.mozilla.org/en-US/firefox/)

2. Easily customizable toolbar. Right-click on the toolbar and select "Customize Toolbar" to see the following screen. You can add and remove icons using drag and drop.
    ![Toolbar Customization](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/a9a7b421-b8ce-c5df-6ccf-66c7e65bcd22.png)
    
3. Sidebar: Provides easy access to various information:
    - Bookmarks
    - Browsing history
    - Synced tabs
    - `Simple Tab Groups` (extension)
    You can group and organize tabs. Tabs are saved even when you close the window.
    - AI Chatbot: Check `AI chatbot` in the `Firefox Labs` section of the settings page. If you check `Show prompts on text select`, you can immediately send selected text to your specified language model on any site.
![AI Chatbot](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/1cf9631d-ee94-7fa8-a753-b69aede5628b.png)

4. Multi-Account Containers
You can log in to the same site with different accounts simultaneously. For example, in one tab, you can log in to a site with your work account, and in another tab, you can log in to the same site with your personal account.

5. Screenshots: :btn[cmd] + :btn[shift] + :btn[S]
You can select the range of screenshots in four ways:
    - Select the range yourself
    - Automatically select part of the page where the cursor is
    - Select the entire visible range
    - Select the entire scrollable range
![Screenshot Tool](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/90edc24f-23d0-6f96-520c-d8a829745611.png)

6. Reader View: :btn[opt] + :btn[cmd] + :btn[R]
Removes unnecessary elements from web pages and improves readability.

7. Device synchronization

8. Customize the browser's appearance with `userChrome.css`.




## 3. [Add-ons (Extensions)](https://addons.mozilla.org/en-US/firefox/)
:::warning
Certain combinations of add-ons may cause unexpected behavior. In such cases, temporarily disable the suspected add-on, restart Firefox, and see which add-on is causing the issue. Once you identify which add-ons are conflicting, it's good to report the issue on the GitHub repository.
:::

### 3-1. Productivity Related

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/bitwarden-password-manager/
:::

Bitwarden is a free, convenient open-source password manager. To use this extension, you need to install the desktop app.
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/9983d16d-9b5b-8f03-7683-9c3831f45387.png "width=300px")
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/darkreader/
:::

Dark Reader displays websites in dark mode, making them easier to read. You can toggle it with :btn[opt] + :btn[D].

:::note
Dark Reader doesn't work on Firefox's PDF viewer. You can use the `doqment` add-on mentioned next or use the following Bookmarklet (JavaScript function registered as a bookmark link). This Bookmarklet inverts colors for regular web pages and just inverts the PDF colors when viewing PDFs (run it twice to revert). For dark mode background in the PDF viewer, see section `4 about:config`.
```
javascript:(function(){var L='style_combined',S='#viewerContainer>#viewer.pdfViewer>.page{filter:%20invert(93%)}',E=document.querySelector('style[id="'+L+'"]');if(E){E.disabled=!E.disabled}else{var%20css='html%20{-webkit-filter:%20invert(90%);-moz-filter:%20invert(100%);-o-filter:%20invert(100%);-ms-filter:%20invert(100%);%20}',head=document.getElementsByTagName('head')[0],style=document.createElement('style');if(!window.counter){window.counter=1}else{window.counter++;if(window.counter%2==0){css='html%20{-webkit-filter:%20invert(0%);-moz-filter:%20invert(0%);-o-filter:%20invert(0%);-ms-filter:%20invert(0%);%20}'}}style.type='text/css';style.id=L;style.innerHTML=document.querySelector('#viewerContainer>#viewer.pdfViewer')?S:css;head.appendChild(style)}})()
```
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/doqment/
:::

doqment can change the PDF color to make it easier to view in the PDF viewer.
:::warning
When this extension is enabled while viewing PDFs, you cannot use the `Zotero Connector` mentioned later. There is no issue when viewing non-PDF content.
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/duplicate-tab-shortcut/
:::

With Duplicate Tabs Shortcut, you can duplicate tabs using the keyboard shortcut :btn[Alt] + :btn[shift] + :btn[D] on Windows/Linux or :btn[opt] + :btn[shift] + :btn[D] on Mac.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/google-shortcuts-all-google-se/
:::

G App Launcher displays shortcuts to all Google services, such as Gmail, Google Drive, Google Calendar, Google Maps, Google Translate, and more.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/languagetool/
:::

Grammar and Spell Checker - LanguageTool checks for spelling and grammar issues anywhere on the web.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/keepa/
:::

Keepa.com - Amazon Price Tracker displays price history graphs for Amazon products.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/
:::

Multi-Account Containers allows you to use multiple accounts on the same website simultaneously. It is compatible with Simple Tab Groups mentioned later. (You might be able to use the minimal container functionality without this add-on.)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/open_in_sidebar/
:::

Open in Sidebar allows you to display another website in the sidebar. It's convenient to register default pages to open [:btn[cmd] + :btn[,] -> Extensions & Themes -> `Open in Sidebar` -> Preferences] and register a shortcut to open this extension in the sidebar. See item 3-4 below for registration methods.

:::warning
There is a similar add-on called `Side View`, but using it prevents YouTube Music from playing in the background.
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/print-edit-we/
:::

Print Edit WE allows you to edit web page content in print preview mode. For example, you can remove ad sections before printing.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/simple-tab-groups/
:::

Simple Tab Groups is possibly the most useful add-on. It allows you to group and organize tabs. You can quickly switch between groups, preventing you from getting lost among many tabs. Groups and their tabs are also retained when you close the browser.
It's also compatible with `Multi-Account Containers`, and you can set which container to open tabs in for each group. It's convenient to register a shortcut to open this extension in the sidebar. See item 3-4 below for registration methods.
![SCR-20240503-edyg.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/956c38a0-bf42-a3ab-3100-e4346319772c.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/simple-translate/
:::

Simple Translate is a simple and lightweight translation tool. It translates selected text and displays it in a popup window. To translate to your preferred language, change the "target language" in the settings screen.
![SCR-20230624-oicn.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/b69b195f-07bc-5d2d-a655-92ca875a0983.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/single-file/
:::

SingleFile allows you to save a complete page as a single HTML file, including CSS, images, fonts, frames, etc. You can annotate before saving and save not just the entire page but also just a selected area.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/swift-selection-search/
:::

Swift Selection Search displays a popup for selected text, allowing you to search using your preferred search engine.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/tabliss/
:::

Tabliss is a new tab extension with beautiful backgrounds and multiple widgets. `Unsplash` is recommended for backgrounds.
![SCR-20230624-oilx.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/859d212e-b3ba-5c20-ec0c-3b573da2024f.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
:::

Tampermonkey is an extension that allows users to run their own JavaScript. You can also install features [already created by other users](https://openuserjs.org/). For example, [tumpio / Endless Google](https://openuserjs.org/scripts/tumpio/Endless_Google) automatically loads Google search results downward, eliminating the need to click the next page link.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/
:::

Wappalyzer displays the technologies used on websites.
::::

::::simple
:::linkcard
https://www.zotero.org/download/connectors
:::

Zotero Connector automatically detects content in your web browser and allows you to add it to your Zotero library with one click. The [Zotero](https://www.zotero.org/) app itself is very helpful for literature management.
![zotero-connector.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/fb3c63c1-6de7-2236-ddd8-7ea5f2189985.png#center)
::::

### 3-2. YouTube Related
::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/enhancer-for-youtube/
:::

Enhancer for YouTube adds many useful features to YouTube, including video playback speed control, cinema mode, screenshots, and more. You can fine-tune video speed in intervals of 0.05 from (0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1) and go beyond 2x speed.
![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/0d3eb5df-c088-e883-d43b-67e94801d644.png)
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/videospeed/
:::

Video Speed Controller offers video playback speed control, skip functions, and pause capabilities, but unlike `Enhancer for YouTube`, it works on any video, not just YouTube, including Amazon Prime, with simple keyboard shortcuts. Video speed can be finely adjusted and set to more than 2x.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/youtube-audio/
:::

Youtube Audio allows you to play only the audio of YouTube videos, reducing memory consumption.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/youtube-comment-translate/
:::

YouTube™ Comment Translate displays an icon in the top right of each YouTube comment, which when clicked translates the comment.
::::

::::simple
Ad Blockers: As mentioned in the next security section, either of the following can remove YouTube ads:

:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/adblocker-ultimate/
:::

:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/
:::
::::


### 3-3. Security Related
::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/adblocker-ultimate/
:::

AdBlocker Ultimate removes all ads and tracking from web pages.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/canvasblocker/
:::

CanvasBlocker can prevent websites from fingerprinting using the Javascript API.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/clearurls/
:::
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/neat-url/
:::

ClearURLs or Neat URL removes unnecessary information from URLs.

:::warning
The former may cause issues when used with Simple Tab Groups (duplicating new tabs opened in containers).
:::
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/cookie-autodelete/
:::

Cookie AutoDelete automatically deletes cookies when they are no longer used by open browser tabs.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/decentraleyes/
:::

Decentraleyes significantly reduces requests from sources like Google Hosted Libraries. It complements regular content blockers.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/private-relay/
:::

Firefox Relay allows you to create alias email addresses linked to your email address. Messages sent to the alias email address are forwarded to your inbox. You can delete them at any time, avoiding the need to share your actual email address.
:::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/10-minutes-disposable-email/
:::

10 minute mail generates a temporary email address valid for only 10 minutes. It's useful for signing up for services you just want to try temporarily.

![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/4e632eb5-dcb7-6cff-2d40-0e926b0b0535.png 'width=300px')
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/flagfox/
:::

Flagfox displays a country flag in the search bar indicating the location of the current website's server.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/privacy-badger17/
:::

Privacy Badger automatically blocks invisible trackers.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/
:::

uBlock Origin is an ad blocker with low memory usage and high performance.
Surprisingly, as an ad blocker, it can be set to hide any element on any website. You can select elements you don't want to display by right-clicking and selecting `Block element`.
::::

::::simple
:::linkcard
https://addons.mozilla.org/en-US/firefox/addon/webrtc-leak-shield/
:::

WebRTC Leak Shield prevents WebRTC leaks.
![](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/5c8fad46-3714-d3d2-f967-c47a6a30a683.png 'width=300px')

:::note
WebRTC stands for Web Real-Time Communication and is a technology that allows direct voice and video communication between browsers over the internet without requiring external software or plugins. While convenient for video conferences and real-time communication, there are privacy concerns about IP address leakage. Disabling WebRTC in your browser can prevent IP leakage.
:::
::::

### 3-4. Setting Add-on Shortcuts
![SCR-20230624-lyil.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/434920cc-7118-bc9a-30b0-55931cc9f72d.png)
![Untitled.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/d7613215-5a9b-b969-bbdf-c1fbce9329ea.png)
![SCR-20230624-lyxa-2.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/f75baf1b-151c-67ce-a244-bbb39ef4fd99.png)


## 4. about:config
`about:config` allows you to change various detailed settings.

:::warning
The `about:config` items may change with version updates. Older sites may list items that no longer exist.
:::

1. First, type `about:config` in the search bar and press Enter.
2. A warning page will appear, but proceed by clicking through.

- To set PDF preview to dark theme, change the following setting to `2`
    ```
    pdfjs.viewerCssTheme    2
    ```
    
- To enable pinch functionality, change the following setting to `true`
    ```
    browser.gesture.pinch.latched    true
    ```

- Open bookmarks in a new tab
    ```
    browser.tabs.loadBookmarksInTabs    true
    ```
    
- Enable spell checking in all text boxes
    ```
    layout.spellcheckDefault    2
    ```
    
- Keep the window open even when the last tab is closed
    ```
    browser.tabs.closeWindowWithLastTab    false
    ```

- Allow applying `userChrome.css`
    ```
    toolkit.legacyUserProfileCustomizations.stylesheets    true
    ```

- Make `Compact view` applicable
    ```
    browser.compactmode.show    true
    ```

- Make add-ons available on all sites
    ```
    extensions.webextensions.restrictedDomains （delete all）
    ```
- Make fullscreen transitions smooth
    ```
    full-screen-api.macos-native-full-screen	false
    full-screen-api.transition-duration.enter	0 0
    full-screen-api.transition-duration.leave	0 0
    ```

There are many other settings you can change, so feel free to explore.

## 5. Security Settings
### 5-1. Secure Internet Connection
- Use a VPN
- Enable [Cloudflare](https://developers.cloudflare.com/1.1.1.1/setup/)
- Enable ECH
- Disable WebRTC

Reference: [Firefox Privacy - ArchWiki](https://wiki.archlinux.org/title/Firefox/Privacy)

#### 5-1-1. VPN
A Virtual Private Network (VPN) offers benefits such as hiding your IP address, encrypting internet traffic, and accessing region-restricted content.

#### 5-1-2. Enable DoH (DNS-over-HTTPS) with Cloudflare
1. Access the preferences page with :btn[cmd] + :btn[,].
2. Scroll down to "Network Settings" and click "Settings...".
3. Select "Enable DNS over HTTPS" and choose "Cloudflare" or "NextDNS" as the provider.
4. Click "OK" to close the tab.

#### 5-1-3. Enable ECH (Encrypted Client Hello)
1. Open Firefox and access `about:config`.
2. Search for `network.dns`.
3. Set `network.dns.echconfig.enabled` to `true`.
4. Set `network.dns.http3_echconfig.enabled` to `true`.

#### 5-1-4. Disable WebRTC
:::note
WebRTC stands for Web Real-Time Communication and is a technology that allows direct voice and video communication between browsers over the internet without requiring external software or plugins. While convenient for video conferences and real-time communication, there are privacy concerns about IP address leakage. Disabling WebRTC in your browser can prevent IP leakage.
:::

To disable WebRTC:
1. Open Firefox and access `about:config`.
2. Search for `media.peerconnection.enabled` and set it to `false`.

[WebRTC Leak Shield](https://addons.mozilla.org/en-US/firefox/addon/webrtc-leak-shield/): This extension allows you to easily toggle the above setting.

### 5-2. Testing
- [Cloudflare Browser Check](https://www.cloudflare.com/ssl/encrypted-sni/#results)
- [WebRTC Test](https://ip8.com/webrtc-test)
- [DNS Leak Test](https://dnsleaktest.org/dns-leak-test)

When you pass the [Cloudflare Browser Check](https://www.cloudflare.com/ssl/encrypted-sni/#results), it will be displayed as follows:

![Untitled.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/e8831a94-67c6-524f-2c8f-a95637dd9cbb.png)

## 6. Compact View Settings
### 6-1. Compact Toolbar
In the latest version, to enable `Compact view`, first type `about:config` in the search bar and proceed, then change the following setting:
```
browser.compactmode.show    true
```

Right-click on the toolbar and select "Customize Toolbar", then click "Density" in the bottom left of the image below and select "Compact".

![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/c595966f-bed6-f2cb-0a3e-528d5ab60bf3.png)

### 6-2. Customize `userChrome.css`
You can customize the window display to your liking using `userChrome.css`.

1. First, change the following setting to allow `userChrome.css` to be applied:
    1. Type `about:config` in the search bar and press Enter.
    2. A warning page will appear, but proceed by clicking through.
    3. Search for `toolkit.legacyUserProfileCustomizations.stylesheets`.
    4. If it's set to `false`, change it to `true`.

2. Next, create `chrome/userChrome.css`:
    1. First, run the following code in the terminal to create `chrome/userChrome.css` on your desktop:
        ```bash
        mkdir ~/Desktop/chrome; cd ~/Desktop/chrome; touch userChrome.css
        ```
    2. Paste the code following `/* compact view settings */` below into `userChrome.css`.
    3. For Mac, place the file at the following path:
    `~/Library/Application\ Support/Firefox/Profiles/<****>.default-release/chrome/userChrome.css` (<****> is an 8-digit alphanumeric string)
    You can access this by typing about:support in the search bar and clicking "Show in Finder" in the red box area shown below:
![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/21764530-dcd2-6d1d-adfa-40d04cbf0724.png)

    4. Restart Firefox.

```css
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

Other options:
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

The following links have even more customizations:
:::linkcard
https://github.com/MrOtherGuy/firefox-csshacks
:::

:::linkcard
https://github.com/Aris-t2/CustomCSSforFx
:::

## 7. Other Tips
- [Firefox Keyboard Shortcuts](https://support.mozilla.org/ja/kb/keyboard-shortcuts-perform-firefox-tasks-quickly)
- Holding :btn[cmd] while clicking a link will always open the link in a new tab.


## 8. Conclusion
Above, I've introduced Firefox based on my personal experience. If you know of other good features, please let me know in the comments.
By the way, many of the Firefox add-ons introduced here are also available as Chrome extensions, so if you often use Chrome, feel free to look for them.