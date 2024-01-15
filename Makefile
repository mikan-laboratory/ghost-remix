# Default image name
IMAGE_NAME ?= smooth-jazz

# Default Ghost API key
GHOST_CONTENT_API_KEY ?= 77a7e9c49a7cc3416ab81eb233

# Container name
CONTAINER_NAME ?= smooth-jazz-container

# Phony targets
.PHONY: build run all clean clean-image clean-all terminal

all: build run
clean-all: clean clean-image

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
	docker run -d --name $(CONTAINER_NAME) -p 80:80 -e GHOST_CONTENT_API_KEY=$(GHOST_CONTENT_API_KEY) $(IMAGE_NAME)

clean:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

# Remove the Docker image
clean-image:
	docker rmi $(IMAGE_NAME)

terminal:
	docker exec -it $(CONTAINER_NAME) /bin/bash
