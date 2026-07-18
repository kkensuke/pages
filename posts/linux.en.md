---
title: "Command Line Guide"
date: "2022-10-18"
subtitle: "A Comprehensive Overview of Command Line Operations"
tags: [CLI]
---


Here we learn the command line - a text interface to computers. You input text commands to perform operations like creating or removing files, changing file permissions, and more.

On Mac, you can use the command line in `Terminal.app`.

## Keyboard Shortcuts

Essential keyboard shortcuts for efficient terminal usage:

### Basic Control
| Shortcut | Description |
| :-----: | :---------: |
|Ctrl + C| Interrupt the current process|
|Ctrl + Z| Suspend the current process|
|Ctrl + D| Exit the shell|
|Ctrl + L| Clear the screen|
|Ctrl + S| Pause command output|
|Ctrl + Q| Resume output (after Ctrl+S)|

### Navigation & Editing
| Shortcut | Description |
| :-----: | :---------: |
|Ctrl + A| Move cursor to start of line|
|Ctrl + E| Move cursor to end of line|
|Ctrl + Left/Right| Move by word|
|Alt + B / Alt + F| Move backward/forward by word|
|Ctrl + T| Swap characters|
|Alt + T| Swap words|

### Cut, Copy, and Undo
| Shortcut | Description |
| :-----: | :---------: |
|Ctrl + W| Cut the word before cursor|
|Ctrl + U| Cut everything before cursor|
|Ctrl + K| Cut everything after cursor|
|Ctrl + Y| Paste the last cut text|
|Ctrl + _| Undo|

### Command History
| Shortcut | Description |
| :-----: | :---------: |
|↑ / ↓| Previous/next command|
|Ctrl + R| Search command history (reverse)|
|Ctrl + G| Exit history search|

---

## Special Symbols

Four special symbols represent important locations:

|Symbol|Meaning|Example|
|:----:|:-----:|:-----:|
|`/`|root directory|`cd /`|
|`.`|current directory|`ls .`|
|`..`|parent directory|`cd ..`|
|`~`|home directory|`cd ~`|

---

## Basic Commands

### Navigation and Information

`pwd`: Print working directory (show current location)
```bash
pwd
# /Users/username/Documents
```

`cd`: Change directory
```bash
cd ~/Documents        # Go to Documents
cd ..                 # Go up one level
cd -                  # Go to previous directory
```

`ls`: List files and directories
```bash
ls                    # List current directory
ls -l                 # Long format with details
ls -a                 # Show hidden files (starting with .)
ls -lh                # Human-readable file sizes
ls -ltr               # Sort by time, reverse order
```

---

### Working with Directories

`mkdir`: Make directory
```bash
mkdir project                    # Create single directory
mkdir -p dir/subdir/subsubdir    # Create nested directories
```

`rmdir`: Remove empty directory
```bash
mkdir temp
rmdir temp                       # Only works if empty
```

`rmdir -p`: Remove directory hierarchy
```bash
mkdir -p dir/subdir/subsubdir
rmdir -p dir/subdir/subsubdir    # Removes all three
```

---

### Working with Files

`touch`: Create empty file or update timestamp
```bash
touch file.txt                   # Create new file
touch existing.txt               # Update modification time
```

`cat`: Display file contents
```bash
cat file.txt                    # Show entire file
cat file1.txt file2.txt         # Show multiple files
cat > newfile.txt               # Create file with input (Ctrl+D to finish)
```

`head` / `tail`: Show beginning or end of file
```bash
head file.txt                   # First 10 lines (default)
head -n 5 file.txt              # First 5 lines
tail -f logfile.txt             # Follow file in real-time (useful for logs)
```

`less` / `more`: View files page by page
```bash
less largefile.txt              # Navigate with arrow keys, q to quit
```

`rm`: Remove files
```bash
rm file.txt                     # Remove file
rm -i file.txt                  # Confirm before removing
rm -v file.txt                  # Verbose (show what's removed)
rm -f file.txt                  # Force remove (no confirmation)
```

`rm -r`: Remove directories recursively
```bash
rm -r directory                  # Remove directory and contents
rm -rf directory                 # Force remove (CAUTION: no recovery!)
```

:::warning
Be extremely careful with `rm -rf` - it permanently deletes without confirmation!
:::

---

### Copying and Moving

`cp`: Copy files or directories
```bash
cp source.txt dest.txt           # Copy file
cp -r dir1 dir2                  # Copy directory recursively
cp -i source.txt dest.txt        # Confirm before overwriting
cp file1 file2 file3 target/     # Copy multiple files to directory
```

:::note
Copy behavior:
- `cp file1 file2` - This overwrite file2 with contents of file1.
- `cp -r dir1 dir2` - If dir2 exists, creates dir1 inside dir2. If dir2 doesn't exist, creates exact copy
:::

`mv`: Move or rename files/directories
```bash
mv old.txt new.txt              # Rename file
mv file.txt directory/          # Move file to directory
mv dir1 dir2                    # Move/rename directory
```

---

### File Information

`file`: Determine file type
```bash
file document.pdf
# document.pdf: PDF document, version 1.4
```

`wc`: Word count
```bash
wc file.txt                     # Lines, words, bytes
wc -l file.txt                  # Count lines only
wc -w file.txt                  # Count words only
```

`du`: Disk usage
```bash
du -h file.txt                  # Human-readable size
du -sh directory/               # Summary of directory size
```

---

## Text Processing

`echo`: Print text or create files with content
```bash
echo "Hello World"              # Print to screen
echo $PATH                      # Print environment variable
echo "text" > file.txt          # Create/overwrite file
echo "more" >> file.txt         # Append to file
```

`grep`: Search for patterns in files
```bash
grep "word" file.txt            # Search for word
grep -i "Word" file.txt         # Case-insensitive search
grep -n "word" file.txt         # Show line numbers
grep -r "word" directory/       # Search recursively in directory
grep -v "word" file.txt         # Show lines NOT containing word
grep -c "word" file.txt         # Count matching lines
grep -w "word" file.txt         # Match whole word only
grep -l "word" *.txt            # List files containing word
grep -o "word" file.txt         # Show only matched parts
grep --color "word" file.txt    # Highlight matches in color
```

`sed`: Stream editor for text manipulation
```bash
sed 's/old/new/' file.txt         # Replace first occurrence per line
sed 's/old/new/g' file.txt        # Replace all occurrences
sed '2d' file.txt                 # Delete line 2
sed -i '' 's/old/new/g' file.txt  # Edit file in-place (Mac)
```

`awk`: Pattern scanning and processing
```bash
awk '{print $1}' file.txt       # Print first column
awk '{print $NF}' file.txt      # Print last column
awk '/pattern/ {print $0}' file.txt  # Print lines matching pattern
```

---

## Permissions

Permissions control who can **open**, **modify**, or **run** a file or directory. You can set file permissions for the file owner, group, and others using a symbolic or numeric (octal) method with the `chmod` command.

### Checking Current Permissions
You can view current permissions using `ls -l`:
```bash
ls -l file.txt
# -rwxr-xr--  1 user  group  1234 Aug  4 15:18 file.txt
```

The first 10 characters represent the file type and permissions:
- The first character indicates the file type (`-` for regular file, `d` for directory).
- The next 9 characters `rwxr-xr--` represent permissions for owner, group, and others.
- `r` = read, `w` = write, `x` = execute, `-` = no permission.
- owner: `rwx` (read, write, execute)
- group: `r-x` (read, execute)
- others: `r--` (read only)


### Symbolic Permission Changes
You can change permissions using the following symbols and syntax with `chmod`:

**Targets:**
- `u` = user (owner)
- `g` = group
- `o` = others
- `a` = all (user + group + others)

**Operations:**
- `=` = set exact permissions
- `+` = add permission
- `-` = remove permission

**Permission Types:**
- `r` = read the file's contents (for directories: list files).
- `w` = modify the file (for directories: create/delete files).
- `x` = run the file as a program (for directories: enter the directory / use `cd`).

**Examples:**
```bash
chmod u+x script.sh             # Make executable for owner
chmod g-w file.txt              # Remove write for group
chmod o-r secret.txt            # Remove read for others
chmod a+r file.txt              # Add read for all
chmod u=rwx,g=rx,o=r file.txt   # Set specific permissions
```

### Numeric (Octal) Permission Changes (Advanced)
You can also set file permissions using a three-digit octal number, like `chmod 755 file.txt`.
The three digits represent permissions for: **[owner] [group] [others]**.
Each digit is a sum of the following values:
- **4** = read (r)
- **2** = write (w)
- **1** = execute (x)
- **0** = no permission

**Common permission codes:**
```bash
chmod 755 file.txt
# 7 (owner):  4+2+1 = read + write + execute
# 5 (group):  4+1   = read + execute
# 5 (others): 4+1   = read + execute

chmod 644 file.txt
# 6 (owner):  4+2 = read + write
# 4 (group):  4   = read only
# 4 (others): 4   = read only

chmod 777 file.txt              # Full permissions for everyone (rarely needed)
chmod 700 file.txt              # Private file (owner only)
```

`chmod -R`: Change permissions on directories and their contents recursively
```bash
chmod -R 755 directory/         # Apply to directory and all contents
```
Be careful — applying `755` recursively can make private files readable by everyone.

### Permission Code Correspondence

| Permission | Owner | Group | Others | Description |
|------------|-------|-------|--------|-------------|
| `700` | `rwx` | `---` | `---` | Private file (owner full access only) |
| `755` | `rwx` | `r-x` | `r-x` | Common for executable scripts |
| `644` | `rw-` | `r--` | `r--` | Common for documents/config files |
| `600` | `rw-` | `---` | `---` | Read/write for owner only |
| `777` | `rwx` | `rwx` | `rwx` | Full access for everyone (rarely safe) |


### Changing owner and group

`chown`: Change file owner:
```bash
chown user file.txt             # Change owner
chown user:group file.txt       # Change owner and group
chown -R user directory/        # Recursive
```

---

## Finding Files

`find`: Search for files and directories
```bash
# Basic syntax
find [path] [options] [expression]

# Find by name
find . -name "*.txt"                 # Find all .txt files
find . -iname "*.TXT"                # Case-insensitive

# Find by type
find . -type f                       # Find files only
find . -type d                       # Find directories only

# Find by time (days)
find . -mtime -7                     # Modified in last 7 days
find . -atime +30                    # Accessed more than 30 days ago

# Find by size
find . -size +10M                    # Larger than 10MB
find . -size -100k                   # Smaller than 100KB
find . -size +1M -size -10M          # Between 1MB and 10MB

# Combine conditions
find . -name "*.log" -mtime +30      # Old log files
find . -type f -empty                # Empty files

# Execute commands on results
find . -name "*.tmp" -delete         # Delete all .tmp files
find . -name "*.txt" -exec rm {} \;  # Remove each file
find . -name "*.txt" -exec rm {} +   # Remove all at once (faster)
```

`locate`: Fast file search using database
```bash
locate filename                 # Quick search (may need: sudo updatedb)
```

`which`: Find command location
```bash
which python                    # Shows path to python executable
```

`whereis`: Find binary, source, and manual pages
```bash
whereis python                  # Shows multiple related paths
```

---

## Wildcards and Pattern Matching

### Shell Globbing

**Basic wildcards:**
```bash
*                               # Matches zero or more characters
?                               # Matches exactly one character
[abc]                           # Matches any character in set
[a-z]                           # Matches any character in range
[!abc]                          # Matches any character NOT in set
```

**Examples:**
```bash
ls *.txt                        # All .txt files
ls file?.txt                    # file1.txt, fileA.txt, etc.
ls [abc]*.txt                   # Files starting with a, b, or c
ls [0-9][0-9].txt               # Two-digit numbered files
rm temp*                        # Remove all files starting with temp
```

### Extended Pattern Matching

Enable with: `shopt -s extglob`

```bash
*(pattern)                      # Matches 0 or more times
+(pattern)                      # Matches 1 or more times
?(pattern)                      # Matches 0 or 1 time
@(pattern)                      # Matches exactly once
!(pattern)                      # Matches anything except pattern
```

**Examples:**
```bash
# Setup
shopt -s extglob
ls
# file1 file2 file3 file11 file123

# Examples
ls !(file1)                     # Everything except file1
ls !(file1|file2)               # Everything except file1 and file2
ls file[0-9]                    # file1 file2 file3 file4
ls file+([0-9])                 # file1 file2 file3 file4 file11 file123
```

### Brace Expansion

Generate arbitrary strings:
```bash
echo {1,2,3}                     # 1 2 3
echo file{1..5}.txt              # file1.txt file2.txt ... file5.txt
echo {a..z}                      # a b c ... z

# Combine patterns
echo {A,B}{1,2}                  # A1 A2 B1 B2

# Practical examples
mkdir -p project/{src,test,docs}
touch file{1..10}.txt
cp file.txt{,.backup}            # Quick backup: file.txt.backup
mv /path/{foo,bar,baz}.txt dir/  # Move multiple specific files
```

---

## Pipes and Redirection

### Understanding Streams

Unix has three standard streams:
- **stdin (0)** - Standard input (keyboard)
- **stdout (1)** - Standard output (screen)
- **stderr (2)** - Standard error (screen)

### Redirection Operators

```bash
command > file                  # Redirect stdout to file (overwrite)
command >> file                 # Redirect stdout to file (append)
command 2> file                 # Redirect stderr to file
command &> file                 # Redirect both stdout and stderr
command > file 2>&1             # Redirect stdout and stderr (alternative)
command < file                  # Read stdin from file
command 2>/dev/null             # Discard error messages
command &>/dev/null             # Discard all output
```

**Examples:**
```bash
ls -l > listing.txt               # Save output to file
echo "log entry" >> log.txt       # Append to log file
find / -name "*.txt" 2>/dev/null  # Search without permission errors
```

### Pipes

Chain commands by sending output of one as input to another:

```bash
command1 | command2                  # Pipe stdout of command1 to command2

# Examples
ls -l | grep ".txt"                  # List only .txt files
cat file.txt | wc -l                 # Count lines in file
history | tail -20                   # Show last 20 commands
ps aux | grep python                 # Find Python processes
cat access.log | grep "404" | wc -l  # Count 404 errors
```

**Useful pipe combinations:**
```bash
# Sort and remove duplicates
cat file.txt | sort | uniq

# Count unique occurrences
cat file.txt | sort | uniq -c

# Find largest files
du -h | sort -rh | head -10

# Monitor system processes
ps aux | grep -i chrome | wc -l
```

---

## Combining Commands

**Sequential execution (`;`)** - Run commands one after another
```bash
command1 ; command2             # command2 runs regardless of command1's success
cd /tmp ; ls ; pwd
```

**Background execution (`&`)** - Run command in background
```bash
command1 & command2             # Both run simultaneously
long_process & echo "Started"
```

**Conditional AND (`&&`)** - Run next command only if previous succeeds
```bash
command1 && command2            # command2 runs only if command1 succeeds
mkdir project && cd project
make && make test && make install
```

**Conditional OR (`||`)** - Run next command only if previous fails
```bash
command1 || command2            # command2 runs only if command1 fails
cd /tmp || echo "Failed to change directory"
```

**Command substitution (`$(...)`)** - Use output of command as argument
```bash
echo "Today is $(date)"
touch file_$(date +%Y%m%d).txt
ls $(dirname $(which python))   # Nested commands
```

`xargs`: Build and execute commands from standard input
```bash
# Basic usage
echo "file1 file2 file3" | xargs rm

# Common patterns
find . -name "*.tmp" | xargs rm              # Remove found files
find . -type f -name "*.txt" | xargs grep "pattern"  # Search in found files

# Handle filenames with spaces
find . -name "*.txt" -print0 | xargs -0 rm   # Use null separator

# Control execution
ls *.txt | xargs -n 1 echo "Processing:"     # One argument at a time
ls *.txt | xargs -I {} cp {} backup/         # Use placeholder
```

---

## Directory Visualization

`tree`: Display directory structure in tree format

Install first (if needed):
```bash
brew install tree               # macOS
```

**Usage:**
```bash
tree                            # Show full tree
tree -L 2                       # Limit depth to 2 levels
tree -d                         # Directories only
tree -a                         # Include hidden files
tree -I 'node_modules|*.pyc'    # Ignore patterns
tree --dirsfirst                # List directories first
tree -h                         # Human-readable sizes

# Example output
project/
├── src/
│   ├── main.py
│   └── utils.py
├── tests/
│   └── test_main.py
└── README.md
```

---

## Symbolic Links

`ln -s`: Create symbolic links (symlinks). A symbolic link is a file that points to another file or directory. It's like a shortcut or alias.

```bash
ln -s /path/to/original /path/to/link

# Examples
ln -s ~/Documents/project ~/Desktop/project-link
ln -s /usr/local/bin/python3 ~/bin/python

# Verify link
ls -l link_file
# lrwxr-xr-x  1 user  group  12 Aug  4 15:18 link_file -> original_file
```

**Useful `ln` options:**
```bash
ln -sf original link            # Force create (overwrite existing)
ln -s ~/Documents/notes.txt .   # Create link in current directory
```

**Key points:**
- Symlinks can point to files or directories
- If original is deleted, symlink breaks
- Relative vs absolute paths affect portability

:::note
**macOS Finder Aliases vs Symlinks:**
- **Finder Aliases**: Remain valid if original file moves
- **Symlinks**: Break if original file moves
- **Compatibility**: Symlinks work in terminal (`cd symlink`), Finder aliases don't
:::

**Hard links** (less common):
```bash
ln original hardlink            # Create hard link (no -s flag)
```
- Both files point to same data
- Deleting one doesn't affect the other
- Cannot link directories or across filesystems

---

## Environment and Configuration

**Environment variables:**
```bash
echo $HOME                      # Show home directory
echo $PATH                      # Show executable search paths
echo $USER                      # Show current username

# Set variables
export VAR_NAME="value"         # Set for current session
```

**Aliases:**
```bash
alias ll='ls -lah'              # Create alias
alias ..='cd ..'
unalias ll                      # Remove alias

# Make permanent: add to ~/.zshrc or ~/.bashrc
```

**View command history:**
```bash
history                         # Show all commands
history 20                      # Show last 20 commands
!123                            # Run command #123 from history
!!                              # Repeat last command
!$                              # Last argument of previous command
```

---

## Process Management

**View processes:**
```bash
ps                              # Current shell processes
ps aux                          # All processes
ps aux | grep python            # Find specific processes
top                             # Interactive process viewer
htop                            # Better process viewer (may need install)
```

**Control processes:**
```bash
command &                       # Run in background
jobs                            # List background jobs
fg %1                           # Bring job 1 to foreground
bg %1                           # Resume job 1 in background
kill PID                        # Kill process by ID
kill -9 PID                     # Force kill
killall process_name            # Kill all processes by name
```


---

## Tips and Best Practices

### 1. Safety First
```bash
# Always use -i for interactive confirmation when deleting
alias rm='rm -i'
alias mv='mv -i'
alias cp='cp -i'

# Make backups before destructive operations
cp important.txt{,.backup}
```

### 2. Efficiency Tricks
```bash
# Quick directory navigation
cd -                           # Go to previous directory
pushd /path && popd            # Save and return to directories

# Quick file editing
open -e file.txt               # macOS: open in TextEdit
nano file.txt                  # Simple terminal editor
vim file.txt                   # Powerful terminal editor
```

### 3. Information Gathering
```bash
man command                    # Read manual page
command --help                 # Quick help
which command                  # Find command location
type command                   # Show command type (alias/function/builtin)
```


---

## Practice Exercises

Try these exercises to build your command line skills:

```bash
# 1. Create a project structure
mkdir -p myproject/{src,tests,docs}
touch myproject/src/{main.py,utils.py}
touch myproject/README.md

# 2. Find and count
find . -name "*.py" | wc -l

# 3. Search and replace
find . -name "*.txt" -exec sed -i '' 's/old/new/g' {} +

# 4. Monitor log files
tail -f /var/log/system.log | grep ERROR
```

---


## Quick Reference

```bash
# Navigation
pwd, cd, ls

# File Operations  
touch, cat, cp, mv, rm, mkdir, rmdir

# Text Processing
grep, sed, awk, sort, uniq, wc

# Search
find, locate, which

# Permissions
chmod, chown

# Pipes & Redirection
|, >, >>, <, 2>, &>

# Process Control
ps, top, kill, jobs, fg, bg

# Information
man, --help, which, type
```