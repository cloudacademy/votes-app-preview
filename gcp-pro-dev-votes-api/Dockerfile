# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of the app source code to the working directory
COPY . .

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production

# Expose port 3333 for the app to listen on
EXPOSE 3333

# Start the app
CMD [ "npm", "start" ]