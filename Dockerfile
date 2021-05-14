FROM python:3.8

ARG GIT_BRANCH

RUN apt-get update && apt-get --no-install-recommends install -yq \
        git \
        ssh

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

WORKDIR /home/COVID-19_Bed-Allotment-System
RUN pip install -r requirements.txt

CMD python manage.py runserver 0.0.0.0:8000