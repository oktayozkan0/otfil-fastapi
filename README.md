# OTFIL
## How to setup
```
docker pull redis
docker pull postgres
docker run --name -p 6379:6379 redis -d redis
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```
