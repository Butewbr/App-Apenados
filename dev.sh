#!/bin/bash

# Define image name (customize if needed)
IMAGE_NAME="server-apenados"

# Build the Docker image
echo "Building Docker image..."
cd server
docker build -t $IMAGE_NAME .

# Check for build errors
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed. Please check the logs for errors."
  exit 1
fi

# Run the container in detached mode
echo "Running the container..."
docker run -p 5000:5000 $IMAGE_NAME

# Display container ID
CONTAINER_ID=$(docker ps -q -l name=$IMAGE_NAME)
echo "Container ID: $CONTAINER_ID"

echo "Flask application is running! Access it at http://localhost:5000/"
