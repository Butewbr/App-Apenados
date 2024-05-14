# Define image name (customize if needed)
# IMAGE_NAME="server-apenados"

# Build the Docker image
# echo "Building Docker image..."
# cd server
# docker compose build

# # Check for build errors
# if [ $? -eq 0 ]; then
#   echo "Build successful!"
# else
#   echo "Build failed. Please check the logs for errors."
#   exit 1
# fi

# Run the container in detached mode
echo "Building the container..."
docker compose build

# Run the container in detached mode
echo "Running the container..."
docker compose up


echo "Flask application is running! Access it at http://localhost:5000/"
