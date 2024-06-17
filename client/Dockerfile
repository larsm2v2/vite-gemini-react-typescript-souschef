# Base stage for building
FROM node:lts-alpine AS base
WORKDIR /app

# Install all dependencies (including react-icons)
COPY package*.json ./
RUN npm install

# Build the app
COPY . .
RUN npm run build

# Production stage for running the app
FROM node:lts-alpine AS production

WORKDIR /app

COPY --from=base /app/package*.json ./

RUN npm ci --omit=dev && npm i vite

COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package-lock.json ./package-lock.json




EXPOSE 3001

CMD ["npm", "run", "preview"]
