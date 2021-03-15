#! /usr/bin/env python
import mysql.connector as mysql
import re
import os
def handleonefile(file,max):
    with open(file) as f:
        read_data = f.read()
    #print(read_data)
    read_data = read_data.replace("\\","\\\\")
    read_data = read_data.replace("\"","\\\"")
    titlestart = re.search("<title>",read_data).start()
    titleend = re.search("</title>",read_data).start()
    if(titlestart>0 and titleend>titlestart):
        if (read_data[titlestart+7:titleend] == "Untitled" or read_data[titlestart+7:titleend] == "无标题笔记"):
            title="//evernote/notitle"
        else:
            title="//"+read_data[titlestart+7:titleend][0:98]
    print("id:"+str(max)+",title:",title)
    #addnew='insert into zgprogram values("'+title+'",\''+content+'\',"'+max.toString().padStart(10,'0')+'",NOW(),0,NOW())';
    query= "insert into zgprogram values(\""+title +"\",\""+read_data+"\",\""+str(max).zfill(10)+"\",NOW(),0,NOW())"
    try:
        cursor.execute(query)
    except:
        print(query)
    
db=mysql.connect(host="mysqlserver",user="root",passwd="passw0rd",auth_plugin='mysql_native_password')
print(db)
cursor = db.cursor()
cursor.execute("use zgdata")
cursor.execute("select max(convert(idntfr,unsigned integer)) as max from zgprogram")
databases = cursor.fetchall()
max= databases[0][0]+1
#print(databases[0][0])
allfiles = os.listdir()
# print(allfiles)
for file in allfiles:
    if(file.endswith("html")):
        #print(file)
        handleonefile(file,max)
        max= max+1
#handleonefile('_cloud_aws_amazon_cloudwatch.html',max)
