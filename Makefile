ENVIRONMENT ?= local
# Default image name
IMAGE_NAME ?= smooth-jazz

# Default Ghost API key
GHOST_CONTENT_API_KEY ?= 77a7e9c49a7cc3416ab81eb233

SITE_TITLE ?= Test
SITE_DESCRIPTION ?= "A test description"
OWNER_NAME ?= Test
OWNER_SLUG ?= test
OWNER_EMAIL ?= test@example.com
OWNER_PASSWORD ?= password
THEME_SOURCE ?= ./themes/bulletin
NEWSLETTER_URL ?= http://localhost:8081
THEME_DESTINATION ?= ../var/www/ghost/content/themes/bulletin
THEME_NAME ?= bulletin

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
	docker run -d --name $(CONTAINER_NAME) -p 8080:8080 -p 8081:8081 \
	-e GHOST_CONTENT_API_KEY=$(GHOST_CONTENT_API_KEY) \
	-e SITE_TITLE=$(SITE_TITLE) \
	-e SITE_DESCRIPTION=$(SITE_DESCRIPTION) \
	-e OWNER_NAME=$(OWNER_NAME) \
	-e OWNER_SLUG=$(OWNER_SLUG) \
	-e OWNER_EMAIL=$(OWNER_EMAIL) \
	-e OWNER_PASSWORD=$(OWNER_PASSWORD) \
	-e ENVIRONMENT=$(ENVIRONMENT) \
	-e THEME_SOURCE=$(THEME_SOURCE) \
	-e THEME_DESTINATION=$(THEME_DESTINATION) \
	-e THEME_NAME=$(THEME_NAME) \
	-e NEWSLETTER_URL=$(NEWSLETTER_URL) \
	$(IMAGE_NAME)

clean:
	docker stop $(CONTAINER_NAME) && docker rm $(CONTAINER_NAME)

# Remove the Docker image
clean-image:
	docker rmi $(IMAGE_NAME)

terminal:
	docker exec -it $(CONTAINER_NAME) /bin/bash
