# OTFIL
## How to setup
```
docker pull redis
docker pull postgres
docker run --name -p 6379:6379 redis -d redis
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
pip install -r requirements.txt
alembic revision --autogenerate -m "first migration"
alembic upgrade head
uvicorn app.main:app
```
and then, app will be available at http://127.0.0.1:8000/
Docs url:
`/docs`
Redoc url:
`/redoc`
OpenAPI Json:
`/openapi.json`
