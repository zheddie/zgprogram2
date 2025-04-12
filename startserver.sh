#!/bin/bash
#cd /root/myapps/zgprogram2/frontend/ && nohup http-server -p 22 & 
#cd /root/myapps/zgprogram2 && nohup node server.js &
cd ~/zgprogram2 && nohup npm run startfront &
docker start mysqlserver.zg2
cd ~/zgprogram2 && npm run start

#/How to stop the front server
#ps -ef |grep 18722
#kill
