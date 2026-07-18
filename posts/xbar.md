---
title: "xbarでMacのメニューバーをカスタマイズする"
date: "2025-10-18"
subtitle: "xbarをインストールし、プラグイン形式を理解して、実用的なツールを作る"
tags: [MacOS, Productivity]
---

[xbar](https://xbarapp.com/)は、実行可能なスクリプトやプログラムの出力をmacOSのメニューバーに表示する、無料でオープンソースのアプリケーションです。プラグインは数行のシェルスクリプトだけでも作れますが、ドロップダウンメニュー、リンク、アクションを備えたツールも作成できます。

この記事では、最小構成のプラグインから始め、xbarが読み取る形式を説明した後、天気、Mail、電源情報、カウントダウンタイマー、GitHub通知の実用的なプラグインを作ります。

:::linkcard
https://xbarapp.com/
:::


## xbarをインストールする

### Homebrew

```bash
brew install --cask xbar
```

### 直接ダウンロードする

[xbarのWebサイト](https://xbarapp.com/)または[GitHubのリリースページ](https://github.com/matryer/xbar/releases)から最新版をダウンロードし、xbarをアプリケーションフォルダへ移動します。

現在のxbarには、macOS Catalina 10.15以降が必要です。


## プラグインディレクトリを確認する

xbarは、ローカルにインストールしたプラグインを次のディレクトリへ保存します。

```text
~/Library/Application Support/xbar/plugins
```

最も簡単な確認方法は、xbarを開いて**Open Plugin Folder**を選択することです。Terminalから既定のディレクトリを開くこともできます。

```bash
open "$HOME/Library/Application Support/xbar/plugins"
```

xbarからインストールしたプラグインも同じディレクトリで管理されます。コミュニティのプラグインを探すには、xbarのメニューから**Plugin Browser**を選択します。

![xbarのプラグインブラウザ](/images/xbar-plugin-browser.jpeg "width=450px")


## 最小構成のプラグインを作る

次の内容で`hello.5m.sh`というファイルを作成します。

```bash[title=hello.5m.sh,showLineNumbers=true]
#!/usr/bin/env bash

printf 'Hello from xbar\n'
printf '%s\n' '---'
printf 'Open the xbar website | href=https://xbarapp.com/\n'
```

プラグインディレクトリへコピーし、実行権限を付けます。

```bash
PLUGIN_DIR="$HOME/Library/Application Support/xbar/plugins"
cp hello.5m.sh "$PLUGIN_DIR/hello.5m.sh"
chmod +x "$PLUGIN_DIR/hello.5m.sh"
```

xbarから**Refresh All**を選択します。メニューバーに`Hello from xbar`と表示され、ドロップダウンメニューにはxbarのWebサイトへのリンクが表示されます。


## プラグイン形式を理解する

### ファイル名と更新間隔

xbarは、プラグインのファイル名から更新間隔を読み取ります。

```text
name.interval.extension
```

よく使う時間の単位は次のとおりです。

- `ms`：ミリ秒。例：`500ms`
- `s`：秒。例：`30s`
- `m`：分。例：`5m`
- `h`：時間。例：`2h`
- `d`：日。例：`1d`

ファイル名は、例えば次のようになります。

```text
weather.30m.sh
email.1m.py
status.30s.js
```

更新間隔は、xbarのプラグインマネージャーから変更することもできます。`<xbar.refresh>`のような非公式のメタデータタグは必要ありません。定期更新の間隔はファイル名によって決まります。

### メニューバーとドロップダウンの出力

xbarのプラグインは、標準出力へプレーンテキストを書き出します。

```bash
printf 'Menu bar text\n'
printf '%s\n' '---'
printf 'First dropdown item\n'
printf 'Second dropdown item\n'
```

最初に現れる`---`だけの行が、メニューバーの出力とドロップダウンの出力を分けます。

- 最初の`---`より前の行は、メニューバーに表示されます。複数の行がある場合、xbarはそれらを順番に切り替えて表示します。
- 最初の`---`より後の行は、ドロップダウンメニューに表示されます。
- ドロップダウン内にある2つ目以降の`---`は、区切り線になります。
- `--`で始まる行は、サブメニューの項目になります。階層を1つ深くするたびに、ダッシュをさらに2つ追加します。

```bash
printf 'Parent item\n'
printf '%s\n' '--Child item'
printf '%s\n' '----Grandchild item'
```

### シバンと実行権限

スクリプトの先頭には、使用するインタープリターを指定するシバン（shebang）が必要です。xbarのプロジェクトでは、`/usr/bin/env`の使用を推奨しています。

```bash
#!/usr/bin/env bash
```

ファイルには実行権限も必要です。

```bash
chmod +x my-plugin.5m.sh
```


## リンク、アクション、書式を追加する

パイプ記号（`|`）の後にパラメーターを追加すると、メニュー項目の表示を変更したり、操作できるようにしたりできます。

### リンク

```bash
printf 'GitHub | href=https://github.com/\n'
```

### コマンド

実行ファイルを起動するには`shell=`を使い、引数を渡すには`param1=`、`param2=`のように記述します。

```bash
printf 'Open Mail | shell=/usr/bin/open param1=-a param2=Mail terminal=false\n'
printf 'Restart SystemUIServer | shell=/usr/bin/killall param1=SystemUIServer terminal=false refresh=true\n'
```

:::warning
名前とは異なり、以前から使われている`bash=`パラメーターは、シェルコマンドを自動的に解釈するものではありません。xbarは`bash=`を`shell=`の別名として受け付け、どちらも指定した実行ファイルを直接起動します。新しいプラグインでは、公式資料に記載されている`shell=`を使ってください。
:::

プラグイン自身を呼び出す場合、プラグインディレクトリのパスに空白が含まれるため、パスを引用符で囲みます。

```bash
printf 'Run again | shell="%s" terminal=false refresh=true\n' "$0"
```

よく使うアクション用のパラメーターは次のとおりです。

- `shell=`：起動する実行ファイル
- `param1=`、`param2=`、...：実行ファイルへ渡す引数
- `terminal=true`：Terminalでコマンドを実行する
- `refresh=true`：アクションの終了後にプラグインを更新する
- `href=`：URLを開く
- `disabled=true`：クリックできないメニュー項目として表示する

### テキストと画像

```bash
printf 'Warning | color=#D70022 font=Menlo-Bold size=13\n'
printf 'Status | templateImage=BASE64_ENCODED_TEMPLATE_IMAGE\n'
printf 'Preview | image=BASE64_ENCODED_IMAGE\n'
```

xbarでは、色名または16進数の色、インストール済みフォントの名前、フォントサイズ、Base64でエンコードした画像を指定できます。一部のSwiftBarプラグインで使われている`sfimage=`パラメーターには、xbarは対応していません。


## メタデータとユーザー設定を追加する

メタデータには、xbarやコミュニティのプラグインリポジトリで表示するプラグインの情報を記述します。

```bash
# <xbar.title>Weather</xbar.title>
# <xbar.version>v1.0.0</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Shows the current weather in the menu bar.</xbar.desc>
# <xbar.dependencies>bash,curl</xbar.dependencies>
```

個人で使うローカルプラグインでは、メタデータは任意です。コミュニティのリポジトリへ投稿するプラグインには、公式のコントリビューションガイドに記載されている完全なメタデータが必要です。

プラグインマネージャーから変更できる設定を追加するには、`xbar.var`メタデータを使います。

```bash
# <xbar.var>string(VAR_LOCATION="Tokyo"): Location used for the weather report.</xbar.var>

LOCATION="${VAR_LOCATION:-Tokyo}"
```

選択した値は、xbarがプラグインを実行するときに環境変数として渡されます。

:::warning
xbarの変数は、プラグインと同じ場所にあるJSONファイルへ保存されます。通常の設定には便利ですが、パスワードやAPIトークンを安全に保存する仕組みではありません。機密情報にはmacOSのキーチェーンを使ってください。
:::


## 例1：天気

このプラグインは[wttr.in](https://wttr.in/)を利用し、ネットワーク通信に失敗してもメニューバーが空にならないように処理します。

```bash[title=weather.30m.sh,showLineNumbers=true]
#!/usr/bin/env bash
# <xbar.title>Weather</xbar.title>
# <xbar.version>v1.0.0</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Shows the current weather in the menu bar.</xbar.desc>
# <xbar.dependencies>bash,curl</xbar.dependencies>
# <xbar.var>string(VAR_LOCATION="Tokyo"): Location used for the weather report.</xbar.var>

set -u

LOCATION="${VAR_LOCATION:-Tokyo}"
LOCATION_PATH=${LOCATION// /+}
URL="https://wttr.in/${LOCATION_PATH}?format=%c+%t"

if WEATHER=$(/usr/bin/curl --fail --silent --show-error --max-time 10 "$URL" 2>/dev/null); then
  printf '🌡️ %s\n' "$WEATHER"
else
  printf '🌡️ Unavailable\n'
fi

printf '%s\n' '---'
printf 'Location: %s\n' "$LOCATION"
printf 'Refresh | refresh=true\n'
printf 'Open wttr.in | href=https://wttr.in/%s\n' "$LOCATION_PATH"
```

ファイル名の`30m`により、30分ごとに更新されます。メニューのRefresh項目を使うと、すぐに更新できます。


## 例2：Mailの未読件数

次のプラグインは、AppleScriptを使ってMailへ問い合わせます。Mailへのアクセスに失敗したときも、何も表示せず終了するのではなく、状況がわかるエラーを表示します。

```bash[title=mail-unread.1m.sh,showLineNumbers=true]
#!/usr/bin/env bash
# <xbar.title>Mail Unread Count</xbar.title>
# <xbar.version>v1.0.0</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Shows the unread count from Mail.</xbar.desc>
# <xbar.dependencies>bash,osascript,open</xbar.dependencies>

set -u

if UNREAD=$(/usr/bin/osascript \
  -e 'tell application "Mail"' \
  -e 'unread count of inbox' \
  -e 'end tell' 2>/dev/null); then
  case "$UNREAD" in
    ''|*[!0-9]*) UNREAD=0 ;;
  esac
  printf '📥 %s\n' "$UNREAD"
  ERROR_MESSAGE=""
else
  printf '📥 ?\n'
  ERROR_MESSAGE="Mail access failed"
fi

printf '%s\n' '---'

if [ -n "$ERROR_MESSAGE" ]; then
  printf '%s | color=red disabled=true\n' "$ERROR_MESSAGE"
elif [ "$UNREAD" -eq 0 ]; then
  printf 'No unread mail | disabled=true\n'
fi

printf 'Open Mail | shell=/usr/bin/open param1=-a param2=Mail terminal=false\n'
```

初回実行時には、Mailを操作する権限を求められる場合があります。アクセスを拒否した場合は、**システム設定 → プライバシーとセキュリティ → オートメーション**にあるxbarの設定を確認してください。


## 例3：電源とアダプターの定格

このプラグインは、バッテリー残量と、接続した電源アダプターから報告されるワット数を表示します。

```bash[title=power-source.5m.sh,showLineNumbers=true]
#!/usr/bin/env bash
# <xbar.title>Power Source</xbar.title>
# <xbar.version>v1.0.0</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Shows battery percentage and the connected adapter rating.</xbar.desc>
# <xbar.dependencies>bash,pmset,system_profiler</xbar.dependencies>

set -u

BATTERY_OUTPUT=$(/usr/bin/pmset -g batt 2>/dev/null)
BATTERY=$(printf '%s\n' "$BATTERY_OUTPUT" | /usr/bin/grep -Eo '[0-9]+%' | /usr/bin/head -n 1)
BATTERY=${BATTERY:-?%}

POWER_SOURCE=$(printf '%s\n' "$BATTERY_OUTPUT" | /usr/bin/head -n 1)

if [[ "$POWER_SOURCE" == *"AC Power"* ]]; then
  WATTAGE=$(/usr/sbin/system_profiler SPPowerDataType 2>/dev/null | \
    /usr/bin/awk '/Wattage \(W\)/ {print $3; exit}')
  if [ -n "$WATTAGE" ]; then
    printf '⚡ %s W · %s\n' "$WATTAGE" "$BATTERY"
  else
    printf '🔌 %s\n' "$BATTERY"
  fi
else
  printf '🔋 %s\n' "$BATTERY"
fi
```

`system_profiler`が表示するのは、電源アダプターの定格として報告されたワット数であり、Macが実際に消費している瞬間的な電力ではありません。また、比較的時間のかかるコマンドを頻繁に実行しないよう、更新間隔を5分にしています。


## 例4：カウントダウンタイマー

このタイマーがキャッシュディレクトリへ保存するのは、検証済みのUnixタイムスタンプだけです。状態ファイルをシェルコードとして実行せず、途中まで書き込まれたデータが見えないようにアトミックに保存します。

```bash[title=countdown.1s.sh,showLineNumbers=true]
#!/usr/bin/env bash
# <xbar.title>Countdown Timer</xbar.title>
# <xbar.version>v2.0.0</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Provides a configurable countdown timer.</xbar.desc>
# <xbar.dependencies>bash,osascript</xbar.dependencies>

set -u

CACHE_DIR="$HOME/Library/Caches/xbar"
STATE_FILE="$CACHE_DIR/countdown.state"

now() {
  /bin/date +%s
}

notify() {
  /usr/bin/osascript \
    -e "display notification \"$2\" with title \"$1\"" \
    >/dev/null 2>&1
}

read_state() {
  END_TIME=0
  value=""

  if [ -r "$STATE_FILE" ]; then
    IFS= read -r value < "$STATE_FILE" || true
  fi

  case "$value" in
    ''|*[!0-9]*) END_TIME=0 ;;
    *) END_TIME=$value ;;
  esac
}

write_state() {
  /bin/mkdir -p "$CACHE_DIR"
  umask 077

  temporary_file="${STATE_FILE}.$$"
  printf '%s\n' "$1" > "$temporary_file"
  /bin/mv "$temporary_file" "$STATE_FILE"
}

parse_seconds() {
  value=$1

  if [[ "$value" =~ ^([0-9]+)([hms])$ ]]; then
    number=$((10#${BASH_REMATCH[1]}))
    unit=${BASH_REMATCH[2]}

    case "$unit" in
      h) printf '%s\n' "$((number * 3600))" ;;
      m) printf '%s\n' "$((number * 60))" ;;
      s) printf '%s\n' "$number" ;;
    esac
  elif [[ "$value" =~ ^[0-9]+$ ]]; then
    number=$((10#$value))
    printf '%s\n' "$((number * 60))"
  else
    return 1
  fi
}

start_timer() {
  if ! duration=$(parse_seconds "$1"); then
    notify "xbar Timer" "Use a duration such as 25m, 90s, or 1h."
    return 1
  fi

  write_state "$(( $(now) + duration ))"
}

case "${1:-}" in
  start)
    start_timer "${2:-25m}" || true
    exit 0
    ;;
  custom)
    input=$(/usr/bin/osascript \
      -e 'display dialog "Enter a duration such as 25m, 90s, or 1h:" default answer "10m" with title "xbar Timer" buttons {"Cancel", "Start"} default button "Start"' \
      -e 'text returned of result' 2>/dev/null) || exit 0
    start_timer "$input" || true
    exit 0
    ;;
  reset)
    /bin/rm -f "$STATE_FILE"
    exit 0
    ;;
esac

read_state
CURRENT_TIME=$(now)

if [ "$END_TIME" -gt "$CURRENT_TIME" ]; then
  REMAINING=$((END_TIME - CURRENT_TIME))
  HOURS=$((REMAINING / 3600))
  MINUTES=$(((REMAINING % 3600) / 60))
  SECONDS=$((REMAINING % 60))

  if [ "$HOURS" -gt 0 ]; then
    printf -v DISPLAY '%02d:%02d:%02d' "$HOURS" "$MINUTES" "$SECONDS"
  else
    printf -v DISPLAY '%02d:%02d' "$MINUTES" "$SECONDS"
  fi
elif [ "$END_TIME" -gt 0 ]; then
  /bin/rm -f "$STATE_FILE"
  notify "xbar Timer" "Timer finished."
  DISPLAY="Done"
else
  DISPLAY="⏱"
fi

printf '%s | font=Menlo\n' "$DISPLAY"
printf '%s\n' '---'
printf 'Start 25 minutes | shell="%s" param1=start param2=25m terminal=false refresh=true\n' "$0"
printf 'Start 5 minutes | shell="%s" param1=start param2=5m terminal=false refresh=true\n' "$0"
printf 'Custom duration | shell="%s" param1=custom terminal=false refresh=true\n' "$0"
printf 'Reset | shell="%s" param1=reset terminal=false refresh=true\n' "$0"
```

ファイル名に`1s`が含まれるため、xbarは表示部分を1秒ごとに実行します。ボタンのアクションは状態を更新または削除し、その直後に再表示を要求します。


## 例5：GitHub通知

この例では、macOSのキーチェーンからトークンを読み取り、HTTP通信の失敗を処理し、GitHubから配列が返されたことを確認してから通知数を数えます。

`jq`が必要です。`brew install jq`でインストールできます。

まず、トークンをプラグインへ書き込まずに、Terminalから一度だけキーチェーンへ保存します。

```bash
read -r -s -p "GitHub token: " TOKEN
printf '\n'
/usr/bin/security add-generic-password \
  -U -a "$USER" -s "xbar-github-token" -w "$TOKEN"
unset TOKEN
```

次に、プラグインを作成します。

```bash[title=github-notifications.5m.sh,showLineNumbers=true]
#!/usr/bin/env bash
# <xbar.title>GitHub Notifications</xbar.title>
# <xbar.version>v1.0.0</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Shows up to 100 unread GitHub notifications.</xbar.desc>
# <xbar.dependencies>bash,curl,jq,security</xbar.dependencies>

set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

if ! command -v jq >/dev/null 2>&1; then
  printf '🔔 ?\n'
  printf '%s\n' '---'
  printf 'jq is not installed | color=red disabled=true\n'
  exit 0
fi

if ! TOKEN=$(/usr/bin/security find-generic-password \
  -a "$USER" -s "xbar-github-token" -w 2>/dev/null); then
  printf '🔔 ?\n'
  printf '%s\n' '---'
  printf 'GitHub token is not configured | color=red disabled=true\n'
  exit 0
fi

API_URL="https://api.github.com/notifications?per_page=100"

if ! RESPONSE=$(/usr/bin/curl \
  --fail --silent --show-error --max-time 15 \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  "$API_URL" 2>/dev/null); then
  printf '🔔 ?\n'
  printf '%s\n' '---'
  printf 'GitHub request failed | color=red disabled=true\n'
  exit 0
fi

COUNT=$(printf '%s' "$RESPONSE" | jq \
  'if type == "array" then length else 0 end')

if [ "$COUNT" -gt 0 ]; then
  printf '🔔 %s\n' "$COUNT"
else
  printf '🔕\n'
fi

printf '%s\n' '---'
printf 'GitHub Notifications | href=https://github.com/notifications\n'
printf 'Refresh | refresh=true\n'
```


## 信頼できるプラグインを作る

### 状況がわかる出力を必ず表示する

何も出力せずにプラグインが終了すると、メニューバーの項目が消えたり、古い出力が残ったりすることがあります。想定できる失敗を処理し、短い状態表示と詳しい説明をドロップダウンに出力します。

```bash
if ! DATA=$(fetch_data); then
  printf '⚠️ Unavailable\n'
  printf '%s\n' '---'
  printf 'Could not update data | color=red disabled=true\n'
  exit 0
fi
```

`set -e`は、この処理の代わりにはなりません。多くの場合、利用者向けの出力を作らずに失敗時点で終了してしまいます。

### `PATH`を明示する

xbarはGUIアプリケーションであるため、対話的なシェルと同じ`PATH`を受け取るとは限りません。`jq`などの追加コマンドを使う場合は、Intel MacとAppleシリコンMacのHomebrew用ディレクトリを追加します。

```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
```

macOS標準のツールには、`/usr/bin/osascript`のような絶対パスを指定すると、さらに明確です。

### タイムアウトとキャッシュを使う

ネットワーク通信を1秒ごとに実行しないでください。ファイル名で適切な更新間隔を選び、`curl`などのコマンドにはタイムアウトを設定し、必要に応じて処理に時間のかかる結果をキャッシュします。

```bash
CACHE_DIR="$HOME/Library/Caches/xbar"
CACHE_FILE="$CACHE_DIR/weather.txt"
CACHE_TTL=300

/bin/mkdir -p "$CACHE_DIR"

if [ -r "$CACHE_FILE" ]; then
  MODIFIED=$(/usr/bin/stat -f %m "$CACHE_FILE" 2>/dev/null || printf '0')
  AGE=$(( $(/bin/date +%s) - MODIFIED ))

  if [ "$AGE" -lt "$CACHE_TTL" ]; then
    /bin/cat "$CACHE_FILE"
    exit 0
  fi
fi
```

キャッシュは、ほかの利用者も使う`/tmp`内の予測可能なファイル名ではなく、`~/Library/Caches/xbar`へ保存します。

### 機密情報を保護する

トークンやパスワードをプラグインへ直接書き込まないでください。macOSのキーチェーンを使い、デバッグ出力にも機密情報を含めないようにします。`xbar.var`の値はプラグインの隣へ保存されるため、機密ではない設定だけに使います。


## トラブルシューティング

### プラグインが表示されない

ファイルが正しいディレクトリにあることを確認します。

```bash
PLUGIN_DIR="$HOME/Library/Application Support/xbar/plugins"
ls -l "$PLUGIN_DIR"
```

次に、実行権限とシバンを確認します。

```bash
chmod +x "$PLUGIN_DIR/my-plugin.5m.sh"
head -n 1 "$PLUGIN_DIR/my-plugin.5m.sh"
```

### プラグインでエラーが表示される

プラグインを直接実行し、標準出力とエラーメッセージを確認します。

```bash
"$HOME/Library/Application Support/xbar/plugins/my-plugin.5m.sh"
```

スクリプトを実行せず、Bashの構文だけを確認することもできます。

```bash
bash -n "$HOME/Library/Application Support/xbar/plugins/my-plugin.5m.sh"
```

Terminalでは動くのにxbarでは動かない場合は、`PATH`と実行ファイルの絶対パスを確認します。また、必要なオートメーション、ファイルとフォルダ、通知の権限がシステム設定で許可されていることも確認してください。

### メニューバーが混み合っている

次のmacOS設定は、xbarだけでなく、メニューバーにあるすべてのステータス項目の間隔を変更します。macOSの公式資料に記載されていない設定であり、リリースによって動作が異なる可能性があります。

```bash
defaults -currentHost write -globalDomain NSStatusItemSpacing -int 6
```

反映するには、サインアウトしてからもう一度サインインします。数値を大きくすると間隔が広がり、小さくすると狭くなります。


## 参考資料

:::linkcard
https://github.com/matryer/xbar
:::

:::linkcard
https://github.com/matryer/xbar-plugins/blob/main/CONTRIBUTING.md
:::

:::linkcard
https://xbarapp.com/docs/2021/03/14/variables-in-xbar.html
:::


## 次のステップ

まずは一目で確認できると便利な値を1つ選び、処理内容に適した更新間隔を設定します。ドロップダウンのアクションは、操作が実際に簡単になる場合だけ追加しましょう。基本的なプラグインが動作したら、日常的に使い始める前に、明示的なエラー処理、タイムアウト、安全な設定方法を追加してください。
