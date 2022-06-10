#!/bin/bash
cd /root/myapps/zgprogram2/frontend/ && nohup http-server -p 22 & 
cd /root/myapps/zgprogram2 && nohup node server.js &
