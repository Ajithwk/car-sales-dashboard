import threading
import time
from typing import Callable
from queue import Queue

task_queue = Queue()

def worker():
    while True:
        func, args = task_queue.get()
        try:
            func(*args)
        except Exception as e:
            print(f"Error processing task: {e}")
        task_queue.task_done()

# Start the worker thread when this file is imported
threading.Thread(target=worker, daemon=True).start()

def add_task(func: Callable, *args):
    task_queue.put((func, args))
