---
title: "YouTube Video Transcription & Summary Tool"
date: "2025-10-17"
subtitle: "A Python tool (CLI & GUI) that extracts YouTube video transcripts and automatically generates summaries using Google Gemini API"
previewImage: https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/b2b8c4e8-951e-4be0-a001-8bd514db63dc.png
tags: [Python, YouTube, AI, FastAPI]
---


![preview.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/b2b8c4e8-951e-4be0-a001-8bd514db63dc.png)


## 1. Introduction
- Have you ever thought while watching a YouTube video, "I wish I could review this content in text later"? Especially with tutorial videos or lecture videos, you don't want to miss important points.
- Or perhaps, "This looks interesting, but the video is long, so I want to know just the key points before watching."
- The tool introduced here is a Python tool (CLI & GUI) that extracts YouTube video transcripts and even automatically creates summaries using the Google Gemini API.

:::linkcard
https://github.com/kkensuke/yt_dlp_transcript
:::

## 2. What This Tool Can Do
### Main Features
- 🎥 **Transcript Extraction**: Stable extraction using `yt-dlp`
- 🔗 **Robust ID Extraction**: Extract Video ID from various YouTube URL formats
- 📝 **Markdown Format Output**: Easy-to-read markdown format with timestamps
- 🔧 **Flexible Output Options**: Customize timestamps, summary inclusion, etc.
- 🤖 **AI Summary Function**: Structured summaries by Gemini API (selectable in Japanese or English)


For example, using this tool, you can apply it to:
- **Tutorial videos**: Transcribe and summarize key points
- **University lecture videos**: Automatically generate summary notes for review
- **English videos**: Efficiently learn through transcription & Japanese summary
- **Long conference videos**: Quickly grasp the main points


## 3. About the Code Structure
This repository offers two ways to use it:

### 3.1. CLI Version
#### 3.1.1. Modularized Version `main.py`
```
main.py                     # Main script
├── url_extractor.py        # URL/Video ID extraction
├── transcript_processor.py # Transcript processing
├── gemini_api.py           # AI summary generation
└── utils.py                # Utility functions
```

#### 3.1.2. All-in-One Version `all.py`
If you want to keep it simple with one file, use `all.py` which integrates all features.

### 3.2. GUI Version Using FastAPI `app.py`
You can also start `app.py` and use it with a UI like the following:

![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/fd0e33c0-d419-4f64-a818-b19721e12292.png)


## 4. Installation
### 4.1. Download the Script
Clone or download the repository from GitHub:
```bash
git clone https://github.com/kkensuke/yt_dlp_transcript
cd yt_dlp_transcript
```

### 4.2. Install Required Libraries
```bash
pip install yt-dlp

# If using `app.py`, also install fastapi and uvicorn
pip install fastapi uvicorn
```

### 4.3. (Optional) Gemini API Setup
If you want to use the summary feature, you need a Gemini API key:
1. Obtain an API key from [Google AI Studio](https://makersuite.google.com/)
2. Set the environment variable:
    ```bash
    export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
3. You can also set it directly in each file (`main.py`, `all.py`, `app.py`):
    ```python
    GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
    ```

## 5. Basic Usage
### 5.1. Using the GUI
Run the following and open `http://localhost:8000` in your browser. Extraction takes about 10 seconds.
```bash
python app.py
```

### 5.2. Simple CLI Usage
```bash
# Specify a YouTube URL
python main.py 'https://www.youtube.com/watch?v=VIDEO_ID'

# Or just the Video ID works too
python main.py 'VIDEO_ID'
```
The same applies when using `all.py`.

This will generate two files:
1. `{video_id}_transcript.md` - Transcript with timestamps
2. `{video_id}_summarized.md` - AI-generated summary (when API key is set)


### 5.3. Example of Generated Files
**Transcript File (transcript.md)**:

```markdown
# Introduction to Python Programming

**Video ID:** ABC123  
**YouTube URL:** https://www.youtube.com/watch?v=ABC123

---

**[00:00:15]** Hello, today I will explain the basics of Python programming.

**[00:01:30]** First, let's discuss variables. A variable is like a box for storing data.
```


**Summary File (summarized.md)**:
```markdown
# Introduction to Python Programming - Summary

## 📝 Summary
This video covers basic Python concepts including variables, data types, and control structures...

## 🔑 Key Concepts and Keywords
- **Variable**: Container for storing data, Importance (High)
- **Data Type**: Integers, strings, lists, etc., Importance (High)

## ✨ Important Points
- Python is a beginner-friendly programming language
- Using variables allows for efficient data management
...
```


## 6. Detailed Options
### 6.1. Remove Timestamps
If you don't need timestamps:
```bash
python main.py 'VIDEO_URL' --no-timestamps
```

### 6.2. Skip Summary
If you only want the transcript:
```bash
python main.py 'VIDEO_URL' --no-summary
```

### 6.3. Specify Summary Language
If the video is in Japanese but you want the summary in English:
```bash
python main.py 'VIDEO_URL' --summary-lang en
```

Conversely, for a Japanese summary of an English video:
```bash
python main.py 'VIDEO_URL' --summary-lang ja
```

### 6.4. Custom File Name
If you want to specify an output file name:
```bash
python main.py 'VIDEO_URL' -o my_custom_transcript.md
```


## 7. Practical Use Cases
### 7.1. Case 1: Automatic Lecture Note Generation
```bash
# Create Japanese summary notes from university lecture videos
python main.py 'LECTURE_VIDEO_URL' --summary-lang ja -o lecture_note.md
```

**Use Scenarios**:
- Summary of key points for review


### 7.2. Case 2: Creating English Learning Materials
```bash
# Get transcripts of English videos (no summary needed)
python main.py 'ENGLISH_VIDEO_ID' --no-summary
```

**Use Scenarios**:
- Answer checking for listening practice
- Confirming unknown words or phrases


### 7.3. Case 3: Summarizing Technical Conference Videos
```bash
# Extract key points from long technical conference videos
python main.py 'https://www.youtube.com/watch?v=CONF_VIDEO' --summary-lang ja
```

**Use Scenarios**: 
- Grasp the main points of a 1+ hour video in 5 minutes



## 8. Troubleshooting
### 8.1. Gemini API Errors
1. Verify that the API key is correct
2. Check quota at [Google AI Studio](https://makersuite.google.com/)

### 8.2. yt-dlp Extraction Failure
- Update `yt-dlp` if it's outdated: `pip install -U yt-dlp`
- If daily usage limit is exceeded, wait until the next day


## 9. Customization Ideas
### 9.1. Adjusting Summary Prompts
You can change the summary style by customizing the prompt in `gemini_api.py`:

```python
# Example: For more technical summaries
prompt = f"""
You are an experienced software engineer.
From the following technical video transcript, extract specific information useful for implementation.
- Emphasize best practices
- Include cautions and common mistakes
...
"""
```


### 9.2. Handling Long Texts
For transcripts longer than 50,000 characters, adjust `MAX_SUMMARY_LENGTH` in `main.py`:
```python
MAX_SUMMARY_LENGTH = 100000  # Support for longer videos
```
However, be mindful of Gemini's token limits.


### 9.3. Create an alias in Zsh
You can create aliases in Zsh to invoke them with shorter commands.
```bash
you() {
    if [ $# -lt 1 ]; then
        echo "Usage: you [summary-lang] 'URL'"
        echo "  summary-lang: en|ja|no|auto (default: auto)"
        return 2
    fi

    # If only one argument, treat it as URL with auto language
    if [ $# -eq 1 ]; then
        lang="auto"
        url="$1"
    else
        # Two or more arguments: first is language, rest is URL
        lang="$1"; shift
        url="$*"
    fi

    cd ~/Desktop
    source <path_to>/venv/bin/activate || { echo "activating venv failed"; return 1; }

    case "$lang" in
        en) opts=(--summary-lang en) ;;
        ja) opts=(--summary-lang ja) ;;
        no) opts=(--no-summary) ;;
        auto) opts=(--summary-lang auto) ;;
        *) echo "Unknown option: $lang"; echo "Usage: you [lang] URL"; echo "  lang: en|ja|no|auto (default: auto)"; deac; return 2 ;;
    esac

    python <path_to>/yt_dlp_transcript/all.py "$url" "${opts[@]}"
    rc=$?

    deac
    return $rc
}
```

### 9.4. Quicklook で Markdown をレンダリング
QLMarkdown is an app that renders Markdown in QuickLook.
It displays the content of generated subtitle and summary files in an easy-to-read format.
```bash
brew install --cask qlmarkdown
```


## 10. Summary
Using this tool, you can efficiently extract information from YouTube videos:
- ✅ **Time Saving**: Grasp key points with summaries when you don't have time to watch long videos  
- ✅ **Enhanced Learning**: Easier review with transcripts  
- ✅ **Crossing Language Barriers**: Collect information with English video → Japanese summary  
- ✅ **Knowledge Base Building**: Accumulate technical videos as text materials  


---

**Reference Links**:
- [yt-dlp Official Documentation](https://github.com/yt-dlp/yt-dlp)
- [Google AI Studio](https://makersuite.google.com/)