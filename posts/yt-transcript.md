---
title: "YouTube 動画の文字起こし＆要約ツール紹介"
date: "2025-10-17"
subtitle: "YouTube 動画の文字起こしを取得し、Google Gemini API で要約まで自動生成する Python ツール（CLI & GUI）"
previewImage: https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/b2b8c4e8-951e-4be0-a001-8bd514db63dc.png
tags: [Python, YouTube, AI, FastAPI]
---


![preview.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/b2b8c4e8-951e-4be0-a001-8bd514db63dc.png)


## 1. はじめに
- YouTube 動画を見ていて「この内容、後でテキストで読み返したいな」と思ったことはありませんか？特に解説動画や講義動画では、重要なポイントを見逃したくないですよね。
- あるいは、「面白そうだが、動画の尺が長いので見る前に要点だけ知りたい」ということもあるでしょう。
- 今回紹介するのは、YouTube 動画の文字起こしを取得し、さらに Google Gemini API を使って要約まで自動作成してくれる Python ツール（CLI & GUI）です。

:::linkcard
https://github.com/kkensuke/yt_dlp_transcript
:::


## 2. このツールでできること
### 主な機能
- 🎥 **文字起こし取得**: `yt-dlp`を使用した安定した取得
- 🔗 **堅牢な ID 取得機能**: 様々な形式の YouTube URL から Video ID を取得
- 📝 **Markdown 形式での出力**: タイムスタンプ付きで読みやすいマークダウン形式
- 🔧 **柔軟な出力オプション**: タイムスタンプ、要約の有無などをカスタマイズ可能
- 🤖 **AI 要約機能**: Gemini API による構造化された要約（日本語・英語から選択可能）


例えば、このツールを使うと次のような用途に活用できます：
- **解説動画**を文字起こしして、重要ポイントを要約
- **大学の講義動画**を要約して、復習用のノートを自動生成
- **英語の動画**を文字起こし＆日本語要約で効率的に学習
- **長時間のカンファレンス動画**の要点を素早く把握


## 3. コードの構成について
このリポジトリは2つの使い方ができます：

### 3.1. CLI バージョン
#### 3.1.1. モジュール化されたバージョン `main.py`
```
main.py                     # メインスクリプト
├── url_extractor.py        # URL/Video IDの抽出
├── transcript_processor.py # 文字起こしの処理
├── gemini_api.py           # AI要約の生成
└── utils.py                # ユーティリティ関数
```

#### 3.1.2. オールインワンバージョン `all.py`
シンプルに１ファイルで完結させたい場合は、全機能が統合された `all.py` を使用してください。

### 3.2. FastAPI を用いた GUI バージョン `app.py`
`app.py` を起動して、以下のような UI で利用することもできます。

![screenshot.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/414636/fd0e33c0-d419-4f64-a818-b19721e12292.png)


## 4. インストール方法
### 4.1. スクリプトのダウンロード
GitHubからリポジトリをクローンまたはダウンロードします：
```bash
git clone https://github.com/kkensuke/yt_dlp_transcript
cd yt_dlp_transcript
```

### 4.2. 必要なライブラリのインストール
```bash
pip install yt-dlp

# `app.py` を使う場合は fastapi と uvicorn も
pip install fastapi uvicorn
```

### 4.3. （オプション）Gemini API の設定
要約機能を使いたい場合は、Gemini API キーが必要です：
1. [Google AI Studio](https://makersuite.google.com/)で API キーを取得
2. 環境変数の設定：
    ```bash
    export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
3. それぞれのファイル（`main.py`,`all.py`,`app.py`）内で直接設定しても可：
    ```python
    GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
    ```

## 5. 基本的な使い方
### 5.1. GUI の使い方
以下を実行し、ブラウザで `http://localhost:8000` を開く。抽出に10秒ほどかかります。
```bash
python app.py
```

### 5.2. CLI のシンプルな使い方
```bash
# YouTube URL を指定
python main.py 'https://www.youtube.com/watch?v=VIDEO_ID'

# または、Video ID だけでもOK
python main.py 'VIDEO_ID'
```
`all.py` を使う場合も同様です。

これだけで、以下の2つのファイルが生成されます：
1. `{video_id}_transcript.md` - タイムスタンプ付き文字起こし
2. `{video_id}_summarized.md` - AI 生成の要約（API キー設定時）


### 5.3. 生成されるファイルの例
**文字起こしファイル（transcript.md）**:

```markdown
# Pythonプログラミング入門講座

**Video ID:** ABC123  
**YouTube URL:** https://www.youtube.com/watch?v=ABC123

---

**[00:00:15]** こんにちは、今日は Pythonプログラミングの基礎について解説します。

**[00:01:30]** まず、変数について説明しましょう。変数とは、データを保存するための箱のようなものです。
```


**要約ファイル（summarized.md）**:
```markdown
# Pythonプログラミング入門講座 - Summary

## 📝 要約
この動画では、Pythonの基本的な概念である変数、データ型、制御構造について...

## 🔑 主要な概念とキーワード
- **変数（Variable）**: データを格納する容器、重要度（高）
- **データ型（Data Type）**: 整数、文字列、リストなど、重要度（高）

## ✨ 重要ポイント
- Pythonは初心者に優しいプログラミング言語である
- 変数を使うことでデータを効率的に管理できる
...
```


## 6. 詳細なオプション
### 6.1. タイムスタンプを削除
タイムスタンプが不要な場合：
```bash
python main.py 'VIDEO_URL' --no-timestamps
```

### 6.2. 要約をスキップ
文字起こしだけが欲しい場合：
```bash
python main.py 'VIDEO_URL' --no-summary
```

### 6.3. 要約言語を指定
動画は日本語だけど、要約は英語で欲しい場合：
```bash
python main.py 'VIDEO_URL' --summary-lang en
```

逆に、英語動画の日本語要約：
```bash
python main.py 'VIDEO_URL' --summary-lang ja
```

### 6.4. カスタムファイル名
出力ファイル名を指定したい場合：
```bash
python main.py 'VIDEO_URL' -o my_custom_transcript.md
```


## 7. 実践的な活用例
### 7.1. ケース1: 講義ノートの自動生成
```bash
# 大学の講義動画から日本語の要約ノートを作成
python main.py 'LECTURE_VIDEO_URL' --summary-lang ja -o lecture_note.md
```

**活用シーン**:
- 復習用の要点まとめ


### 7.2. ケース2: 英語学習教材の作成
```bash
# 英語動画の文字起こしを取得（要約は不要）
python main.py 'ENGLISH_VIDEO_ID' --no-summary
```

**活用シーン**:
- リスニング練習の答え合わせ
- 知らない単語やフレーズの確認


### 7.3. ケース3: 技術カンファレンスの動画を要約
```bash
# 長時間の技術カンファレンス動画から要点を抽出
python main.py 'https://www.youtube.com/watch?v=CONF_VIDEO' --summary-lang ja
```

**活用シーン**: 
- 1時間以上の動画の要点を5分で把握



## 8. トラブルシューティング
### 8.1. Gemini API のエラー
1. APIキーが正しいか確認
2. [Google AI Studio](https://makersuite.google.com/)でクォータを確認

### 8.2. yt-dlpの抽出失敗
- `yt-dlp` が古い場合はアップデート：`pip install -U yt-dlp`
- 1日の利用制限の超過している場合は、翌日まで待つ



## 9. カスタマイズのアイデア
### 9.1. 要約プロンプトの調整
`gemini_api.py` 内のプロンプトをカスタマイズすることで、要約のスタイルを変更できます：

```python
# 例：より技術的な要約にしたい場合
prompt = f"""
あなたは経験豊富なソフトウェアエンジニアです。
以下の技術動画の文字起こしから、実装に役立つ具体的な情報を抽出してください。
- ベストプラクティスを強調
- 注意点やよくあるミスも記載
...
"""
```


### 9.2. 長文の処理
50,000文字を超える長い文字起こしの場合、`main.py` の `MAX_SUMMARY_LENGTH` を調整：

```python
MAX_SUMMARY_LENGTH = 100000  # より長い動画に対応
```

ただし、Gemini のトークン制限には注意が必要です。

### 9.3. Zsh でエイリアスを作成
 Zsh でエイリアスを作成し、より短いコマンドで呼び出すことができます。
```zsh
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
`QLMarkdown` は Quicklook で Markdown をレンダリングするアプリです。
生成された字幕と要約のファイルの内容を見易く表示してくれます。
```zsh
brew install --cask qlmarkdown
```


## 10. まとめ
このツールを使えば、YouTube 動画から効率的に情報を抽出できます：
- ✅ **時間の節約**: 長い動画を見る時間がない時に要約で要点把握  
- ✅ **学習効率UP**: 文字起こしで復習しやすく  
- ✅ **言語の壁を越える**: 英語動画→日本語要約で情報収集  
- ✅ **ナレッジベース構築**: 技術動画をテキスト資料として蓄積  


---

**参考リンク**:
- [yt-dlp 公式ドキュメント](https://github.com/yt-dlp/yt-dlp)
- [Google AI Studio](https://makersuite.google.com/)
