'''
用户系统模块
'''
import re;
import Flask1.mySqlLink as Link;
import Flask1.fileSystem as fileSys;

#用户数据文件存在位置
USERFILEPATH = 'usersfile.txt';

def readAllValue(path):
    '''
    读取文件中的所有数据
    '''
    ret = [];
    try:
        file = open(path,'r',-1,'utf-8');
    except :
        file = open(path,'w',-1,'utf-8');
        file.close();
        file = open(path,'r',-1,'utf-8');

    line = file.readline();
    line = line[:-1];
    while line:
        ret.append(line);
        line = file.readline();
        line = line[:-1];
    file.close();
    return ret;

def readValue(path):
    '''
    读取文件内容
    '''
    file = open(path,"r",-1,'utf-8');
    ret = file.read();
    file.close();
    return ret;

def writeValue(path,value):
    '''
    向文件中写入内容
    '''
    file = open(path,'w',-1,'utf-8');
    file.write(value);
    file.close();
    return;

def writeValues(path,values):
    '''
    向文件中写入多行内容
    '''
    assert isinstance(values,list);
    file = open(path,'w',-1,'utf-8');
    file.writelines(values);
    file.close();
    return;

def writeValueAdd(path,value):
    '''
    向文件中加写入内容
    '''
    file = open(path,'a',-1,'utf-8');
    file.write(value);
    file.close();
    return;

def writeValuesAdd(path,values):
    '''
    向文件中加写入多行内容
    '''
    assert isinstance(values,list);
    file = open(path,'a',-1,'utf-8');
    file.writelines(values);
    file.close();
    return;

def getValue(code,gets):
    '''
    从一段字符串中获取内容
    '''
    ret = [];

    for x in gets:
        item = re.compile(x+r':([^:;]*)');
        item2 = item.search(code)
        print(item);
        print(item2);
        if not item2==None:
            ret.append(item2.group(1));
        else:
            ret.append("");

    return ret;

class UserBasic(object):
    '''
    用户类
    '''

    #所有的用户数据
    USERS = [];

    def __init__(self,id,name,password,type):
        '''
        构造函数
        '''
        self.id = id;
        self.name = name;
        self.password = password;
        self.type = type;

    @staticmethod
    def Count():
        '''
        获取总用户的数量
        '''
        return len(UserBasic.USERS);

    @staticmethod
    def SignOn(name,password):
        '''
        检查登录(类方法)
        '''
        ret = None;
        if UserBasic.Count()==0:
            UserBasic.USERS = UserBasic.CreateAllUserSql();
        for user in UserBasic.USERS:
            if not isinstance(user,UserBasic):
                print('next');
                continue;
            if user.name==name and user.password==password:
                ret = user;
                break;
            else:
                print(user.name==name)
                print(user.password==password)
                pass

        if isinstance(ret,UserBasic):
            return ret.id;
        else:
            return -1;

    @staticmethod
    def GetUser(id):
        '''
        获取用户
        '''
        ret = None;
        for user in UserBasic.USERS:
            if user.id==id:
                ret = user;
                break;

        return ret;

    @staticmethod
    def SignIn(name,password):
        '''
        注册账号
        '''
        userId = UserBasic.SignOn(name,password);
        print(userId);
        if int(userId)<0:
            id = len(UserBasic.USERS);
            newUser = UserBasic(id,name,password,"basic");
            UserBasic.USERS.append(newUser);
            newUser.SaveSql();
        else:
            newUser = UserBasic.GetUser(userId);

        return newUser;

    def ToString(self,eof = None):
        '''
        转化账户信息为字符串
        '''
        ret = "id:" + str(self.id) +";name:"+ self.name +";password:"+self.password+";type:"+self.type;
        if not eof==None and eof == True:
            ret+="\n";
        return ret;

    def getMd5(self):
        '''
        获取用户的md5值
        '''
        userStr = self.ToString();
        return fileSys.stringToMd5(userStr);

    def ToList(self):
        '''
        转化账户信息为数组
        '''
        ret = [];
        ret.append(str(self.id));
        ret.append(self.name);
        ret.append(self.password);
        ret.append(self.type);

        return ret;

    def Save(self):
        '''
        保存用户信息
        '''
        writeValueAdd(USERFILEPATH,self.ToString(True));
        return;
    
    def SaveSql(self):
        '''
        保存用户信息到数据库
        '''
        try:
            Link.deleteValue("users","id",self.id);
        except :
            pass
        Link.addValue("users",Link.getColumns("users"),self.ToList());
        return;

    @staticmethod
    def AddUser(user):
        '''
        添加用户到后台数据中
        '''
        assert isinstance(user,UserBasic);
        UserBasic.USERS.append(user);
        return;

    @staticmethod
    def SaveAll():
        '''
        保存所有用户数据
        '''
        values = [];
        for x in UserBasic.USERS:
            values.append(x.ToString(True));
        
        writeValues(USERFILEPATH,values);
        return;
    
    @staticmethod
    def SaveAllSql():
        '''
        保存所有用户数据
        '''
        values = [];
        for x in UserBasic.USERS:
            values.append(x.ToList());
        
        Link.deleteTableValues("users");
        Link.addValues("users",Link.getColumns("users"),values);
        return;


    @staticmethod
    def CreateAllUser():
        '''
        根据保存在文件中的数据还原出用户表
        '''
        all = [];
        all = readAllValue(USERFILEPATH);
        UserBasic.USERS = [];
        for x in all:
            userinfo = getValue(x,['id','name','password']);
            UserBasic.USERS.append(UserBasic(userinfo[0],userinfo[1],userinfo[2]));

        return UserBasic.USERS;

    @staticmethod
    def CreateAllUserSql():
        '''
        根据数据库中的数据还原出用户表
        '''
        all = Link.getTable("users");
        UserBasic.USERS = [];
        for x in all:
            UserBasic.USERS.append(UserBasic(x[0],x[1],x[2],x[3]));

        return UserBasic.USERS;

    @staticmethod
    def CreateUser(userValue):
        '''
        根据保存在文件中的数据还原出用户表
        '''
        userinfo = getValue(userValue,['id','name','password','type']);
        user = UserBasic(userinfo[0],userinfo[1],userinfo[2],userinfo[3]);

        return user;
    
    @staticmethod
    def CreateUserSql(id):
        '''
        根据用户的id从数据库中还原出用户
        '''
        userinfo = Link.getTable("users",Link.getColumns("users"),'id='+str(id));
        user = UserBasic(userinfo[0],userinfo[1],userinfo[2],userinfo[3]);

        return user;

    def ChangeName(self,newName):
        '''
        修改用户名
        '''
        self.name = newName;
        return Link.changeValue('users','name',newName,'id',str(self.id));

    def ChangePassword(self,oldPassword,newPassword):
        '''
        修改用户密码
        '''
        if oldPassword==self.password:
            self.password = newPassword;
            return Link.changeValue('users','password',newPassword,'id',str(self.id));
        else:
            return False;

    def GetHeadPhoto(self):
        '''获取头像'''
        ret = Link.getTable("headphoto","headphoto","id="+str(self.id));
        if ret==None:
            return "";
        else:
            return ret;

    def UpHeadPhoto(self,photo):
        '''上传头像'''
        print(len(photo));
        return Link.addValue("headphoto",Link.getColumns("headphoto"),[str(self.id),photo]);

    def ChangeHeadPhoto(self,photo):
        '''更新头像'''
        print(len(photo));
        return Link.changeValue("headphoto","headphoto",photo,"id",str(self.id));

    def GetDiary(self):
        '''
        获取用户日记
        '''
        ret= Link.getTable("value",['id','title','text'],'userid='+str(self.id));
        return ret;

    def NewDiary(self,title,value):
        '''
        新建日记
        '''
        id = Link.getTable("value");
        ret = Link.addValue("value",['id','userid','title','text'],
                            [str(len(id)),str(self.id),title,value]);
        return ret;

    def GetOneDiary(self,id):
        '''
        获取一条日记
        '''
        ret = Link.getTable("value",['title','text'],'id='+str(id));
        return ret;

    def NewTicket(self):
        '''
        新建一个投票
        '''

        return;






