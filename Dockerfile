FROM resin/raspberrypi3-node

# Motion / etc.
RUN apt-get -q update && apt-get install -yq --no-install-recommends \
        motion rsync vim file ssh \
	&& apt-get clean && rm -rf /var/lib/apt/lists/*

# Node App
RUN apt-get -q update && apt-get install -yq --no-install-recommends \
        libraspberrypi-bin

WORKDIR /usr/src/app

COPY package.json ./
RUN JOBS=MAX npm i --production

COPY . ./

CMD ["bash", "etc/run-motion.sh"]

CMD ["npm", "start"]
