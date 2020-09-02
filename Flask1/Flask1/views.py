"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template,redirect, request, url_for,session
from Flask1 import app
from random import randint;
from Flask1.users import UserBasic as User;
import json;

myname = "绘梦璃";

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
        return redirect(url_for("index"));
    
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

        return redirect(url_for("index"));

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
    context['title'] = "修改信息";
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

    if isinstance(user,User):
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
