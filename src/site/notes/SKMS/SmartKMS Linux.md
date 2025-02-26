---
{"dg-publish":true,"permalink":"/skms/smart-kms-linux/"}
---

![Pasted image 20250225122737.png](/img/user/img/pasted/Pasted%20image%2020250225122737.png)

安裝SmartKMS注意事項

`vi /etc/sysconfig/selinux`
> [!warning]
> SELINUX=disabled
> 關閉防火牆 disable<span style="color: crimson">d</span>

`SELINUX=disabled`
`systemctl disable firewalld.service`
![Pasted image_u.png](/img/user/img/Pasted%20image_u.png)
重新啟動，ssh會需要重連
`reboot`




SmartKMS對Application Servers的整合支援：

J2EE相容之Web伺服器（例如：Apache Tomcat 9）。
※特別注意：

Tomcat8或9，請記得改Tomcat的server.xml內URIEncoding="UTF-8" maxPostSize="0"要換成URIEncoding="UTF-8" maxPostSize="-1" maxHttpHeaderSize="204800"。
已有UTF-8另外添加maxPostSize="-1" maxHttpHeaderSize="204800"即可

1.tomcat

參數啟動檔
```
#!/bin/bash

# 設定 Tomcat 相關路徑
export KMS_HOME=/SRM/SmartKMS
export JAVA_HOME=/SRM/SmartKMS/openjdk
export CATALINA_HOME=/SRM/SmartKMS/tomcat9
export CATALINA_PID=/SRM/SmartKMS/catalinaPid
export JAVA_OPTS="-Dskms.home=${KMS_HOME}/Server -Dsolr.solr.home=${KMS_HOME}/Solr \
-Djava.library.path=${CATALINA_HOME}/bin:${CATALINA_HOME}/webapps/SmartKMS/WEB-INF/lib \
-Xmx1G -Xms512M -XX:MaxMetaspaceSize=256M -XX:MetaspaceSize=256M -XX:-UseGCOverheadLimit \
-Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.util.logging.config.file=$CATALINA_HOME/conf/logging.properties \
--add-opens=java.base/com.sun.org.apache.xerces.internal.jaxp=ALL-UNNAMED --add-opens=java.xml/com.sun.org.apache.xerces.internal.jaxp=ALL-UNNAMED \
--illegal-access=deny"

# 啟動 Tomcat
$CATALINA_HOME/bin/startup.sh
```

2.
啟動solr
cd /SRM/SmartKMS/solr-9.7.0/bin
查看所有最大限制
ulimit -a
修改open files
ulimit -n 65000
修改 max user processes
ulimit -u 65000

無法以root啟動需要添加 --force
./solr start --force
./solr status

創建core
./solr create -c core
./solr restart --force


vim /SRM/SmartKMS/solr-9.7.0/bin/solr.in.sh
```
設定 Solr 的 JAVA 路徑
SOLR_JAVA_HOME="/SRM/SmartKMS/openjdk/"

# 設定 JVM 最大記憶體使用量 1G
SOLR_HEAP="1G"
SOLR_JAVA_MEM="-Xms512m -Xmx1562m"

#default localhost
SOLR_HOST="192.168.182.149"

#設定時區
SOLR_TIMEZONE="Asia\Taipei"

# 設定 Solr 監聽 Port
SOLR_PORT="8983"

反註解
SOLR_OPTS="$SOLR_OPTS -Dlog4j2.formatMsgNoLookups=true"

export JAVA_HOME="/SRM/SmartKMS/openjdk"
export PATH=$JAVA_HOME/bin:$PATH
export SOLR_OPTS="$SOLR_OPTS -Dsolr.allow.unsafe.resourceloading=true"
```

##### 3.安裝MariaDB

`yum install mariadb-server.x86_64`
`systemctl start mariadb.service`
`systemctl enable mariadb`
`systemctl status mariadb.service`

> [!error] Title
> Contents
匯入時注意錯誤!! MariaDB的sql檔大小寫有差異

```
root password
mysql -u root -p
CREATE DATABASE skms CHARACTER SET utf8 COLLATE utf8_unicode_ci;
exit

#匯入mariadb
mysql -u root -p skms < /SRM/SmartKMS/dbs/MariaDB/skms.sql

#顯示資料表結構語法
describe skms.propertytype;
#刪除資料庫
drop database skms;
```

> [!tip]
> 無法透過hibernate創建結構時可能需要用DB工具重新建立

設定DB遠端連線
加密、設定密碼
set password=PASSWORD('<span style="color: crimson">root</span>');
可以使用加密root密碼 **CJWt5SDMOdM**
以下還是使用
set password=PASSWORD('password')

MariaDB為了提高安全性，默認只監聽127.0.0.1的3306 port 並禁止TCP連線
`select user,host from mysql.user;`
查看Host為localhost
![Pasted image_d.png](/img/user/img/Pasted%20image_d.png)
[為 MariaDB 配置遠端存取權限](https://blog.csdn.net/lanuage/article/details/78846766)
%代表所有IP，password表示將用這個密碼登入root用戶

> [!tip]
> `*.*` 記得別漏掉，markdown **是斜體

`GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;`

指定IP連線
AP1
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.182.149' IDENTIFIED BY 'password' WITH GRANT OPTION;`
AP1 本機 (mariadb連線用)
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION;;`
本機
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.182.1' IDENTIFIED BY 'password' WITH GRANT OPTION;`

刪除使用者
`DROP USER'root'@'192.168.182.1';`
`FLUSH PRIVILEGES;`

保存更改
`FLUSH PRIVILEGES;`

`select user,host from mysql.user;`
`exit`
![Pasted image_z.png](/img/user/img/Pasted%20image_z.png)

資料庫設定
SmartKMS 9連接資料庫的設定檔
vim /SRM/SmartKMS/Server/cfg/ds-config.xml

> [!error]
> 試著本機連線
> mysql -u root -p -h 127.0.0.1 -D skms
> mariadb也請使用mysql連線

```
<ds-config>

  <datasource name="com.intumit" default="true">

  <vendor>資料庫類別</vendor>  ( MariaDB 或 mssql 或 oracle )
<driverClassName >JDBC Driver名稱</driverClassName>
   <url>JDBC連接字串</url>
   <username>資料庫登入帳號</username> 
   <password encrypted="true">加密的資料庫密碼</password> 
---------------
  <vendor>mysql</vendor>
  <driverClassName>com.mysql.jdbc.Driver</driverClassName>
  <url>jdbc:mysql://127.0.0.1:3306/skms</url>
  <username>root</username>
  <password encrypted="false">password</password>
---------------
<pool provider="c3p0">
  <minSize>10</minSize>
	<maxSize>50</maxSize>
	<acquireIncrement>0</acquireIncrement>
	<maxStatements>0</maxStatements>
	<maxIdleTime>300</maxIdleTime>
	<maxConnectionAge>3600</maxConnectionAge>
	<idleConnectionTestPeriod>100</idleConnectionTestPeriod>
    <autoCommitOnClose>false</autoCommitOnClose>
</pool>
</datasource>

</ds-config>
```

更換license key
cd /SRM/SmartKMS/Server/cfg/
原先檔案可以cp到tmp
vim /SRM/SmartKMS/Server/cfg/license.txt
```
IRxImHsCRQhqym4j8Xn5DKjuAQxU/IPRrWMoDpgOLpZwlvFf6laqKXk1I1G9ZPtIAFoew2tV6Gi8376DlC6v0KXXwNLViTxjkaNM/2bWne0UQhyethjE52A3Y8R4j6jag3y8AKgjYl42dCmH+WuKcBvwm7mRCJYmzqxX3Yest4iB9y4diriVrQ3kj+ylqf8QePqAV3WAQXKMkQE4HNZzu0v+RbXdTyxv9/SbhPVGPsPWPVFt9FsqBMfUPB4I3LWdjGQGm8oNdGuzSaGN/ml5mhM/RB7Hpk90mKD8uDSNvnaQjPxATLFUdOUwHiHCtFUQ3vAB1UQOlY4985lfSC1UfgGUxKx0q09zkK6BOP6bamszJMNH1fWoW2ksIc0dgjaOWzm7M7savS+UpvWfq0FcTLH4rCc98gvnwvKRKvEa0L0=
```

log4j fail 創一個新檔案
[java - Please initialize the log4j system properly. While running web service - Stack Overflow](https://stackoverflow.com/questions/6608775/please-initialize-the-log4j-system-properly-while-running-web-service)
vim /SRM/SmartKMS/tomcat9/webapps/SmartKMS/WEB-INF/classes/log4j.properties
```
log4j.rootLogger=debug, stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%-4r [%t] %-5p %c %x - %m%n
```


安裝mariadb jdbc
`wget https://dlm.mariadb.com/4174416/Connectors/java/connector-java-3.5.2/mariadb-java-client-3.5.2.jar -P /SRM/SmartKMS/tomcat9/webapps/SmartKMS/WEB-INF/lib`

添加權限
chmod 755 /SRM -R
