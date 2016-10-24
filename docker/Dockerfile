FROM ubuntu:14.04

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 && \
    echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list && \
    apt-get update && \
    apt-get install -y --force-yes pwgen mongodb-org mongodb-org-server mongodb-org-shell mongodb-org-mongos mongodb-org-tools && \
    echo "mongodb-org hold" | dpkg --set-selections && echo "mongodb-org-server hold" | dpkg --set-selections && \
    echo "mongodb-org-shell hold" | dpkg --set-selections && \
    echo "mongodb-org-mongos hold" | dpkg --set-selections && \
    echo "mongodb-org-tools hold" | dpkg --set-selections

VOLUME /data/db

ENV STORAGE_ENGINE wiredTiger

ADD script/set_mongodb_password.sh /script/set_mongodb_password.sh

EXPOSE 27017 28017

# Install Data
RUN apt-get update
RUN apt-get install -y node
RUN apt-get install -y nodejs npm
RUN apt-get install -y nodejs-legacy
RUN apt-get install -y git
WORKDIR /src
RUN git clone https://github.com/joel1st/championweb.git
RUN cd championweb/ && npm install -y
COPY /script/RestoreDatabase.sh ../script/RestoreDatabase.sh
CMD ["sh", "../script/RestoreDatabase.sh"]

EXPOSE 8888