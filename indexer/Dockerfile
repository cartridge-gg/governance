FROM node:22.10.0-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Default command - will be overridden by docker-compose
CMD ["npm", "start"]
