# Use a base image that has Node.js and npm installed
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package.json package-lock.json ./

# Install all dependencies (including nodemon)
RUN npm install

# Copy the rest of your project files into the container
COPY . .

# Expose the port your app will run on (change 3000 to the port you use)
EXPOSE 3000

# Set the command to run your app
CMD ["npm", "run", "dev"]
