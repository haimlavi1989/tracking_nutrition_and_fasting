# frontend Dockerfile
# Use the official Angular image as a base
FROM node:22-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Angular CLI
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN ng build --configuration development

# Use Nginx to serve the Angular app
FROM nginx:latest
COPY --from=build /app/dist/tracking_nutrition_and_fasting/browser /usr/share/nginx/html
EXPOSE 80
