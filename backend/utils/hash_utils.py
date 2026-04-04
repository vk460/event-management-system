import hashlib

def verify_file_integrity(file_path, stored_hash):
    """
    Verifies that the file at file_path matches the stored_hash.
    """
    sha256_hash = hashlib.sha256()
    try:
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest() == stored_hash
    except FileNotFoundError:
        return False
