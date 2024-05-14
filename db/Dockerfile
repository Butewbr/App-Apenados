# Use the official PostgreSQL image from Docker Hub
FROM postgres:14.2-alpine

COPY db/schema.sql /docker-entrypoint-initdb.d/

# The SQL file will be executed when the container starts
