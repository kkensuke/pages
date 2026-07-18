---
title: "xbar: Customize Your Mac Menu Bar with Scripts"
date: "2025-10-18"
subtitle: "Install xbar, Understand Its Plugin Format, and Build Reliable Menu Bar Tools"
tags: [MacOS, Productivity]
---

[xbar](https://xbarapp.com/) is a free and open-source macOS application that displays the output of executable scripts and programs in the menu bar. A plugin can be as small as a few lines of shell script, but it can also provide dropdown menus, links, and actions.

This guide starts with a minimal plugin, explains the format xbar expects, and then develops practical plugins for weather, Mail, power information, a countdown timer, and GitHub notifications.

:::linkcard
https://xbarapp.com/
:::


## Install xbar

### Homebrew

```bash
brew install --cask xbar
```

### Direct Download

Download the latest release from the [xbar website](https://xbarapp.com/) or the [GitHub releases page](https://github.com/matryer/xbar/releases), then move xbar to the Applications folder.

The current xbar release requires macOS Catalina 10.15 or later.


## Find the Plugin Directory

xbar stores locally installed plugins in the following directory:

```text
~/Library/Application Support/xbar/plugins
```

The easiest way to find it is to open xbar and choose **Open Plugin Folder**. You can also open the default directory from Terminal:

```bash
open "$HOME/Library/Application Support/xbar/plugins"
```

Plugins installed from xbar are managed in the same directory. To browse community plugins, open an xbar menu and choose **Plugin Browser**.

![xbar plugin browser](/images/xbar-plugin-browser.jpeg "width=450px")


## Create a Minimal Plugin

Create a file named `hello.5m.sh` with the following content:

```bash[title=hello.5m.sh,showLineNumbers=true]
#!/usr/bin/env bash

printf 'Hello from xbar\n'
printf '%s\n' '---'
printf 'Open the xbar website | href=https://xbarapp.com/\n'
```

Copy it to the plugin directory and make it executable:

```bash
PLUGIN_DIR="$HOME/Library/Application Support/xbar/plugins"
cp hello.5m.sh "$PLUGIN_DIR/hello.5m.sh"
chmod +x "$PLUGIN_DIR/hello.5m.sh"
```

Choose **Refresh All** from xbar. The text `Hello from xbar` should appear in the menu bar, and its dropdown menu should contain a link to the xbar website.


## Understand the Plugin Format

### Filename and Refresh Interval

xbar reads the refresh interval from the plugin filename:

```text
name.interval.extension
```

Common interval units are:

- `ms`: milliseconds, such as `500ms`
- `s`: seconds, such as `30s`
- `m`: minutes, such as `5m`
- `h`: hours, such as `2h`
- `d`: days, such as `1d`

For example:

```text
weather.30m.sh
email.1m.py
status.30s.js
```

The interval can also be changed from the xbar plugin manager. An undocumented metadata tag such as `<xbar.refresh>` is not needed; the filename controls scheduled refreshes.

### Menu Bar and Dropdown Output

An xbar plugin writes plain text to standard output.

```bash
printf 'Menu bar text\n'
printf '%s\n' '---'
printf 'First dropdown item\n'
printf 'Second dropdown item\n'
```

The first line containing only `---` separates menu bar output from dropdown output:

- Lines before the first `---` are shown in the menu bar. If there are multiple lines, xbar cycles through them.
- Lines after the first `---` appear in the dropdown menu.
- Additional `---` lines inside the dropdown become separators.
- Lines beginning with `--` become submenu items. Use two additional dashes for each deeper level.

```bash
printf 'Parent item\n'
printf '%s\n' '--Child item'
printf '%s\n' '----Grandchild item'
```

### Shebang and Executable Permission

A script needs a shebang that selects its interpreter. The xbar project recommends using `/usr/bin/env`:

```bash
#!/usr/bin/env bash
```

It must also be executable:

```bash
chmod +x my-plugin.5m.sh
```


## Add Links, Actions, and Formatting

Append parameters after a pipe character (`|`) to change a menu item or make it interactive.

### Links

```bash
printf 'GitHub | href=https://github.com/\n'
```

### Commands

Use `shell=` to run an executable and `param1=`, `param2=`, and so on to pass arguments.

```bash
printf 'Open Mail | shell=/usr/bin/open param1=-a param2=Mail terminal=false\n'
printf 'Restart SystemUIServer | shell=/usr/bin/killall param1=SystemUIServer terminal=false refresh=true\n'
```

:::warning
Despite its name, the older `bash=` parameter does not automatically interpret a shell command. xbar accepts it as an alias for `shell=`, and both forms directly launch the specified executable. Use the documented `shell=` form in new plugins.
:::

When a plugin needs to call itself, quote its path because the plugin directory contains spaces:

```bash
printf 'Run again | shell="%s" terminal=false refresh=true\n' "$0"
```

The most useful action parameters are:

- `shell=`: executable to run
- `param1=`, `param2=`, ...: arguments passed to the executable
- `terminal=true`: open the command in Terminal
- `refresh=true`: refresh the plugin after the action finishes
- `href=`: open a URL
- `disabled=true`: display a non-clickable menu item

### Text and Images

```bash
printf 'Warning | color=#D70022 font=Menlo-Bold size=13\n'
printf 'Status | templateImage=BASE64_ENCODED_TEMPLATE_IMAGE\n'
printf 'Preview | image=BASE64_ENCODED_IMAGE\n'
```

xbar supports named or hexadecimal colors, installed font names, font sizes, and Base64-encoded images. The `sfimage=` parameter used by some SwiftBar plugins is not supported by xbar.


## Add Metadata and User-Configurable Variables

Metadata describes a plugin in xbar and in the community plugin repository.

```bash
# <xbar.title>Weather</xbar.title>
# <xbar.version>v1.0.0</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Shows the current weather in the menu bar.</xbar.desc>
# <xbar.dependencies>bash,curl</xbar.dependencies>
```

Metadata is optional for a private local plugin. A plugin submitted to the community repository needs the complete metadata described in the official contribution guide.

Use `xbar.var` metadata to expose settings in the plugin manager:

```bash
# <xbar.var>string(VAR_LOCATION="Tokyo"): Location used for the weather report.</xbar.var>

LOCATION="${VAR_LOCATION:-Tokyo}"
```

The selected value becomes an environment variable when xbar runs the plugin.

:::warning
xbar variables are stored in a JSON file next to the plugin. They are convenient for ordinary settings, but they are not secure storage for passwords or API tokens. Use macOS Keychain for secrets.
:::


## Example 1: Weather

This plugin uses [wttr.in](https://wttr.in/) and handles network failures without leaving the menu bar blank.

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

The `30m` part of the filename schedules a refresh every 30 minutes. The manual Refresh item updates it immediately.


## Example 2: Mail Unread Count

The following plugin queries Mail with AppleScript. It reports a readable error instead of exiting silently when Mail access fails.

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

The first run may prompt for permission to control Mail. If access is denied, review xbar under **System Settings → Privacy & Security → Automation**.


## Example 3: Power Source and Adapter Rating

This plugin displays the battery percentage and the wattage reported for a connected power adapter.

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

`system_profiler` reports the adapter's advertised wattage, not the Mac's instantaneous power draw. A five-minute interval also avoids running this relatively slow command too frequently.


## Example 4: Countdown Timer

This timer stores only a validated Unix timestamp in the user's cache directory. It does not execute the state file as shell code, and it writes state atomically to avoid partially written data.

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

Because the filename contains `1s`, xbar runs the display portion once per second. Button actions update or remove the state and then request an immediate refresh.


## Example 5: GitHub Notifications

This example reads a token from macOS Keychain, handles HTTP failures, and verifies that GitHub returned an array before counting it.

It requires `jq`, which can be installed with `brew install jq`.

First, save the token once from Terminal without writing it into the plugin:

```bash
read -r -s -p "GitHub token: " TOKEN
printf '\n'
/usr/bin/security add-generic-password \
  -U -a "$USER" -s "xbar-github-token" -w "$TOKEN"
unset TOKEN
```

Then create the plugin:

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


## Make Plugins Reliable

### Always Produce Useful Output

If a plugin exits before printing anything, its menu bar item can disappear or retain stale output. Handle expected failures and print a short status plus details in the dropdown.

```bash
if ! DATA=$(fetch_data); then
  printf '⚠️ Unavailable\n'
  printf '%s\n' '---'
  printf 'Could not update data | color=red disabled=true\n'
  exit 0
fi
```

`set -e` is not a substitute for this behavior: it exits on many failures without creating user-facing output.

### Set `PATH` Explicitly

xbar is a GUI application and may not receive the same `PATH` as an interactive shell. Add directories for Intel and Apple silicon Homebrew when a plugin uses installed commands such as `jq`:

```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
```

For macOS-provided tools, an absolute path such as `/usr/bin/osascript` is even clearer.

### Use Timeouts and Caching

Do not make a network request every second. Use a reasonable filename interval, add a timeout to commands such as `curl`, and cache expensive results when appropriate.

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

Store caches under `~/Library/Caches/xbar` rather than in a predictable shared `/tmp` filename.

### Protect Secrets

Do not hardcode tokens or passwords in a plugin. Prefer macOS Keychain, and avoid printing secrets in debug output. Use `xbar.var` only for non-sensitive preferences because its values are stored next to the plugin.


## Troubleshooting

### The Plugin Does Not Appear

Confirm that the file is in the correct directory:

```bash
PLUGIN_DIR="$HOME/Library/Application Support/xbar/plugins"
ls -l "$PLUGIN_DIR"
```

Then verify that it is executable and has a valid shebang:

```bash
chmod +x "$PLUGIN_DIR/my-plugin.5m.sh"
head -n 1 "$PLUGIN_DIR/my-plugin.5m.sh"
```

### The Plugin Shows an Error

Run it directly to inspect its standard output and error messages:

```bash
"$HOME/Library/Application Support/xbar/plugins/my-plugin.5m.sh"
```

Check Bash syntax without executing it:

```bash
bash -n "$HOME/Library/Application Support/xbar/plugins/my-plugin.5m.sh"
```

If a command works in Terminal but not in xbar, check `PATH`, use an absolute executable path, and confirm any required Automation, Files and Folders, or Notification permissions in System Settings.

### The Menu Bar Is Crowded

The following macOS setting changes spacing for all menu bar status items, not only xbar. It is an undocumented macOS preference and may behave differently across macOS releases.

```bash
defaults -currentHost write -globalDomain NSStatusItemSpacing -int 6
```

Sign out and sign in again to apply the change. Increase the number for wider spacing or decrease it for narrower spacing.


## Resources

:::linkcard
https://github.com/matryer/xbar
:::

:::linkcard
https://github.com/matryer/xbar-plugins/blob/main/CONTRIBUTING.md
:::

:::linkcard
https://xbarapp.com/docs/2021/03/14/variables-in-xbar.html
:::


## Next Steps

Start with one value that is useful at a glance, choose a refresh interval appropriate for the underlying command, and add dropdown actions only when they improve the workflow. Once the basic plugin works, add explicit error handling, timeouts, and secure configuration before relying on it every day.
