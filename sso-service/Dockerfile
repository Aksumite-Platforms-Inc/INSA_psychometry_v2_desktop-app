# Stage 1: Build the Go application
FROM golang:alpine AS builder

# Install necessary packages
RUN apk add --no-cache bash ca-certificates git gcc g++ libc-dev

# Set the working directory
WORKDIR /temp

# Add the source code to the container
ADD . /temp

# Download dependencies and build the application
RUN go mod tidy && go build -v -o INSAssoService

# Stage 2: Create the final image
FROM alpine

# Install necessary packages
RUN apk update && apk add --no-cache ca-certificates && rm -rf /var/cache/apk/*

# Set the working directory
WORKDIR /usr/src/app

# Copy the built application and other necessary files from the builder stage
COPY --from=builder /temp/INSAssoService /usr/src/app/
COPY --from=builder /temp/envs /usr/src/app/envs
COPY --from=builder /temp/docs /usr/src/app/docs
COPY --from=builder /temp/sso.db /usr/src/app/

# Expose the application port
EXPOSE 8181

# Command to run the application
CMD ["./INSAssoService"]