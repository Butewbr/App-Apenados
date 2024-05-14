FROM python:3.11-slim

COPY server/app app

WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["gunicorn", "--worker-class=gevent", "--worker-connections=1000", "--reload", "-w", "2", "--timeout", "60", "-b", ":5000", "app:app"]
