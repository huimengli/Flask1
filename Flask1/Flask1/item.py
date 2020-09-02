'''
文字加密解密工具
'''

import re
import base64

class chinese(object) :
    _keyA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    _keya = "abcdefghijklmnopqrstuvwxyz"
    _keyB = "0123456789ABCDEF"

    @staticmethod
    def setCode(time, input):
        time = str(time);
        count = len(time);
        input = str(input);
        ret = ""
        for x in input:
            i = input.index(x)
            ret += chinese.setCodeOne(int(time[(count - 1) - (i % count)]),x)
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
        count = len(time);
        ret = re.compile(r"[A-Z\d]+[a-z]+").findall(value);
        #[...value.matchAll(/[A - Z\d]+[a - z] + /g)];
        values = []
        for x in ret:
            values.append(x)

        ret = "";
        for x in values:
            i = values.index(x);
            ret+=chr(chinese.getCodeOne(int(time[count - 1 - i % count]),x));
  
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