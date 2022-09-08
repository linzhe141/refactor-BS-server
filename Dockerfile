# FROM node

# RUN mkdir -p /home/serverApp

# WORKDIR /home/serverApp

# COPY . /home/serverApp

# RUN npm install

# CMD ["npm","run","serve"]

FROM mysql:latest

RUN mkdir -p /home/serverApp

WORKDIR /home/serverApp

COPY . /home/serverApp


# RUN  sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list

# RUN echo "deb http://mirrors.163.com/debian/ jessie main non-free contrib" >> /etc/apt/sources.list

# RUN echo "deb http://mirrors.163.com/debian/ jessie-proposed-updates main non-free contrib" >>/etc/apt/sources.list

# RUN echo "deb-src http://mirrors.163.com/debian/ jessie main non-free contrib" >>/etc/apt/sources.list

# RUN echo "deb-src http://mirrors.163.com/debian/ jessie-proposed-updates main non-free contrib" >>/etc/apt/sources.list
#更新apt-get源 使用163的源
RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak && \
    echo "deb http://mirrors.163.com/debian/ jessie main non-free contrib" >/etc/apt/sources.list && \
    echo "deb http://mirrors.163.com/debian/ jessie-proposed-updates main non-free contrib" >>/etc/apt/sources.list && \
    echo "deb-src http://mirrors.163.com/debian/ jessie main non-free contrib" >>/etc/apt/sources.list && \
    echo "deb-src http://mirrors.163.com/debian/ jessie-proposed-updates main non-free contrib" >>/etc/apt/sources.list

# RUN apt-get clean 
RUN apt-get update 

RUN apt-get install vim -y

RUN apt-get install nodejs -y

RUN apt-get install nginx -y

RUN npm install
