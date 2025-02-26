---
{"dg-publish":true,"permalink":"/app/app/"}
---

優先安裝RabbitMQ，先確認能否正常running
參考文字客服安裝
安裝erlan
安裝RabbitMQ

安裝更新與必要套件
執行init.sh

安裝包執行步驟
a. 將安裝包app-20240311-v23.tgz上傳至 /opt 目錄中
b. 比對md5
	cd /opt
	md5sum app-20240509-v25.tar.gz
	應是d76ad1f950c9b280b8091ac7d190e42e
c. 解壓縮安裝包並重新命名
	cd /opt
	tar zxvf app-20240509-v25.tar.gz
	mv app-20240509-v25 app
d. 進入安裝包目錄
	cd /opt/app
e. 開始安裝
	./install.sh

1. 於DB1/DB2安裝MariaDB
	a. 執行步驟a ~ e, 選擇11開始安裝
	b. 依序輸入n n y, 僅第一次安裝時需要優化kernel
	![Pasted image 20250217145203.png](/img/user/img/Pasted%20image%2020250217145203.png)
	c. DB主機不需建立服務帳號, 輸入n
	d. 輸入y修補ssh安全性
	e. 建立DB使用者帳號, 此處以帳號 ’admin’@’%’, 密碼password為例子
	![Pasted image 20250217145825.png](/img/user/img/Pasted%20image%2020250217145825.png)
	f. 依序輸入y, y建立Helpdesk4J資料庫與SmartRobot資料庫
	![Pasted image 20250217145837.png](/img/user/img/Pasted%20image%2020250217145837.png)
	g. 輸入y確認以上資訊正確 並安裝
	h. 輸入n
	![Pasted image 20250217145959.png](/img/user/img/Pasted%20image%2020250217145959.png)
	i. 參考文件MariaDB Master to Master(aa) with HAproxy.docx讓兩台DB同步
	j. 連線測試
	mysql -uadmin -ppassword
	出現以下畫面代表已經連至DB
	![Pasted image 20250218102312.png](/img/user/img/Pasted%20image%2020250218102312.png)


dnf install socat
安裝Helpdesk4J

![Pasted image 20250220105807.png](/img/user/img/pasted/Pasted%20image%2020250220105807.png)

![Pasted image 20250218153141.png](/img/user/img/pasted/Pasted%20image%2020250218153141.png)

vim /SRM/helpdesk4j/startup.sh
確認路徑以及多餘的空白
![Pasted image 20250220102738.png](/img/user/img/pasted/Pasted%20image%2020250220102738.png)

vim /SRM/helpdesk4j/AppData/cfg/Server.properties
![Pasted image 20250220101604.png](/img/user/img/pasted/Pasted%20image%2020250220101604.png)

[root@192 helpdesk4j]# chown -R helpdesk:helpdesk /SRM/helpdesk4j/




