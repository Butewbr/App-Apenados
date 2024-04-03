FROM python:3.9-slim

COPY app app

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD [ "gunicorn", "--bind", "0.0.0.0:5000", "app:app" ]

