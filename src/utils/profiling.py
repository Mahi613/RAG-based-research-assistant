import time
import os
import json
from contextlib import contextmanager
from datetime import datetime

try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False

LOGS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "logs")

def get_memory_mb():
    """Get current process memory RSS in MB."""
    if HAS_PSUTIL:
        process = psutil.Process(os.getpid())
        return round(process.memory_info().rss / (1024 * 1024), 2)
    return 0.0

@contextmanager
def profile_section(name: str, enabled: bool = True, extra_meta: dict = None):
    """Context manager to measure latency and memory delta for a section."""
    if not enabled:
        yield {}
        return

    start_time = time.perf_counter()
    start_mem = get_memory_mb()

    result_metrics = {
        "section": name,
        "timestamp": datetime.now().isoformat(),
        "start_memory_mb": start_mem
    }

    try:
        yield result_metrics
    finally:
        end_time = time.perf_counter()
        end_mem = get_memory_mb()
        
        elapsed = round(end_time - start_time, 4)
        mem_delta = round(end_mem - start_mem, 2)

        result_metrics.update({
            "elapsed_sec": elapsed,
            "end_memory_mb": end_mem,
            "memory_delta_mb": mem_delta
        })

        if extra_meta:
            result_metrics.update(extra_meta)

        log_profile(result_metrics)

def log_profile(metrics: dict):
    """Append profiling entry to logs/profiling.jsonl."""
    os.makedirs(LOGS_DIR, exist_ok=True)
    log_file = os.path.join(LOGS_DIR, "profiling.jsonl")
    try:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(metrics) + "\n")
    except Exception as e:
        print(f"[Profiling] Warning: Failed to write log: {e}")
