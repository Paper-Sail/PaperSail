FROM node:7

COPY package.json /var/www/html/package.json
RUN npm config set strict-ssl false
RUN cd /var/www/html/ && npm install

#WORKDIR is /var/www/html
COPY . /var/www/html/

# replace this with your application's default port
EXPOSE 5000

WORKDIR /var/www/html/


ENTRYPOINT ["/usr/local/bin/npm", "start"]
