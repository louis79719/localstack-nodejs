###################
# BASE  CONTAINER #
###################
FROM node:12.14-alpine as base

# We need сertificates and openssl for https
RUN apk update && apk upgrade && \
  apk add --no-cache openssl ca-certificates
RUN update-ca-certificates

###################
# BUILD CONTAINER #
###################
FROM base as builder

# Create a folder where we going to build our application
RUN mkdir -p app
WORKDIR /home/node/app

# Copy all necessary files for building application
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY src src

# Build application
RUN npm install --production=true

########################
# PRODUCTION CONTAINER #
########################
FROM base as final
ENV NODE_ENV production

RUN apk update && apk add bash

# Create a folder to our application
RUN mkdir -p app/node_modules
WORKDIR /home/node/app

# Copy build results from builder stage to runtime stage
COPY --from=builder /home/node/app/node_modules ./node_modules/
COPY --from=builder /home/node/app/src ./src/
COPY --from=builder /home/node/app/package.json ./

RUN chown -R node /home/node
USER node

CMD npm run start
