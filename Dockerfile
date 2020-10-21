FROM node:current-alpine as builder
WORKDIR /webapp

COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /webapp/dist /usr/share/nginx/html/