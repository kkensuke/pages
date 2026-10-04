---
title: "Naming Conventions in Programming"
date: "2024-7-5"
subtitle: "A Comprehensive Guide to Writing Clean and Maintainable Code"
tags: [Code]
icon: case-sensitive
---




## 0 The Art of Writing Self-Documenting Code
Good naming is one of the most critical aspects of writing maintainable code. It is the first step in making your code self-explanatory and easy to understand. As the saying goes:
:::quote{title='Phil Karlton'}
There are only two hard things in Computer Science: cache invalidation and naming things.
:::


## 1 Core Principles of Naming
Before diving into language-specific conventions, let's establish the fundamental principles of good naming:

1. **Clarity Over Brevity**: Names should be clear and self-documenting
2. **Consistency**: Follow established patterns within your codebase
3. **Context-Awareness**: Names should reflect their scope and usage
4. **Pronunciation**: Names should be easy to pronounce in code reviews
5. **Searchability**: Names should be unique enough to be searchable



## 2 Python Naming Conventions
Python's naming conventions are outlined in [PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/), the official style guide for Python code.

### 2-1 Package Names
- **Convention**: All-lowercase names, preferably short single words
- **Pattern**: `lowercase` (preferred), `lowercase_with_underscores` (acceptable for multi-word packages)
- **Examples**:
  - ✅ `requests`
  - ✅ `numpy`
  - ✅ `my_package` (acceptable though single-word is preferred)
  - ❌ `MyPackage`

### 2-2 Module Names
- **Convention**: All-lowercase with optional underscores
- **Pattern**: `lowercase` or `lowercase_with_underscores`
- **Examples**:
  - ✅ `utils`
  - ✅ `data_processing`
  - ✅ `image_utils`
  - ❌ `imageUtils`
  - ❌ `ImageUtils`

### 2-3 Constants
- **Convention**: All-uppercase with underscores
- **Pattern**: `UPPERCASE_WITH_UNDERSCORES`
- **Examples**:
  - ✅ `MAX_CONNECTIONS = 100`
  - ✅ `DEFAULT_TIMEOUT = 30`
  - ✅ `PI = 3.14159`
  - ❌ `MaxConnections = 100`
  - ❌ `default_timeout = 30`

### 2-4 Variables
- **Convention**: Lowercase with underscores
- **Pattern**: `lowercase_with_underscores`
- **Examples**:
  ```python
  # Good examples
  player_name = "John"
  total_score = 100
  items_in_cart = ["apple", "banana"]
  
  # Bad examples
  PlayerName = "John"  # Looks like a class
  totalScore = 100     # Not Python style
  x = ["apple", "banana"]  # Not descriptive
  ```

### 2-5 Boolean Variables
- **Convention**: Question form or state description
- **Common Prefixes**: `is_`, `has_`, `can_`, `should_`, `with_`
- **Examples**:
  ```python
  # State description
  is_active = True
  has_permission = True
  can_edit = False
  should_retry = True
  with_logging = True
  
  # Without prefix (when context is clear)
  active = True
  visible = False
  enabled = True
  ```

### 2-6 Functions
- **Convention**: Lowercase with underscores
- **Pattern**: `verb_noun` or `action_object`
- **Examples**:
  ```python
  # Good examples
  def calculate_total(items):
      pass

  def get_user_profile(user_id):
      pass

  def validate_email(email):
      pass

  # Bad examples
  def Calculate_Total(items):  # Wrong capitalization
      pass

  def userData(user_id):  # Wrong convention
      pass
  ```

### 2-7 Classes
- **Convention**: CapWords/PascalCase
- **Pattern**: `CapitalizedWords`
- **Examples**:
  ```python
  # Good examples
  class UserProfile:
      pass

  class DatabaseConnection:
      pass

  class HTMLParser:
      pass

  # Bad examples
  class user_profile:  # Wrong convention
      pass

  class databaseConnection:  # Wrong convention
      pass
  ```

### 2-8 Methods and Instance Variables
- **Public Methods**: Same as function naming
- **Private Methods/Variables**: Single leading underscore
- **Name Mangling**: Double leading underscore
- **Examples**:
  ```python
  class User:
      def __init__(self):
          self.name = "John"           # Public
          self._password = "secret"    # Private by convention
          self.__id = "12345"         # Name mangled

      def get_profile(self):          # Public method
          pass

      def _hash_password(self):       # Private method
          pass

      def __generate_id(self):        # Name mangled method
          pass
  ```



## 3 Naming Conventions in Other Languages
### 3-1 JavaScript/TypeScript
- **Variables/Functions**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPERCASE_WITH_UNDERSCORES
- **Interface**（TypeScript）：PascalCase
- **Type**（TypeScript）：PascalCase
- **Enum**（TypeScript）：PascalCase + UPPERCASE
- **Private Fields**: #prefixed (e.g., `#privateField`)
- **Acronyms**: Two approaches:
  - Treat as single word: `htmlParser`, `jsonData` (increasingly preferred in modern style guides)
  - All caps: `HTMLParser`, `JSONData` (still common in many codebases)
- **Examples**:
  ```javascript
  // Variables
  let userName = "John";
  let isActive = true;

  // Functions
  function calculateTotal() {}
  const getUserProfile = () => {};

  // Classes
  class UserProfile {
      #privateField = 'secret';
      
      constructor() {}
  }
  
  // Interface
  interface User {
      id: number;
      name: string;
  }
  // Type
  type UserID = string | number;
  // Enum
  enum UserRole {
      ADMIN,
      USER,
      GUEST
  }

  // Constants
  const MAX_ATTEMPTS = 3;
  
  // Acronyms - both styles shown
  const jsonParser = new JSONParser();
  const htmlElement = document.querySelector('div');
  ```



## 4 Abbreviations and Acronyms
### 4-1 General Rules
1. **Avoid** unless widely recognized
2. **Be consistent** with casing rules
3. **Document** when necessary

### 4-2 Common Acceptable Abbreviations
- `id` for "identifier"
- `str` for "string" (Python)
- `num` for "number"
- `max`/`min` for "maximum"/"minimum"
- `char` for "character"
- `temp` for "temporary"
- `init` for "initialize"
- `auth` for "authentication"
- `admin` for "administrator"

### 4-3 Acronyms
- **HTTP**: HyperText Transfer Protocol
- **URL**: Uniform Resource Locator
- **HTML**: HyperText Markup Language
- **XML**: eXtensible Markup Language
- **JSON**: JavaScript Object Notation
- **SQL**: Structured Query Language
- **API**: Application Programming Interface
- **GUI**: Graphical User Interface

For a comprehensive list of recommended abbreviations, refer to the [Code Abbreviations Guide](https://github.com/abbrcode/abbreviations-in-code).



## 5 Best Practices and Tips
### 5-1 DO's
- ✅ Use descriptive names that reveal intent
- ✅ Choose names that make code readable as prose
- ✅ Use consistent naming patterns
- ✅ Make names pronounceable
- ✅ Use domain terminology when appropriate

### 5-2 DON'Ts
- ❌ Use single-letter names (except for loops/lambdas)
- ❌ Use abbreviations unless widely accepted
- ❌ Use names that differ only slightly
- ❌ Use encodings in names (Hungarian notation)
- ❌ Use cute or humorous names

### 5-3 Examples of Good vs Bad Names

```python
# Good Names
user_count = 0
active_users = []
calculate_total_price(items)
class DatabaseConnection:
    pass

# Bad Names
n = 0  # What is n?
lst = []  # What kind of list?
do_stuff(things)  # Too vague
class Dbconn:  # Unclear abbreviation
```



## 6 Special Cases and Edge Cases
### 6-1 Mathematical Operations
When working with mathematical concepts, single-letter variables can be acceptable:
```python
# Acceptable mathematical variables
x, y, z = coordinates
i, j, k = indices
n = count
```

### 6-2 Loop Variables
Short names are acceptable in limited contexts:
```python
for i in range(10):
    for j in range(10):
        matrix[i][j] = 0
```

### 6-3 Lambda Functions
Short parameter names can be acceptable in simple lambda functions:
```python
# Acceptable
squares = map(lambda x: x**2, numbers)

# Less readable for complex operations
transform = lambda x, y: (x * y) + (x / y)  # Better as a named function
```


## 7 Resources and Tools
### 7-1 Style Checkers
- Python: `pylint`, `flake8`
- JavaScript: `eslint`

### 7-2 Documentation
- [PEP 8](https://peps.python.org/pep-0008/) - Python Style Guide
- [Google Style Guides](https://google.github.io/styleguide/)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

Remember: The goal of naming conventions is to make code more readable and maintainable. When in doubt, choose clarity over brevity.