---
title: "Command Line Guide"
date: "2022-10-18"
subtitle: "A Practical Guide to Files, Pipes, Permissions, Processes, and Shell Scripts"
tags: [CLI]
---


The command line is a text interface for controlling a computer. Instead of clicking through folders and menus, you enter commands to move between directories, inspect and modify files, connect programs, manage processes, and automate repeated work.

On macOS, open `Terminal.app`. Most Linux distributions provide a terminal application as well. macOS uses Zsh as its default interactive shell, while Bash is common on Linux. The basic commands in this guide work in both unless a section is marked as Bash-specific.

:::warning
Commands such as `rm`, `chmod`, and `chown` can remove data or make it inaccessible. Check the current directory with `pwd`, inspect the target with `ls`, and preview wildcard matches with `echo` before running a destructive command.
:::


## Keyboard Shortcuts

These shortcuts make an interactive terminal much faster to use.

### Process and Screen Control

| Shortcut | Description |
| --- | --- |
| `Ctrl + C` | Interrupt the foreground process |
| `Ctrl + Z` | Suspend the foreground process |
| `Ctrl + D` | Send end-of-file; at an empty prompt, exit the shell |
| `Ctrl + L` | Clear the screen |
| `Ctrl + S` | Pause terminal output in terminals that use flow control |
| `Ctrl + Q` | Resume output paused by `Ctrl + S` |

### Cursor Movement and Editing

| Shortcut | Description |
| --- | --- |
| `Ctrl + A` | Move to the beginning of the line |
| `Ctrl + E` | Move to the end of the line |
| `Alt + B` / `Alt + F` | Move backward or forward by one word |
| `Ctrl + T` | Swap the current character with the previous character |
| `Alt + T` | Swap the current word with the previous word |
| `Ctrl + W` | Cut the word before the cursor |
| `Ctrl + U` | Cut from the cursor to the beginning of the line |
| `Ctrl + K` | Cut from the cursor to the end of the line |
| `Ctrl + Y` | Paste the most recently cut text |
| `Ctrl + _` | Undo the last edit |

On many macOS terminal configurations, `Esc`, then `B` or `F`, can be used when `Option + B` or `Option + F` is not configured as `Alt`.

### Command History

| Shortcut | Description |
| --- | --- |
| `Up` / `Down` | Move through previous and next commands |
| `Ctrl + R` | Search command history backward |
| `Ctrl + G` | Cancel the history search |


## Paths and Special Symbols

The filesystem is a hierarchy that begins at the root directory `/`.

| Symbol | Meaning | Example |
| --- | --- | --- |
| `/` | Root directory | `cd /` |
| `.` | Current directory | `ls .` |
| `..` | Parent directory | `cd ..` |
| `~` | Current user's home directory | `cd ~` |
| `-` | Previous working directory when used with `cd` | `cd -` |

An **absolute path** begins at `/`. A **relative path** begins at the current directory.

```bash
/Users/username/Documents/report.txt   # Absolute path on macOS
Documents/report.txt                   # Relative path from the home directory
../report.txt                           # A file in the parent directory
```

Quote or escape paths that contain spaces:

```bash
cd "My Projects"
cd My\ Projects
```


## Navigating and Inspecting Directories

### `pwd`: Show the Current Directory

```bash
pwd
# /Users/username/Documents
```

### `cd`: Change Directory

```bash
cd ~/Documents       # Go to Documents in the home directory
cd ..                # Go up one level
cd ../..             # Go up two levels
cd -                 # Return to the previous directory
cd                   # Go to the home directory
```

### `ls`: List Directory Contents

```bash
ls                   # List the current directory
ls -l                # Long format: permissions, owner, size, and time
ls -a                # Include hidden names that begin with .
ls -lh               # Use human-readable file sizes
ls -ltr              # Sort by modification time, oldest first
ls -AhlS             # Combine options: almost all, long, readable, by size
```

Most short options can be combined: `ls -A -h -l -S` and `ls -AhlS` are equivalent.

### `tree`: Display a Directory Hierarchy

The `tree` command may need to be installed first:

```bash
brew install tree                 # macOS with Homebrew
sudo apt install tree             # Debian or Ubuntu
```

```bash
tree                              # Show the full hierarchy
tree -L 2                         # Limit output to two levels
tree -d                           # Show directories only
tree -a                           # Include hidden entries
tree -I 'node_modules|*.pyc'      # Ignore matching names
tree --dirsfirst                  # Put directories before files
tree -h                           # Use human-readable file sizes
```

Example output:

```text
project/
├── src/
│   ├── main.py
│   └── utils.py
├── tests/
│   └── test_main.py
└── README.md
```


## Creating Files and Directories

### `mkdir`: Create Directories

```bash
mkdir project                     # Create one directory
mkdir dir1 dir2                   # Create several directories
mkdir -p project/src/components   # Create missing parent directories
```

### `touch`: Create a File or Update Its Timestamp

```bash
touch file.txt                    # Create an empty file if it does not exist
touch existing.txt                # Update its access and modification times
touch file{1..3}.txt              # Create file1.txt, file2.txt, and file3.txt
```

### `rmdir`: Remove Empty Directories

```bash
rmdir empty-directory
rmdir -p dir/subdir/leaf          # Also remove empty parent directories
```

`rmdir` fails if a target directory contains anything. Use this behavior when you want to avoid removing files accidentally.


## Viewing and Measuring Files

### `cat`, `less`, `head`, and `tail`

```bash
cat file.txt                      # Print the entire file
cat file1.txt file2.txt           # Print several files in order
less largefile.txt                # View a file page by page; press q to quit
head file.txt                     # Print the first 10 lines
head -n 5 file.txt                # Print the first 5 lines
tail file.txt                     # Print the last 10 lines
tail -f application.log           # Follow new lines as they are written
```

### `file`: Identify a File Type

```bash
file document.pdf
# document.pdf: PDF document, version 1.4
```

### `wc`: Count Lines, Words, and Bytes

```bash
wc file.txt                       # Lines, words, and bytes
wc -l file.txt                    # Lines only
wc -w file.txt                    # Words only
wc -c file.txt                    # Bytes only
```

### `du`: Measure Disk Usage

```bash
du -h file.txt                    # Human-readable file size
du -sh directory/                 # Total size of a directory
du -h -d 1 .                      # Size of each item one level below, on macOS
du -h --max-depth=1 .             # GNU/Linux equivalent
```


## Copying, Moving, and Removing

### `cp`: Copy Files and Directories

```bash
cp source.txt destination.txt     # Copy a file
cp -i source.txt destination.txt  # Ask before overwriting
cp -v source.txt destination.txt  # Print the copied names
cp file1 file2 target/            # Copy several files into a directory
cp -R source-dir destination-dir  # Copy a directory recursively
```

The meaning of the destination depends on whether it already exists:

- `cp source.txt destination.txt` replaces `destination.txt` if it exists. Add `-i` to request confirmation.
- If `destination-dir` does not exist, `cp -R source-dir destination-dir` creates it as a copy of `source-dir`.
- If `destination-dir` exists, the result is usually `destination-dir/source-dir/...`.

### `mv`: Move or Rename

```bash
mv old.txt new.txt                # Rename a file
mv -i old.txt new.txt             # Ask before overwriting
mv file.txt directory/            # Move a file into a directory
mv dir1 dir2                      # Rename dir1, or move it into dir2 if dir2 exists
```

### `rm`: Remove Files and Nonempty Directories

```bash
rm file.txt                       # Remove one file
rm -i file.txt                    # Ask before removing
rm -v file.txt                    # Print removed names
rm -r directory/                  # Remove a directory recursively
rm -ri directory/                 # Recursively remove with confirmation
rm -rf directory/                 # Force recursive removal without confirmation
```

:::warning
`rm` does not provide a built-in undo operation. Treat `rm -rf` as a last resort. Never paste it without first checking the exact expanded targets, for example with `echo directory/*` or `find directory -maxdepth 1`.
:::


## Creating Text and Redirecting Output

### `echo` and `printf`

```bash
echo "Hello, world"               # Print a line
echo "$PATH"                      # Print an environment variable
printf '%s\n' "Hello, world"      # Print using an explicit format
```

`printf` is preferable when formatting matters because its behavior is more predictable across shells.

### Standard Streams

Every command can work with three standard streams:

| Stream | Number | Default destination |
| --- | ---: | --- |
| Standard input (`stdin`) | `0` | Keyboard |
| Standard output (`stdout`) | `1` | Terminal |
| Standard error (`stderr`) | `2` | Terminal |

### Redirection Operators

```bash
command > file                    # Write stdout to file, replacing it
command >> file                   # Append stdout to file
command < file                    # Read stdin from file
command 2> errors.log             # Write stderr to file
command > output.log 2>&1         # Write stdout and stderr to one file
command &> output.log             # Bash and Zsh shorthand for the line above
command 2>/dev/null               # Discard stderr
```

```bash
echo "first line" > notes.txt
echo "second line" >> notes.txt
cat notes.txt
# first line
# second line
```

### Pipes

A pipe, `|`, sends the standard output of the command on its left to the standard input of the command on its right.

```bash
history | tail -20                # Last 20 history entries
grep "ERROR" application.log | wc -l
ps aux | grep '[p]ython'
du -h ./* | sort -h | tail -10
```

Each stage should do one job: select data, transform it, sort it, count it, or save it.

### `tee`: Display and Save Output

`tee` copies its input both to the terminal and to a file, which is useful when you want to continue a pipeline while keeping a record.

```bash
ls / | tee root-contents.txt | head
grep "ERROR" application.log | tee errors.txt | wc -l
command | tee -a history.log      # Append instead of replacing
```


## Text Processing

### `grep`: Search Lines

`grep` uses regular expressions to select matching lines.

```bash
grep 'word' file.txt              # Lines containing word
grep -i 'word' file.txt           # Ignore letter case
grep -n 'word' file.txt           # Include line numbers
grep -w 'word' file.txt           # Match a whole word
grep -v 'word' file.txt           # Select nonmatching lines
grep -r 'word' directory/         # Search recursively
grep -l 'word' *.txt              # Print matching filenames only
grep -c 'word' file.txt           # Count matching lines
grep -o '[0-9]\+' file.txt        # Print only matching parts with basic regex
grep -E '[0-9]+' file.txt         # Use extended regular expressions
```

Common options:

| Option | Meaning |
| --- | --- |
| `-i` | Ignore case |
| `-w` | Match whole words |
| `-v` | Select nonmatching lines |
| `-n` | Include line numbers |
| `-H` / `-h` | Show or suppress filename prefixes |
| `-r` | Search directories recursively |
| `-R` | Search recursively and follow symbolic links |
| `-l` / `-L` | List files with or without matches |
| `-c` | Count matching lines |
| `-m NUMBER` | Stop after `NUMBER` matches per file |
| `-o` | Print only the matched text |

### `sed`: Transform Text

```bash
sed 's/old/new/' file.txt          # Replace the first match on each line
sed 's/old/new/g' file.txt         # Replace every match
sed '2d' file.txt                  # Delete the second line in the output
sed -i '' 's/old/new/g' file.txt   # Edit in place on macOS
sed -i 's/old/new/g' file.txt      # Edit in place with GNU sed on Linux
```

Without `-i`, `sed` prints the transformed text and leaves the original file unchanged.

### `awk`: Process Records and Columns

```bash
awk '{print $1}' file.txt          # Print the first whitespace-separated field
awk '{print $NF}' file.txt         # Print the last field
awk '/pattern/ {print $0}' file.txt
awk -F, '{print $2}' data.csv      # Use a comma as the field separator
```

### `sort`, `uniq`, `cut`, and `tr`

```bash
sort names.txt                     # Sort lines
sort names.txt | uniq              # Remove adjacent duplicates
sort names.txt | uniq -c           # Count each distinct line
cut -d, -f2 data.csv               # Print the second comma-separated field
tr '[:lower:]' '[:upper:]' < file.txt
```


## Finding Files and Commands

### `find`: Search the Filesystem

The basic form is `find PATH CONDITIONS ACTIONS`.

```bash
find . -name '*.txt'               # Names ending in .txt
find . -iname '*.TXT'              # Case-insensitive name match
find . -type f                     # Regular files only
find . -type d                     # Directories only
find . -empty                      # Empty files or directories

find . -mtime -7                   # Modified during the last 7 days
find . -mmin -60                   # Modified during the last 60 minutes
find . -atime +30                  # Accessed more than 30 days ago

find . -size +10M                  # Larger than 10 MiB
find . -size +30k -size -1M        # Between 30 KiB and 1 MiB

find . -name '*.log' -mtime +30    # Combine conditions with implicit AND
find . \( -name '*.py' -o -name '*.sh' \) -type f
find . -not -path './node_modules/*' -type f
```

Quote patterns such as `'*.txt'`. Otherwise, the shell may expand them before `find` receives them.

### Run a Command on Search Results

```bash
find . -name '*.txt' -exec grep -n 'word' {} +
find . -name '*.tmp' -exec rm -i {} +
find . -name '*.tmp' -delete
```

`{}` is replaced with the found paths. The final `+` groups as many paths as possible into each command invocation; `\;` runs the command once per path.

:::warning
Place `-delete` only after confirming the same `find` expression without it. `find` descends into subdirectories unless you restrict it with options such as `-maxdepth`.
:::

### `find` with `xargs`

Use a null character as the separator so that filenames containing spaces, quotes, or newlines remain intact.

```bash
find . -type f -name '*.txt' -print0 | xargs -0 grep -n 'word'
find . -type f -name '*.tmp' -print0 | xargs -0 rm -i
```

When possible, `find ... -exec command {} +` is simpler and provides the same safe filename handling.

### Find an Executable

```bash
command -v python                  # Portable: show how a command resolves
type python                        # Explain whether it is an alias, function, or file
which python                       # Common, but less informative than type
whereis python                     # Binary, source, and manual locations on many Linux systems
locate filename                    # Fast database search when locate is installed
```


## Shell Globbing and Brace Expansion

### Globs Match Filenames

The shell expands a glob into matching filenames before it runs the command.

| Pattern | Meaning |
| --- | --- |
| `*` | Zero or more characters |
| `?` | Exactly one character |
| `[abc]` | One character from the set |
| `[a-z]` | One character from the range |
| `[!abc]` | One character not in the set |

```bash
ls *.txt                           # Every .txt file
ls file?.txt                       # file1.txt, fileA.txt, and similar names
ls [abc]*.txt                      # Names beginning with a, b, or c
ls [0-9][0-9].txt                  # Names with exactly two digits
mv *.{py,sh} scripts/              # Python and shell files
```

Preview a glob without performing the intended operation:

```bash
echo rm temp*
printf '%s\n' temp*
```

:::note
Globs and regular expressions are different languages. The shell expands `*.txt` as a glob, while `grep -E '^[0-9]+$'` interprets its quoted pattern as a regular expression.
:::

### Extended Globs in Bash

Enable extended pattern matching in Bash:

```bash
shopt -s extglob
```

| Pattern | Meaning |
| --- | --- |
| `*(pattern)` | Zero or more occurrences |
| `+(pattern)` | One or more occurrences |
| `?(pattern)` | Zero or one occurrence |
| `@(pattern)` | Exactly one occurrence |
| `!(pattern)` | Anything except the pattern |

```bash
ls
# file1 file2 file3 file11 file123

ls !(file1)
# file2 file3 file11 file123

ls !(file1|file2)
# file3 file11 file123

ls file+([0-9])
# file1 file2 file3 file11 file123
```

These examples are Bash-specific. Zsh provides its own extended glob syntax and options.

### Brace Expansion Generates Strings

Brace expansion does not inspect the filesystem; it generates strings.

```bash
echo {1,2,3}                       # 1 2 3
echo file{1..5}.txt                # file1.txt through file5.txt
echo {a..z}                        # a through z
echo {A,B}{1,2}                    # A1 A2 B1 B2

mkdir -p project/{src,tests,docs}
touch file{1..10}.txt
cp file.txt{,.backup}              # Expands to: cp file.txt file.txt.backup
mv /path/{foo,bar,baz}.txt dir/
```


## Combining Commands and Expansions

### Command Lists

```bash
command1 ; command2                # Run command2 regardless of command1
command1 && command2               # Run command2 only if command1 succeeds
command1 || command2               # Run command2 only if command1 fails
command1 & command2                # Start command1 in the background, then command2
```

Practical examples:

```bash
mkdir project && cd project
make && make test
cd /tmp || echo "Could not enter /tmp"
long_running_command & echo "Started in the background"
```

### Command Substitution: `$(...)`

Command substitution runs a command and inserts its standard output into another command.

```bash
echo "Today is $(date +%F)"
touch "report_$(date +%Y%m%d).txt"
ls "$(dirname "$(command -v python)")"
```

Prefer `$(...)` to legacy backticks because it is easier to read and nest.

### Parameter Expansion: `${...}`

Parameter expansion reads or transforms the value of a shell variable. It does not run the contents as a command.

```bash
animal=cat
echo "${animal}s"                  # cats
echo "${animal}_food"              # cat_food
echo "${HOME}/Documents"
```

The braces separate the variable name from adjacent text. This is the essential difference:

```bash
$(date)                            # Output of the date command
${HOME}                            # Value of the HOME variable
```

### `xargs`: Build Commands from Input

```bash
printf '%s\n' file1 file2 file3 | xargs echo
printf '%s\n' file1 file2 file3 | xargs -n 1 echo "Processing:"
printf '%s\0' *.txt | xargs -0 -I {} cp {} backup/
```

Use `-0` with null-delimited input whenever filenames are involved.


## Environment, Aliases, and History

### Environment Variables

```bash
echo "$HOME"                       # Home directory
echo "$PATH"                       # Directories searched for executables
echo "$USER"                       # Current username

export PROJECT_ROOT="$HOME/project" # Set and export a variable
```

Changes made at the prompt normally last only for the current shell session. Add persistent settings to `~/.zshrc` for Zsh or `~/.bashrc` for Bash, then start a new shell or reload the file.

```bash
source ~/.zshrc                    # Reload Zsh configuration
source ~/.bashrc                   # Reload Bash configuration
```

### Aliases and Functions

```bash
alias ll='ls -lah'
alias ..='cd ..'
unalias ll
```

Aliases are suited to simple command substitutions. Use a function when you need arguments or multiple commands:

```bash
mkcd() {
    mkdir -p "$1" && cd "$1"
}

mkcd new-project
```

### Command History

```bash
history                            # Show history
history 20                         # Show recent entries in many shells
!!                                 # Repeat the previous command
!123                               # Run history entry 123
!$                                 # Last argument of the previous command
```

History expansion depends on the shell and its configuration. Use `Ctrl + R` when you want to find and inspect a command before running it.


## Permissions and Ownership

Permissions control who may read, modify, or execute files and who may list, modify, or enter directories.

### Inspect Permissions

```bash
ls -l script.sh
# -rwxr-xr--  1 user  group  1234 Aug  4 15:18 script.sh
```

The first character is the file type: `-` for a regular file, `d` for a directory, and `l` for a symbolic link. The next nine characters are three permission groups:

```text
rwx r-x r--
│   │   └── others
│   └────── group
└────────── owner (user)
```

For a regular file:

- `r` allows reading the contents.
- `w` allows modifying the contents.
- `x` allows executing the file as a program.

For a directory:

- `r` allows reading its list of names.
- `w` allows creating, renaming, or removing entries, subject to other permissions.
- `x` allows entering the directory and accessing entries whose names are known.

### Symbolic Permissions with `chmod`

| Symbol | Meaning |
| --- | --- |
| `u` | User or owner |
| `g` | Group |
| `o` | Others |
| `a` | Everyone |

| Operator | Meaning |
| --- | --- |
| `=` | Set exact permissions |
| `+` | Add permissions |
| `-` | Remove permissions |

```bash
chmod u+x script.sh               # Add execute for the owner
chmod g-w file.txt                # Remove group write access
chmod o-r secret.txt              # Remove read access for others
chmod a+r file.txt                # Add read access for everyone
chmod u=rwx,g=rx,o=r file.txt     # Set each class explicitly
```

### Numeric Permissions with `chmod`

Each digit is the sum of `4` for read, `2` for write, and `1` for execute. The three digits apply to owner, group, and others.

| Mode | Symbolic form | Typical use |
| --- | --- | --- |
| `755` | `rwxr-xr-x` | Publicly executable script or traversable directory |
| `700` | `rwx------` | Private executable or directory |
| `644` | `rw-r--r--` | Common document or configuration file |
| `600` | `rw-------` | Private file |
| `777` | `rwxrwxrwx` | Full access for everyone; rarely appropriate |

```bash
chmod 755 script.sh
chmod 644 document.txt
chmod 600 private-key
chmod -R u+rwX,go-rwx private-directory/
```

:::note
New files often begin from mode `666` and new directories from `777`, but the shell's `umask` removes permissions. Run `umask` to inspect the current mask. The execute bit is omitted from the base mode for regular files so that ordinary new files do not become executable automatically.
:::

:::warning
Apply recursive permission changes carefully. `chmod -R 755 directory/` also marks every regular file executable and readable by everyone. Symbolic mode `u+rwX` uses uppercase `X` to add execute only to directories and to files that are already executable.
:::

### Change Owner and Group

```bash
chown user file.txt                 # Change owner
chown user:group file.txt           # Change owner and group
chown -R user:group directory/      # Apply recursively
```

Changing ownership commonly requires administrator privileges, for example `sudo chown ...`.


## Links

### Symbolic Links

A symbolic link is a small filesystem entry that stores a path to another file or directory.

```bash
ln -s /path/to/original /path/to/link
ln -s ~/Documents/project ~/Desktop/project-link
ls -l ~/Desktop/project-link
# project-link -> /Users/username/Documents/project
```

Useful options:

```bash
ln -sf original link              # Replace an existing destination
ln -s ~/Documents/notes.txt .     # Create the link in the current directory
```

- A symbolic link may point to a file or directory.
- If its target is removed or moved, the link may break.
- Relative links can be more portable within a directory tree; absolute links are independent of the current working directory.

:::note
A macOS Finder alias is not the same as a symbolic link. Command-line tools understand symbolic links directly, while Finder aliases use macOS-specific metadata.
:::

### Hard Links

```bash
ln original.txt hardlink.txt
```

Hard-linked filenames refer to the same underlying file data. Removing one name does not remove the data while another hard link remains. Hard links normally cannot cross filesystems or refer to directories.


## Process and Job Management

### Inspect Processes

```bash
ps                                 # Processes associated with this terminal
ps aux                             # All processes in BSD-style output
ps aux | grep '[p]ython'           # Find a process without matching grep itself
pgrep -fl python                   # Find process IDs and command lines
top                                # Interactive system process viewer
htop                               # Alternative viewer, if installed
```

### Foreground and Background Jobs

```bash
long_running_command &             # Start in the background
jobs                               # List jobs belonging to this shell
fg %1                              # Bring job 1 to the foreground
bg %1                              # Resume suspended job 1 in the background
```

Press `Ctrl + Z` to suspend a foreground process, then use `bg` to continue it in the background or `fg` to bring it back.

### Stop Processes

```bash
kill PID                           # Request a graceful termination
kill -TERM PID                     # Same signal, written explicitly
killall process_name               # Signal processes by name
kill -9 PID                        # Force termination with SIGKILL
```

Use `kill -9` only when normal termination does not work. It prevents the process from cleaning up files or other resources.


## Writing Bash Scripts

A shell script stores a sequence of commands in a text file so that it can be repeated reliably.

### A Minimal Script

Create `hello.sh`:

```bash
#!/usr/bin/env bash

set -euo pipefail

name=${1:-world}
printf 'Hello, %s!\n' "$name"
```

Run it with Bash, or make it executable and run it directly:

```bash
bash hello.sh Kensei

chmod u+x hello.sh
./hello.sh Kensei
```

The first line is the **shebang** and selects the interpreter. The options in `set -euo pipefail` are a common defensive starting point for Bash scripts:

- `-e` exits when an unhandled command fails.
- `-u` reports an unset variable as an error.
- `-o pipefail` makes a pipeline fail when any stage fails.

These options affect control flow, so understand their behavior before adding them to a large existing script.

### Script Arguments and Special Parameters

| Parameter | Meaning |
| --- | --- |
| `$0` | Script or function name |
| `$1` through `$9` | Individual positional arguments |
| `${10}` and above | Positional arguments that require braces |
| `"$@"` | All arguments, preserved as separate strings |
| `"$*"` | All arguments combined into one string |
| `$#` | Number of positional arguments |
| `$$` | Process ID of the current shell |
| `$?` | Exit status of the previous command |
| `$!` | Process ID of the most recent background command |

Use `"$@"` when forwarding arguments:

```bash
backup() {
    cp -v -- "$@" backup/
}

backup "first file.txt" second.txt
```

Quoting `"$@"` preserves `"first file.txt"` as one argument.

### Conditional Statements

Bash and Zsh support the versatile `[[ ... ]]` conditional syntax:

```bash
file=$1

if [[ -f $file ]]; then
    echo "$file is a regular file"
elif [[ -d $file ]]; then
    echo "$file is a directory"
else
    echo "$file does not exist"
fi
```

Useful tests include:

| Test | Meaning |
| --- | --- |
| `-e path` | Path exists |
| `-f path` | Regular file exists |
| `-d path` | Directory exists |
| `-r path` | Path is readable |
| `-w path` | Path is writable |
| `-x path` | Path is executable or traversable |
| `-z string` | String is empty |
| `string1 == string2` | Strings are equal inside `[[ ... ]]` |

The older `[ ... ]` form is specified by POSIX and is more portable to `/bin/sh`. It has stricter quoting and operator rules. Use `[[ ... ]]` in scripts that explicitly select Bash or Zsh, and `[ ... ]` when writing portable `sh` scripts.

### Functions

```bash
find_large_files() {
    local pattern=${1:-'*'}
    local size_mb=${2:-10}
    find . -type f -name "$pattern" -size "+${size_mb}M" -exec ls -lh {} +
}

find_large_files '*.pdf' 20
```

Functions share the current shell environment, so they can change directories and variables in the calling shell. Quote every expansion that should remain one argument.


## Help and Good Habits

### Learn What a Command Does

```bash
man command                        # Full manual page
command --help                     # Common GNU-style quick help
help command                       # Help for a Bash builtin
type command                       # Alias, function, builtin, or executable
command -v command                 # Show how the command resolves
```

Option syntax and behavior can differ between macOS/BSD tools and GNU/Linux tools. Check the manual on the system where the command will run.

### Work Safely

```bash
pwd                                # Confirm your location
ls -la target/                     # Inspect the target
echo rm target/*.tmp               # Preview a wildcard expansion
cp important.txt{,.backup}         # Make a quick backup
rm -i file.txt                     # Request confirmation
```

Aliases such as `alias rm='rm -i'` can add a useful interactive guard, but scripts and other environments may not load the alias. Do not rely on it as the only safety measure.

### Work Efficiently

```bash
cd -                               # Return to the previous directory
pushd /path/to/project             # Save the current directory and move
popd                               # Return to the saved directory
nano file.txt                      # Beginner-friendly terminal editor
vim file.txt                       # Modal terminal editor
open -e file.txt                   # Open in TextEdit on macOS
```


## Practice Exercises

### Create and Inspect a Project

```bash
mkdir -p myproject/{src,tests,docs}
touch myproject/src/{main.py,utils.py}
touch myproject/README.md
tree myproject
```

### Find and Count Files

```bash
find myproject -type f -name '*.py' | wc -l
```

### Search and Transform Text

```bash
printf '%s\n' INFO ERROR INFO ERROR > application.log
grep -n 'ERROR' application.log | tee errors.log | wc -l
```

### Write a Small Script

Create a script that accepts a directory as `$1`, checks that it exists with `[[ -d ... ]]`, and prints its five largest entries using `du`, `sort`, and `tail`.


## Quick Reference

| Task | Commands and operators |
| --- | --- |
| Navigate | `pwd`, `cd`, `ls`, `tree` |
| Create | `mkdir`, `touch` |
| View | `cat`, `less`, `head`, `tail`, `file` |
| Copy, move, remove | `cp`, `mv`, `rm`, `rmdir` |
| Measure | `wc`, `du` |
| Search | `grep`, `find`, `command -v`, `type` |
| Transform text | `sed`, `awk`, `sort`, `uniq`, `cut`, `tr` |
| Redirect and pipe | `>`, `>>`, `<`, `2>`, `|`, `tee` |
| Combine commands | `;`, `&`, `&&`, `||`, `$(...)` |
| Permissions | `chmod`, `chown`, `umask` |
| Links | `ln`, `ln -s` |
| Processes and jobs | `ps`, `top`, `pgrep`, `kill`, `jobs`, `fg`, `bg` |
| Help | `man`, `--help`, `help`, `type` |
