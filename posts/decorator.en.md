---
title: "10 examples of decorators"
date: "2024-10-31"
subtitle: "Extend the functionality of functions with decorators"
tags: [Python]
---


## 1. Timing Decorator
Measure the execution time of a function.

```python
import time

def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"{func.__name__} took {end_time - start_time:.4f} seconds to execute")
        return result
    return wrapper


# Example usage
@timing_decorator
def slow_function():
    time.sleep(2)


slow_function()
# Output: slow_function took 2.0051 seconds to execute
```

## 2. Logging Decorator
Log the call, arguments, and return value of a function.

```python
def logging_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper


# Example usage
@logging_decorator
def add(a, b):
    return a + b


result = add(2, 3)
# Output: Calling add with args: (2, 3), kwargs: {}
# Output: add returned 5
```

## 3. Cache Decorator
Cache the results of heavy computations like recursive functions to optimize performance.

```python
def cache_decorator(func):
    cache = {}
    def wrapper(*args):
        if args in cache:
            print(f"Returning cached result for {args}")
            return cache[args]
        result = func(*args)
        cache[args] = result
        return result
    return wrapper


# Example usage
@cache_decorator
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)


print(fib(10))
# Returning cached result for (1,)
# Returning cached result for (2,)
# Returning cached result for (3,)
# Returning cached result for (4,)
# Returning cached result for (5,)
# Returning cached result for (6,)
# Returning cached result for (7,)
# Returning cached result for (8,)
# 55
```

## 4. Retry Decorator
Retry the function call a specified number of times if an exception occurs.

```python
import time

def retry_decorator(retries=3, delay=1):
    def decorator(func):
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"Attempt {attempts+1} failed with {e}. Retrying in {delay} seconds...")
                    time.sleep(delay)
                    attempts += 1
            return None
        return wrapper
    return decorator


# Example usage
@retry_decorator(retries=5, delay=0.5)
def example_function():
    raise Exception("Error")


example_function()
# Attempt 1 failed with Error. Retrying in 0.5 seconds...
# Attempt 2 failed with Error. Retrying in 0.5 seconds...
# Attempt 3 failed with Error. Retrying in 0.5 seconds...
# Attempt 4 failed with Error. Retrying in 0.5 seconds...
# Attempt 5 failed with Error. Retrying in 0.5 seconds...
```

## 5. Authorization Decorator
Check if the user has the required permissions before executing the function.

```python
def authorization_decorator(allowed_roles):
    def decorator(func):
        def wrapper(user, *args, **kwargs):
            if user.role not in allowed_roles:
                raise PermissionError(f"User {user.name} does not have the required permissions")
            return func(user, *args, **kwargs)
        return wrapper
    return decorator


# Example usage
class User:
    def __init__(self, name, role):
        self.name = name
        self.role = role

@authorization_decorator(allowed_roles=["admin", "superuser"])
def delete_user(user, username):
    print(f"User {username} deleted by {user.name}")


# This will work
admin_user = User("AdminUser", "admin")
delete_user(admin_user, "SomeUser")
# Output: User SomeUser deleted by AdminUser

# This will raise a PermissionError
regular_user = User("RegularUser", "regular")
delete_user(regular_user, "SomeUser")
# Output: PermissionError: User RegularUser does not have the required permissions
```


## 6. Singleton Decorator
Ensure that a class has only one instance.

```python
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance


# Example usage
@singleton
class SingletonClass:
    def __init__(self):
        print("Singleton instance created")


instance1 = SingletonClass()
instance2 = SingletonClass()
print(instance1 is instance2)
# Output: True
```

## 7. Validate Arguments Decorator
Validate the types of arguments passed to a function.

```python
def validate_args(types):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for (a, t) in zip(args, types):
                if not isinstance(a, t):
                    raise TypeError(f"Argument {a} is not of type {t.__name__}")
            return func(*args, **kwargs)
        return wrapper
    return decorator


# Example usage 1
@validate_args((int, int))
def add(a, b):
    return a + b

print(add(2, 3))  # 5
# print(add(2, '3'))  # Raises TypeError: Argument 3 is not of type int


# Example usage 2
@validate_args((np.ndarray, np.ndarray))
def add_array(a, b):
    return a + b

print(add_array(np.array([1, 2]), np.array([3, 4])))  # [4 6]
# print(add_array(np.array([1, 2]), [3, 4]))  # Raises TypeError: Argument [3, 4] is not of type ndarray
```

## 8. Ensure Positive Decorator
Ensure that all arguments passed to a function are positive.

```python
def ensure_positive(func):
    def wrapper(*args, **kwargs):
        for arg in args:
            if arg <= 0:
                raise ValueError("All arguments must be positive")
        return func(*args, **kwargs)
    return wrapper


# Example usage
@ensure_positive
def multiply(a, b):
    return a * b


print(multiply(3, 4))  # 12
# print(multiply(3, -4))  # Raises ValueError: All arguments must be positive
```

## 9. Count Calls Decorator
Count the number of times a function has been called.

```python
def count_calls(func):
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        print(f"{func.__name__} has been called {wrapper.calls} times")
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper


# Example usage
@count_calls
def say_hello():
    print("Hello")


say_hello()
say_hello()
# say_hello has been called 1 times
# Hello
# say_hello has been called 2 times
# Hello
```


## 10. Throttling Decorator
Limit the frequency at which a function can be called.

```python
import time
from functools import wraps

def throttle(rate):
    interval = 1.0 / rate
    def decorator(func):
        last_call = [0.0]
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_call[0]
            if elapsed < interval:
                time.sleep(interval - elapsed)
            last_call[0] = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator


# Example usage
@throttle(2)  # 2 calls per second
def print_message():
    print("時刻" + time.strftime("%H:%M:%S", time.localtime()))


for _ in range(6):
    print_message()
# 時刻04:54:26
# 時刻04:54:26
# 時刻04:54:27
# 時刻04:54:27
# 時刻04:54:28
# 時刻04:54:28
```

