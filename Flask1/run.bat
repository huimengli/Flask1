:������Ҫ����һ���µĴ�����������natapp������:
:start cmd /k echo Hello, World! ���ڽ����󲻻�ر�:
:start cmd /C pause ���ڽ������Զ��ر�:
start cmd /C %~dp0natapp -authtoken=b7bfb6002991a622
:��������Ϊ������ҳ������:
%~dp0env\Scripts\python.exe %~dp0runserver.py
:��վ������������ر�����cmd����:
:taskkill /f /im cmd.exe: