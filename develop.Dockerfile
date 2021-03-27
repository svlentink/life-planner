FROM node AS build

# actual building process
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY . /app
RUN npm run build

FROM nginx:alpine
COPY --from=build /app /usr/share/nginx/html/lp
#:8080/lp/
