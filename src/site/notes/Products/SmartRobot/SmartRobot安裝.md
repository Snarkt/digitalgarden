---
{"dg-publish":true,"permalink":"/products/smart-robot/smart-robot/"}
---


此篇使用SmartRobot-6.0.0

整篇主要參考
[SmartRobot安裝手順(AP+DB+WEB，含系統參數設定)](http://ikm.intumit.com/SmartKMS/doc/read.action?binderId=84935)   
![[Pasted image 20250221101808.png\|Pasted image 20250221101808.png]]
   
安裝VMware Workstation 17 (需要註冊，照填台灣地址即可)   
跟繁體包 (預設有簡中)
**[VMware Workstation Pro 17 專業虛擬機軟體的繁體中文化](https://yourui0604.blogspot.com/2024/09/vmware-workstation-tw-locale-change.html)**   
"C:\Program Files (x86)\VMware\VMware Workstation\vmware.exe"<mark style="background-color: #fff88f; color: black"> </mark>—locale zh_TW   
![Pasted image_s.png](/img/user/img/Pasted%20image_s.png)
   
安裝CentOS最新版本
CentOS 7 或 Stream 9
目前是安裝Stream 9
[安装CentOS Stream 10版本的Linux虚拟机-CSDN博客](https://blog.csdn.net/soso678/article/details/145009527)   
記得 CD/DVD 設定 ISO 檔案   
C:\Program Files (x86)\VMware\VMware Workstation\.iso   
![Pasted image_7.png](/img/user/img/Pasted%20image_7.png)    
[CentOS 7.0 不完全安裝手冊 - Step 8 設定「軟體選擇」 | IT 技術家](https://blog.itist.tw/2014/08/centos7-install08.html)   
選Server或是Server with GUI
設置root

> [!danger] 
> 勾選 <span style="color: crimson">允許ssh登入</span>   
用putty ssh 22port連線   
   
[Putty — 登陸後設定標題列顯示IP](https://topic.alibabacloud.com/tc/a/putty-set-the-title-bar-to-display-ip-addresses-after-login_8_8_32075606.html#:~:text=%E6%8A%8A%E4%B8%8B%E9%9D%A2%E7%9A%84%E5%B9%BE%E8%A1%8C%E6%8C%87%E4%BB%A4%E7%A2%BC%E8%BF%BD%E5%8A%A0%E5%88%B0%20~/.bashrc%20(%E5%B0%8D%E6%87%89%20root%20%E4%BD%BF%E7%94%A8%E8%80%85%EF%BC%8C%E4%B9%9F%E5%B0%B1%E6%98%AF%20/root/.bashrc%20%E6%AA%94%E6%A1%88)%E8%87%AA%E5%8B%95%E6%8C%87%E4%BB%A4%E7%A2%BC%E7%9A%84%E6%9C%80%E5%BE%8C%E3%80%82%20%23,non-Linux%20tty%20login%20by%20ssh.%20%E9%87%8D%E6%96%B0%E7%99%BB%E9%99%B8%E8%A9%B2%E4%BC%BA%E6%9C%8D%E5%99%A8%20(%E9%82%84%E6%98%AF%E7%94%A8%E4%B9%8B%E5%89%8D%E7%9A%84%E9%82%A3%E5%80%8B%E4%BD%BF%E7%94%A8%E8%80%85%E7%99%BB%E9%99%B8)%EF%BC%8C%E4%BD%A0%E6%9C%83%E7%99%BC%E7%8F%BE%E5%B7%A6%E4%B8%8A%E6%96%B9%E5%8F%88%E5%8F%AF%E4%BB%A5%E7%9C%8B%E5%88%B0%E4%BC%BA%E6%9C%8D%E5%99%A8%E7%9A%84%20IP%E4%BA%86%E3%80%82)

`vim  ~/.bashrc`   
```js
# Auto add env parameter $PROMPT_COMMAND when use non-Linux tty login by ssh.
if [ "$SSH_CONNECTION" != '' -a "$TERM" != 'linux' ]; then
declare -a HOSTIP
HOSTIP=`echo $SSH_CONNECTION |awk '{print $3}'`
export PROMPT_COMMAND='echo -ne "\\033]0;${USER}@$HOSTIP:[${HOSTNAME%%.*}]:${PWD/#$HOME/~} \\007"'
fi
##
```

`vi /etc/sysconfig/selinux`
> [!warning] 
> SELINUX=disabled
> 關閉防火牆 disable<span style="color: crimson">d</span>

`SELINUX=disabled`
`systemctl disable firewalld.service`   
![Pasted image_u.png](/img/user/img/Pasted%20image_u.png)  
重新啟動，ssh會需要重連   
`reboot`

winscp上傳檔案   
路徑在 `cd /`   
`mkdir -p /SRM/SmartRobot`   
![Pasted image_o.png](/img/user/img/Pasted%20image_o.png)    

安裝unzip解壓縮檔案
`sudo yum install unzip`   
   
`unzip kernel.zip`
`rm -rf __MACOSX/`

解壓縮 tomcat
`tar -xzvf apache-tomcat-10.1.34.tar.gz`   
`mv apache-tomcat-10.1.34 tomcat9`   

解壓縮 jdk
	1. jdk
	`tar -xzvf openlogic-openjdk-8u442-b06-linux-x64.tar.gz`
	`mv openlogic-openjdk-8u442-b06-linux-x64 openjdk`   
	2. jre
	`tar -xzvf openlogic-openjdk-jre-8u432-b06-linux-x64.tar.gz`
	`mv openlogic-openjdk-jre-8u432-b06-linux-x64 openjdk/jre`   

解壓縮 war 到 tomcat 底下
mv SmartRobot-7.3.0-202412tw.war tomcat9/webapps/
unzip SmartRobot-7.3.0-202412tw.war -d wise
rm SmartRobot-7.3.0-202412tw.war
> [!tip]
解壓縮錯的話，指定檔案以外全部刪除   
`rm -rf !(wise.war)`

增加使用者   
`adduser helpdesk`   
`passwd helpdesk`   
修改使用者密碼有要求6位數英數組合   
[修改Linux密碼提示it is based on a dictionary word怎麼辦？](https://www.unixlinux.online/unixlinux/linuxgl/linuxwh/201703/74613.html)   
但這邊是使用root帳號可以強制更改   
所以密碼同: helpdesk   
![Pasted image_0.png](/img/user/img/Pasted%20image_0.png)    
   
##### 安裝MariaDB (可安裝在AP1或是另開一台機器，這邊裝在AP1)   

`yum install mariadb-server.x86_64`   
`systemctl start mariadb.service`   
`systemctl enable mariadb`
`systemctl status mariadb.service`

```
#密碼 password
mysql -u root -p
Enter password:

#建立資料庫
create database WiSe_Robot default character set utf8mb4 default collate utf8mb4_general_ci;
show databases;

#刪除資料庫
drop database wise_robot
```

> [!tip]
> 無法透過hibernate創建結構時可能需要用DB工具重新建立   

設定DB遠端連線   
加密密碼   
set password=PASSWORD('<span style="color: crimson">password</span>');
   
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
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.182.137' IDENTIFIED BY 'password' WITH GRANT OPTION;`   
AP2   
`GRANT ALL PRIVILEGES ON *.* TO 'root'@'192.168.182.138' IDENTIFIED BY 'password' WITH GRANT OPTION;`   
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
   
修改DB設定 (AP1與AP2都要修改連線到指定DB)   
`vim /SRM/SmartRobot/kernel/etc/hibernate.cfg.xml`   

沒有檔案的話先cp一個
cp hibernate.cfg.xml.sample hibernate.cfg.xml   

註解掉 MySql setting
反註解 MariaDB setting  
設定DB的IP與密碼   

> [!warning] 
> 初次執行時需要將update更改成 <span style="color: crimson">create</span>   
(設定完執行SmartRobot時vm會變很卡，網頁加載也同樣變超卡)   

```
    <!-- MariaDB setting
    -->
    <property name="dialect">org.hibernate.dialect.MariaDBDialect</property>
    <property name="connection.driver_class">org.mariadb.jdbc.Driver</property>
    <property name="connection.url">jdbc:mariadb://192.168.182.137:3306/WiSe_Robot?autoCommit=true&amp;autoReconnect=true&amp;useUnicode=true&amp;characterEncoding=UTF8</property>
    <property name="connection.username">root</property>
    <property name="connection.password">password</property>
    <property name="hibernate.hbm2ddl.auto">create</property>
```

![Pasted image_p.png](/img/user/img/Pasted%20image_p.png)

##### 記憶體設定

[jvm调优技巧 - 内存抖动 、Xms和Xmx参数为什么要设置相同的值](https://blog.csdn.net/qq_27184497/article/details/119052930)   

> [!info]
> - xms參數：用於設定JVM啟動時堆記憶體的初始大小（最小值）。
> - xmx參數：用來設定JVM堆記憶體的最大大小。   
   這兩個參數在JVM啟動時會對堆記憶體進行初始化與限制
   直接影響Java應用的記憶體使用量。   
   
`cat /proc/meminfo`   
查看總記憶體   
總記憶體為1777408 KB   
從kb換算成mb   
1777408/1024=1735.75   
設定佔用90%   
1735.75x90%=1562.175 MB
-Xmx1562M
![Pasted image_17.png](/img/user/img/Pasted%20image_17.png)

此圖為 jStartup.bat的設定，tStartup.sh請參考下方SmartRobot安裝手順AP Server

> [!info]
> jStartup.bat為先前jetty的程式啟動bat檔
> tStartup.sh為現在tomcat的程式啟動sh檔

![Pasted image_g.png](/img/user/img/Pasted%20image_g.png)    
   
##### 設定Master / Slave (2 AP)   

有兩台AP時需要設定   
`vim /SRM/SmartRobot/kernel/etc/hazelcast.xml`   
錯誤退出刪除暫存   
`ls -a`   
`rm .hazelcast.xml.swp`

```
1. 設定hazelcast server使用的port
	<port auto-increment="true" port-count="100">5701</port>  
    
2. 設定hazelcast所有member的ip**
	<tcp-ip enabled="true">
		刪除 <interface>127.0.0.1</interface>
		<member-list>
		<members>192.168.182.137,127.0.0.1</members>
	    </member-list>  
    
```
AP Master   
![Pasted image_w.png](/img/user/img/Pasted%20image_w.png)    
AP Slave   
![Pasted image_21.png](/img/user/img/Pasted%20image_21.png)
**設定索引同步** 
`vim /SRM/SmartRobot/kernel/cores/core0/conf/solrconfig.xml`

> [!warning] 
 若為AP1者，將master區塊反註解，其餘註解之。
 若為AP2者，將slave區塊反註解，其餘註解之；
Slave內另需標註Master IP與Port，${solr.core.name}更換成對應的core 例如core0 (預設)。

```
<requestHandler name="/replication" class="solr.ReplicationHandler" >
     <!-- LB mode settings，目前先採用雙主機模式，
          未來超過兩台用 SolrCloud 模式更合適
          <lst name="master">
            <str name="enable">true</str>
            <str name="replicateAfter">commit</str>
            <str name="confFiles">schema.xml,stopwords.txt</str>
          </lst>
          <lst name="slave">
            <str name="enable">true</str>
            <str name="masterUrl">http://[master_IP]:8080/wise/wiseadm/${solr.core.name}</str>
            <str name="pollInterval">00:00:10</str>
            <str name="compression">internal</str>
            <str name="httpConnTimeout">5000</str>
            <str name="httpReadTimeout">10000</str>
          </lst>
      -->
```

![Pasted image_19.png](/img/user/img/Pasted%20image_19.png)    
![Pasted image_23.png](/img/user/img/Pasted%20image_23.png)    
   
##### SmartRobot安裝手順AP Server   

(兩台AP都需要設定，可以用winscp複製sh檔，但E. F.跟環境變數還是要設定)   

啟動服務應該修改為Tomcat
[SmartRobot (v7.1.0) 安裝機器人說明.docx](http://ikm.intumit.com/SmartKMS/doc/read.action?binderId=288137)

C.將wise.war放置於/SRM/SmartRobot/tomcat9/webapps 底下   
`cd /SRM/SmartRobot/`   
-d 解壓縮到指令目錄下，沒有的話會創建   
`unzip SmartRobot-7.3.0-202412tw.war -d /SRM/SmartRobot/tomcat9/webapps/wise`   

> [!tip]
解壓縮錯的話，指定檔案以外全部刪除   
`rm -rf !(wise.war)`   
   
移動檔案到指定目錄   
`cd /SRM/SmartRobot`   
`mkdir bin`   
`mv tShutdown.sh tStartup.sh tViewLog.sh bin/`   
   
D.設定以下檔案   
DB_TYPE根據環境設置/MYSQL/MSSQL   
`cd /SRM/SmartRobot`   
啟動服務   
`./bin/tStartup.sh`   
關閉服務   
`./bin/tShutdown.sh`   
檢視服務   
`./bin/tViewLog.sh`   
![Pasted image_14.png](/img/user/img/Pasted%20image_14.png)    
   
更改 /SRM/ 權限   
`chmod 755 /SRM/ -R`

1.`vim ./bin/tStartup.sh`   
修改SRBT_HOME為SmartRobot目錄   
SRBT_HOME=/SRM/SmartRobot/ 

###### 方法一 將JAVA跟CATALINA都加進sh裡面
> [!bug]
> export裡面請不要換行，會影響到轉真人

> [!tip]
Windows編輯過檔案可能導致sh執行時：指令找不到
可以使用dos2unix，或是手動修改換行符號

```js
#!/bin/bash
export SRBT_HOME=/SRM/SmartRobot
export JAVA_HOME=/SRM/SmartRobot/openjdk
export JAVA=$JAVA_HOME/bin/java
export JRE_HOME=$JAVA_HOME/jre
export PATH=$JAVA_HOME/bin:$PATH
export CATALINA_HOME=/SRM/SmartRobot/tomcat9
export CATALINA_PID=/SRM/SmartRobot/tomcat9/bin/catalina.pid
export CATALINA_OPTS="-Xms512M -Xmx1562M"
export JAVA_OPTS="${JAVA_OPTS} \
-Xmx1562M -Xms512M -XX:MetaspaceSize=256M \
-XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:+DisableExplicitGC \
-Djava.util.logging.config.file=${CATALINA_HOME}/conf/logging.properties"

#添加catalina.pid檔案
if [ -f "${CATALINA_PID}" ]; then
    echo "CATALINA_PID exist: [${CATALINA_PID}]"
else
    echo "CATALINA_PID does not exist. Creating new file"
    touch $CATALINA_PID
fi
```

以下JAVA_OPTS GC參數為JDK8以前
```
-XX:-UseGCOver headLimit \
-XX:+UseConcMarkSweepGC \
-XX:+CMSIncrementalMode \
-XX:+DisableExplicitGC \
-XX:CMSInitiatingOccupancyFraction=80"
```

###### 方法二 JAVA加入環境變數即可 (可查看java -version) 
<span style="color: crimson">不推薦</span> 如果後續有第二個tomcat要再改回sh
JAVA=$JAVA_HOME/bin/java   
```js
加入JAVA_PATH
vim ~/.bashrc

export JAVA_HOME=/SRM/SmartRobot/openjdk
export JRE_HOME=$JAVA_HOME/jre
export PATH=$JAVA_HOME/bin:$PATH

source ~/.bashrc

java -version
```

![Pasted image_3.png](/img/user/img/Pasted%20image_3.png)    

修改webapps_dir路徑 (根據自身搭建環境修改)   
if [ -z "${WEBAPPS_DIR+xxx}" ]; then
export WEBAPPS_DIR=$SRBT_HOME/<span style="color: crimson">tomcat9</span>/webapps`

最後一行修改sh的路徑   
`${CATALINA_HOME}/bin/startup.sh`

###### 2.`vim ./bin/tShutdown.sh`

```js
#!/bin/bash
export JAVA_HOME=/SRM/SmartRobot/openjdk
export JAVA=${JAVA_HOME}/bin/java
export CATALINA_HOME=/SRM/SmartRobot/tomcat9
export CATALINA_PID=${CATALINA_HOME}/bin/catalina.pid
export SRBT_HOME=/SRM/SmartRobot
export TOMCAT_HOME=${SRBT_HOME}/tomcat9

pushd ${TOMCAT_HOME}/bin/ &>/dev/null
./catalina.sh stop 10 -force
popd &>/dev/null

${CATALINA_HOME}/bin/shutdown.sh
```

> [!tip]
查看tomcat的pid，或是java的pid   
`ps aux | grep tomcat`   
`ps -ef | grep tomcat`  

執行此行如果pid沒有刪除   
`kill -9 [PID]`  

-Xmx1562M參考 記憶體設定   
```js
加入CATALINA_PATH
vim ~/.bashrc

export CATALINA_HOME=/SRM/SmartRobot/tomcat9
export CATALINA_BASE=/SRM/SmartRobot/tomcat9
export CATALINA_OPTS="-Xms512M -Xmx1562M"

source ~/.bashrc
```

###### 3.`vim ./bin/tViewLog.sh`   
注意檔案路徑
直接實時查看log tail -f
```js
#!/bin/bash
export SRBT_HOME=/SRM/SmartRobot
tail -f ${SRBT_HOME}/tomcat9/logs/catalina.out
```

E.複製.sample更名，並根據環境使用相對應的SQL設定
`cd /SRM/SmartRobot/kernel/etc`   
`cp hibernate.cfg.xml.sample hibernate.cfg.xml`   
更改 hibernate.cfg.xml   

F.複製.sample更名   
`cd /SRM/SmartRobot/kernel/etc`   
`cp application.properties.sample application.properties`

文字客服轉真人的檔案需要最新的，將先前丟在SmartRobot檔案蓋過去
`cp /SRM/SmartRobot/application.properties /SRM/SmartRobot/kernel/etc`
cp：是否覆蓋 '/SRM/SmartRobot/kernel/etc/application.properties'？ y

修改tomcat port號   
[Tomcat端口配置详细_tomcat修改端口-CSDN博客](https://blog.csdn.net/weixin_69553582/article/details/124893517)   
`vim /SRM/SmartRobot/tomcat9/conf/server.xml`   
```js
<Connector port="8081" protocol="HTTP/1.1"
           URIEncoding="UTF-8"
           connectionTimeout="20000"
           redirectPort="8443"/>
```
砍掉先前tomcat的port 8080   
`lsof -i :8080`   
`netstat -tuln | grep 8080`   
`kill -9 [PID]`   
 
> [!info] 
更改 /SRM/ 權限   
`chmod 755 /SRM/ -R`

##### 執行SmartRobot
`cd /SRM/SmartRobot`
`./bin/tStartup.sh` 
![Pasted image_15.png](/img/user/img/Pasted%20image_15.png)    
查看tomcat log服務是否正常   
`less /SRM/SmartRobot/tomcat9/logs/catalina.out`
![Pasted image_2.png](/img/user/img/Pasted%20image_2.png)    
![Pasted image_f.png](/img/user/img/Pasted%20image_f.png)    
   
全部步驟順利的話~成功啟動   
[http://192.168.182.137:8081/wise/wiseadm/login.jsp](http://192.168.182.137:8081/wise/wiseadm/login.jsp)   
[http://192.168.182.137:8081/wise/wiseadm](http://192.168.182.137:8081/wise/wiseadm)   
![Pasted image_q.png](/img/user/img/Pasted%20image_q.png)    


> [!danger]
初次執行完要將create更改成 <span style="color: crimson">update</span>，否則資料庫會重建
`vim /SRM/SmartRobot/kernel/etc/hibernate.cfg.xml`
`<property name="hibernate.hbm2ddl.auto">update</property>`

登入帳號密碼，驚嘆號記得打   
admin   
intumit!!   
![Pasted image_k.png](/img/user/img/Pasted%20image_k.png)    
依照對應的192.168.182.137:8081 來源core建立公司   
![Pasted image_k.png](/img/user/img/Pasted%20image_k.png)    
![Pasted image_j.png](/img/user/img/Pasted%20image_j.png)
192.168.182.137:8081 預設會有core0 

> [!error] 
~~怕跟129搞混先刪除了~~   
錯誤示範!! 應該保留core0，後續會需要索引同步   
最後是使用core8，兩邊都不要亂刪除!

![Pasted image_y.png](/img/user/img/Pasted%20image_y.png)

> [!info]
> Contents
公司名稱: test   
CoreName: core0   
索引使用core0不需要帶其他參數   
DefaultLocale: zh_TW   
備註: CTC Test   
![Pasted image_4.png](/img/user/img/Pasted%20image_4.png)    
功能設定區塊   
啟用上下文: On   
啟用文字客服: Off   
系統參數設定區塊   
是否啟用: On   
啟用一般用戶前台: On   
是否開啟偵錯: On   
![Pasted image_8.png](/img/user/img/Pasted%20image_8.png)    
點擊: Channel Management   
添加多圖文設定   
格式: RICH_TEXT   
名稱: default   
代號: web   
![Pasted image_5.png](/img/user/img/Pasted%20image_5.png)    

成功開啟robot內建的網頁   
[http://192.168.182.137:8081/wise/webchat/default/?t=oC56ls9rDQCvE6pSN%2B9i0w%3D%3D](http://192.168.182.137:8081/wise/webchat/default/?t=oC56ls9rDQCvE6pSN+9i0w==)   
![Pasted image_h.png](/img/user/img/Pasted%20image_h.png)    
開啟一般問答，先點擊變身   
![Pasted image_x.png](/img/user/img/Pasted%20image_x.png)
需要另外設定使用者管理，即可使用上方的一般問答
![Pasted image 20250206092752.png](/img/user/img/Pasted%20image%2020250206092752.png)

![Pasted image_1.png](/img/user/img/Pasted%20image_1.png)    

> [!tip]
往下滑就能新增問答了   
![Pasted image_11.png](/img/user/img/Pasted%20image_11.png)

問題名稱   
![Pasted image.png](/img/user/img/Pasted%20image.png)    
問題回答   
![Pasted image_6.png](/img/user/img/Pasted%20image_6.png)    
問題關鍵字   
![Pasted image_18.png](/img/user/img/Pasted%20image_18.png)
成功回覆問題 (需要先在前台回覆，後面訊息框才會更新)   
![Pasted image_16.png](/img/user/img/Pasted%20image_16.png)    
![Pasted image_l.png](/img/user/img/Pasted%20image_l.png)    
設定Master / Slave (2 AP) 成功畫面如下   
![Pasted image_t.png](/img/user/img/Pasted%20image_t.png)    
![Pasted image_r.png](/img/user/img/Pasted%20image_r.png)    

##### 
> [!question] 
制式文案修改會產生亂碼，參考[[Products/SmartRobot/重新匯入制式文案\|重新匯入制式文案]]