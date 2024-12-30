FROM python:3.9-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the requirements file to leverage Docker cache for dependencies
COPY requirements.txt /app/

# Install Python dependencies (will be cached unless requirements.txt changes)

RUN apk add postgresql-client build-base postgresql-dev

RUN pip install -r requirements.txt

RUN pip install celery[redis]

# Copy the rest of the application code
COPY . /app/

EXPOSE 8000

RUN adduser --disabled-password service-user

USER service-user