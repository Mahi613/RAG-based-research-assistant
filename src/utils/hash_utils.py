"""Utility for computing cryptographic hashes of files."""

from __future__ import annotations
from pathlib import Path
import hashlib
from typing import Union

__all__ = ["calculate_file_hash"]


def calculate_file_hash(
    file_path: Union[str, Path],
    algorithm="sha256",
    chunk_size: int = 8192,
) -> str:
    """
    Compute a hexadecimal hash for a file.

    Parameters
    ----------
    file_path : str | Path
        Path to the file to hash.
    algorithm : str, optional
        Hash algorithm accepted by ``hashlib`` (default ``"sha256"``).
    chunk_size : int, optional
        Number of bytes to read per iteration (default ``8192``).

    Returns
    -------
    str
        Hexadecimal hash string (lower‑case).

    Raises
    ------
    ValueError
        If ``algorithm`` is not supported by ``hashlib``.
    FileNotFoundError
        If the file cannot be opened.
    """
    algorithm = algorithm.lower()
    if algorithm not in hashlib.algorithms_available:
        raise ValueError(f"Unsupported hash algorithm: {algorithm}")

    hasher = hashlib.new(algorithm)

    path = Path(file_path)
    try:
        with path.open("rb") as f:
            for chunk in iter(lambda: f.read(chunk_size), b""):
                hasher.update(chunk)
    except OSError as exc:
        raise FileNotFoundError(f"Unable to read file {path!s}: {exc}") from exc

    return hasher.hexdigest().lower()


if __name__ == "__main__":
    # Simple CLI for quick testing
    import argparse

    parser = argparse.ArgumentParser(description="Calculate file hash")
    parser.add_argument("path", help="Path to the file")
    parser.add_argument("-a", "--algorithm", default="sha256", help="Hash algorithm")
    args = parser.parse_args()
    print(calculate_file_hash(args.path, args.algorithm))
