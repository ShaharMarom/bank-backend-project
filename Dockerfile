FROM node:latest

# Build arguments that can be set during build time
ARG NODE_ENV=production
ARG PORT=3000

# Set environment variables
ENV NODE_ENV=$NODE_ENV
ENV PORT=$PORT
ENV HOME=/app

WORKDIR $HOME

COPY src/ $HOME/src
COPY package*.json $HOME/

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]