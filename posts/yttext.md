---
title: "yttext"
date: "2026-09-16"
subtitle: "YouTube 字幕を取得し、Gemini で要約する CLI & Web アプリ"
tags: [Python, YouTube, Gemini, Productivity]
---

## 1. はじめに

YouTube の解説動画や講義動画を見ていると、次のようなことがあります。

* 動画の内容を後からテキストで検索したい
* 長い動画を見る前に、まず要点を把握したい
* 技術カンファレンスや講義の内容を Markdown として保存したい
* 英語動画の字幕を取得して、日本語で要約したい
* 字幕を JSON や SRT にして別のツールから利用したい

`yttext` は、YouTube の **元言語の字幕を取得して再利用しやすいファイルへ変換する Python アプリケーション**です。

:::linkcard
https://github.com/kkensuke/yttext
:::

Gemini API キーを用意すると、取得した字幕から **Gemini による Markdown 要約**も生成できます。字幕の取得には API キーは必要ありません。

利用方法は大きく分けて 2 つあります。

* **CLI** — ターミナルから字幕取得・要約・ファイル保存を行う
* **Web アプリ** — ブラウザから設定し、字幕や要約をプレビュー・コピー・ダウンロードする

## 2. `yttext` でできること

主な機能は次の通りです。

* YouTube URL または 11 文字の Video ID から字幕を取得
* 手動字幕・自動生成字幕の両方に対応
* Markdown / Text / JSON / SRT / VTT の 5 形式へ出力
* Gemini による Markdown 要約
* 字幕とは別の言語での要約
* 50,000 文字を超える字幕の処理方法を選択可能
* Web アプリからプレビュー・コピー・ダウンロード

Gemini API キーを持っていなくても、字幕取得ツールとして利用できます。

## 3. インストール

`yttext` は PyPI、Homebrew、ソースコードから利用できます。

### 3.1. インストールせずに試す

`uv` を使っている場合、CLI はインストールせずに実行できます。

```bash
uvx yttext "YOUTUBE_URL" --no-summary
```

`pipx` でも同様です。

```bash
pipx run yttext "YOUTUBE_URL" --no-summary
```

「とりあえず字幕を取得してみたい」という場合は、この方法が最も手軽です。

### 3.2. PyPI から インストール

頻繁に利用する場合はツールとしてインストールできます。

`uv`：

```bash
uv tool install yttext
# GUI も利用する場合は web extra を追加
uv tool install 'yttext[web]'
```

`pipx`：

```bash
pipx install yttext
# GUI も利用する場合は web extra を追加
pipx install 'yttext[web]'
```

次のコマンドで、バージョンが適切に表示されたらインストール成功です。
```bash
yttext --version
```

GUI は次のコマンドで起動できます。
```bash
yttext web
```

### 3.4. Homebrew

macOS など Homebrew を使える環境では、CLI と Web アプリをまとめてインストールできます。

```bash
brew install kkensuke/tap/yttext
```

## 4. Gemini API キーの設定

字幕を取得するだけなら Gemini API キーは不要です。

Gemini による要約や、利用可能な Gemini モデルの取得を行う場合だけ API キーを使用します。

### 4.1. macOS / Linux

CLI では `GEMINI_API_KEY` 環境変数を利用します。

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

利用するモデルを固定したい場合は、任意で `GEMINI_MODEL` も設定できます。

```bash
export GEMINI_MODEL="gemini-flash-lite-latest"
```

### 4.2. Windows PowerShell

```powershell
$env:GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
$env:GEMINI_MODEL = "gemini-flash-lite-latest"
```

### 4.3. API キーは CLI 引数で渡さない

CLI では環境変数を使用します。API キーをコマンドライン引数として指定する機能はありません。

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

yttext "YOUTUBE_URL"
```

## 5. Web アプリ

### 5.1. 起動

Web 用依存パッケージをインストールした環境、または Homebrew 版では次のコマンドで起動します。

```bash
yttext web
```

ローカルモードではデフォルトで、

```text
http://127.0.0.1:8000
```

を使用し、起動後に標準ブラウザが開きます。

Web アプリでは次のような操作ができます。

* YouTube URL / Video ID の入力
* 出力形式の選択
* Gemini 要約の ON / OFF
* 要約言語の選択
* Gemini モデルの選択
* 利用可能な Gemini モデルの読み込み
* ローカルブラウザ Cookie の選択
* 字幕のプレビュー
* 要約のプレビュー
* クリップボードへのコピー
* ファイルのダウンロード

Markdown の表、ネストしたリスト、コードブロック、LaTeX 数式などもブラウザ上で表示できます。

### 5.2. Web アプリで Gemini を使う

Gemini summary を有効にした場合は API キーが必要です。

ローカルサーバー側に `GEMINI_API_KEY` が設定されていない場合は、ブラウザから自分の Gemini API キーを入力できます。

入力されたキーは Gemini の処理にだけ使用されます。

ブラウザへ入力したキーは要約処理を送信した後にクリアされます。

そのため、再度 Gemini の処理を実行する場合は API キーをもう一度入力します。

### 5.3. 毎回 API キーを入力したくない場合

ローカル環境では、Web アプリを起動する前に環境変数を設定できます。

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
export GEMINI_MODEL="gemini-flash-lite-latest"

yttext web
```

ローカルの loopback アクセスでは、サーバープロセスの `GEMINI_API_KEY` をフォールバックとして利用できます。
ブラウザ側に別の API キーを入力した場合は、そのキーが優先されます。

## 6. CLI の基本

基本形式は次の通りです。

```bash
yttext [OPTIONS] YOUTUBE_URL_OR_VIDEO_ID
```

ヘルプ：

```bash
yttext --help
```

主なオプションは次の通りです。

| オプション                                     | 説明                           |
| ----------------------------------------- | ---------------------------- |
| `-o, --output-dir DIR`                    | 字幕・要約ファイルの出力先                |
| `-f, --format {md,txt,json,srt,vtt}`      | 字幕形式。デフォルトは `md`             |
| `-n, --no-summary`                        | Gemini 要約を行わない               |
| `-l, --summary-lang LANGUAGE`             | `auto` または BCP 47 言語タグ       |
| `-L, --long-summary {skip,truncate,full}` | 50,000 文字を超える字幕の要約方法         |
| `-c, --cookies-from-browser BROWSER`      | ローカルブラウザの Cookie を利用         |
| `-m, --gemini-model MODEL_ID`             | Gemini モデルを指定                |
| `-M, --list-gemini-models`                | `generateContent` 対応モデルを一覧表示 |
| `-V, --version`                           | バージョン表示                      |
| `-h, --help`                              | ヘルプ表示                        |

長いオプション名は省略できません。

たとえば `--output-dir` を `--out` のように省略するのではなく、短縮形の `-o` を使います。

## 7. CLI の実行例

### 7.1. 字幕だけ取得

Gemini API キーを用意しなくても利用できます。

```bash
yttext "YOUTUBE_URL" --no-summary

# 短縮形：
yttext "YOUTUBE_URL" -n
```

### 7.2. 字幕と Gemini 要約を作成

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

yttext "https://www.youtube.com/watch?v=VIDEO_ID"
```

Video ID だけでも実行できます。

```bash
yttext "VIDEO_ID"
```

API キーが設定されていない場合でも字幕取得は行われ、要約だけがスキップされます。


### 7.3. 出力先を変更

```bash
yttext "YOUTUBE_URL" --output-dir output/

# 短縮形：
yttext "YOUTUBE_URL" -o output/
```

`-o` にはファイル名ではなく **出力ディレクトリ**を指定します。

### 7.4. JSON で保存

```bash
yttext "YOUTUBE_URL" --format json --no-summary

# 短縮形：
yttext "YOUTUBE_URL" -f json -n
```

指定できる形式は次の 5 種類です。

```text
md
txt
json
srt
vtt
```

### 7.5. 英語動画を日本語で要約

```bash
yttext "ENGLISH_VIDEO_URL" --summary-lang ja

# 短縮形：
yttext "ENGLISH_VIDEO_URL" -l ja
```

字幕そのものは元言語で保存され、Gemini の要約だけを日本語にできます。

逆に、日本語動画を英語で要約することもできます。

```bash
yttext "JAPANESE_VIDEO_URL" --summary-lang en
```

字幕と同じ主要言語で要約する場合は `auto` を指定します。

```bash
yttext "YOUTUBE_URL" --summary-lang auto
```

CLI では `ja` や `en` 以外にも、有効な BCP 47 言語タグを指定できます。

たとえばイタリア語なら、

```bash
yttext "YOUTUBE_URL" --summary-lang it
```


### 7.6. Gemini モデルを指定

```bash
yttext "YOUTUBE_URL" \
  --gemini-model "gemini-flash-latest" \
  --summary-lang ja

# 短縮形：
yttext "YOUTUBE_URL" -m "gemini-flash-latest" -l ja
```

モデルは次の優先順位で選択されます。

1. `--gemini-model`
2. `GEMINI_MODEL`
3. 組み込みのデフォルトモデル

現在の組み込みデフォルトは `gemini-flash-lite-latest` です。

### 7.7. 利用可能な Gemini モデルを確認

```bash
yttext --list-gemini-models

# 短縮形：
yttext -M
```


### 7.8. 50,000 文字を超える字幕

長時間動画では字幕が 50,000 文字を超えることがあります。

CLI では処理方法を選択できます。

全文を Gemini へ送る：

```bash
yttext "YOUTUBE_URL" --long-summary full
```

先頭 50,000 文字以内だけ要約：

```bash
yttext "YOUTUBE_URL" --long-summary truncate
```

長文の場合は要約しない：

```bash
yttext "YOUTUBE_URL" --long-summary skip
```

CLI のデフォルトは `skip` です。

Web アプリの場合は、50,000 文字を超えたことを検出すると、全文を Gemini に送信する前に確認画面を表示します。

### 7.9. ブラウザ Cookie を利用

通常の匿名アクセスでは字幕を取得できない動画の場合、ローカルブラウザの Cookie を利用できる場合があります。

Chrome：

```bash
yttext "YOUTUBE_URL" --cookies-from-browser chrome

# 短縮形：
yttext "YOUTUBE_URL" -c chrome
```

対応しているブラウザは次の通りです。

* Chrome
* Chromium
* Edge
* Firefox
* Safari
* Brave

Cookie を必要としない動画も多いため、まずは Cookie なしで試し、必要になった場合だけ使用するのがおすすめです。

## 8. 生成されるファイル

Markdown を指定した場合、字幕は次のような名前で保存されます。

```text
{video_id}_transcript.md
```

Gemini 要約に成功した場合：

```text
{video_id}_summarized.md
```

JSON を指定した場合は、

```text
{video_id}_transcript.json
```

のように拡張子が変わります。

### Markdown の例

Markdown 出力には動画情報、チャプター、字幕などが含まれます。

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

タイムスタンプをクリックすると、その位置から YouTube を開けます。

YouTube 側にチャプターが存在しない場合は `Chapters` セクションは出力されません。

## 9. 実践的な活用例

### 9.1. 講義動画から復習ノートを作る

```bash
yttext "LECTURE_VIDEO_URL" --summary-lang ja
```

字幕全文を保存しつつ、Gemini による要約も作成できます。

* 講義内容の復習
* 試験前の要点整理
* Markdown ノートの作成
* 動画内のキーワード検索
* 必要な部分だけ動画へ戻る

といった用途に使えます。

### 9.2. 海外の技術動画を日本語で読む

```bash
yttext "ENGLISH_VIDEO_URL" --summary-lang ja
```

字幕は英語のまま保存し、要約だけを日本語にできます。

そのため、

1. 日本語要約で全体像を把握する
2. 気になった部分を原文字幕で確認する
3. タイムスタンプから動画の該当箇所へ戻る

という使い方ができます。

技術用語の原文を残したまま概要を日本語で把握したい場合に便利です。

### 9.3. 英語学習用に字幕を保存

要約を作らず字幕だけ取得します。

```bash
yttext "ENGLISH_VIDEO_URL" --no-summary
```

SRT にする場合：

```bash
yttext "ENGLISH_VIDEO_URL" -f srt -n
```

* リスニング後の答え合わせ
* フレーズ検索
* 単語検索
* 字幕プレイヤーへの読み込み

などに利用できます。

### 9.4. JSON にしてプログラムから処理

```bash
yttext "YOUTUBE_URL" -f json -n -o output/
```

JSON 出力にすると、さらに別のプログラムから扱いやすくなります。

たとえば、

* RAG 用データの前処理
* 字幕セグメントの解析
* チャプター単位の処理
* 検索インデックスの作成
* 独自の要約処理

などに利用できます。

### 9.5. 長時間のカンファレンス動画を要約

```bash
yttext "CONFERENCE_VIDEO_URL" \
  --summary-lang ja \
  --long-summary full
```

字幕全文を Gemini へ送信するため、使用するモデルのコンテキスト上限や API 利用量を確認した上で使用します。


## 11. API キーの扱い

字幕取得には Gemini API キーを使用しません。

ブラウザから Gemini を利用する場合、入力された API キーは Gemini の処理時だけバックエンドへ送信され、そこから Google の Gemini API に渡されます。

API キーを意図的に次の場所へ保存しない設計になっています。

* URL
* 字幕ファイル
* 要約ファイル
* 短期要約ジョブ
* ブラウザの localStorage
* sessionStorage
* Cookie

ブラウザへ入力した API キーは Gemini リクエスト送信後にクリアされます。

ローカル Web アプリで毎回キーを入力したくない場合は、環境変数 `GEMINI_API_KEY` を利用できます。

## 12. トラブルシューティング

### 12.1. 字幕が見つからない

まず次を確認します。

* 動画に手動字幕または自動生成字幕があるか
* YouTube が元言語字幕を取得可能な状態で公開しているか
* URL / Video ID が正しいか
* `yttext` が古くないか

`uv`：

```bash
uv tool upgrade yttext
```

`pipx`：

```bash
pipx upgrade yttext
```

Homebrew：

```bash
brew update
brew upgrade yttext
```

ソース版で `yt-dlp` を更新する場合：

```bash
uv lock --upgrade-package yt-dlp
uv sync
```

### 12.2. `HTTP 429` が出る

YouTube 側から一時的にレート制限されている可能性があります。

時間を置いてから再実行します。

ローカル環境の場合は、ログイン済みブラウザの Cookie を利用すると取得できる場合があります。

```bash
yttext "YOUTUBE_URL" -c chrome
```

### 12.3. Gemini 要約だけ失敗する

字幕取得と Gemini 要約は分離されています。

Gemini の処理に失敗しても、取得済みの字幕は利用できます。

次の項目を確認します。

* Gemini API キーが有効か
* API クォータを超えていないか
* API キーの制限設定に問題がないか
* 選択した Gemini モデルが利用可能か

CLI ではモデル一覧を確認できます。

```bash
yttext --list-gemini-models
```

Web アプリでは **Load available models** を利用できます。

### 12.4. Web アプリで API キーが消えた

これは意図した動作です。

ブラウザへ入力した Gemini API キーは、要約リクエストを送信するとクリアされます。

再試行する場合は API キーを再入力します。

ローカル環境で毎回入力したくない場合は、起動前に環境変数を設定します。

```bash
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

yttext web
```

### 12.5. `yttext web` で依存パッケージのエラーになる

PyPI から CLI だけをインストールした場合、Web アプリ用の依存パッケージは含まれていません。

Web アプリを利用する場合は `web` extra を含めます。

```bash
uv tool install 'yttext[web]'
```

または、

```bash
pipx install 'yttext[web]'
```

Homebrew 版には CLI と Web アプリの両方が含まれています。

## 13. コード構成

主要なコードは `src/yttext/` にあります。

```text
src/yttext/
├── cli.py               # CLI
├── web.py               # FastAPI Web アプリ
├── web_state.py         # Web アプリの短期ジョブ管理
├── service.py           # 字幕取得・要約の共通ワークフロー
├── youtube.py           # YouTube メタデータ・字幕取得
├── gemini.py            # Gemini API クライアント
├── renderers.py         # md/txt/json/srt/vtt の出力
├── summary_languages.py # 要約言語
├── models.py            # データモデル
├── errors.py            # エラー
├── utils.py             # 共通処理
└── ui/                  # Web UI
```

CLI と Web アプリが別々の字幕取得処理を持つのではなく、`service.py` を中心とした共通処理を利用しています。

## 14. 開発環境

ソースコードを変更して試す場合は、Web と開発用依存関係をインストールします。

```bash
uv sync --extra web --extra dev
```

Web アプリ：

```bash
uv run yttext web
```

テスト：

```bash
uv run --extra web --extra dev pytest
```

Ruff：

```bash
uv run --extra web --extra dev ruff check .
```

フォーマット確認：

```bash
uv run --extra web --extra dev ruff format --check .
```

### Gemini の要約プロンプトを変更する

Gemini の要約処理は、

```text
src/yttext/gemini.py
```

にあります。

自分の用途に特化した要約へ変更したい場合は、ソース版を clone してプロンプトを調整できます。

たとえば技術動画向けなら、

```text
- 実装に使える具体例を優先する
- ベストプラクティスを整理する
- 注意点や典型的な失敗をまとめる
- コマンドやコード断片を可能な限り保持する
```

といった方針へ変更できます。

インストール済みパッケージを直接変更するより、Git リポジトリを clone して管理する方が扱いやすいです。

## 15. まとめ

`yttext` は、YouTube の元言語字幕を取得し、必要に応じて Gemini で要約できる CLI / Web アプリです。

まとめると、

* 字幕取得は API キー不要
* CLI と Web アプリの両方を利用可能
* PyPI, Homebrew からインストール可能
* Markdown / Text / JSON / SRT / VTT に対応
* Markdown のタイムスタンプから動画の該当位置へ移動可能
* Gemini による構造化 Markdown 要約
* 要約言語を BCP 47 タグで指定可能
* 50,000 文字を超える字幕の処理方法を選択可能

といった特徴があります。

長い YouTube 動画を最初から最後まで再生し直さなくても、まず字幕をファイル化し、必要に応じて Gemini で要約してから内容を確認できます。

動画の内容を「視聴するだけ」で終わらせず、検索・再利用できるテキストとして残したい場合に利用してみてください。
