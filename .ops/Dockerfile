FROM nginx:1.17.6-alpine AS base
WORKDIR /app
EXPOSE 80 443

FROM node:13.2.0-stretch AS build
RUN apt update && apt install tree
WORKDIR /src
COPY . .
RUN npm i && npm run postinstall && npm run build-production

FROM base
COPY --from=build /src/dist/angular-template/ /usr/share/nginx/html
