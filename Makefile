ENVIRONMENT ?= local
# Default image name
IMAGE_NAME ?= ghost-remix
# Default Ghost API key
GHOST_CONTENT_API_KEY ?= 77a7e9c49a7cc3416ab81eb233
BLOG_URL ?= http://localhost:8080
SITE_TITLE ?= Test
SITE_DESCRIPTION ?= "A test description"
OWNER_NAME ?= Test
OWNER_SLUG ?= test
OWNER_EMAIL ?= test@example.com
OWNER_PASSWORD ?= password
JWT_SECRET ?= a543a2c76c05e0f9cbc3fa07b19ffb79af59a0b8d2d3971ac202e57853cb8cfa
COMMENT_SETTINGS ?= all

# Container name
CONTAINER_NAME ?= ghost-remix-container

# Phony targets
.PHONY: build run all clean clean-image clean-all terminal

all: build run
clean-all: clean clean-image

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the Docker container
run:
	docker run -d --name $(CONTAINER_NAME) -p 8080:8080 \
	-e GHOST_CONTENT_API_KEY=$(GHOST_CONTENT_API_KEY) \
	-e SITE_TITLE=$(SITE_TITLE) \
	-e SITE_DESCRIPTION=$(SITE_DESCRIPTION) \
	-e OWNER_NAME=$(OWNER_NAME) \
	-e OWNER_SLUG=$(OWNER_SLUG) \
	-e OWNER_EMAIL=$(OWNER_EMAIL) \
	-e OWNER_PASSWORD=$(OWNER_PASSWORD) \
	-e ENVIRONMENT=$(ENVIRONMENT) \
	-e BLOG_URL=$(BLOG_URL) \
	-e JWT_SECRET=$(JWT_SECRET) \
	-e COMMENT_SETTINGS=$(COMMENT_SETTINGS) \
	$(IMAGE_NAME)

clean:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

# Remove the Docker image
clean-image:
	docker rmi $(IMAGE_NAME)

terminal:
	docker exec -it $(CONTAINER_NAME) /bin/bash
