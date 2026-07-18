---
title: "xbar: Customizing Your Mac Menu Bar"
date: "2025-10-18"
subtitle: "Put Any Information in Your Mac Menu Bar with Simple Shell Scripts"
tags: [MacOS, Productivity]
---

## What is xbar?

:::linkcard
https://xbarapp.com/
:::

**xbar** is a free and open-source MacOS application that lets you put the output of any script or program into your Mac menu bar. With just a few lines of shell script, you can display system information, check email, monitor server status, or create custom utilities.

### Key Features

- 🚀 **Simple**: Write scripts in any language (bash, Python, JavaScript, etc.)
- 🔄 **Auto-refresh**: Set custom refresh intervals
- 📦 **Plugin Repository**: Browse hundreds of community plugins
- ⚙️ **Customizable**: Full control over appearance and behavior


## Installation

### Method 1: Homebrew
```bash
brew install --cask xbar
```

### Method 2: Direct Download
Download the latest release from [xbarapp.com](https://xbarapp.com/) and drag it to your Applications folder.


## Browse and Install Plugins

![](/images/xbar-plugin-browser.jpeg "width=450px")
1. Open xbar and click on the menu bar icon
2. Select "Plugin Browser"
3. Browse or search for plugins
4. Click "Install" to add a plugin


:::tip
If you have many plugins installed, menu bar icons may overflow.Change the spacing between icons in menu bar by running the following command in Terminal:
```bash
defaults -currentHost write -globalDomain NSStatusItemSpacing -int 6
```
Increase the number to widen the spacing, decrease to narrow it. You need to sign out and sign in again for the change to take effect.
:::


## Understanding xbar Plugin Format

### Filename Convention

xbar uses the filename to determine refresh intervals:

```
plugin-name.{time}.{extension}
```

**Refresh intervals:**
- `1s` - Every second
- `10s` - Every 10 seconds  
- `1m` - Every minute
- `5m` - Every 5 minutes
- `1h` - Every hour
- `1d` - Every day

**Examples:**
```bash
weather.5m.sh        # Refreshes every 5 minutes
email.1m.py          # Refreshes every minute
stocks.30s.js        # Refreshes every 30 seconds
```

### Output Format

xbar plugins use a simple text-based format:

```bash
# Menu bar display (first line)
echo "Display Text"

# Dropdown menu (lines after "---")
echo "---"
echo "Menu Item 1"
echo "Menu Item 2"
```


## Script Examples

Let's examine the three xbar scripts:

### 1. Email Unread Count Monitor

```bash[title=email_unread.1m.sh,showLineNumbers=true]
#!/bin/bash
#  <xbar.title>Mail</xbar.title>
#  <xbar.desc>Show unread count from Mail.app in menubar (with Open Mail option)</xbar.desc>
#  <xbar.dependencies>bash,osascript,open</xbar.dependencies>
set -e

# get unread count (fall back to 0 if empty)
OUTPUT=$(osascript -e 'tell application "Mail"' -e 'unread count of inbox' -e 'end tell')
OUTPUT=${OUTPUT:-0}

echo -n "📥"
echo " ${OUTPUT}"

echo "---"

if [[ $OUTPUT -gt 0 ]]
then
  echo "Open Mail | bash=/usr/bin/open param1=-a param2=Mail terminal=false"
else
  echo "No unread mail"
fi
```

#### How It Works

1. **AppleScript Integration**: Uses `osascript` to query Mail.app's unread count
2. **Menu Bar Display**: Shows 📥 icon with unread count
3. **Interactive Menu**: Provides "Open Mail" button when unread messages exist
4. **Refresh**: Updates every minute (`1m` in filename)

#### Features
- ✅ Quick glance at unread emails without opening Mail.app
- ✅ Click to open Mail.app directly
- ✅ Handles Mail.app not running gracefully


### 2. USB-C Charger Wattage Display

```bash[title=power_wattage.30s.sh,showLineNumbers=true]
#!/bin/bash
# <xbar.title>USB-C Charger Wattage with Battery</xbar.title>
# <xbar.desc>Displays current USB-C charger wattage and battery percentage.</xbar.desc>

# Get battery percentage
BATTERY=$(pmset -g batt | grep -Eo "\d+%" | cut -d% -f1)

# Get charger wattage
WATTAGE=$(system_profiler SPPowerDataType | grep "Wattage" | awk '{print $3}')

if [ -z "$WATTAGE" ]; then
  # On battery
  echo "🔋 ${BATTERY}%"
else
  # Charging
  echo "⚡ ${WATTAGE}W ${BATTERY}%"
fi
```

#### How It Works

1. **Battery Status**: Uses `pmset` to get battery percentage
2. **Charger Detection**: Uses `system_profiler` to detect connected charger wattage
3. **Smart Display**: Shows different icons for battery vs charging state
4. **Refresh**: Updates every 30 seconds

#### Use Cases
- Monitor charging power, e.g., ⚡ 65W (useful for checking if using correct charger)
- Battery level, e.g., 🔋 50%



### 3. Advanced Countdown Timer

```bash[title=simple-timer.1s.sh,showLineNumbers=true]
#!/bin/bash
# <xbar.title>Simple Timer (Fixed-width)</xbar.title>
# <xbar.version>v1.2</xbar.version>
# <xbar.author>Kensuke</xbar.author>
# <xbar.desc>Countdown timer with fixed-width digits (uses fullwidth Unicode digits).</xbar.desc>
# <xbar.dependencies>bash, osascript</xbar.dependencies>
# <xbar.refresh>1</xbar.refresh>

STATE_FILE="/tmp/xbar_timer_state"

now() { date +%s; }

save_state() {
  cat >"$STATE_FILE" <<EOF
END_TIME=$END_TIME
RUNNING=$RUNNING
REMAINING=$REMAINING
NOTIFIED=$NOTIFIED
EOF
}

load_state() {
  if [ -f "$STATE_FILE" ]; then
    source "$STATE_FILE"
  else
    END_TIME=0
    RUNNING=0
    REMAINING=0
    NOTIFIED=0
  fi
}

# convert ASCII digits and colon to fullwidth characters (fixed width)
to_fullwidth() {
  s="$1"
  # array of fullwidth digits 0-9
  digits=(０ １ ２ ３ ４ ５ ６ ７ ８ ９)
  for i in 0 1 2 3 4 5 6 7 8 9; do
    s="${s//${i}/${digits[i]}}"
  done
  # convert colon to fullwidth colon
  s="${s//:/：}"
  echo "$s"
}

# parse human-friendly durations: 25m, 5m, 1m, 90s, 1h, or plain minutes (e.g. 25)
parse_seconds() {
  arg="$1"
  if [[ "$arg" =~ ^([0-9]+)h$ ]]; then
    echo $(( ${BASH_REMATCH[1]} * 3600 ))
  elif [[ "$arg" =~ ^([0-9]+)m$ ]]; then
    echo $(( ${BASH_REMATCH[1]} * 60 ))
  elif [[ "$arg" =~ ^([0-9]+)s$ ]]; then
    echo "${BASH_REMATCH[1]}"
  elif [[ "$arg" =~ ^[0-9]+$ ]]; then
    # treat plain number as minutes
    echo $(( arg * 60 ))
  else
    # fallback: 60s
    echo 60
  fi
}

notify_finished() {
  /usr/bin/osascript -e 'beep 3'
  /usr/bin/osascript -e 'display dialog "Timer finished!" with title "xbar Timer" buttons {"OK"} default button "OK" with icon caution' &>/dev/null
}

# Handle action invocations
if [ "$1" = "start" ]; then
  DURATION_STR="${2:-25m}"
  DURATION=$(parse_seconds "$DURATION_STR")
  END_TIME=$(( $(now) + DURATION ))
  RUNNING=1
  REMAINING=0
  NOTIFIED=0
  save_state
  exit 0
elif [ "$1" = "custom" ]; then
  # Show input dialog for custom timer
  CUSTOM_INPUT=$(/usr/bin/osascript -e 'display dialog "Enter timer duration:\n(e.g., 10m, 30s, 1h, or just 15 for minutes)" default answer "10m" with title "Custom Timer" buttons {"Cancel", "Start"} default button "Start"' -e 'text returned of result' 2>/dev/null)
  if [ -n "$CUSTOM_INPUT" ]; then
    DURATION=$(parse_seconds "$CUSTOM_INPUT")
    END_TIME=$(( $(now) + DURATION ))
    RUNNING=1
    REMAINING=0
    NOTIFIED=0
    save_state
  fi
  exit 0
elif [ "$1" = "stop" ]; then
  load_state
  if [ "$RUNNING" -eq 1 ]; then
    REM=$(( END_TIME - $(now) ))
    if [ "$REM" -lt 0 ]; then REM=0; fi
    REMAINING=$REM
    END_TIME=0
  fi
  RUNNING=0
  NOTIFIED=0
  save_state
  exit 0
elif [ "$1" = "reset" ]; then
  END_TIME=0
  RUNNING=0
  REMAINING=0
  NOTIFIED=0
  save_state
  exit 0
fi

# Normal display run (no args)
load_state

# Determine display text and icon
if [ "$RUNNING" -eq 1 ] && [ "$END_TIME" -gt 0 ]; then
  REM=$(( END_TIME - $(now) ))
  if [ "$REM" -eq 0 ]; then
    # Show 00:00 first
    DISPLAY="00:00"
    ICON="⏰"
  elif [ "$REM" -lt 0 ]; then
    # Time is up, show alert
    if [ "$NOTIFIED" -eq 0 ]; then
      notify_finished
      NOTIFIED=1
    fi
    RUNNING=0
    REMAINING=0
    END_TIME=0
    save_state
    DISPLAY="Done"
    ICON=""
  else
    # Running timer - format time
    H=$(( REM / 3600 ))
    M=$(( (REM % 3600) / 60 ))
    S=$(( REM % 60 ))
    if [ "$H" -gt 0 ]; then
      printf -v DISPLAY "%02d:%02d:%02d" "$H" "$M" "$S"
    else
      printf -v DISPLAY "%02d:%02d" "$M" "$S"
    fi
    ICON="⏰"
  fi
else
  # Stopped/paused timer
  REM=$REMAINING
  if [ "$REM" -gt 0 ]; then
    # Paused with remaining time
    H=$(( REM / 3600 ))
    M=$(( (REM % 3600) / 60 ))
    S=$(( REM % 60 ))
    if [ "$H" -gt 0 ]; then
      printf -v DISPLAY "%02d:%02d:%02d" "$H" "$M" "$S"
    else
      printf -v DISPLAY "%02d:%02d" "$M" "$S"
    fi
    ICON="⏸"
  else
    # No timer set
    DISPLAY="⏰"
    ICON=""
  fi
fi

# Convert to fullwidth if contains digits/colon
if [[ "$DISPLAY" =~ [0-9] ]]; then
  DISPLAY=$(to_fullwidth "$DISPLAY")
fi

# Combine icon and display
if [ -n "$ICON" ]; then
  DISPLAY="${ICON} ${DISPLAY}"
fi

# Single output point for menu bar
echo "$DISPLAY"

# Menu items
echo '---'
SCRIPT_PATH="$0"
echo "Start 1h  | bash='$SCRIPT_PATH' param1='start' param2='1h' terminal=false refresh=true"
echo "Start 30m  | bash='$SCRIPT_PATH' param1='start' param2='30m' terminal=false refresh=true"
echo "Start 3m  | bash='$SCRIPT_PATH' param1='start' param2='3m' terminal=false refresh=true"
echo "Set Custom Timer | bash='$SCRIPT_PATH' param1='custom' terminal=false refresh=true"
if [ "$RUNNING" -eq 1 ]; then
  echo "Stop      | bash='$SCRIPT_PATH' param1='stop' terminal=false refresh=true"
fi
echo "Reset     | bash='$SCRIPT_PATH' param1='reset' terminal=false refresh=true"
```

#### Advanced Features

This timer script demonstrates several advanced xbar techniques:

1. **State Persistence**: Uses `/tmp/xbar_timer_state` to maintain timer state between refreshes
2. **Full-width Unicode**: Converts digits to full-width characters (０１２３) for consistent spacing
3. **Interactive Controls**: Provides start, stop, and reset buttons in dropdown menu
4. **Flexible Duration Input**: Accepts formats like `25m`, `90s`, `1h`, or plain numbers (treated as minutes)
5. **Custom Timer Dialog**: Shows macOS dialog for entering custom durations
6. **Notifications**: Audio beep and visual dialog when timer completes

#### Key Implementation Details

**State Management**:
```bash
# Save timer state to file
save_state() {
  cat >"$STATE_FILE" <<EOF
END_TIME=$END_TIME
RUNNING=$RUNNING
REMAINING=$REMAINING
NOTIFIED=$NOTIFIED
EOF
}
```

**Duration Parsing**:
```bash
parse_seconds() {
  arg="$1"
  if [[ "$arg" =~ ^([0-9]+)h$ ]]; then
    echo $(( ${BASH_REMATCH[1]} * 3600 ))
  elif [[ "$arg" =~ ^([0-9]+)m$ ]]; then
    echo $(( ${BASH_REMATCH[1]} * 60 ))
  # ... more formats
}
```

**Fixed-width Display**:
```bash
# Converts "12:34" to "１２：３４" for consistent menu bar width
to_fullwidth() {
  digits=(０ １ ２ ３ ４ ５ ６ ７ ８ ９)
  # ... conversion logic
}
```


## Advanced xbar Plugin Techniques

### Menu Item Actions

xbar supports interactive menu items with various actions:

```bash
# Open URL
echo "GitHub | href=https://github.com"

# Run bash command
echo "Restart | bash=/usr/bin/killall param1=SystemUIServer terminal=false refresh=true"

# Run with parameters
echo "Process File | bash='./process.sh' param1='file.txt' terminal=false"

# Show in terminal
echo "Run Script | bash='./script.sh' terminal=true"

# Refresh after action
echo "Action | bash='command' refresh=true"
```

### Text Formatting

```bash
# Colors
echo "Red Text | color=red"
echo "Custom Color | color=#FF5733"

# Font styles  
echo "Bold Text | font=Monaco size=14"
echo "Custom Font | font='Helvetica Neue' size=12"

# Combine attributes
echo "Styled Item | color=blue font=Monaco size=14"
```

### Icons and Emojis

```bash
# Use emojis
echo "⚠️ Warning"
echo "✅ Success"
echo "📧 Email"

# Use SF Symbols (macOS 11+)
echo "Symbol | sfimage=star.fill"

# Custom image
echo "Item | image=base64encodedimage"
```

### Submenus

```bash
echo "Parent Menu"
echo "--Submenu Item 1"
echo "--Submenu Item 2"
echo "----Nested Item"
```

### Separators

```bash
echo "---"  # Separator line
```


## Writing Your Own xbar Plugin

Let's create a simple weather plugin:

```bash[title=weather.30m.sh,showLineNumbers=true]
#!/bin/bash

# Get weather data (using wttr.in API)
LOCATION="Tokyo"
WEATHER=$(curl -s "wttr.in/${LOCATION}?format=%c+%t" | head -n 1)

# Menu bar display
echo "🌡️ ${WEATHER}"

# Dropdown menu
echo "---"
echo "Location: ${LOCATION}"
echo "---"
echo "Refresh | refresh=true"
echo "Open wttr.in | href=https://wttr.in/${LOCATION}"
```

### Steps to Install

1. **Create the file**:
   ```bash
   touch ~/plugins/weather.30m.sh
   ```

2. **Make it executable**:
   ```bash
   chmod +x ~/plugins/weather.30m.sh
   ```

3. **Refresh xbar**:
   - Click xbar menu → "Refresh All"


## Best Practices

### 1. Error Handling

```bash
#!/bin/bash
set -e  # Exit on error

# Handle missing commands
if ! command -v jq &> /dev/null; then
    echo "❌ Error"
    echo "---"
    echo "jq not installed"
    exit 1
fi
```

### 2. Performance

:::warning
Avoid slow operations in frequently refreshed plugins. For example, don't run a plugin that makes network requests every second.
:::

```bash
# Cache results for expensive operations
CACHE_FILE="/tmp/xbar_cache_${PLUGIN_NAME}"
CACHE_TTL=300  # 5 minutes

if [ -f "$CACHE_FILE" ]; then
    AGE=$(($(date +%s) - $(stat -f %m "$CACHE_FILE")))
    if [ $AGE -lt $CACHE_TTL ]; then
        cat "$CACHE_FILE"
        exit 0
    fi
fi

# Fetch new data
DATA=$(expensive_operation)
echo "$DATA" | tee "$CACHE_FILE"
```

### 3. Security

```bash
# Don't hardcode sensitive data
API_KEY="${MY_API_KEY:-}"
if [ -z "$API_KEY" ]; then
    echo "❌ No API key"
    exit 1
fi

# Use environment variables or keychain
PASSWORD=$(security find-generic-password -s "my-service" -w)
```



## Plugin Ideas

Here are some ideas for custom xbar plugins:

### System Monitoring
- CPU/Memory usage
- Disk space
- Network speed
- Running processes

### Productivity
- Simer ✅ (already have this!)
- Task list from Things/Todoist
- Calendar events
- Clipboard history

### Communication
- Unread messages (Slack, Discord)
- Email count ✅ (already have this!)
- GitHub notifications

### Development
- Git repository status
- CI/CD build status
- Server uptime
- Docker container status

### Personal
- Bitcoin price
- Stock prices
- Weather ✅ (example above)
- Calendar events
- Habit tracker


## Troubleshooting
1. **Check permissions**:
    ```bash
    chmod +x ~/plugins/your-plugin.sh
    ```

2. **Verify shebang**:
    ```bash
    #!/bin/bash
    # Must be first line
    ```

3. **Check syntax**:
    ```bash
    bash -n your-plugin.sh
    ```

4. **Filename format**:
    ```
    plugin-name.INTERVAL.extension
    ```
    For example: `timer.1s.sh` (refreshes every second)



## Advanced Examples

### API Integration

```bash[title=github-notifications.5m.sh,showLineNumbers=true]
#!/bin/bash

GITHUB_TOKEN="${GITHUB_TOKEN}"
API_URL="https://api.github.com/notifications"

COUNT=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" "$API_URL" | jq length)

if [ "$COUNT" -gt 0 ]; then
    echo "🔔 ${COUNT}"
else
    echo "🔕"
fi

echo "---"
echo "GitHub Notifications | href=https://github.com/notifications"
```

### System Information

```bash[title=system-info.1h.sh,showLineNumbers=true]
#!/bin/bash

# Get system info
UPTIME=$(uptime | awk '{print $3,$4}' | sed 's/,//')
CPU=$(top -l 1 | grep "CPU usage" | awk '{print $3}')
MEMORY=$(top -l 1 | grep "PhysMem" | awk '{print $2}')

echo "💻 System"
echo "---"
echo "Uptime: ${UPTIME}"
echo "CPU: ${CPU}"
echo "Memory: ${MEMORY}"
```


## Resources

:::linkcard
https://xbarapp.com/
:::

:::linkcard
https://github.com/matryer/xbar-plugins/blob/main/CONTRIBUTING.md
:::


## Conclusion

xbar is a powerful tool for customizing your Mac menu bar. With just a few lines of shell script, you can:

- 📊 Monitor system resources
- 📧 Check email and notifications  
- ⏱️ Create productivity tools
- 🌐 Integrate with APIs

Start with simple plugins and gradually build more complex ones as you learn. The xbar community has created hundreds of plugins you can use as references and inspiration.
