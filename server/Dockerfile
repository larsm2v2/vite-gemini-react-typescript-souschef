FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm ci --production

COPY . .
EXPOSE 5000

CMD ["npm", "run", "dev"]