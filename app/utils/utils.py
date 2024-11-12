from slugify import slugify
from time import time


def generate_slug(value):
    return f"{slugify(value, max_length=30)}-{int(time() * 1000)}"
