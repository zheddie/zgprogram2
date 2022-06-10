
# 1.oftxfer tool.
"oftfer -prompt"
This command prompt the oftfer GUI panel. Then user can use it to list files and send them to an i box.
"oftxfer -system javap5 -sbpbuildid <builder> -logon xj9 -file `pwd`/888.oft"
This command is used for sending one file to an i box(here is javap5).
Note:
1. user have to input the full path of the file want to be sent.
2. oftxfer is used for process oft files and oft files are created after compiler on the AFS(or on AIX). So you can find oft files in "gen" path and we usually do this command in "gen" side.
"oftxfer -system javap5 -sbpbuildid <builderid> -logon xj9 -o `pwd`/filelist”

This command is used for sending files listed in filelist to an i box(here is javap5).

oftxfer -fi qp2cl.qwobj.oft -l zhanggan -sbpb zgid -system ut28p65 

Note:
oft
## 1.user have to creat the filelist file before using it. e.g. "find `pwd` -name \*.oft", the different is in the output of these two command.
## 2. <builderid>: builder ID is an object that used for building oftxfer transfered files on i. On i, all the build tools are stored in the three librarys:qdevelop, qbldsys,qbldsysr. .
WRKBLDID: work with all builder IDs on i.
ADDBUILDER : add builder ID on i. You have to add a builder id before using it in oftxfer command. Following is command we use to add builder id for j9
ADDBUILDER BLDID(XJ92) BLDRTYPE(*MINI) DESTOPT(*SYSTEM) IMPTDATE(*ANY) DEBUG(*NO)
or DEBUG(*YES) ====>This will fix the issue of 020A about the optimization error.
<meta http-equiv="content-type" content="text/html; charset=utf-8"> REPBPR: used for rebuilding all objectS in one builder ID. After rebuilding, level of the rebuilt object are change to 1.
3. Before using build tools, you have to run CRTBLDEVT on i to prepare environment for build tools. This command only need to be run once after system installation.

2. obi files summary:
1.obi files are configuration files. They are used when we compile codes on AFS. From these files, compiler find information like:
which source file to compile, what kind of object the file should be compile to, where to store the final built object on i.
2. pattern of all kinds of obi files
XXXX.ifsfile.obi: This means the final object is a IFS object and it will store in IFS system on i.
XXXXXX.module.obi: This means the final object is a module on i. Final object can be .qwobj. or .srvpgm.
XXXXXX.srvpgm.obi:This means the final object is a *SRVPGM on i. This build normally depends on multiple modules.
XX.prdlod.obi: This means the final object is a product load definition object, e.g. qjva1150.prdloa.obj. For qjva1150, 11 means product option is 11, 50=MRM means code(MRI means information need to be tranlate to mutiple languages).
XXX.lib.obi: This means the final object is a lib on i.

3. The error of 020A if no DEBUG(*YES) could be:
CPD5D0D Diagnostic 20 06/27/14 05:18:37.249430 QBNCRTMD QSYS *STMT QBNCRTMD QSYS *STMT
From module . . . . . . . . : QBNCRTMD
From procedure . . . . . . : QBNCRTMD__exitWithDiagnostic
Statement . . . . . . . . . : 4
To module . . . . . . . . . : QBNCRTMD
To procedure . . . . . . . : QBNCRTMD__exitWithDiagnostic
Statement . . . . . . . . . : 4
Message . . . . : Parameter to module creation interface not valid.
Cause . . . . . : The module was not created because the caller of the
module creation interface failed to supply a parameter, or one of the
supplied parameters was not valid. The error code is X'020A'. The following
are common error codes and their causes: -- 0101: Object sub-type was not
valid. -- 0102: Public authority was provided for an object which was not
being inserted into a context. -- 0103: Permanent object was not being
inserted into a context. -- 0201: Creation target version was not valid. --
0202: Language version was not valid. -- 0203: Optimization level was not
valid. -- 0204: Module creation attributes were not valid. -- 0205:
Encapsulation attributes were not valid. -- 0206: Deletion attributes were
not valid. -- 0207: Maximum optimization level was not valid. -- 0208:
Encapsulation attributes for collecting profiling data were not valid. --
0209: Module creation attributes were not valid for argument optimization.
-- 020A: Optimization level is greater than the maximum optimization level.
-- 020D: Instruction statistics pointer was not valid. -- 0210: High level
language symbol table pointer was not valid. -- 0301: More than one
extendable associated space entries were provided. -- 0302: Multiple
associated space entries used the same identifier. -- 0303: An associated
space entry used a reserved identifier. -- 0304: Associated space attributes
were not valid. -- 0305: Associated space entry attributes were not valid.
-- 0306: Debug data was too big. -- 0307: Intermediate language data was too
big. -- 0401: Attribute data pointer was not valid. -- 0402: Text data
pointer was not valid. -- 0403: Where used data pointer was not valid. --
0404: Associated data was provided for an object which was not being
inserted into a context. -- 0405: Associated data was provided for a
temporary object. -- 0502: Target release not valid for argument
optimization. Recovery . . . : Use the Analyze Problem (ANZPRB) command
or the Create APAR (CRTAPAR) command to report the problem.
CPF5D0E Escape 40 06/27/14 05:18:37.249456 QBNCRTMD QSYS *STMT QWXCRTMD QSYS *STMT
From module . . . . . . . . : QBNCRTMD
From procedure . . . . . . : QBNCRTMD__exitWithDiagnostic
Statement . . . . . . . . . : 9
To module . . . . . . . . . : QWXCRTMD
To procedure . . . . . . . : create_module
Statement . . . . . . . . . : 27
Message . . . . : Module QJVAQSHCMD not created.
Cause . . . . . : Creation of module QJVAQSHCMD failed due to an error.
Recovery . . . : See the previous messages in the job log to determine
the cause of the problem. Correct the problem and try the command again.

