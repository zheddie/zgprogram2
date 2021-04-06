#! /usr/bin/env python
import mysql.connector as mysql
import re
import os
def replaceimg(line,replace):
    stop = False
    begin=0
    end = len(line)
    newline=""
    while(not stop):
        matchedstr = re.search(r'<img src=".*?>',line[begin:end],re.M|re.I|re.S)
        if matchedstr:
            # print(matchedstr.span())
            newline+=line[begin:begin+matchedstr.span()[0]]
            # print("NEWLINE:"+newline)
            matchs = re.match(r'<img src="(.*)\.resources\/(.*?)"',matchedstr.group(),re.M|re.I|re.S)
            if matchs:
                if os.path.isdir(matchs.group(1)+".resources"):
                    cmd='mv '+matchs.group(1)+".resources ID"+replace+".resources"
                    print(cmd)
                    os.system(cmd)
                # cmd="ls -ld ../frontend/"+matchs.group(1)+".resources"
                # print(matchs.group(1)+".resources")
                # os.system(cmd)
                newline+='<img src="ID'+replace+'.resources/'+matchs.group(2)+'"'+matchedstr.group()[matchs.span()[1]:]
            else:
                newline+=matchedstr.group()
            begin+=matchedstr.span()[1]
        else:
            newline+=line[begin:end]
            stop = True
    return(newline)
    
db=mysql.connect(host="mysqlserver2",user="root",passwd="passw0rd",auth_plugin='mysql_native_password')
print(db)
cursor = db.cursor()
cursor.execute("use zgdata")
cursor.execute("select idntfr,content from zgprogram where content like '%<img src=%.resources/%'")
databases = cursor.fetchall()
print(databases[0][1])
print("..........................................................................")
newcontent=replaceimg(databases[0][1],databases[0][0])
print(newcontent)
print("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
print(databases[1][1])
print("..........................................................................")
newcontent=replaceimg(databases[1][1],databases[1][0])
print(newcontent)
# for onenote in databases:
#     print(onenote[1])
#     newcontent=replaceimg(onenote[1])
#     print(newcontent)
    # matchobjs = r.match(r'(.*)<img src="(.*)\.resources\/(.*)',onenote,re.M|re.I)
    # if matchobjs:
    #     print("group={},(1)={},(2)={},(3)={}".format(matchobjs.group(),matchobjs.group(1),matchobjs.group(2),matchobjs.group(3)))




# max= databases[0][0]+1
# #print(databases[0][0])
# allfiles = os.listdir()
# # print(allfiles)
# for file in allfiles:
#     if(file.endswith("html")):
#         #print(file)
#         handleonefile(file,max)
#         max= max+1
# #handleonefile('_cloud_aws_amazon_cloudwatch.html',max)
