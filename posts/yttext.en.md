---
title: "yttext"
date: "2026-09-16"
subtitle: "A CLI and Web App for Extracting YouTube Captions and Summarizing Them with Gemini"
tags: [Python, YouTube, Gemini, Productivity]
---

## 1. Introduction

When watching YouTube tutorials, lectures, or technical videos, you may want to do things like:

* Search the video's content as text later
* Get an overview before watching a long video
* Save technical conference talks or lectures as Markdown
* Extract captions from English videos and summarize them in Japanese
* Export captions as JSON or SRT for use with other tools

`yttext` is a Python application that **extracts captions in the video's original language and converts them into reusable files**.

:::linkcard
https://github.com/kkensuke/yttext
:::

With a Gemini API key, it can also generate **Markdown summaries using Gemini** from the extracted captions. No API key is required to extract captions.

There are two main ways to use it:

* **CLI** — Extract captions, generate summaries, and save files from the terminal
* **Web app** — Configure options in the browser and preview, copy, or download captions and summaries

## 2. What `yttext` Can Do

The main features are:

* Extract captions from a YouTube URL or 11-character Video ID
* Support both manually created and auto-generated captions
* Export to five formats: Markdown / Text / JSON / SRT / VTT
* Generate Markdown summaries with Gemini
* Generate summaries in a language different from the caption language
* Choose how to handle captions longer than 50,000 characters
* Preview, copy, and download results from the Web app

You can use `yttext` as a caption extraction tool even without a Gemini API key.

## 3. Installation

`yttext` is available from PyPI, Homebrew, or source.

### 3.1. Try It Without Installing

If you use `uv`, you can run the CLI without installing it:

```bash
uvx yttext "YOUTUBE_URL" --no-summary
```

The same can be done with `pipx`:

```bash
pipx run yttext "YOUTUBE_URL" --no-summary
```

This is the easiest way if you just want to try extracting captions first.

### 3.2. Install from PyPI

If you use it frequently, you can install it as a tool.

With `uv`:

```bash
uv tool install yttext

# Add the web extra if you also want to use the GUI
uv tool install 'yttext[web]'
```

With `pipx`:

```bash
pipx install yttext

# Add the web extra if you also want to use the GUI
pipx install 'yttext[web]'
```

If the version is displayed correctly with the following command, the installation was successful:

```bash
yttext --version
```

You can start the GUI with:

```bash
yttext web
```

### 3.4. Homebrew

On macOS and other environments where Homebrew is available, you can install both the CLI and Web app together:

```bash
brew install kkensuke/tap/yttext
```

## 4. Configuring the Gemini API Key

A Gemini API key is not required if you only want to extract captions.

The API key is only used for Gemini summarization and retrieving the list of available Gemini models.

### 4.1. macOS / Linux

The CLI uses the `GEMINI_API_KEY` environment variable:

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

If you want to use a specific model, you can optionally set `GEMINI_MODEL`:

```bash
export GEMINI_MODEL="gemini-flash-lite-latest"
```

### 4.2. Windows PowerShell

```powershell
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
$env:GEMINI_MODEL = "gemini-flash-lite-latest"
```

### 4.3. Do Not Pass the API Key as a CLI Argument

The CLI uses environment variables. There is no option for passing the API key as a command-line argument.

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

yttext "YOUTUBE_URL"
```

## 5. Web App

### 5.1. Starting the App

If the Web dependencies are installed, or if you are using the Homebrew version, start the app with:

```bash
yttext web
```

In local mode, it uses the following address by default:

```text
http://127.0.0.1:8000
```

After startup, the default browser opens automatically.

The Web app lets you:

* Enter a YouTube URL / Video ID
* Select an output format
* Enable or disable Gemini summarization
* Select the summary language
* Select a Gemini model
* Load available Gemini models
* Select local browser cookies
* Preview captions
* Preview summaries
* Copy content to the clipboard
* Download files

Markdown tables, nested lists, code blocks, LaTeX formulas, and similar content can also be rendered in the browser.

### 5.2. Using Gemini in the Web App

An API key is required when Gemini summarization is enabled.

If `GEMINI_API_KEY` is not configured on the local server, you can enter your own Gemini API key in the browser.

The entered key is used only for Gemini operations.

A key entered in the browser is cleared after the summary request is submitted.

Therefore, if you run another Gemini operation, you need to enter the API key again.

### 5.3. If You Do Not Want to Enter the API Key Every Time

In a local environment, you can set environment variables before starting the Web app:

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
export GEMINI_MODEL="gemini-flash-lite-latest"

yttext web
```

For local loopback access, the server process can use `GEMINI_API_KEY` as a fallback.

If a different API key is entered in the browser, the browser-provided key takes priority.

## 6. CLI Basics

The basic syntax is:

```bash
yttext [OPTIONS] YOUTUBE_URL_OR_VIDEO_ID
```

Help:

```bash
yttext --help
```

The main options are:

| Option                                    | Description                                             |
| ----------------------------------------- | ------------------------------------------------------- |
| `-o, --output-dir DIR`                    | Output directory for caption and summary files          |
| `-f, --format {md,txt,json,srt,vtt}`      | Caption format. Defaults to `md`                        |
| `-n, --no-summary`                        | Disable Gemini summarization                            |
| `-l, --summary-lang LANGUAGE`             | `auto` or a BCP 47 language tag                         |
| `-L, --long-summary {skip,truncate,full}` | How to summarize captions longer than 50,000 characters |
| `-c, --cookies-from-browser BROWSER`      | Use cookies from a local browser                        |
| `-m, --gemini-model MODEL_ID`             | Select a Gemini model                                   |
| `-M, --list-gemini-models`                | List models that support `generateContent`              |
| `-V, --version`                           | Show the version                                        |
| `-h, --help`                              | Show help                                               |

Long option names cannot be abbreviated.

For example, instead of abbreviating `--output-dir` as `--out`, use the short form `-o`.

## 7. CLI Examples

### 7.1. Extract Captions Only

You can use the tool without a Gemini API key:

```bash
yttext "YOUTUBE_URL" --no-summary

# Short form:
yttext "YOUTUBE_URL" -n
```

### 7.2. Generate Captions and a Gemini Summary

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

yttext "https://www.youtube.com/watch?v=VIDEO_ID"
```

You can also provide only the Video ID:

```bash
yttext "VIDEO_ID"
```

Even if no API key is configured, caption extraction still runs and only the summary is skipped.

### 7.3. Change the Output Directory

```bash
yttext "YOUTUBE_URL" --output-dir output/

# Short form:
yttext "YOUTUBE_URL" -o output/
```

`-o` specifies an **output directory**, not a file name.

### 7.4. Save as JSON

```bash
yttext "YOUTUBE_URL" --format json --no-summary

# Short form:
yttext "YOUTUBE_URL" -f json -n
```

The following five formats are available:

```text
md
txt
json
srt
vtt
```

### 7.5. Summarize an English Video in Japanese

```bash
yttext "ENGLISH_VIDEO_URL" --summary-lang ja

# Short form:
yttext "ENGLISH_VIDEO_URL" -l ja
```

The captions are saved in their original language, while only the Gemini summary is generated in Japanese.

You can also summarize a Japanese video in English:

```bash
yttext "JAPANESE_VIDEO_URL" --summary-lang en
```

Use `auto` to generate the summary in the same primary language as the captions:

```bash
yttext "YOUTUBE_URL" --summary-lang auto
```

In addition to `ja` and `en`, the CLI accepts valid BCP 47 language tags.

For example, for Italian:

```bash
yttext "YOUTUBE_URL" --summary-lang it
```

### 7.6. Select a Gemini Model

```bash
yttext "YOUTUBE_URL" \
  --gemini-model "gemini-flash-latest" \
  --summary-lang ja

# Short form:
yttext "YOUTUBE_URL" -m "gemini-flash-latest" -l ja
```

The model is selected in the following order of priority:

1. `--gemini-model`
2. `GEMINI_MODEL`
3. The built-in default model

The current built-in default is `gemini-flash-lite-latest`.

### 7.7. Check Available Gemini Models

```bash
yttext --list-gemini-models

# Short form:
yttext -M
```

### 7.8. Captions Longer Than 50,000 Characters

Captions for long videos may exceed 50,000 characters.

The CLI lets you choose how to handle them.

Send the entire transcript to Gemini:

```bash
yttext "YOUTUBE_URL" --long-summary full
```

Summarize only the first 50,000 characters:

```bash
yttext "YOUTUBE_URL" --long-summary truncate
```

Skip summarization for long captions:

```bash
yttext "YOUTUBE_URL" --long-summary skip
```

The CLI default is `skip`.

In the Web app, when captions longer than 50,000 characters are detected, a confirmation screen is shown before the full text is sent to Gemini.

### 7.9. Use Browser Cookies

For videos whose captions cannot be retrieved through normal anonymous access, you may be able to use cookies from a local browser.

Chrome:

```bash
yttext "YOUTUBE_URL" --cookies-from-browser chrome

# Short form:
yttext "YOUTUBE_URL" -c chrome
```

The following browsers are supported:

* Chrome
* Chromium
* Edge
* Firefox
* Safari
* Brave

Many videos do not require cookies, so it is recommended to try without them first and use browser cookies only when necessary.

## 8. Generated Files

When Markdown is selected, captions are saved with a file name such as:

```text
{video_id}_transcript.md
```

If Gemini summarization succeeds:

```text
{video_id}_summarized.md
```

If JSON is selected:

```text
{video_id}_transcript.json
```

The extension changes according to the selected format.

### Markdown Example

The Markdown output contains video information, chapters, captions, and other information.

```markdown
# Python プログラミング入門

**Video ID:** a1b2C3d4E5F

**YouTube URL:** https://www.youtube.com/watch?v=a1b2C3d4E5F

**Duration:** 01:02:34

**Captions:** Auto-generated captions (ja)

## Chapters

- [00:00 — はじめに](https://www.youtube.com/watch?v=a1b2C3d4E5F&t=0s)

- [03:15 — 変数](https://www.youtube.com/watch?v=a1b2C3d4E5F&t=195s)

---

**[00:00](https://www.youtube.com/watch?v=a1b2C3d4E5F&t=0s)**

こんにちは。今日は Python の基礎について解説します。
```

Clicking a timestamp opens YouTube at that position.

If the video does not have chapter information, the `Chapters` section is not included.

## 9. Practical Use Cases

### 9.1. Create Review Notes from Lecture Videos

```bash
yttext "LECTURE_VIDEO_URL" --summary-lang ja
```

You can save the complete captions while also generating a Gemini summary.

This can be useful for:

* Reviewing lecture content
* Organizing key points before an exam
* Creating Markdown notes
* Searching for keywords within a video
* Returning only to the parts of the video you need

### 9.2. Read Overseas Technical Videos in Japanese

```bash
yttext "ENGLISH_VIDEO_URL" --summary-lang ja
```

The captions remain in English, while only the summary is generated in Japanese.

This allows you to:

1. Get an overview from the Japanese summary
2. Check the original captions for parts that interest you
3. Return to the relevant point in the video using the timestamp

This is useful when you want to understand the overall content in Japanese while preserving technical terminology in the original language.

### 9.3. Save Captions for English Study

Extract only the captions without generating a summary:

```bash
yttext "ENGLISH_VIDEO_URL" --no-summary
```

To save them as SRT:

```bash
yttext "ENGLISH_VIDEO_URL" -f srt -n
```

Possible uses include:

* Checking your answers after listening practice
* Searching for phrases
* Searching for words
* Loading the captions into a subtitle player

### 9.4. Process the Output as JSON

```bash
yttext "YOUTUBE_URL" -f json -n -o output/
```

JSON output makes the data easier to process from other programs.

For example:

* Preprocessing data for RAG
* Analyzing caption segments
* Processing content by chapter
* Building a search index
* Running custom summarization

### 9.5. Summarize Long Conference Videos

```bash
yttext "CONFERENCE_VIDEO_URL" \
  --summary-lang ja \
  --long-summary full
```

Because this sends the entire caption text to Gemini, check the context limit of the model you are using and your API usage before running it.

## 11. API Key Handling

A Gemini API key is not used for caption extraction.

When Gemini is used from the browser, the entered API key is sent to the backend only when a Gemini operation is performed, and is then passed to Google's Gemini API.

The application is designed not to intentionally store the API key in the following locations:

* URLs
* Caption files
* Summary files
* Short-lived summary jobs
* Browser localStorage
* sessionStorage
* Cookies

An API key entered in the browser is cleared after the Gemini request is submitted.

If you do not want to enter the key every time when using the local Web app, you can use the `GEMINI_API_KEY` environment variable.

## 12. Troubleshooting

### 12.1. No Captions Are Found

First, check the following:

* Whether the video has manual or auto-generated captions
* Whether YouTube exposes the original-language captions in a retrievable form
* Whether the URL / Video ID is correct
* Whether your version of `yttext` is outdated

With `uv`:

```bash
uv tool upgrade yttext
```

With `pipx`:

```bash
pipx upgrade yttext
```

With Homebrew:

```bash
brew update
brew upgrade yttext
```

To update `yt-dlp` when running from source:

```bash
uv lock --upgrade-package yt-dlp
uv sync
```

### 12.2. `HTTP 429` Appears

YouTube may be temporarily rate-limiting requests.

Wait and try again later.

In a local environment, using cookies from a signed-in browser may allow the captions to be retrieved:

```bash
yttext "YOUTUBE_URL" -c chrome
```

### 12.3. Only Gemini Summarization Fails

Caption extraction and Gemini summarization are separate processes.

Even if the Gemini operation fails, the captions that were already extracted remain available.

Check the following:

* Whether the Gemini API key is valid
* Whether you have exceeded your API quota
* Whether the API key restrictions are configured correctly
* Whether the selected Gemini model is available

You can check the model list from the CLI:

```bash
yttext --list-gemini-models
```

In the Web app, use **Load available models**.

### 12.4. The API Key Disappeared from the Web App

This is intentional.

A Gemini API key entered in the browser is cleared when the summary request is submitted.

Enter the API key again if you want to retry.

If you do not want to enter it every time in a local environment, set the environment variable before starting the app:

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

yttext web
```

### 12.5. `yttext web` Reports a Dependency Error

If you installed only the CLI from PyPI, the Web app dependencies are not included.

To use the Web app, install the `web` extra:

```bash
uv tool install 'yttext[web]'
```

or:

```bash
pipx install 'yttext[web]'
```

The Homebrew version includes both the CLI and the Web app.

## 13. Code Structure

The main source code is under `src/yttext/`:

```text
src/yttext/
├── cli.py               # CLI
├── web.py               # FastAPI Web app
├── web_state.py         # Short-lived Web app job management
├── service.py           # Shared caption extraction and summarization workflow
├── youtube.py           # YouTube metadata and caption extraction
├── gemini.py            # Gemini API client
├── renderers.py         # md/txt/json/srt/vtt output
├── summary_languages.py # Summary languages
├── models.py            # Data models
├── errors.py            # Errors
├── utils.py             # Shared utilities
└── ui/                  # Web UI
```

Rather than implementing separate caption extraction logic for the CLI and Web app, both use shared processing centered around `service.py`.

## 14. Development Environment

To modify and test the source code, install the Web and development dependencies:

```bash
uv sync --extra web --extra dev
```

Web app:

```bash
uv run yttext web
```

Tests:

```bash
uv run --extra web --extra dev pytest
```

Ruff:

```bash
uv run --extra web --extra dev ruff check .
```

Format check:

```bash
uv run --extra web --extra dev ruff format --check .
```

### Customizing the Gemini Summary Prompt

The Gemini summarization logic is located in:

```text
src/yttext/gemini.py
```

If you want summaries tailored to your own use case, you can clone the source version and adjust the prompt.

For example, for technical videos:

```text
- Prioritize concrete examples that can be used in implementation
- Organize best practices
- Summarize caveats and common mistakes
- Preserve commands and code snippets whenever possible
```

Rather than modifying an installed package directly, it is easier to clone the Git repository and manage your changes there.

## 15. Summary

`yttext` is a CLI / Web app that extracts YouTube captions in their original language and can optionally summarize them with Gemini.

In summary, it provides:

* Caption extraction without requiring an API key
* Both CLI and Web app interfaces
* Installation from PyPI and Homebrew
* Markdown / Text / JSON / SRT / VTT output
* Links from Markdown timestamps to the corresponding position in the video
* Structured Markdown summaries using Gemini
* Summary language selection using BCP 47 tags
* Configurable handling of captions longer than 50,000 characters

Instead of replaying a long YouTube video from beginning to end, you can first save its captions to a file and, when needed, generate a Gemini summary before reviewing the content.

If you want to keep video content as searchable and reusable text rather than simply watching it once, give `yttext` a try.
