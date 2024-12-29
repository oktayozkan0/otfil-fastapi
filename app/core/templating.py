from jinja2 import Environment, FileSystemLoader
import os


templates = Environment(
    loader=FileSystemLoader(os.path.join(os.getcwd(), "app", "templates"))
)
