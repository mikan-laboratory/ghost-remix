# Default image name
IMAGE_NAME ?= smooth-jazz

# Default Ghost API key
GHOST_API_KEY ?= 77a7e9c49a7cc3416ab81eb233

# Phony targets
.PHONY: build run all

all: build run

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
	docker run -e GHOST_API_KEY=$(GHOST_API_KEY) $(IMAGE_NAME)
