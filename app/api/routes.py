from fastapi import APIRouter


routes = APIRouter()

@routes.get("/health")
def main():
    return {"status": "active"}
