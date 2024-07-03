FROM node:lts-alpine

WORKDIR /app
COPY ./package*.json ./
RUN npm install
RUN npm install typescript ts-node --save-dev


COPY . .

# Install dependencies
# RUN npm ci --production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY . .
EXPOSE 5000

CMD ["npm", "run", "dev"]