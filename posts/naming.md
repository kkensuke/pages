---
title: "プログラミングの命名規則"
date: "2024-7-5"
subtitle: "クリーンで保守しやすいコードを書くための包括的ガイド"
tags: [Code]
icon: case-sensitive
---




## 0 自己説明的なコードを書く技術
良い命名は、保守可能なコードを書く上で最も重要な側面の一つです。コードそれ自身を説明的で理解しやすくするための第一歩です。
:::quote{title='Phil Karlton'}
コンピュータサイエンスには二つの難しいことがある：キャッシュの無効化と物事に名前を付けることだ。
:::



## 1 命名の基本原則
言語固有の規則に入る前に、良い命名の基本原則を確立しましょう：

1. **簡潔さよりも明確さ**：名前は明確で自己説明的であるべき
2. **一貫性**：コードベース内で確立されたパターンに従う
3. **コンテキスト認識**：名前はその範囲と使用法を反映すべき
4. **発音**：コードレビューで発音しやすい名前であるべき
5. **検索可能性**：名前は検索可能なほど十分にユニークであるべき



## 2 Python の命名規則
Pythonの命名規則は、Pythonコードの公式スタイルガイドである [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/) に概説されています。

### 2-1 パッケージ名
- **規則**：すべて小文字の名前、できれば短い単語一つ
- **パターン**：`lowercase`（推奨）、`lowercase_with_underscores`（複数語のパッケージでは許容可能）
- **例**：
  - ✅ `requests`
  - ✅ `numpy`
  - ✅ `my_package`（単語一つが好ましいが許容可能）
  - ❌ `MyPackage`

### 2-2 モジュール名
- **規則**：任意のアンダースコアを含むすべて小文字
- **パターン**：`lowercase` または `lowercase_with_underscores`
- **例**：
  - ✅ `utils`
  - ✅ `data_processing`
  - ✅ `image_utils`
  - ❌ `imageUtils`
  - ❌ `ImageUtils`

### 2-3 定数
- **規則**：アンダースコア付きのすべて大文字
- **パターン**：`UPPERCASE_WITH_UNDERSCORES`
- **例**：
  - ✅ `MAX_CONNECTIONS = 100`
  - ✅ `DEFAULT_TIMEOUT = 30`
  - ✅ `PI = 3.14159`
  - ❌ `MaxConnections = 100`
  - ❌ `default_timeout = 30`

### 2-4 変数
- **規則**：アンダースコア付きの小文字
- **パターン**：`lowercase_with_underscores`
- **例**：
  ```python
  # 良い例
  player_name = "John"
  total_score = 100
  items_in_cart = ["apple", "banana"]

  # 悪い例
  PlayerName = "John"  # クラスのように見える
  totalScore = 100     # Python のスタイルではない
  x = ["apple", "banana"]  # 説明的でない
  ```

### 2-5 ブール変数
- **規則**：質問形式または状態の説明
- **一般的な接頭辞**：`is_`、`has_`、`can_`、`should_`、`with_`
- **例**：
  ```python
  # 状態の説明
  is_active = True
  has_permission = True
  can_edit = False
  should_retry = True
  with_logging = True

  # 接頭辞なし（コンテキストが明確な場合）
  active = True
  visible = False
  enabled = True
  ```

### 2-6 関数
- **規則**：アンダースコア付きの小文字
- **パターン**：`verb_noun` または `action_object`
- **例**：
  ```python
  # 良い例
  def calculate_total(items):
      pass

  def get_user_profile(user_id):
      pass

  def validate_email(email):
      pass

  # 悪い例
  def Calculate_Total(items):  # 誤った大文字小文字の使用
      pass

  def userData(user_id):  # 誤った規則
      pass
  ```

### 2-7 クラス
- **規則**：CapWords/PascalCase
- **パターン**：`CapitalizedWords`
- **例**：
  ```python
  # 良い例
  class UserProfile:
      pass

  class DatabaseConnection:
      pass

  class HTMLParser:
      pass

  # 悪い例
  class user_profile:  # 誤った規則
      pass

  class databaseConnection:  # 誤った規則
      pass
  ```

### 2-8 メソッドとインスタンス変数
- **公開メソッド**：関数の命名と同じ
- **非公開メソッド/変数**：先頭に単一のアンダースコア
- **名前修飾**：先頭に二重のアンダースコア
- **例**：
  ```python
  class User:
      def __init__(self):
          self.name = "John"           # 公開
          self._password = "secret"    # 規則により非公開
          self.__id = "12345"         # 名前修飾

      def get_profile(self):          # 公開メソッド
          pass

      def _hash_password(self):       # 非公開メソッド
          pass

      def __generate_id(self):        # 名前修飾メソッド
          pass
  ```



## 3 他の言語での命名規則
### 3-1 JavaScript/TypeScript
- **変数/関数**：camelCase
- **クラス**：PascalCase
- **Interface**（TypeScript）：PascalCase
- **型(type)**（TypeScript）：PascalCase
- **列挙型(enum)**：PascalCase + UPPERCASE
- **定数**：UPPERCASE_WITH_UNDERSCORES
- **非公開フィールド**：#接頭辞付き（例：`#privateField`）
- **頭字語**：二つのアプローチ：
  - 単語として扱う：`htmlParser`、`jsonData`（最近のスタイルガイドでは好まれる）
  - すべて大文字：`HTMLParser`、`JSONData`（多くのコードベースでまだ一般的）
- **例**：
  ```javascript
  // 変数
  let userName = "John";
  let isActive = true;

  // 関数
  function calculateTotal() {}
  const getUserProfile = () => {};

  // クラス
  class UserProfile {
      #privateField = 'secret';

      constructor() {}
  }

  // インターフェース
  interface User {
      id: string;
      name: string;
      email: string;
  }
  // 型
  type UserID = string | number;
  // 列挙型
  enum UserRole {
      ADMIN,
      USER,
      GUEST
  }

  // 定数
  const MAX_ATTEMPTS = 3;

  // 頭字語 - 両方のスタイルを表示
  const jsonParser = new JSONParser();
  const htmlElement = document.querySelector('div');
  ```



## 4 略語と頭字語
### 4-1 一般的なルール
1. 広く認識されていない限り**避ける**
2. 大文字小文字のルールと**一貫性を持つ**
3. 必要に応じて**文書化する**

### 4-2 一般的に許容される略語
- `id` は「identifier」（識別子）
- `str` は「string」（文字列）（Python）
- `num` は「number」（数値）
- `max`/`min` は「maximum」/「minimum」（最大/最小）
- `char` は「character」（文字）
- `temp` は「temporary」（一時的）
- `init` は「initialize」（初期化）
- `auth` は「authentication」（認証）
- `admin` は「administrator」（管理者）

### 4-3 頭字語
- **HTTP**：HyperText Transfer Protocol（ハイパーテキスト転送プロトコル）
- **URL**：Uniform Resource Locator（統一資源位置指定子）
- **HTML**：HyperText Markup Language（ハイパーテキストマークアップ言語）
- **XML**：eXtensible Markup Language（拡張可能マークアップ言語）
- **JSON**：JavaScript Object Notation（JavaScript オブジェクト表記法）
- **SQL**：Structured Query Language（構造化クエリ言語）
- **API**：Application Programming Interface（アプリケーションプログラミングインターフェース）
- **GUI**：Graphical User Interface（グラフィカルユーザーインターフェース）

推奨略語の包括的リストについては、[Code Abbreviations Guide](https://github.com/abbrcode/abbreviations-in-code)を参照してください。

## 5 ベストプラクティスとヒント

### 5-1 すべき事
- ✅ 意図を明らかにする説明的な名前を使用する
- ✅ 散文として読みやすいコードになる名前を選ぶ
- ✅ 一貫した命名パターンを使用する
- ✅ 発音可能な名前にする
- ✅ 適切な場合はドメイン用語を使用する

### 5-2 すべきでない事
- ❌ 単一文字の名前を使う（ループ/ラムダ以外）
- ❌ 広く受け入れられていない限り略語を使用する
- ❌ わずかに異なるだけの名前を使用する
- ❌ 名前にエンコーディングを使用する（ハンガリアン記法）
- ❌ 可愛いまたはユーモラスな名前を使用する

### 5-3 良い名前と悪い名前の例

```python
# 良い名前
user_count = 0
active_users = []
calculate_total_price(items)
class DatabaseConnection:
    pass

# 悪い名前
n = 0  # nとは何か？
lst = []  # どんなリスト？
do_stuff(things)  # あまりにも曖昧
class Dbconn:  # 不明確な略語
```



## 6 特殊なケースとエッジケース
### 6-1 数学的操作
数学的概念を扱う場合、単一文字の変数は許容される場合があります：
```python
# 許容される数学的変数
x, y, z = coordinates
i, j, k = indices
n = count
```

### 6-2 ループ変数
限定的なコンテキストでは短い名前が許容されます：
```python
for i in range(10):
    for j in range(10):
        matrix[i][j] = 0
```

### 6-3 ラムダ関数
単純なラムダ関数では短いパラメータ名が許容される場合があります：
```python
# 許容可能
squares = map(lambda x: x**2, numbers)

# 複雑な操作では読みにくい
transform = lambda x, y: (x * y) + (x / y)  # 名前付き関数の方が良い
```



## 7 リソースとツール
### 7-1 スタイルチェッカー
- Python: `pylint`、`flake8`
- JavaScript: `eslint`

### 7-2 ドキュメント
- [PEP 8](https://peps.python.org/pep-0008/) - Python スタイルガイド
- [Google Style Guides](https://google.github.io/styleguide/)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

覚えておいてください：命名規則の目的は、コードをより読みやすく保守しやすくすることです。迷った場合は、簡潔さよりも明確さを選びましょう。