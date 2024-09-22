.PHONY: all
all: build
FORCE: ;

SHELL  := env LIBRARY_ENV=$(LIBRARY_ENV) $(SHELL)
LIBRARY_ENV ?= dev

test:
	go test -v -cover -covermode=atomic ./usecase/...

build-mocks:
	@go install go.uber.org/mock/mockgen@latest
	@~/go/bin/mockgen -source=models/repository.go -destination=models/mocks/repository_mock.go -package=mocks