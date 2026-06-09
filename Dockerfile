FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_IEUM_API_BASE_URL
ARG VITE_MIRIM_OAUTH_CLIENT_ID
ARG VITE_MIRIM_OAUTH_CLIENT_SECRET
ARG VITE_MIRIM_OAUTH_REDIRECT_URI
ARG VITE_MIRIM_OAUTH_SCOPES
ARG VITE_MIRIM_OAUTH_SERVER_URL

ENV VITE_IEUM_API_BASE_URL=$VITE_IEUM_API_BASE_URL
ENV VITE_MIRIM_OAUTH_CLIENT_ID=$VITE_MIRIM_OAUTH_CLIENT_ID
ENV VITE_MIRIM_OAUTH_CLIENT_SECRET=$VITE_MIRIM_OAUTH_CLIENT_SECRET
ENV VITE_MIRIM_OAUTH_REDIRECT_URI=$VITE_MIRIM_OAUTH_REDIRECT_URI
ENV VITE_MIRIM_OAUTH_SCOPES=$VITE_MIRIM_OAUTH_SCOPES
ENV VITE_MIRIM_OAUTH_SERVER_URL=$VITE_MIRIM_OAUTH_SERVER_URL

COPY package.json yarn.lock ./
RUN corepack enable && corepack prepare yarn@1.22.22 --activate && yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:1.29-alpine

COPY --from=build /app/dist /usr/share/nginx/html
RUN printf '%s\n' \
  'server {' \
  '  listen 3000;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  location / {' \
  '    try_files $uri $uri/ /index.html;' \
  '  }' \
  '}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000
