FROM node:22.12.0-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
COPY tsconfig.json ./

USER node
CMD ["npm", "run", "start:sepolia"]
