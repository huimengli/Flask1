'''
文件操作系统模块
'''

import sys
import json
import os;
import Flask1.mySqlLink as Link;

def fuc():
    '''
    废弃
    '''
    #def fileInFolder(filepath):
    #    '''
    #    遍历指定目录，显示目录下的所有文件名
    #    '''
    #    pathDir =  os.listdir(filepath)  # 获取filepath文件夹下的所有的文件
    #    files = []
    #    for allDir in pathDir:
    #        child = os.path.join('%s\\%s' % (filepath, allDir))
    #        files.append(child.decode('gbk'))  # .decode('gbk')是解决中文显示乱码问题
    #        # print child
    #        # if os.path.isdir(child):
    #        #     print child
    #        #     simplepath = os.path.split(child)
    #        #     print simplepath
    #    return files
    
    #def getfilelist(filepath):
    #    '''
    #    遍历文件夹及其子文件夹的所有文件，获取文件的列表
    #    '''
    #    filelist =  os.listdir(filepath)  # 获取filepath文件夹下的所有的文件
    #    files = []
    #    for i in range(len(filelist)):
    #        child = os.path.join('%s\\%s' % (filepath, filelist[i]))
    #        if os.path.isdir(child):
    #            files.extend(getfilelist(child))
    #        else:
    #            files.append(child)
    #    return files
    
    #def getfilelist(filepath, tabnum=1):
    #    '''
    #    遍历子文件和所有子文件夹 输出字符串
    #    '''
    #    simplepath = os.path.split(filepath)[1]
    #    returnstr = simplepath+"目录<>"+"\n"
    #    returndirstr = ""
    #    returnfilestr = ""
    #    filelist = os.listdir(filepath)
    #    for num in range(len(filelist)):
    #        filename=filelist[num]
    #        if os.path.isdir(filepath+"/"+filename):
    #            returndirstr += "\t"*tabnum+getfilelist(filepath+"/"+filename, tabnum+1)
    #        else:
    #            returnfilestr += "\t"*tabnum+filename+"\n"
    #    returnstr += returnfilestr+returndirstr
    #    return returnstr+"\t"*tabnum+"</>\n"
     
    #def filesRename(filepath):
    #    '''
    #    批量改名
    #    '''
    #    filelist =  os.listdir(filepath)  # 获取filepath文件夹下的所有的文件
    #    files = []
    #    for i in range(len(filelist)):
    #        child = os.path.join('%s\\%s' % (filepath, filelist[i]))
    #        if os.path.isdir(child):
    #            continue
    #        else:
    #            newName = os.path.join('%s\\%s' % (filepath, str(i) + "_" + filelist[i]))
    #            print( newName)
    #            os.rename(child, newName)
    
    return 0;

class files(object):
    '''
    文件对象
    '''
    def __init__(self,id,name,size,eachSize,package,md5,path,userid,level):
        '''
        初始化
        '''
        self.id = id;
        self.name = name;
        self.size = size;
        self.eachSize = eachSize;
        self.package = package;
        self.md5 = md5;
        self.path = path;
        self.userid = userid;
        self.level = level;

        return;

    def getValue(self):
        '''
        获取文件内容
        '''
        if os.path.exists(self.path):
            file = open(self.path,"r",encoding="utf8");
            val = file.read();
            #print(val);
            #value = json.loads(val);
            file.close();
            return str(val);
        else:
            return "{}";

class fileSystem(object):
    '''
    文件系统
    '''

    # 当前目录
    nowDir = os.getcwd();

    # 根目录
    root = nowDir+"/Flask1/root";

    # 管理员根目录
    adminRoot = root+"/admin";

    # 用户目录
    userRoot = root+"/user";

    @staticmethod
    def exists(filename):
        '''
        文件是否存在
        '''
        return os.path.exists(filename);

    @staticmethod
    def getAllFiles(dirpath):
        '''
        获取文件夹中所有文件/文件夹
        '''
        filelist = os.listdir(dirpath);
        dirpath = dirpath[len(fileSystem.root):]
        ret = [];
        for x in filelist:
            ret.append(dirpath+"/"+x);
        return ret;

    @staticmethod
    def getAllFilesAndType(dirpath):
        '''
        获取文件夹中所有文件/文件夹和属性
        '''
        allFiles = fileSystem.getAllFiles(dirpath);
        ret = [];
        for x in allFiles:
            ret.append({str(x):str(os.path.isfile(fileSystem.root+x))});

        return ret;

    @staticmethod
    def newFile(filename,value=None):
        '''
        新建文件
        '''
        try:
            if exists(filename):
                file = open(filename,"a",encoding="utf8");
            else:
                file = open(filename,"w",encoding="utf8");

            file.write(value);
            file.close();
    
            return True;
        except Exception as err:
            print(err);
            return False;

    @staticmethod
    def getAllFromSql(tableName):
        '''
        从数据库中获取所有文件数据
        '''
        all = Link.getTable(tableName);
        ret = [];
        if not type(all)==bool and len(all)>0:
            for x in all:
                ret.append(files(x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7],x[8]));

        return ret;

    def __init__(self,tableName):
        '''
        初始化
        '''
        self.tableName = tableName;
        self.fileSteam = fileSystem.getAllFromSql(tableName);

        return;

    def upFile(filename,value):
        '''
        上传文件到服务器
        '''
        if fileSystem.exists(filename)==false:
            f = open(filename,"w",encoding="utf8");
            f.write(value);
            f.close();
            return True;
        else:return False;
        return False;

    def getFileList(self,dir=None):
        '''
        获取文件列表
        '''
        if dir==None or dir=="root":
            return str(self.getAllFilesAndType(self.root));
        else:
            return str(self.getAllFilesAndType(self.root+dir));

