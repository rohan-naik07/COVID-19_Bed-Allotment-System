FROM node:12-alpine

ARG GIT_BRANCH

RUN apk update
RUN apk add openssh git

WORKDIR /home
COPY github_key .

RUN chmod 600 github_key && \
    eval $(ssh-agent) && \
    ssh-add github_key && \
    ssh-keyscan -H github.com >> /etc/ssh/ssh_known_hosts && \
    git clone git@github.com:pranjal2410/COVID-19_Bed-Allotment-System.git && \
    cd COVID-19_Bed-Allotment-System && \
    git pull origin main && \
    git checkout ${GIT_BRANCH} && \
    git pull origin ${GIT_BRANCH}

WORKDIR /home/COVID-19_Bed-Allotment-System/frontend

ENV REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_SOCKET_URL=ws://localhost:8000
ENV REACT_APP_API_KEY=AIzaSyBR25jzMjLW8okagFlCf87hhx6SFuMfO04

RUN yarn install

CMD ["yarn", "start"]