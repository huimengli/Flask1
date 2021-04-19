'''
我自己写的RSA加密模块
'''
import re
import math
import random
import base64;

#RSA计算模块

def bigAddSlow(num1,num2):
    '''
    大数相加(慢速)
    '''
    num1 = str(num1)
    num2 = str(num2)

    count1 = len(num1)
    count2 = len(num2)

    isF1 = re.compile(r"-").match(num1) and True or False
    isF2 = re.compile(r'-').match(num2) and True or False

    if isF1 and not isF2:
        return bigSubtractSlow(num2,num1[1:])
    elif not isF1 and isF2:
        return bigSubtractSlow(num1,num2[1:])
    elif isF1 and isF2:
        return "-" + bigAddSlow(num1[1:],num2[1:])

    minCount = min(count1,count2)
    ret = ""

    n1 = 0
    n2 = 0
    r = 0

    for x in range(1,minCount + 1):
        n1 += int(num1[count1 - x])
        n2 = int(num2[count2 - x])
        r = n1 + n2
        n1 = math.floor(r / 10)
        ret+=str(r % 10)

    if count1 < count2:
        for x in range(minCount + 1,count2 + 1):
            n2 = int(num2[count2 - x])
            r = n1 + n2
            n1 = math.floor(r / 10)
            ret+=str(r % 10)
    elif count1 > count2:
        for x in range(minCount + 1,count1 + 1):
            n1 += int(num1[count1 - x])
            r = n1
            n1 = math.floor(r / 10)
            ret += str(r % 10)
    if n1 == 1:
        ret+="1"

    rett = ""
    for x in range(1,len(ret) + 1):
        rett+=ret[len(ret) - x]

    return bigNumberFixed(rett)


def bigSubtractSlow(num1,num2):
    '''
    大数相减(慢速)
    '''
    num1 = str(num1)
    num2 = str(num2)

    isF1 = re.compile(r"-").match(num1)
    isF2 = re.compile(r'-').match(num2)

    if isF1 and not isF2:
        return '-' + bigAddSlow(num1[1:],num2)
    elif not isF1 and isF2:
        return bigAddSlow(num1,num2[1:])
    elif isF1 and isF2:
        return bigSubtractSlow(num2[1:],num1[1:])

    ret = ""
    isLess = False
    if bigIsBigerSlow(num2,num1) > 0:
        isLess = True
        temp = num1
        num1 = num2
        num2 = temp
    elif bigIsBigerSlow(num1,num2) == 0:
        return "0"

    count1 = len(num1)
    count2 = len(num2)

    n1 = 0
    n2 = 0
    r = 0

    for x in range(1,count2 + 1):
        n1 = n1 == 0 and 10 or 9
        n1 = n1 + int(num1[count1 - x])
        n2 = int(num2[count2 - x])
        r = n1 - n2
        n1 = r < 10 and 1 or 0
        ret += str(r % 10)

    if count1 > count2:
        for i in range(count2 + 1,count1 + 1):
            n1 = n1 == 0 and 10 or 9
            n1 = n1 + int(num1[count1 - i])
            r = n1
            n1 = r < 10 and 1 or 0
            ret += str(r % 10)

    if isLess:
        ret+= "-"

    #print(ret);

    rett = ""
    for i in range(1,len(ret) + 1):
        rett+=ret[len(ret) - i]

    return bigNumberFixed(rett)


def bigIsBigerSlow(num1,num2) -> int:
    '''
    大数比较
    '''
    num1 = str(num1)
    num2 = str(num2)

    num1 = bigNumberFixed(num1)
    num2 = bigNumberFixed(num2)

    first1 = num1.split(".")[0]
    first2 = num2.split(".")[0]

    if len(first1) > len(first2):
        return 1
    elif len(first1) < len(first2):
        return -1
    else:
        return num1 > num2 and 1 or num1 < num2 and -1 or 0


def bigNumberFixed(num) -> str:
    '''
    大数修正
    '''
    num = str(num)
    match = re.compile(r'-(0*)').match(num)
    if match:
        if len(num) == 2 and num[1] == "0":
            return "0"
        elif len(num) == 1:
            return "0"
        return '-' + num[len(match[0]):]
    elif num[0] == "0":
        if len(num) == 1 and num[0] == "0":
            return "0"
        elif len(num) == 0:
            return "0"
        match = re.compile(r'0+').match(num)
        return num[len(match[0]):]
    else:
        if len(num) == 1 and num[0] == "0":
            return "0"
        elif len(num) == 0:
            return "0"
        return num


def bigMultiplySlow(num1,num2):
    '''
    大数相乘(慢速,建议别用)
    '''
    ret = num1
    if int(num1) == 0 or int(num2) == 0:
        return "0"
    for x in range(1,num2):
        ret = bigAddSlow(ret,num1)
    return ret


def bigMultiplyKaraSuba(num1,num2):
    '''
    大数相乘(分治算法)
    
    结果小于9007199136250225(js安全数据:9007199254740992)的计算直接返回计算结果
    让我没想到的是,python的安全数据好像也是2的53次方,也就是9007199254740992
    '''
    if int(num1) == 0 or int(num2) == 0:
        return "0"
    #elif int(num1)<=94906265 and int(num2)<=94906265:
    #    return str(int(num1)*int(num2));
    elif int(num1) <= 10 and int(num2) <= 10:
        return str(int(num1) * int(num2))

    num1 = str(num1)
    num2 = str(num2)

    count1 = len(num1)
    count2 = len(num2)

    halfN = math.floor(max(count1,count2) / 2)

    first1 = count1 > halfN and num1[:count1 - halfN] or "0"
    last1 = count1 > halfN and num1[count1 - halfN:] or num1
    first2 = count2 > halfN and num2[:count2 - halfN] or "0"
    last2 = count2 > halfN and num2[count2 - halfN:] or num2

    plus1 = bigAddSlow(first1,last1)
    plus2 = bigAddSlow(first2,last2)

    c2 = bigMultiplyKaraSuba(first1,first2)
    c0 = bigMultiplyKaraSuba(last1,last2)
    c1 = bigSubtractSlow(bigSubtractSlow(bigMultiplyKaraSuba(plus1,plus2),c0),c2)

    for i in range(halfN):
        c2 +="00"
        c1 += "0"

    ret = bigAddSlow(bigAddSlow(c2,c1),c0)

    return str(ret)

def bigDividedCutSlow(num1,num2):
    '''
    大数相除(分割法)(慢速)
    '''
    num1 = str(num1)
    num2 = str(num2)

    if num2 == "1":
        return num1

    num1 = bigNumberFixed(num1)
    num2 = bigNumberFixed(num2)

    readF = re.compile(r'-')

    if readF.match(num1) or readF.match(num2):
        #print("不支持计算负数");
        raise Exception("不支持计算负数")

    eachValue = [num2]
    for x in range(1,9):
        eachValue.append(bigAddSlow(eachValue[len(eachValue) - 1],num2))

    if bigIsBigerSlow(num1,num2) > 0:
        count1 = len(num1)
        count2 = len(num2)

        cha = count1 - count2
        each = "0"
        next = False
        num = num1
        ret = "0"

        for x in range(cha + 1):
            i = cha - x
            next = False
            for y in range(9):
                j = 9 - y - 1#由于python的for函数特性,所以需要再减一
                each = eachValue[j]
                for k in range(i):
                    each+="0"
                if bigIsBigerSlow(each,num) > 0:
                    next = False
                else:
                    next = True
                    num = bigSubtractSlow(num,each)
                    ret+=str(j + 1)
                    break
            if not next:
                ret+="0"

        return bigNumberFixed(ret)
    elif bigIsBigerSlow(num1,num2) == 0:
        return "1"
    else:
        #暂不支持小数除法
        return "0"


def bigQuotient(num1,num2):
    '''
    大数求商
    '''
    num1 = str(num1)
    num2 = str(num2)

    if bigIsBigerSlow(num1,num2) < 0:
        return num1
    elif bigIsBigerSlow(num1,num2) == 0:
        return "0"
    if num2 == "0":
        return None
    divided = bigDividedCutSlow(num1,num2)
    #print(divided);
    return bigNumberFixed(bigSubtractSlow(num1,bigMultiplyKaraSuba(divided,num2)))

def bigRandom(num):
    '''
    大数求随机数
    '''
    num = str(num)
    key = random.random()
    key = math.floor(key * 10000000000000000)
    ret = bigMultiplyKaraSuba(num,key)
    return bigNumberFixed(ret[:len(num) - 1])

def bigPowerSlow(num,exp):
    '''
    大数乘方(慢速)
    '''
    if exp == 0:
        return"1"
    else:
        num = str(num)
    ret = num
    for x in range(1,exp):
        ret = bigMultiplyKaraSuba(ret,num)
    return bigNumberFixed(ret)

def bigPower(num,exp):
    '''
    大数乘方
    '''
    if exp == 0:
        return "1"
    else:
        num = str(num)
        exp-=1
    ret = num
    while exp >= 1:
        exp = math.floor(exp)
        if exp & 1:
            ret = bigMultiplyKaraSuba(ret,num)
        num = bigMultiplyKaraSuba(num,num)
        exp/=2
    return ret

def bigPowerAndQuotient(num1:int or str,exp,num2):
    num1 = str(num1)
    exp = str(exp)
    num2 = str(num2)

    # 算法原理:
    # ab % k = (a%k) * (b%k) % k
    # 所以，假设大数b是1234567
    # 那么a^b % k = (a^1234560 % k) * (a^7 % k) % k = ((a^123456 % k)^10 % k) *
    # (a^7 % k) % k

    rets = []
    lists = []
    qlist = []
    ret = ""

    lists.append("1")
    lists.append(num1)

    qlist.append("1")
    qlist.append(bigQuotient(num1,num2))

    for x in range(1,10):
        lists.append(bigMultiplyKaraSuba(lists[len(lists) - 1],num1))
        qlist.append(bigQuotient(lists[len(lists) - 1],num2))

    for x in range(len(exp)):
        i = len(exp) - x-1;
        each = qlist[int(exp[i])]
        for j in range(1,x+1):
            each = bigPowerAndQuotientSlow(each,10,num2)
        rets.append(each)

    ret = rets[0]

    for x in range(1,len(rets)):
        ret = bigMultiplyKaraSuba(ret,rets[x])

    return bigQuotient(ret,num2)

def bigPowerAndQuotientSlow(num1,exp,num2):
    '''
    慢速乘方求商
    '''
    return bigQuotient(bigPower(num1,exp),num2)


#固定参数

numbers = [31,
        61,
        89,
        107,
        127,
        521,
        607,
        1279,
        2203,
        2281,
        3217,
        4253,
        4423,
        9689,
        9941,
        11213,];

#功能性函数

def getPrime(count):
    '''
    获取素数(获取已知素数用)

    @param {int} count 层叠方次数
    '''
    ret = "2";
    for x in range(1,count):
        ret = bigAddSlow(ret,ret);
    return bigNumberFixed(bigSubtractSlow(ret,1));


def getKey(num1,num2,num3):
    '''
    获取密匙
    (懒得写了,这个贼吃算力)
    '''
    pass

#需要使用的类

class rsaKey(object):
    '''
    计算密匙
    '''
    def __init__(self,N,E,D):
        '''
        初始化
        '''
        self.N = N;
        self.E = E;
        self.D = D;


class project(object):
    '''
    加密核心模块
    在其他值要使用,只要加载这个模块就够了
    '''
    keys = {
        "middleKey":{
            "N":"4951760154835678088235319297",
            "E":"618970019642690137449562111",
            "D":"2803193270864617953997415754",
        },
        "shotKey1":{
            "N":"1153631",
            "E":"1447",
            "D":"1005847"
        },
        "shotKey2":{
            "N":"3604379",
            "E":"2009",
            "D":"3023845",
        },
        "veryShotKey":{
            "N":"3599",
            "E":"71",
            "D":"3431",
        },
    }
    _key = "12345678"
    _64Key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    def base64ToKey(self,input):
        '''
        base64转8进制
        '''
        index = "0"
        ret = ""
        for x in range(len(input)):
            index = indexOf(self._64Key,input[x])
            if index == 64:
                ret += "0"
            elif index == "-1":
                ret+=input[i]
            else:
                ret+=self._key[math.floor(index / 8)]
                ret+=self._key[index % 8]

        return ret

    def keyToBase64(self,input):
        '''
        8进制转base64
        '''
        inputA = ""
        inputB = ""
        index = 0
        ret = ""
        trun = False
        for x in range(len(input)):
            if not trun:
                indexA = str(input[x]);
                #print(indexA);
                if bigIsBigerSlow(indexA,0)==0:
                    ret+="="
                    continue
                
                if indexOf(self._key,indexA) == -1:
                    ret+=indexA
                    continue
                
                indexB = input[x+1];
                index = indexOf(self._key,indexA) * 8 + indexOf(self._key,indexB)
                ret += self._64Key[index];
                trun = True;
            else:trun = False;

        return ret;

    def encode(self,input):
        '''
        将输入内容转为8进制数据
        '''
        base = base64.b64encode(input.encode()).decode();
        return self.base64ToKey(base);

    def decode(self,input):
        '''
        将8进制数据转回字符串内容
        '''
        base = self.keyToBase64(input);
        print(base);
        return base64.b64decode(base.encode()).decode();

    def setCode(self,input,key:{"N":"","E":"","D":""}):
        '''
        RSA加密
        '''
        if not isinstance(key,dict):
            raise Exception("参数错误!");
        input = self.encode(input);
        ret = [];
        for i in range(len(input)-1):
            if not i&1:
                ret.append(input[i]+input[i+1]);
        if len(input)&1:
            ret.append(input[len(input)-1]);
        input = "";
        for i in range(len(ret)-1):
            input+=bigPowerAndQuotient(ret[i],key["E"],key["N"])+",";
        input+=bigPowerAndQuotient(ret[len(ret)-1],key['E'],key['N']);
        return base64.b64encode(input.encode()).decode();

    def getCode(self,input,key:{"N":"","E":"","D":""}):
        '''
        RSA解密(错误代码)
        '''
        if not isinstance(key,dict):
            raise Exception("参数错误!");
        input = base64.b64decode(input.encode()).decode();
        rets = input.split(",");
        ret = "";
        for x in range(len(rets)):
            ret+=bigPowerAndQuotient(rets[x],key['D'],key['N']);
        ret = self.keyToBase64(ret);
        # 传输数据过程中可能会有"00"被加密,由于00==0所以导致缺少补位,添加补位即可
        while len(ret)%4!=0:
            ret+="=";
        ret = base64.b64decode(ret.encode()).decode();
        return ((ret[len(ret)-1])and re.compile(r'\s\n\0').match(ret[len(ret)-1]))and ret[:len(ret)-1] or ret;
    

#特殊追加函数
def indexOf(lists:list,obj:object) -> int:
    '''
    获取索引
    '''
    ret = 0
    try:
        for x in lists:
            if x is obj:
                return ret
            else:
                ret+=1
        return -1
    except Exception:
        return -1
    return -1

def indexsOf(lists:list,obj:object) -> list:
    '''
    获取全部索引
    '''
    index = 0
    ret = []
    for x in lists:
        if x is obj:
            ret.append(index)
        index+=1
    return ret



#测试用函数

def testAddSlow(count):
    '''
    测试相加
    '''
    ret = []
    for x in range(count):
        for y in range(count):
            if str(x + y) == bigAddSlow(x,y):
                ret.append(True)
            else    :
                ret.append(False)

    return ret

def testSubtractSlow(count):
    '''
    测试相减
    '''
    ret = []
    for x in range(count):
        for y in range(count):
            if str(x - y) == bigSubtractSlow(x,y):
                ret.append(True)
            else    :
                ret.append(False)

    return ret

def testDividedCutSlow(count):
    '''
    测试相除(分割法)(慢速)
    '''
    ret = []
    for x in range(1,count):
        for y in range(1,count):
            if str(math.floor(x / y)) == bigDividedCutSlow(x,y):
                ret.append(True)
            else    :
                ret.append(False)

    return ret;
    
def testPowerAndQuotient(count):
    '''
    测试剩余除法
    '''
    ret = [];
    for x in range(1,count):
        for y in range(2,count):
            if bigPowerAndQuotientSlow(x,10,y)==bigPowerAndQuotient(x,10,y):
                ret.append(True);
            else:
                print(x);
                print(y);
                ret.append(False);

    return ret;