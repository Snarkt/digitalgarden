---
{"dg-publish":true,"permalink":"/products/smart-kms/smart-kms-linux/"}
---


此篇使用 smartkms-build-251_5d76c74

![Pasted image 20250225122737.png](/img/user/Assets/Img/Pasted%20image%2020250225122737.png)

安裝SmartKMS注意事項

`vi /etc/sysconfig/selinux`
> [!warning]
> SELINUX=disabled
> 關閉防火牆 disable<span style="color: crimson">d</span>

`SELINUX=disabled`
`systemctl disable firewalld.service`
![Pasted image_u.png](/img/user/Assets/Img/Pasted%20image_u.png)
重新啟動，ssh會需要重連
`reboot`

目錄整理
mkdir /SRM
cd /SRM
unzip smartkms-build-251_5d76c74-bin.zip
mv smartkms-build-251_5d76c74 SmartKMS
![Pasted image 20250226154625.png](/img/user/Assets/Img/Pasted%20image%2020250226154625.png)
將jdk1.8、jdk11、tbin、solr-9.7.0.tgz、tomcat9.zip 解壓到SmartKMS內

mv SmartKMS.war Solr.war tomcat9/webapps/
unzip SmartKMS.war -d SmartKMS
unzip Solr.war -d Solr

解壓縮 jdk
	1. jdk
	`tar -xzvf openlogic-openjdk-11.0.26+4-linux-x64.tar.gz`
	`mv openlogic-openjdk-8u442-b06-linux-x64 openjdk`   
	2. jre
	`tar -xzvf openlogic-openjdk-jre-11.0.26+4-linux-x64.tar.gz`
	`mv openlogic-openjdk-jre-8u432-b06-linux-x64 openjdk/jre`
	
	mv jre openjdk/

添加權限
chmod 755 /SRM -R

SmartKMS對Application Servers的整合支援：

J2EE相容之Web伺服器（例如：Apache Tomcat 9）。
※特別注意：

vim /SRM/SmartKMS/tomcat9/conf/server.xml

Tomcat8或9
請記得改Tomcat的server.xml內
URIEncoding="UTF-8" maxPostSize="0"要換成
URIEncoding="UTF-8" maxPostSize="-1" maxHttpHeaderSize="204800"。

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
-Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.util.logging.config.file=$CATALINA_HOME/conf/logging.properties"

# 啟動 Tomcat
$CATALINA_HOME/bin/startup.sh
```


> [!bug] 
使用 jdk11 會跳出錯誤，需要略過錯誤可以再加上這些參數
但最後要連到
>http://localhost:8080/SmartKMS/setup/CompanyList.action
>會白屏，最後還是要使用 jdk1.8 (JAVA8)

```
--add-opens=java.base/com.sun.org.apache.xerces.internal.jaxp=ALL-UNNAMED --add-opens=java.xml/com.sun.org.apache.xerces.internal.jaxp=ALL-UNNAMED --add-opens java.base/sun.misc=ALL-UNNAMED \
--illegal-access=deny"
```

2.啟動solr

> [!warning] 
>solr-9.7.0要使用 jdk11，用 jdk1.8 ( JAVA8 ) 會報錯
>將 openjdk 路徑換為 jdk11

修改solr設定檔
vim /SRM/SmartKMS/solr-9.7.0/bin/solr.in.sh
```
# 設定 Solr 的 JAVA 路徑
SOLR_JAVA_HOME="/SRM/SmartKMS/openjdk/"

# 設定 JVM 最大記憶體使用量 1G
SOLR_HEAP="1G"
SOLR_JAVA_MEM="-Xms512m -Xmx1562m"

# default localhost
SOLR_HOST="192.168.182.149"

#設定時區
SOLR_TIMEZONE="Asia\Taipei"

# 設定Solr資料夾
SOLR_HOME="/SRM/SmartKMS/Solr/"

# 設定 Solr 監聽 Port default 8983
SOLR_PORT="8983"

# 反註解
SOLR_OPTS="$SOLR_OPTS -Dlog4j2.formatMsgNoLookups=true"

# 加在最後一行
export SOLR_OPTS="$SOLR_OPTS -Dsolr.allow.unsafe.resourceloading=true"
```

查看所有最大限制 (可以略過)
ulimit -a
修改open files
ulimit -n 65000
修改 max user processes
ulimit -u 65000

solr因安全性無法以root啟動
要用root啟動時需要添加 --force
./solr start --force
./solr status

創建core
./solr create -c core
./solr restart --force
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
![Pasted image_d.png](/img/user/Assets/Img/Pasted%20image_d.png)
[為 MariaDB 配置遠端存取權限](https://blog.csdn.net/lanuage/article/details/78846766)
%代表所有IP，password表示將用這個密碼登入root用戶

> [!tip]
> `*.*` 記得別漏掉，markdown **是斜體

任何連線
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'password' WITH GRANT OPTION;`

指定IP連線
AP1
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.182.149' IDENTIFIED BY 'password' WITH GRANT OPTION;`
AP1 本機 (mariadb連線用)
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'password' WITH GRANT OPTION;`
本機
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.182.1' IDENTIFIED BY 'password' WITH GRANT OPTION;`

刪除使用者
`DROP USER'root'@'192.168.182.1';`

保存更改
`FLUSH PRIVILEGES;`

`select user,host from mysql.user;`
`exit`
![Pasted image_z.png](/img/user/Assets/Img/Pasted%20image_z.png)

資料庫設定
SmartKMS 9連接資料庫的設定檔
vim /SRM/SmartKMS/Server/cfg/ds-config.xml

> [!error]
> 試著本機連線
> mysql -u root -p -h 127.0.0.1 -D skms
> mariadb設定檔使用mysql連線

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
dJUeRci1JDnWPivm4HZCS6/wCIYVdtkuZO6V8TCQZsdFpTKE1JHXXtGfQkEpek4VKOE5LNEFXfL11yUEOREUFle4oxFxs2kaah+333bV2GnGWs0qwIkg3DG6Ib90HYoKEogCYdGJ6akZPokqluZ78smwEvtwb2vpiYlDxEyMxBR6bvrJ2hmcwn52Pj0iqXBNXSfDT8uAZxa9RE0jXnzt8BvE0GZQg15ZcvQP9ZR5rVOHRGQTZidggg52sLOmsKcleE15c4YZF0u9dIgjFceLw/RwjVYGINJe42F1lvJX+diFE+kOq9r/3tRnQu94eCgk+FrKqakg/Wy+MaUqZHzv4kdqSHf8kpzCw4pBHBul7NM9n8xXapBLAhBuS2/ZANzWNCUW7MaVmZj3V/3TGebHVCeWfJlzew0Tdyz5oayx0OaDC4gyAkn8T64AHTH27Y9TtukQGA23brye+Qz9RcJqz6dns5YnQfZMKWPIW5lRkuxXAZvYZP5kv8YXMRi44aKY
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

執行tomcat跟solr
cd /SRM/SmartKMS
./solr-9.7.0/bin/solr start --force
./tbin/tStartup.sh

http://localhost:8080/SmartKMS/setup/CompanyList.action

KmsUser_Role