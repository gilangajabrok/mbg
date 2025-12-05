.PHONY: help build dev run test clean install deps lint

help:
	@echo "MBG API - Golang Backend"
	@echo ""
	@echo "Available targets:"
	@echo "  make install      - Download and install dependencies"
	@echo "  make dev          - Run development server"
	@echo "  make build        - Build production binary"
	@echo "  make run          - Run production binary"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run linter (golangci-lint)"
	@echo "  make fmt          - Format code"
	@echo "  make docker-up    - Start Docker containers"
	@echo "  make docker-down  - Stop Docker containers"
	@echo "  make db-reset     - Reset database"
	@echo "  make clean        - Remove build artifacts"

install:
	@echo "Downloading dependencies..."
	go mod download
	go mod tidy
	@echo "✓ Dependencies installed"

deps:
	@echo "Updating dependencies..."
	go get -u ./...
	go mod tidy
	@echo "✓ Dependencies updated"

dev:
	@echo "Starting development server..."
	go run cmd/api/main.go

build:
	@echo "Building production binary..."
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/mbg-api cmd/api/main.go
	@echo "✓ Binary built: bin/mbg-api"

run: build
	@echo "Running server..."
	./bin/mbg-api

test:
	@echo "Running tests..."
	go test -v ./...

lint:
	@echo "Running linter..."
	golangci-lint run

fmt:
	@echo "Formatting code..."
	go fmt ./...
	goimports -w .

docker-build:
	@echo "Building Docker image..."
	docker build -t mbg-api:latest .
	@echo "✓ Image built"

docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d
	@echo "✓ Containers started"
	@echo "  API: http://localhost:8000"
	@echo "  DB: localhost:5432"

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down
	@echo "✓ Containers stopped"

docker-logs:
	docker-compose logs -f

db-reset:
	@echo "Resetting database..."
	docker-compose exec postgres dropdb -U postgres mbg
	docker-compose exec postgres createdb -U postgres mbg
	@echo "✓ Database reset"

clean:
	@echo "Cleaning up..."
	rm -rf bin/
	go clean
	@echo "✓ Clean complete"

.DEFAULT_GOAL := help
