"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template,redirect, request, url_for,session
from Flask1 import app
from random import randint;
from Flask1.users import UserBasic as User;
import json;
import Flask1.fileSystem as Fsys;
import math;

myname = "个人网盘";

fileSys = Fsys.fileSystem("files");

#主页面
indexWeb = "file";

@app.route("/")
@app.route("/signOn/")
@app.route("/signon/")
def signOn():
    '''
    登录页面
    '''
    context = {};
    context['name'] = myname;
    context['title'] = '登录页面';
    context['code'] = randint(1000,9999);
    name = request.args.get("name");
    password = request.args.get("password");
    id = None;
    if name==None or password==None:
        try:
            name = session['name'];
            password = session['password'];
        except:
            print;
    if not name==None and not password==None:
        id = User.SignOn(name,password);
        print(id);
    if id==None:
        pass
    elif id<0:
        #return redirect(url_for("signIn"));
        pass
    elif id>=0:
        session['id'] = id;
        session['name'] = name;
        session['password'] = password;
        return redirect(url_for(indexWeb));
    
    return render_template(
        'signOn.html',
        context=context,
    );

@app.route("/signIn/")
@app.route("/signin/")
def signIn():
    '''
    注册页面
    '''
    context = {};
    context['name'] = myname;
    context['title'] = "注册页面";
    context['code'] = randint(1000,9999);
    name = request.args.get("name");
    password = request.args.get("password");
    user = None;
    if name==None or password==None:
        try:
            name = session['name'];
            password = session['password'];
        except Exception as e:
            print(e);
    if not name==None and not password==None and not name=='' and not password=='':
        user = User.GetUser(User.SignOn(name,password));
        print(user);

        if isinstance(user,User):
            session['id'] = user.id;
            session['name'] = name;
            session['password'] = password;
        else:
            user = User.SignIn(name,password);
            session['id'] = user.id;
            session['name'] = name;
            session['password'] = password;

        return redirect(url_for(indexWeb));

    return render_template(
        'signIn.html',
        context=context,
    )

@app.route("/index/",methods=['GET','POST'])
def index():
    '''
    主页面
    '''
    context = {};
    context['name'] = myname;
    context['title'] = "主页面";
    name = request.args.get("name");
    password = request.args.get("password");
    user = None;
    if name==None or password==None:
        try:
            name = session['name'];
            password = session['password'];
        except :
            print;

    if not name==None and not password==None and not name=='' and not password=='':
        id = User.SignOn(name,password);
        print(id);
        user = User.GetUser(id);
        print(user);

    if isinstance(user,User):
        session['id'] = user.id;
        session['name'] = name;
        session['password'] = password;
    else:
        return redirect(url_for("signIn"));

    values = request.get_data();
    print(values);
    if len(values)>0:
        print(values);
        value = json.loads(values);
        try:
            if value['n']=='name':
                return user.name;
            elif value['n']=='id':
                return str(user.id);
            elif value['n']=="headPhoto":
                return user.GetHeadPhoto();
            elif value['n']=="upPhoto":
                if user.UpHeadPhoto(value['photoValue']):
                    return "True";
                else:
                    return str(user.ChangeHeadPhoto(value['photoValue']));
            elif value['n']=='ball':
                allDiary =  user.GetDiary();
                rets = {};
                for diary in allDiary:
                    ret = {};
                    ret["id"] = diary[0]
                    ret["title"] = diary[1];
                    ret["value"] = diary[2];
                    rets[str(allDiary.index(diary))] = ret;
                return json.dumps(rets);
            elif value['n']=="exit":
                session['name'] = "";
                session['password'] = "";
                session['id'] = "";
                redirect(url_for("signOn"));
                return "exit";
            elif value['n']=="upValue":
                return str(user.NewDiary(value['title'],value['value']));
            elif value['n']=="diary":
                session['diaryid'] = value['id'];
                return redirect(url_for("oneValue"));

        except Exception as e:
            print(e);

        return values;

    return render_template(
        'index.html',
        context = context,
    )

@app.route("/oneValue/")
@app.route("/onevalue/")
def oneValue():
    '''
    显示一个日记的页面
    '''
    context = {};
    context['name'] = myname;
    context['title'] = "日记查看";
    context['diarytitle'] = '';
    context['diaryvalue'] = '';

    name = request.args.get("name");
    password = request.args.get("password");
    exit = request.args.get("exit");
    if not exit==None:
        session['diaryid'] = "";
        return redirect(url_for("index"));
    user = None;
    if name==None or password==None:
        try:
            name = session['name'];
            password = session['password'];
        except Exception as e:
            print(e);

    if not name==None and not password==None:
        user = User.GetUser(User.SignOn(name,password));
        print(user.ToString());

    if isinstance(user,User):
        session['id'] = user.id;
        session['name'] = name;
        session['password'] = password;
    else:
        return redirect(url_for("signIn"));

    try:
        diaryId = session['diaryid'];
        diary = user.GetOneDiary(diaryId);
        print(diary);
        context['diarytitle'] = diary[0][0];
        context['diaryvalue'] = diary[0][1];
    except Exception as e:
        print(e);
        return redirect(url_for("index"));

    return render_template(
        'oneValue.html',
        context = context,
    )

@app.route("/changeValue/")
@app.route("/changevalue/")
def changeValue():
    '''
    修改账户信息的页面
    '''
    context = {};
    context['name'] = myname;
    context['title'] = "个人中心";
    context['username'] = "none";
    context['userid'] = "none";

    name = request.args.get("name");
    password = request.args.get("password");
    exit = request.args.get("exit");
    if not exit==None:
        return redirect(url_for("index"));
    user = None;
    if name==None or password==None:
        try:
            name = session['name'];
            password = session['password'];
        except Exception as e:
            print(e);

    if not name==None and not password==None:
        user = User.GetUser(User.SignOn(name,password));

    if isinstance(user,User) and not user==None:
        session['id'] = user.id;
        session['name'] = name;
        session['password'] = password;
        context['username'] = user.name;
        context['userid'] = str(user.id);
    else:
        return redirect(url_for("signIn"));
    
    newname = request.args.get("newname");
    if not newname==None:
        user.ChangeName(newname);
        session['name'] = newname;
        context['username'] = newname;

    old = request.args.get("old");
    ne = request.args.get("ne");
    if not old==None and not ne==None:
        isChangePassword = user.ChangePassword(old,ne);
        if isChangePassword:
            session['password'] = ne;

    return render_template(
        'changeValue.html',
        context = context,
    )

@app.route("/test/")
def test():
    '''
    测试页面
    '''
    context = {};
    context['name'] = myname;
    context['title'] = "测试页面";

    return render_template(
        'test.html',
        context=context,        
    )

@app.route("/plane/")
def plane():
    '''
    打飞机小游戏
    '''
    context = {};
    context["name"] = myname;
    context['title'] = "打飞机游戏";

    return render_template(
        'plane2.html',
        context=context,
    )

@app.route("/file/",methods=['GET','POST'])
def file():
    '''
    文件系统
    '''
    context = {};
    context['name'] = myname;
    context['title'] = "文件管理";
    print("\n");
    name = None;
    password = None;
    user = None;
    if name==None or password==None:
        try:
            name = session['name'];
            password = session['password'];
        except Exception as err:
            print(err);

    if not name==None and not password==None and not name=='' and not password=='':
        id = User.SignOn(name,password);
        #print(id);
        user = User.GetUser(id);
        #print(user);

    if isinstance(user,User) and not user==None:
        session['id'] = user.id;
        session['name'] = name;
        session['password'] = password;


    values = request.get_data();
    
    #print(values);
    
    if len(values)>0:
        #print(values);
        value = json.loads(values);
        #print(values.decode("utf8"));
        try:
            if value['n']=='name':
                return user.name;

            elif value['n']=='id':
                return str(user.id);

            elif value['n']=="headPhoto":
                return user.GetHeadPhoto();

            elif value['n']=="type":
                return user.type;

            elif value['n']=="nameAndType":
                return '{"name":"'+str(user.name)+'","type":"'+str(user.type)+'"}';

            elif value['n']=="exit":
                session['name'] = "";
                session['password'] = "";
                session['id'] = "";
                redirect(url_for("signOn"));
                return "exit";

            elif value['n']=="list":
                #try:
                if value['isdir']=="True":
                    return fileSys.getFileList(value['dir']);
                else:
                    return str(Fsys.files.getFileNoDelete(fileSys.fileSteam,value['dir']));

            elif value['n']=="newDir":
                #print(user.ToString());
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    if len(value['dir'])>1:
                        return fileSys.newDir(value['dir'],value['name']);
                    else:
                        return "Error";

            elif value['n']=="upFile":
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    files = fileSys.streamUpdate();
                    eachSize = 1024*1024*20;
                    if eachSize>int(value['size']):
                        eachSize = int(value['size']);
                    package = math.ceil(int(value['size'])/(1024*1024*20));
                    level = package;
                    level += user.AddLevel();

                    newFile = Fsys.files(len(files),value['name'],value['size'],str(eachSize),package,value['md5'],fileSys.root+value['dir']+"/"+value['name']+".file",user.id,level,value['create'],value['uptime'],0);
                    print(newFile.toDictNoCut());
                    upSql = newFile.upSql("files");
                    if upSql=="True":
                        write = newFile.toDictNoCut();
                        write['value'] = value['value'];
                        fileSys.fileSteam.append(newFile);
                        return str(fileSys.newFileZlib(newFile.path,write));
                    else:
                        return upSql;

            elif value['n']=="upFileTest":
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    files = fileSys.streamUpdate();
                    eachSize = 1024*1024*20;
                    if eachSize>int(value['size']):
                        eachSize = int(value['size']);
                    package = math.ceil(int(value['size'])/(1024*1024*20));
                    level = package;
                    level+=user.AddLevel();

                    newFile = Fsys.files(len(files),value['name'],value['size'],str(eachSize),package,value['md5'],fileSys.root+value['dir']+"/"+value['name']+".file",user.id,level,value['create'],value['uptime'],0);
                    return str(fileSys.existsSql(newFile));

            elif value['n']=="getFileInfo":
                dir = fileSys.root+value["dir"]+".file";
                print(dir);
                if fileSys.exists(dir):
                    file = fileSys.getFile(dir);
                    return str(file.toDict());

                return "Error";

            elif value['n']=="upFileOver":
                dir = fileSys.root+value['dir']+"/"+value["name"]+".file";
                print(dir);
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    fileSys.streamUpdate();
                    file = fileSys.getFile(dir);
                    print(file.toDict());
                    if int(file.id)>=0:
                        fileIndex = fileSys.fileSteam.index(file);
                        print(fileIndex);
                        eachSize = 1024*1024*20;
                        if eachSize>int(value['size']):
                            eachSize = int(value['size']);
                        package = math.ceil(int(value['size'])/(1024*1024*20));
                        level = package;
                        level += user.AddLevel();
                        if user.ChackLevel(file.level):
                            file.path = dir;
                            file.name = value['name'];
                            file.size = value['size'];
                            file.eachSize = eachSize;
                            #file.create = value['create'];
                            file.md5 = value['md5'];
                            file.package = package;
                            file.level = level;
                            file.userid = user.id;
                            file.uptime = value['uptime'];
                            upSql = file.changeSql(fileSys.tableName);
                            if upSql==True or upSql=="True":
                                #print("True");
                                write = file.toDictNoCut();
                                write['value'] = value['value'];
                                fileSys.fileSteam[fileIndex] = file;
                                return str(fileSys.overFileZlib(file.path,write));
                            elif upSql=="Error":return "SystemError";  
                            else:return str(upSql);
                        else:return "Error";
                    else:return "Alive";

            elif value['n']=="downFile":
                dir = fileSys.root+value["dir"];
                print(dir);
                if not fileSys.exists(dir):
                    file = fileSys.getFile(dir);
                    return "Alive";
                else:
                    file = fileSys.getFile(dir);
                    if not isinstance(user,User) or user==None:
                        if file.level<=1:
                            return file.getValueZlib();
                        else:
                            return "Error";
                    else:
                        if user.ChackLevel(file.level):
                            return file.getValueZlib();
                        else:
                            return "Error";

            elif value['n']=="deleteFile":
                dir = fileSys.root+value['dir'];
                if not fileSys.exists(dir):
                    return "Alive";
                else:
                    file = fileSys.getFile(dir);
                    print(file.toDictNoCut());
                    if not isinstance(user,User) or user ==None:
                        return "Error";
                    else:
                        if user.type=="admin":
                            return file.sqlDelete(Fsys.files.tableName);
                        elif user.type=="staff" and file.level<=70:
                            return file.sqlDelete(Fsys.files.tableName);
                        elif user.type=="general" and file.level<=40:
                            return file.sqlDelete(Fsys.files.tableName);
                        elif user.type=="basic" and file.level<=10:
                            return file.sqlDelete(Fsys.files.tableName);
                        else:
                            return "Error";

                return "False";

            elif value['n']=="upHeadPhoto":
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    if user.UpHeadPhoto(value['value']):
                        return "True";
                    else:
                        return str(user.ChangeHeadPhoto(value['value']));

        except Exception as e:
            #print("错误内容:"+str(e));
            #print("错误文件:"+str(e.__traceback__.tb_frame.f_globals["__file__"]))  # 发生异常所在的文件
            #print("错误行数:"+str(e.__traceback__.tb_lineno))                       # 发生异常所在的行数
            raise e;
    #else:
        return values;

    #print(fileSys.fileSteam[0].getValue());

    return render_template(
        'file.html',
        context=context,
    );

@app.route("/adminfile/",methods=['GET','POST'])
@app.route("/adminFile/",methods=['GET','POST'])
def adminfile():
    '''
    文件系统
    '''
    context = {};
    context['name'] = myname;
    context['title'] = "文件管理员";
    print("\n");
    name = None;
    password = None;
    user = None;
    if name==None or password==None:
        try:
            name = session['name'];
            password = session['password'];
        except Exception as err:
            print(err);

    if not name==None and not password==None and not name=='' and not password=='':
        id = User.SignOn(name,password);
        #print(id);
        user = User.GetUser(id);
        #print(user);

    if isinstance(user,User) and not user==None:
        session['id'] = user.id;
        session['name'] = name;
        session['password'] = password;

    try:
        if user.ChackLevel(100)==False:
                return redirect("/file/");
    except Exception:
        return redirect("/file/");

    values = request.get_data();
    
    #print(values);
    
    if len(values)>0:
        #print(values);
        value = json.loads(values);
        #print(values.decode("utf8"));
        try:
            if value['n']=='name':
                return user.name;

            elif value['n']=='id':
                return str(user.id);

            elif value['n']=="headPhoto":
                return user.GetHeadPhoto();

            elif value['n']=="type":
                return user.type;

            elif value['n']=="nameAndType":
                return '{"name":"'+str(user.name)+'","type":"'+str(user.type)+'"}';

            elif value['n']=="exit":
                session['name'] = "";
                session['password'] = "";
                session['id'] = "";
                redirect(url_for("signOn"));
                return "exit";

            elif value['n']=="list":
                #try:
                if value['isdir']=="True":
                    return fileSys.getFileList(value['dir']);
                else:
                    return str(Fsys.files.getFile(fileSys.fileSteam,value['dir']));

            elif value['n']=="newDir":
                #print(user.ToString());
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    if len(value['dir'])>1:
                        return fileSys.newDir(value['dir'],value['name']);
                    else:
                        return "Error";

            elif value['n']=="upFile":
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    files = fileSys.streamUpdate();
                    eachSize = 1024*1024*20;
                    if eachSize>int(value['size']):
                        eachSize = int(value['size']);
                    package = math.ceil(int(value['size'])/(1024*1024*20));
                    level = package;
                    level += user.AddLevel();

                    newFile = Fsys.files(len(files),value['name'],value['size'],str(eachSize),package,value['md5'],fileSys.root+value['dir']+"/"+value['name']+".file",user.id,level,value['create'],value['uptime'],0);
                    print(newFile.toDictNoCut());
                    upSql = newFile.upSql("files");
                    if upSql=="True":
                        write = newFile.toDictNoCut();
                        write['value'] = value['value'];
                        fileSys.fileSteam.append(newFile);
                        return str(fileSys.newFileZlib(newFile.path,write));
                    else:
                        return upSql;

            elif value['n']=="upFileTest":
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    files = fileSys.streamUpdate();
                    eachSize = 1024*1024*20;
                    if eachSize>int(value['size']):
                        eachSize = int(value['size']);
                    package = math.ceil(int(value['size'])/(1024*1024*20));
                    level = package;
                    level+=user.AddLevel();

                    newFile = Fsys.files(len(files),value['name'],value['size'],str(eachSize),package,value['md5'],fileSys.root+value['dir']+"/"+value['name']+".file",user.id,level,value['create'],value['uptime'],0);
                    return str(fileSys.existsSql(newFile));

            elif value['n']=="getFileInfo":
                dir = fileSys.root+value["dir"]+".file";
                print(dir);
                if fileSys.exists(dir):
                    file = fileSys.getFile(dir);
                    return str(file.toDict());

                return "Error";

            elif value['n']=="upFileOver":
                dir = fileSys.root+value['dir']+"/"+value["name"]+".file";
                print(dir);
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    fileSys.streamUpdate();
                    file = fileSys.getFile(dir);
                    print(file.toDict());
                    if int(file.id)>=0:
                        fileIndex = fileSys.fileSteam.index(file);
                        print(fileIndex);
                        eachSize = 1024*1024*20;
                        if eachSize>int(value['size']):
                            eachSize = int(value['size']);
                        package = math.ceil(int(value['size'])/(1024*1024*20));
                        level = package;
                        level += user.AddLevel();
                        if user.ChackLevel(file.level):
                            file.path = dir;
                            file.name = value['name'];
                            file.size = value['size'];
                            file.eachSize = eachSize;
                            file.create = value['create'];
                            file.md5 = value['md5'];
                            file.package = package;
                            file.level = level;
                            file.userid = user.id;
                            upSql = file.changeSql(fileSys.tableName);
                            if upSql==True or upSql=="True":
                                #print("True");
                                write = file.toDictNoCut();
                                write['value'] = value['value'];
                                fileSys.fileSteam[fileIndex] = file;
                                return str(fileSys.overFileZlib(file.path,write));
                            elif upSql=="Error":return "SystemError";  
                            else:return str(upSql);
                        else:return "Error";
                    else:return "Alive";

            elif value['n']=="downFile":
                dir = fileSys.root+value["dir"];
                print(dir);
                if not fileSys.exists(dir):
                    file = fileSys.getFile(dir);
                    return "Alive";
                else:
                    file = fileSys.getFile(dir);
                    if not isinstance(user,User) or user==None:
                        if file.level<=1:
                            return file.getValueZlib();
                        else:
                            return "Error";
                    else:
                        if user.ChackLevel(file.level):
                            return file.getValueZlib();
                        else:
                            return "Error";

            elif value['n']=="deleteFile":
                dir = fileSys.root+value['dir'];
                if not fileSys.exists(dir):
                    return "Alive";
                else:
                    file = fileSys.getFile(dir);
                    print(file.toDictNoCut());
                    if not isinstance(user,User) or user ==None:
                        return "Error";
                    else:
                        if user.type=="admin":
                            return file.sqlDelete(Fsys.files.tableName);
                        elif user.type=="staff" and file.level<=70:
                            return file.sqlDelete(Fsys.files.tableName);
                        elif user.type=="general" and file.level<=40:
                            return file.sqlDelete(Fsys.files.tableName);
                        elif user.type=="basic" and file.level<=10:
                            return file.sqlDelete(Fsys.files.tableName);
                        else:
                            return "Error";

                return "False";

            elif value['n']=="upHeadPhoto":
                if not isinstance(user,User) or user==None:
                    return "Error";
                else:
                    if user.UpHeadPhoto(value['value']):
                        return "True";
                    else:
                        return str(user.ChangeHeadPhoto(value['value']));

        except Exception as e:
            #print("错误内容:"+str(e));
            #print("错误文件:"+str(e.__traceback__.tb_frame.f_globals["__file__"]))  # 发生异常所在的文件
            #print("错误行数:"+str(e.__traceback__.tb_lineno))                       # 发生异常所在的行数
            raise e;
    #else:
        return values;

    #print(fileSys.fileSteam[0].getValue());

    return render_template(
        'adminFile.html',
        context=context,
    );

@app.route("/web3D/")
@app.route("/Web3D/")
def web3D():
    '''
    网站3D测试
    '''

    return render_template(
        'test3D.html',
    );

@app.route("/testPath/")
@app.route("/testpath/")
def testPath():
    return render_template(
        'testPath.html',        
    )

@app.route("/woker/")
def woker():
    '''
    矿工下载位置
    '''
    return render_template(
        'woker.html',        
    )

#@app.route('/')
#@app.route('/home')
#def home():
#    """Renders the home page."""
#    return render_template(
#        'index.html',
#        title='Home Page',
#        year=datetime.now().year,
#    )

#@app.route('/contact')
#def contact():
#    """Renders the contact page."""
#    return render_template(
#        'contact.html',
#        title='Contact',
#        year=datetime.now().year,
#        message='Your contact page.'
#    )

#@app.route('/about')
#def about():
#    """Renders the about page."""
#    return render_template(
#        'about.html',
#        title='About',
#        year=datetime.now().year,
#        message='Your application description page.'
#    )
