# Stage 1: Build
FROM node:latest as node

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install && npm run build


# Stage 2: Run with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=node /app/dist/angular-crud/browser .
# or
# COPY --from=node /app/dist/angular-crud .

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
