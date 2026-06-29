# build the react app -> stage 1 
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2 - serve it with nginx [fresh container]
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# nginx has its own built-in CMD already