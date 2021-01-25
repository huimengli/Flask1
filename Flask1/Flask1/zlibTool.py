import zlib

def compress(infile, dst, level=9):
    '''
    压缩文件
    '''
    infile = open(infile, 'rb')
    dst = open(dst, 'wb')
    compress = zlib.compressobj(level)
    data = infile.read(1024)
    while data:
        dst.write(compress.compress(data))
        data = infile.read(1024)
    dst.write(compress.flush())

def decompress(infile, dst):
    '''
    解压缩文件
    '''
    infile = open(infile, 'rb')
    dst = open(dst, 'wb')
    decompress = zlib.decompressobj()
    data = infile.read(1024)
    while data:
        dst.write(decompress.decompress(data))
        data = infile.read(1024)
    dst.write(decompress.flush())

def encode(input,level=9):
    '''
    压缩字符串
    '''
    return zlib.compress(input.encode("utf8"),level);

def decode(input):
    '''
    解压字符串
    '''
    return zlib.decompress(input).decode("utf8");