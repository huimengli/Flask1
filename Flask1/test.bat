:������Ҫ����һ���µĴ�����������natapp������:
:start cmd /k echo Hello, World! ���ڽ����󲻻�ر�:
:start cmd /C pause ���ڽ������Զ��ر�:
:����Natapp���:
:start cmd /C %~dp0natapp -authtoken=9987c65e46bb5b5f:
:������ҳ�鿴��վ:
start cmd /C explorer http://localhost:8000
:loop
:������ҳ������:
%~dp0env\Scripts\python.exe %~dp0runserver.py
goto loop
:Ϊ�˲鿴������Ϣ:
pause
:explorer http://slow.keliit.top:
:��վ������������ر�����cmd����:
:taskkill /f /im cmd.exe: