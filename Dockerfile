FROM node AS build

# actual building process
WORKDIR /app
COPY package.json /app/
RUN npm install -g
COPY . /app
RUN npm run build

# the remaining code is used in github.com/svlentink/www
ARG WEBPATH=lent.ink/projects/life-planner
ARG OUTPATH=/data/webroot/$WEBPATH
RUN mkdir -p `dirname $OUTPATH`

# Now we move the static website
# to the path we would visit in the browser
# this container thus specifies the path
RUN mv /app $OUTPATH

FROM scratch
COPY --from=build /data /data
