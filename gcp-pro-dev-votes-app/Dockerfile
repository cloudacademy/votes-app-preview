# Build stage
FROM node:18-alpine AS build

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Serve stage
FROM node:18-alpine AS serve

# Set the working directory to /app
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/dist .

# Install serve
RUN npm install -g serve

# Handle ingress path
RUN ln -s /app/ /app/tally && sed -i 's%="/%="/tally/%g' index.html

# Expose port 3001
EXPOSE 3001

# Start the application
CMD ["serve", ".", "-p", "3001"]