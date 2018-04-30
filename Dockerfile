FROM node
RUN mkdir /app
COPY package.json /app
COPY main.js /app
COPY amqp_test.js /app
WORKDIR /app
RUN npm install
CMD node -v
