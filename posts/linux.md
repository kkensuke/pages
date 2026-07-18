---
title: "コマンドラインガイド"
date: "2022-10-18"
subtitle: "ファイル、パイプ、権限、プロセス、シェルスクリプトの実践ガイド"
tags: [CLI]
---


コマンドラインは、コンピューターを操作するためのテキストインターフェースです。フォルダやメニューをクリックする代わりにコマンドを入力し、ディレクトリ間の移動、ファイルの確認や変更、プログラム同士の接続、プロセスの管理、繰り返し作業の自動化などを行います。

macOSでは `Terminal.app` を開きます。多くのLinuxディストリビューションにもターミナルアプリケーションが用意されています。macOSのデフォルトの対話シェルはZshで、LinuxではBashがよく使われます。このガイドの基本コマンドは、Bash固有と明記した節を除き、どちらでも使用できます。

:::warning
`rm`、`chmod`、`chown` などのコマンドは、データを削除したりアクセス不能にしたりする可能性があります。破壊的なコマンドを実行する前に、`pwd` で現在のディレクトリを確認し、`ls` で対象を調べ、`echo` でワイルドカードの展開結果を確認してください。
:::


## キーボードショートカット

次のショートカットを覚えると、ターミナルを効率よく操作できます。

### プロセスと画面の操作

| ショートカット | 説明 |
| --- | --- |
| `Ctrl + C` | フォアグラウンドプロセスを中断する |
| `Ctrl + Z` | フォアグラウンドプロセスを一時停止する |
| `Ctrl + D` | EOF（入力終了）を送る。空のプロンプトではシェルを終了する |
| `Ctrl + L` | 画面を消去する |
| `Ctrl + S` | フロー制御を使用するターミナルで出力を一時停止する |
| `Ctrl + Q` | `Ctrl + S` で停止した出力を再開する |

### カーソル移動と編集

| ショートカット | 説明 |
| --- | --- |
| `Ctrl + A` | 行頭へ移動する |
| `Ctrl + E` | 行末へ移動する |
| `Alt + B` / `Alt + F` | 1単語分、後方または前方へ移動する |
| `Ctrl + T` | 現在の文字と直前の文字を入れ替える |
| `Alt + T` | 現在の単語と直前の単語を入れ替える |
| `Ctrl + W` | カーソル直前の単語を切り取る |
| `Ctrl + U` | カーソルから行頭までを切り取る |
| `Ctrl + K` | カーソルから行末までを切り取る |
| `Ctrl + Y` | 最後に切り取ったテキストを貼り付ける |
| `Ctrl + _` | 直前の編集を元に戻す |

macOSのターミナル設定によっては、`Option + B` や `Option + F` が `Alt` として設定されていないことがあります。その場合は、`Esc` を押してから `B` または `F` を押します。

### コマンド履歴

| ショートカット | 説明 |
| --- | --- |
| `Up` / `Down` | 前後のコマンド履歴へ移動する |
| `Ctrl + R` | コマンド履歴を後方検索する |
| `Ctrl + G` | 履歴検索を中止する |


## パスと特殊記号

ファイルシステムは、ルートディレクトリ `/` を起点とする階層構造です。

| 記号 | 意味 | 例 |
| --- | --- | --- |
| `/` | ルートディレクトリ | `cd /` |
| `.` | 現在のディレクトリ | `ls .` |
| `..` | 親ディレクトリ | `cd ..` |
| `~` | 現在のユーザーのホームディレクトリ | `cd ~` |
| `-` | `cd` で使用した場合、直前にいたディレクトリ | `cd -` |

**絶対パス**は `/` から始まります。**相対パス**は現在のディレクトリを基準にします。

```bash
/Users/username/Documents/report.txt   # macOSの絶対パス
Documents/report.txt                   # ホームディレクトリからの相対パス
../report.txt                          # 親ディレクトリにあるファイル
```

空白を含むパスは、引用符で囲むかバックスラッシュでエスケープします。

```bash
cd "My Projects"
cd My\ Projects
```


## ディレクトリの移動と確認

### `pwd`：現在のディレクトリを表示する

```bash
pwd
# /Users/username/Documents
```

### `cd`：ディレクトリを移動する

```bash
cd ~/Documents       # ホームディレクトリ内のDocumentsへ移動
cd ..                # 1階層上へ移動
cd ../..             # 2階層上へ移動
cd -                 # 直前にいたディレクトリへ戻る
cd                   # ホームディレクトリへ移動
```

### `ls`：ディレクトリの内容を一覧表示する

```bash
ls                   # 現在のディレクトリを一覧表示
ls -l                # 権限、所有者、サイズ、時刻を含む詳細表示
ls -a                # .で始まる隠しファイルも表示
ls -lh               # ファイルサイズを読みやすい単位で表示
ls -ltr              # 更新時刻順に古いものから表示
ls -AhlS             # ほぼすべてを詳細・読みやすいサイズ・サイズ順で表示
```

多くの短いオプションはまとめて記述できます。`ls -A -h -l -S` と `ls -AhlS` は同じ意味です。

### `tree`：ディレクトリ階層を表示する

`tree` コマンドは、先にインストールが必要な場合があります。

```bash
brew install tree                 # Homebrewを使用するmacOS
sudo apt install tree             # DebianまたはUbuntu
```

```bash
tree                              # 階層全体を表示
tree -L 2                         # 2階層まで表示
tree -d                           # ディレクトリだけを表示
tree -a                           # 隠しファイルも表示
tree -I 'node_modules|*.pyc'      # 一致する名前を除外
tree --dirsfirst                  # ファイルより先にディレクトリを表示
tree -h                           # ファイルサイズを読みやすい単位で表示
```

出力例：

```text
project/
├── src/
│   ├── main.py
│   └── utils.py
├── tests/
│   └── test_main.py
└── README.md
```


## ファイルとディレクトリの作成

### `mkdir`：ディレクトリを作成する

```bash
mkdir project                     # ディレクトリを1つ作成
mkdir dir1 dir2                   # 複数のディレクトリを作成
mkdir -p project/src/components   # 存在しない親ディレクトリも作成
```

### `touch`：ファイルを作成する、またはタイムスタンプを更新する

```bash
touch file.txt                    # 存在しなければ空のファイルを作成
touch existing.txt                # アクセス時刻と更新時刻を更新
touch file{1..3}.txt              # file1.txt、file2.txt、file3.txtを作成
```

### `rmdir`：空のディレクトリを削除する

```bash
rmdir empty-directory
rmdir -p dir/subdir/leaf          # 空になった親ディレクトリも削除
```

対象のディレクトリに何か入っていると、`rmdir` は失敗します。ファイルを誤って削除したくない場合、この動作を安全策として利用できます。


## ファイルの表示とサイズの確認

### `cat`、`less`、`head`、`tail`

```bash
cat file.txt                      # ファイル全体を表示
cat file1.txt file2.txt           # 複数のファイルを順番に表示
less largefile.txt                # 1画面ずつ表示。qで終了
head file.txt                     # 先頭10行を表示
head -n 5 file.txt                # 先頭5行を表示
tail file.txt                     # 末尾10行を表示
tail -f application.log           # 追加される行をリアルタイムで表示
```

### `file`：ファイルの種類を判定する

```bash
file document.pdf
# document.pdf: PDF document, version 1.4
```

### `wc`：行数、単語数、バイト数を数える

```bash
wc file.txt                       # 行数、単語数、バイト数
wc -l file.txt                    # 行数のみ
wc -w file.txt                    # 単語数のみ
wc -c file.txt                    # バイト数のみ
```

### `du`：ディスク使用量を確認する

```bash
du -h file.txt                    # 読みやすい単位でファイルサイズを表示
du -sh directory/                 # ディレクトリの合計サイズ
du -h -d 1 .                      # macOSで1階層下の各項目のサイズを表示
du -h --max-depth=1 .             # GNU/Linuxでの同等の書き方
```


## コピー、移動、削除

### `cp`：ファイルやディレクトリをコピーする

```bash
cp source.txt destination.txt     # ファイルをコピー
cp -i source.txt destination.txt  # 上書き前に確認
cp -v source.txt destination.txt  # コピーした名前を表示
cp file1 file2 target/            # 複数のファイルをディレクトリへコピー
cp -R source-dir destination-dir  # ディレクトリを再帰的にコピー
```

コピー先がすでに存在するかどうかで動作が変わります。

- `cp source.txt destination.txt` は、`destination.txt` が存在すれば上書きします。確認するには `-i` を付けます。
- `destination-dir` が存在しない場合、`cp -R source-dir destination-dir` は `source-dir` のコピーとして作成します。
- `destination-dir` が存在する場合、通常は `destination-dir/source-dir/...` という構造になります。

### `mv`：移動または名前を変更する

```bash
mv old.txt new.txt                # ファイル名を変更
mv -i old.txt new.txt             # 上書き前に確認
mv file.txt directory/            # ファイルをディレクトリへ移動
mv dir1 dir2                      # dir1の名前を変更、または既存のdir2内へ移動
```

### `rm`：ファイルや空でないディレクトリを削除する

```bash
rm file.txt                       # ファイルを1つ削除
rm -i file.txt                    # 削除前に確認
rm -v file.txt                    # 削除した名前を表示
rm -r directory/                  # ディレクトリを再帰的に削除
rm -ri directory/                 # 逐次確認しながら再帰的に削除
rm -rf directory/                 # 確認なしで強制的に再帰削除
```

:::warning
`rm` には組み込みの取り消し機能がありません。`rm -rf` は最後の手段として扱ってください。実行する前に、`echo directory/*` や `find directory -maxdepth 1` などを使い、展開後の正確な対象を必ず確認します。
:::


## テキストの作成と出力のリダイレクト

### `echo` と `printf`

```bash
echo "Hello, world"               # 1行表示
echo "$PATH"                      # 環境変数を表示
printf '%s\n' "Hello, world"      # 明示した書式で表示
```

書式が重要な場合は、シェル間での動作が比較的一貫している `printf` が適しています。

### 標準ストリーム

各コマンドは3つの標準ストリームを利用できます。

| ストリーム | 番号 | デフォルトの接続先 |
| --- | ---: | --- |
| 標準入力（`stdin`） | `0` | キーボード |
| 標準出力（`stdout`） | `1` | ターミナル |
| 標準エラー出力（`stderr`） | `2` | ターミナル |

### リダイレクト演算子

```bash
command > file                    # 標準出力をファイルへ書き込み、内容を置換
command >> file                   # 標準出力をファイル末尾へ追記
command < file                    # ファイルから標準入力を読み込む
command 2> errors.log             # 標準エラー出力をファイルへ書き込む
command > output.log 2>&1         # 標準出力と標準エラー出力を同じファイルへ書き込む
command &> output.log             # BashとZshで使える上の行の短縮形
command 2>/dev/null               # 標準エラー出力を破棄
```

```bash
echo "first line" > notes.txt
echo "second line" >> notes.txt
cat notes.txt
# first line
# second line
```

### パイプ

パイプ `|` は、左側のコマンドの標準出力を、右側のコマンドの標準入力へ渡します。

```bash
history | tail -20                # 直近20件の履歴
grep "ERROR" application.log | wc -l
ps aux | grep '[p]ython'
du -h ./* | sort -h | tail -10
```

パイプラインの各段階には、データの抽出、変換、並べ替え、集計、保存など、1つの役割を持たせます。

### `tee`：表示と保存を同時に行う

`tee` は、入力をターミナルに表示すると同時にファイルにも書き込みます。パイプラインを続けながら結果を保存したい場合に便利です。

```bash
ls / | tee root-contents.txt | head
grep "ERROR" application.log | tee errors.txt | wc -l
command | tee -a history.log      # 置換せず追記
```


## テキスト処理

### `grep`：行を検索する

`grep` は正規表現を使用し、一致する行を抽出します。

```bash
grep 'word' file.txt              # wordを含む行
grep -i 'word' file.txt           # 大文字と小文字を区別しない
grep -n 'word' file.txt           # 行番号を付ける
grep -w 'word' file.txt           # 単語全体に一致
grep -v 'word' file.txt           # 一致しない行を抽出
grep -r 'word' directory/         # ディレクトリを再帰的に検索
grep -l 'word' *.txt              # 一致したファイル名だけを表示
grep -c 'word' file.txt           # 一致した行数を数える
grep -o '[0-9]\+' file.txt        # 基本正規表現で一致部分だけを表示
grep -E '[0-9]+' file.txt         # 拡張正規表現を使用
```

よく使うオプション：

| オプション | 意味 |
| --- | --- |
| `-i` | 大文字と小文字を区別しない |
| `-w` | 単語全体に一致させる |
| `-v` | 一致しない行を抽出する |
| `-n` | 行番号を付ける |
| `-H` / `-h` | ファイル名の接頭辞を表示する／しない |
| `-r` | ディレクトリを再帰的に検索する |
| `-R` | シンボリックリンクをたどって再帰検索する |
| `-l` / `-L` | 一致する／一致しないファイルを一覧表示する |
| `-c` | 一致する行数を数える |
| `-m NUMBER` | ファイルごとに `NUMBER` 件一致した時点で停止する |
| `-o` | 一致した部分だけを表示する |

### `sed`：テキストを変換する

```bash
sed 's/old/new/' file.txt          # 各行の最初の一致を置換
sed 's/old/new/g' file.txt         # すべての一致を置換
sed '2d' file.txt                  # 出力から2行目を削除
sed -i '' 's/old/new/g' file.txt   # macOSでファイルを直接編集
sed -i 's/old/new/g' file.txt      # LinuxのGNU sedでファイルを直接編集
```

`-i` を付けなければ、`sed` は変換後のテキストを表示するだけで、元のファイルは変更しません。

### `awk`：レコードや列を処理する

```bash
awk '{print $1}' file.txt          # 空白区切りの最初のフィールドを表示
awk '{print $NF}' file.txt         # 最後のフィールドを表示
awk '/pattern/ {print $0}' file.txt
awk -F, '{print $2}' data.csv      # カンマを区切り文字として2列目を表示
```

### `sort`、`uniq`、`cut`、`tr`

```bash
sort names.txt                     # 行を並べ替える
sort names.txt | uniq              # 隣接する重複行を削除
sort names.txt | uniq -c           # 各行の出現回数を数える
cut -d, -f2 data.csv               # カンマ区切りの2列目を表示
tr '[:lower:]' '[:upper:]' < file.txt
```


## ファイルとコマンドの検索

### `find`：ファイルシステムを検索する

基本形は `find PATH CONDITIONS ACTIONS` です。

```bash
find . -name '*.txt'               # 名前が.txtで終わるもの
find . -iname '*.TXT'              # 大文字と小文字を区別せず名前を検索
find . -type f                     # 通常ファイルのみ
find . -type d                     # ディレクトリのみ
find . -empty                      # 空のファイルまたはディレクトリ

find . -mtime -7                   # 過去7日以内に更新
find . -mmin -60                   # 過去60分以内に更新
find . -atime +30                  # 30日より前にアクセス

find . -size +10M                  # 10MiBより大きい
find . -size +30k -size -1M        # 30KiBより大きく1MiBより小さい

find . -name '*.log' -mtime +30    # 暗黙のANDで条件を組み合わせる
find . \( -name '*.py' -o -name '*.sh' \) -type f
find . -not -path './node_modules/*' -type f
```

`'*.txt'` のようなパターンは引用符で囲みます。囲まないと、`find` が受け取る前にシェルが展開することがあります。

### 検索結果にコマンドを実行する

```bash
find . -name '*.txt' -exec grep -n 'word' {} +
find . -name '*.tmp' -exec rm -i {} +
find . -name '*.tmp' -delete
```

`{}` は見つかったパスに置き換えられます。末尾の `+` は、可能な限り多くのパスをまとめて1回のコマンドに渡します。`\;` を使うと、パスごとに1回ずつコマンドを実行します。

:::warning
`-delete` を追加する前に、同じ `find` 式を `-delete` なしで実行して対象を確認してください。`-maxdepth` などで制限しない限り、`find` はサブディレクトリにも入ります。
:::

### `find` と `xargs`

ファイル名に空白、引用符、改行が含まれていても正しく処理できるように、null文字を区切り文字として使います。

```bash
find . -type f -name '*.txt' -print0 | xargs -0 grep -n 'word'
find . -type f -name '*.tmp' -print0 | xargs -0 rm -i
```

可能であれば、`find ... -exec command {} +` の方が単純で、同様にファイル名を安全に扱えます。

### 実行可能コマンドを探す

```bash
command -v python                  # 移植性の高い方法でコマンドの解決先を表示
type python                        # alias、関数、ファイルなどの種類を説明
which python                       # 一般的だがtypeより情報が少ない
whereis python                     # 多くのLinux環境でバイナリ、ソース、manの場所を表示
locate filename                    # locateがあればデータベースから高速検索
```


## シェルグロブとブレース展開

### グロブでファイル名を一致させる

シェルはコマンドを実行する前に、グロブを一致するファイル名へ展開します。

| パターン | 意味 |
| --- | --- |
| `*` | 0文字以上の任意の文字列 |
| `?` | 任意の1文字 |
| `[abc]` | 集合内のいずれか1文字 |
| `[a-z]` | 範囲内のいずれか1文字 |
| `[!abc]` | 集合に含まれない1文字 |

```bash
ls *.txt                           # すべての.txtファイル
ls file?.txt                       # file1.txtやfileA.txtなど
ls [abc]*.txt                      # a、b、cのいずれかで始まる名前
ls [0-9][0-9].txt                  # 2桁の数字を持つ名前
mv *.{py,sh} scripts/              # Pythonファイルとシェルファイル
```

実際の操作をする前に、グロブの展開結果を確認できます。

```bash
echo rm temp*
printf '%s\n' temp*
```

:::note
グロブと正規表現は異なる言語です。シェルは `*.txt` をグロブとして展開します。一方、`grep -E '^[0-9]+$'` は、引用符で囲まれたパターンを正規表現として解釈します。
:::

### Bashの拡張グロブ

Bashで拡張パターンマッチを有効にします。

```bash
shopt -s extglob
```

| パターン | 意味 |
| --- | --- |
| `*(pattern)` | 0回以上の繰り返し |
| `+(pattern)` | 1回以上の繰り返し |
| `?(pattern)` | 0回または1回 |
| `@(pattern)` | ちょうど1回 |
| `!(pattern)` | パターン以外 |

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

これらの例はBash固有です。Zshには独自の拡張グロブ構文とオプションがあります。

### ブレース展開で文字列を生成する

ブレース展開はファイルシステムを調べず、文字列を生成します。

```bash
echo {1,2,3}                       # 1 2 3
echo file{1..5}.txt                # file1.txtからfile5.txt
echo {a..z}                        # aからz
echo {A,B}{1,2}                    # A1 A2 B1 B2

mkdir -p project/{src,tests,docs}
touch file{1..10}.txt
cp file.txt{,.backup}              # cp file.txt file.txt.backupに展開
mv /path/{foo,bar,baz}.txt dir/
```


## コマンドと展開の組み合わせ

### コマンドリスト

```bash
command1 ; command2                # command1の結果にかかわらずcommand2を実行
command1 && command2               # command1が成功した場合だけcommand2を実行
command1 || command2               # command1が失敗した場合だけcommand2を実行
command1 & command2                # command1をバックグラウンドで開始し、command2を実行
```

実用例：

```bash
mkdir project && cd project
make && make test
cd /tmp || echo "Could not enter /tmp"
long_running_command & echo "Started in the background"
```

### コマンド置換：`$(...)`

コマンド置換はコマンドを実行し、その標準出力を別のコマンドへ挿入します。

```bash
echo "Today is $(date +%F)"
touch "report_$(date +%Y%m%d).txt"
ls "$(dirname "$(command -v python)")"
```

`$(...)` は読みやすく入れ子にしやすいため、古いバッククォート記法よりも優先して使用します。

### パラメータ展開：`${...}`

パラメータ展開は、シェル変数の値を読み取ったり変換したりします。中身をコマンドとして実行するわけではありません。

```bash
animal=cat
echo "${animal}s"                  # cats
echo "${animal}_food"              # cat_food
echo "${HOME}/Documents"
```

波括弧は、変数名とその直後の文字列を区切ります。次の違いが重要です。

```bash
$(date)                            # dateコマンドの出力
${HOME}                            # HOME変数の値
```

### `xargs`：入力からコマンドを組み立てる

```bash
printf '%s\n' file1 file2 file3 | xargs echo
printf '%s\n' file1 file2 file3 | xargs -n 1 echo "Processing:"
printf '%s\0' *.txt | xargs -0 -I {} cp {} backup/
```

ファイル名を扱う場合は、null区切りの入力と `-0` を使用します。


## 環境変数、alias、履歴

### 環境変数

```bash
echo "$HOME"                       # ホームディレクトリ
echo "$PATH"                       # 実行可能ファイルを検索するディレクトリ
echo "$USER"                       # 現在のユーザー名

export PROJECT_ROOT="$HOME/project" # 変数を設定してexport
```

プロンプトで行った変更は、通常、現在のシェルセッションでのみ有効です。永続化する設定は、Zshなら `~/.zshrc`、Bashなら `~/.bashrc` に追加し、新しいシェルを開始するか設定ファイルを再読み込みします。

```bash
source ~/.zshrc                    # Zshの設定を再読み込み
source ~/.bashrc                   # Bashの設定を再読み込み
```

### aliasと関数

```bash
alias ll='ls -lah'
alias ..='cd ..'
unalias ll
```

単純なコマンドの置き換えにはaliasが適しています。引数や複数のコマンドが必要な場合は関数を使います。

```bash
mkcd() {
    mkdir -p "$1" && cd "$1"
}

mkcd new-project
```

### コマンド履歴

```bash
history                            # 履歴を表示
history 20                         # 多くのシェルで最近の履歴を表示
!!                                 # 直前のコマンドを再実行
!123                               # 履歴番号123を実行
!$                                 # 直前のコマンドの最後の引数
```

履歴展開の動作は、シェルとその設定によって異なります。コマンドを実行前に検索して確認したい場合は、`Ctrl + R` を使います。


## 権限と所有者

権限は、誰がファイルを読み取り、変更、実行できるか、また誰がディレクトリの一覧表示、変更、移動を行えるかを制御します。

### 権限を確認する

```bash
ls -l script.sh
# -rwxr-xr--  1 user  group  1234 Aug  4 15:18 script.sh
```

最初の1文字はファイルの種類です。`-` は通常ファイル、`d` はディレクトリ、`l` はシンボリックリンクを示します。続く9文字は、3つの権限グループです。

```text
rwx r-x r--
│   │   └── その他のユーザー
│   └────── グループ
└────────── 所有者（ユーザー）
```

通常ファイルの場合：

- `r` は内容の読み取りを許可します。
- `w` は内容の変更を許可します。
- `x` はプログラムとしての実行を許可します。

ディレクトリの場合：

- `r` は名前の一覧を読み取ることを許可します。
- `w` は、ほかの権限も満たす場合に、項目の作成、名前変更、削除を許可します。
- `x` はディレクトリへ入り、名前が分かっている項目へアクセスすることを許可します。

### `chmod` による記号形式の権限指定

| 記号 | 意味 |
| --- | --- |
| `u` | ユーザーまたは所有者 |
| `g` | グループ |
| `o` | その他のユーザー |
| `a` | すべてのユーザー |

| 演算子 | 意味 |
| --- | --- |
| `=` | 権限を正確に設定する |
| `+` | 権限を追加する |
| `-` | 権限を削除する |

```bash
chmod u+x script.sh               # 所有者に実行権限を追加
chmod g-w file.txt                # グループの書き込み権限を削除
chmod o-r secret.txt              # その他のユーザーの読み取り権限を削除
chmod a+r file.txt                # 全員に読み取り権限を追加
chmod u=rwx,g=rx,o=r file.txt     # 各区分の権限を明示的に設定
```

### `chmod` による数値形式の権限指定

各桁は、読み取りの `4`、書き込みの `2`、実行の `1` の合計です。3桁は、所有者、グループ、その他のユーザーの順に対応します。

| モード | 記号形式 | 一般的な用途 |
| --- | --- | --- |
| `755` | `rwxr-xr-x` | 公開実行可能なスクリプト、または誰でも移動できるディレクトリ |
| `700` | `rwx------` | 非公開の実行可能ファイルまたはディレクトリ |
| `644` | `rw-r--r--` | 一般的な文書または設定ファイル |
| `600` | `rw-------` | 非公開ファイル |
| `777` | `rwxrwxrwx` | 全員にすべてを許可。通常は不適切 |

```bash
chmod 755 script.sh
chmod 644 document.txt
chmod 600 private-key
chmod -R u+rwX,go-rwx private-directory/
```

:::note
新しいファイルの基準モードは多くの場合 `666`、新しいディレクトリは `777` ですが、シェルの `umask` によって権限が取り除かれます。現在のマスクは `umask` で確認できます。通常ファイルの基準モードに実行権限がないため、新しい一般ファイルが自動的に実行可能になることはありません。
:::

:::warning
再帰的な権限変更は慎重に行ってください。`chmod -R 755 directory/` は、通常ファイルにも実行権限を付け、全員から読み取り可能にします。記号形式の `u+rwX` で大文字の `X` を使うと、ディレクトリと、すでに実行可能なファイルだけに実行権限を追加できます。
:::

### 所有者とグループを変更する

```bash
chown user file.txt                 # 所有者を変更
chown user:group file.txt           # 所有者とグループを変更
chown -R user:group directory/      # 再帰的に適用
```

所有者の変更には、`sudo chown ...` のように管理者権限が必要になることが一般的です。


## リンク

### シンボリックリンク

シンボリックリンクは、別のファイルやディレクトリへのパスを保持する小さなファイルシステム項目です。

```bash
ln -s /path/to/original /path/to/link
ln -s ~/Documents/project ~/Desktop/project-link
ls -l ~/Desktop/project-link
# project-link -> /Users/username/Documents/project
```

便利なオプション：

```bash
ln -sf original link              # 既存のリンク先を置換
ln -s ~/Documents/notes.txt .     # 現在のディレクトリにリンクを作成
```

- シンボリックリンクは、ファイルにもディレクトリにも作成できます。
- リンク先を削除または移動すると、リンクが切れることがあります。
- 相対リンクはディレクトリツリー内で移植しやすく、絶対リンクは現在の作業ディレクトリに依存しません。

:::note
macOSのFinderエイリアスとシンボリックリンクは別のものです。コマンドラインツールはシンボリックリンクを直接扱えますが、FinderエイリアスはmacOS固有のメタデータを使用します。
:::

### ハードリンク

```bash
ln original.txt hardlink.txt
```

ハードリンクされた複数のファイル名は、同じ実体データを参照します。1つの名前を削除しても、ほかのハードリンクが残っている間はデータが削除されません。通常、ハードリンクはファイルシステムをまたげず、ディレクトリにも作成できません。


## プロセスとジョブの管理

### プロセスを確認する

```bash
ps                                 # このターミナルに関連するプロセス
ps aux                             # BSD形式ですべてのプロセスを表示
ps aux | grep '[p]ython'           # grep自身を一致させずにプロセスを検索
pgrep -fl python                   # プロセスIDとコマンドラインを検索
top                                # 対話的なシステムプロセス表示
htop                               # インストールされている場合に使える代替表示
```

### フォアグラウンドジョブとバックグラウンドジョブ

```bash
long_running_command &             # バックグラウンドで開始
jobs                               # このシェルに属するジョブを一覧表示
fg %1                              # ジョブ1をフォアグラウンドへ移動
bg %1                              # 一時停止中のジョブ1をバックグラウンドで再開
```

`Ctrl + Z` でフォアグラウンドプロセスを一時停止し、`bg` でバックグラウンド実行を再開するか、`fg` でフォアグラウンドへ戻します。

### プロセスを停止する

```bash
kill PID                           # 正常終了を要求
kill -TERM PID                     # 同じシグナルを明示的に指定
killall process_name               # 名前でプロセスへシグナルを送る
kill -9 PID                        # SIGKILLで強制終了
```

`kill -9` は通常の終了要求で停止しない場合に限って使用します。プロセスがファイルやほかのリソースを後処理する機会が失われます。


## Bashスクリプトの作成

シェルスクリプトは一連のコマンドをテキストファイルに保存し、同じ処理を確実に繰り返せるようにします。

### 最小構成のスクリプト

`hello.sh` を作成します。

```bash
#!/usr/bin/env bash

set -euo pipefail

name=${1:-world}
printf 'Hello, %s!\n' "$name"
```

Bashで実行するか、実行権限を付けて直接実行します。

```bash
bash hello.sh Kensei

chmod u+x hello.sh
./hello.sh Kensei
```

最初の行は**shebang**で、使用するインタープリターを選択します。`set -euo pipefail` の各オプションは、Bashスクリプトでよく使われる防御的な初期設定です。

- `-e` は、処理されていないコマンドの失敗時に終了します。
- `-u` は、未設定変数の参照をエラーにします。
- `-o pipefail` は、パイプラインのいずれかの段階が失敗した場合に、パイプライン全体を失敗とします。

これらのオプションは制御フローに影響するため、大規模な既存スクリプトへ追加する前に動作を理解してください。

### スクリプトの引数と特殊パラメータ

| パラメータ | 意味 |
| --- | --- |
| `$0` | スクリプト名または関数名 |
| `$1` から `$9` | 個々の位置引数 |
| `${10}` 以降 | 波括弧が必要な10番目以降の位置引数 |
| `"$@"` | すべての引数を個別の文字列として保持 |
| `"$*"` | すべての引数を1つの文字列として結合 |
| `$#` | 位置引数の数 |
| `$$` | 現在のシェルのプロセスID |
| `$?` | 直前のコマンドの終了ステータス |
| `$!` | 最後にバックグラウンド実行したコマンドのプロセスID |

引数を別のコマンドへ渡す場合は `"$@"` を使用します。

```bash
backup() {
    cp -v -- "$@" backup/
}

backup "first file.txt" second.txt
```

`"$@"` を引用符で囲むことで、`"first file.txt"` が1つの引数として保持されます。

### 条件分岐

BashとZshでは、柔軟な `[[ ... ]]` 条件式を使用できます。

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

よく使うテスト：

| テスト | 意味 |
| --- | --- |
| `-e path` | パスが存在する |
| `-f path` | 通常ファイルが存在する |
| `-d path` | ディレクトリが存在する |
| `-r path` | パスを読み取れる |
| `-w path` | パスへ書き込める |
| `-x path` | パスを実行または通過できる |
| `-z string` | 文字列が空である |
| `string1 == string2` | `[[ ... ]]` 内で文字列が等しい |

古い `[ ... ]` 形式はPOSIXで規定されており、`/bin/sh` への移植性が高い一方、引用符や演算子の規則がより厳格です。BashまたはZshを明示的に選択するスクリプトでは `[[ ... ]]` を使い、移植可能な `sh` スクリプトでは `[ ... ]` を使います。

### 関数

```bash
find_large_files() {
    local pattern=${1:-'*'}
    local size_mb=${2:-10}
    find . -type f -name "$pattern" -size "+${size_mb}M" -exec ls -lh {} +
}

find_large_files '*.pdf' 20
```

関数は現在のシェル環境を共有するため、呼び出し元のシェルのディレクトリや変数を変更できます。1つの引数として保持したい展開は、必ず引用符で囲みます。


## ヘルプと実用上の習慣

### コマンドの動作を調べる

```bash
man command                        # 詳細なマニュアルページ
command --help                     # GNU形式でよく使われる簡易ヘルプ
help command                       # Bashの組み込みコマンドのヘルプ
type command                       # alias、関数、組み込み、実行ファイルを判定
command -v command                 # コマンドの解決先を表示
```

オプションの構文や動作は、macOSのBSD系ツールとGNU/Linuxのツールで異なる場合があります。コマンドを実行するシステム上のマニュアルを確認してください。

### 安全に作業する

```bash
pwd                                # 現在地を確認
ls -la target/                     # 対象を確認
echo rm target/*.tmp               # ワイルドカードの展開を事前確認
cp important.txt{,.backup}         # 簡易バックアップを作成
rm -i file.txt                     # 確認を要求
```

`alias rm='rm -i'` のようなaliasは、対話操作の安全策として役立ちます。ただし、スクリプトや別の環境ではaliasが読み込まれない場合があります。これだけを安全対策にしないでください。

### 効率よく作業する

```bash
cd -                               # 直前のディレクトリへ戻る
pushd /path/to/project             # 現在地を保存して移動
popd                               # 保存したディレクトリへ戻る
nano file.txt                      # 初心者向けのターミナルエディタ
vim file.txt                       # モーダル操作のターミナルエディタ
open -e file.txt                   # macOSのTextEditで開く
```


## 練習問題

### プロジェクトを作成して確認する

```bash
mkdir -p myproject/{src,tests,docs}
touch myproject/src/{main.py,utils.py}
touch myproject/README.md
tree myproject
```

### ファイルを検索して数える

```bash
find myproject -type f -name '*.py' | wc -l
```

### テキストを検索して変換する

```bash
printf '%s\n' INFO ERROR INFO ERROR > application.log
grep -n 'ERROR' application.log | tee errors.log | wc -l
```

### 小さなスクリプトを書く

ディレクトリを `$1` として受け取り、`[[ -d ... ]]` で存在を確認し、`du`、`sort`、`tail` を使ってサイズの大きい5項目を表示するスクリプトを作成してください。


## クイックリファレンス

| 操作 | コマンドと演算子 |
| --- | --- |
| 移動 | `pwd`、`cd`、`ls`、`tree` |
| 作成 | `mkdir`、`touch` |
| 表示 | `cat`、`less`、`head`、`tail`、`file` |
| コピー、移動、削除 | `cp`、`mv`、`rm`、`rmdir` |
| サイズや数の確認 | `wc`、`du` |
| 検索 | `grep`、`find`、`command -v`、`type` |
| テキスト変換 | `sed`、`awk`、`sort`、`uniq`、`cut`、`tr` |
| リダイレクトとパイプ | `>`、`>>`、`<`、`2>`、`|`、`tee` |
| コマンドの組み合わせ | `;`、`&`、`&&`、`||`、`$(...)` |
| 権限 | `chmod`、`chown`、`umask` |
| リンク | `ln`、`ln -s` |
| プロセスとジョブ | `ps`、`top`、`pgrep`、`kill`、`jobs`、`fg`、`bg` |
| ヘルプ | `man`、`--help`、`help`、`type` |
