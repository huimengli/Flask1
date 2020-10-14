'''
文件操作系统模块
'''

import os;

# 当前目录
nowDir = os.getcwd();

# 根目录
root = nowDir+"\\root";

# 管理员根目录
adminRoot = nowDir+"\\root\\admin";

# 用户目录
userRoot = nowDir+"\\root\\user";

def exists(filename):
    '''
    文件是否存在
    '''
    return os.path.exists(filename);

def getAllFiles(dirpath):
    '''
    获取文件夹中所有文件/文件夹
    '''
    return os.listdir(dirpath);

def getAllFilesAndType(dirpath):
    '''
    获取文件夹中所有文件/文件夹和属性
    '''
    allFiles = getAllFiles(dirpath);
    ret = [];
    for x in allFiles:
        ret.append((x,os.path.isfile(x)));

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
