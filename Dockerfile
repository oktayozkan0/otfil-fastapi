FROM python:3.12

WORKDIR /api

COPY . /api

RUN pip install --no-cache-dir --upgrade -r /api/requirements.txt

EXPOSE 8000