FROM node:20-alpine
ENV HOME=/app
WORKDIR $HOME

COPY src/ $HOME/src

COPY package.json $HOME
RUN npm install


COPY . .

EXPOSE 3000

CMD ["npm", "start"]