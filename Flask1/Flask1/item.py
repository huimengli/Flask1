'''
文字加密解密工具
'''

import re
import base64
import sys

class chinese(object) :
    _keyA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    _keya = "abcdefghijklmnopqrstuvwxyz"
    _keyB = "0123456789ABCDEF"

    @staticmethod
    def setCode(time, input):
        time = str(time);
        lenght = len(time);
        input = str(input);
        print(lenght);
        ret = "";
        for i in range(len(input)):
            x = input[i];
            ret += chinese.setCodeOne(int(time[(lenght - 1) - (i % lenght)]),x)
        return ret
        
    @staticmethod
    def setCodeOne(numOne, inputOne) :
        if numOne == 0:
            numOne = 1

        inputOne = ord(inputOne)
        ret = numOne * inputOne
        first = int(ret / 26)
        last = int(ret % 26)
        first = chinese.numToTextA(first)
        last = chinese.numToTexta(last)
        return first + last

        
    @staticmethod
    def numToTextA(num) :
        ret = ""
        theNum = 0
        if (num > 25):
            ret += chinese._keyA[25]
            num -= 25
        
        while (num > 25) :
            theNum =theNum+1;
            num -= 25;

        if (theNum > 0) :
            ret += str(theNum);
  
        ret += chinese._keyA[num]
        return ret
        
    @staticmethod
    def numToTexta(num) :
        ret = ""
        while (num > 25):
           ret += chinese._keya[25];
           num -= 25;
    
        ret += chinese._keya[num]
        return ret;

       
    @staticmethod
    def getCode(time, value) :
        time = str(time);
        lenght = len(time);
        ret = re.compile(r"[A-Z\d]+[a-z]+").findall(value);
        #[...value.matchAll(/[A - Z\d]+[a - z] + /g)];
        values = []
        for x in ret:
            values.append(x)

        ret = "";
        for i in range(len(values)):
            x = values[i];
            ret+=chr(chinese.getCodeOne(int(time[lenght - 1 - i % lenght]),x));
  
        return ret;
        

       
    @staticmethod
    def getCodeOne(numOne, valueOne):
        if numOne==0:
            numOne = 1;
        first = re.compile(r'[A-Z\d]+').search(valueOne).group(0);
        last = re.compile(r'[a-z]+').search(valueOne).group(0);
        first = int(chinese.textToNumA(first))
        last = int(chinese.textToNuma(last))
        ret = (first * len(chinese._keyA) + last) / numOne
        return int(ret)
        

        
    @staticmethod
    def textToNumA(string):
        ret = 0
        strs = re.compile(r'(Z?)([\d]*)([A-Z])').match(string);
        if not strs[2]=="":
            ret = 25 * (int(strs[2]) + 1);
        elif not strs[1]=="":
            ret += chinese._keyA.index(strs[1]);
        ret += chinese._keyA.index(strs[3])
        return ret;

        
    @staticmethod
    def textToNuma(string):
        ret = 0
        for x in string:
            ret+=chinese._keya.index(x);
        return ret;

def encode(string:str):
    '''
    base64加密
    '''
    return base64.b64encode(string.encode()).decode();

def decode(string:str):
    '''
    base64解密
    '''
    return base64.b64decode(string.encode()).decode();

def trace(message,index=-1):
    '''
    打印信息以及打印堆栈信息
    '''
    #try:
    #    message = Exception(message);
    #    raise message;
    #except Exception as e:
    #    mes = traceback.format_exc();
    #    print(mes.replace("Exception:","Message:"));
    #return;
    message = str(message);
    frame = sys._getframe().f_back;
    print("打  印："+(index>0 and str(index)+"次" or "全部")+"调用");
    print("信  息："+message);
    while not (index==0 or frame==None):
        print("文  件："+frame.f_code.co_filename);
        print("行  数："+str(frame.f_lineno));
        print("函数名："+frame.f_code.co_name);
        frame = frame.f_back;
        index-=1;
    print("");
    return;

#def Trace(message,index=1):
#    '''
#    简单打印信息以及打印堆栈信息
#    index为-1时打印所有堆栈信息
#    '''
#    frame = sys._getframe().f_back;
#    print("Trace : "+(index>0 and str(index)+"times" or "all"));
#    print("Message : "+message);
#    while not (index==0 or frame==None):
#        #print("file : "+frame.f_code.co_filename+" ; line : "+str(frame.f_code.co_firstlineno)+" function : "+frame.f_code.co_name);
#        print("file : "+frame.f_code.co_filename+" ; line : "+str(frame.f_lineno)+" function : "+frame.f_code.co_name);
#        frame = frame.f_back;
#        index-=1;
#    print("");
#    return;

def Trace(*message,index=1):
    '''
    简单打印信息以及打印堆栈信息
    index为-1时打印所有堆栈信息
    '''
    frame = sys._getframe().f_back;
    print("Trace : "+(index>0 and str(index)+"times" or "all"));
    files = [];
    lines = [];
    functions = [];
    while not (index==0 or frame==None):
        files.append(frame.f_code.co_filename);
        lines.append(str(frame.f_lineno));
        functions.append(frame.f_code.co_name);
        frame = frame.f_back;
        index-=1;
    fileCount = 0;
    lineCount = 0;
    functionCount = 0;
    for x in range(len(files)):
        fileCount = max(fileCount,len(files[x]));
        lineCount = max(lineCount,len(lines[x]));
        functionCount = max(functionCount,len(functions[x]));
    for x in range(len(files)):
        print("file : "+Complement(files[-x-1],fileCount)+"  line : "+Complement(lines[-x-1],lineCount)+"  function : "+Complement(functions[-x-1],functionCount))

    print("Message : ",end="");
    print(message);
    print("");
    return;

def Complement(input:(str,int),figures,isEnd=True,value=" ")->str: # type: ignore
    '''
    补位
    figures:补位位数
    isEnd:补位在内容尾部(输入为int时候默认前面补0,及无视此参数)
    value:用于补位的内容(输入为int时候默认补位内容为0,及无视此参数)
    '''
    if isinstance(input,int):
        input = str(input);
        count = figures - len(input);
        for x in range(count):
            input = "0"+input;
        return input;
    elif isinstance(input,str):
        count = figures - len(input);
        if isEnd:
            for x in range(count):
                input += value;
        else:
            for x in range(count):
                input = value+input;
        return input;
    else:
        raise Exception("输入参数错误!");

def Error(err:Exception,index=1):
    '''
    简单打印错误信息及打印堆栈信息
    index为-1时打印所有堆栈信息
    '''
    message = str(err);
    traceback = err.__traceback__;
    frame = traceback.tb_frame;
    print("Error : "+(index>0 and str(index)+"times" or "all"));
    files = [];
    lines = [];
    functions = [];
    while not (index==0 or frame==None):
        files.append(frame.f_code.co_filename);
        lines.append(str(frame.f_lineno));
        functions.append(frame.f_code.co_name);
        frame = frame.f_back;
        index-=1;
    fileCount = 0;
    lineCount = 0;
    functionCount = 0;
    for x in range(len(files)):
        fileCount = max(fileCount,len(files[x]));
        lineCount = max(lineCount,len(lines[x]));
        functionCount = max(functionCount,len(functions[x]));
    for x in range(len(files)):
        print("errorfile : "+Complement(files[-x-1],fileCount)+"  line : "+Complement(lines[-x-1],lineCount)+"  function : "+Complement(functions[-x-1],functionCount))

    print("Message : "+message);
    print("");
    return;