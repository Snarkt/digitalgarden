---
{"dg-publish":true,"permalink":"/skms/smart-kms/"}
---


教育訓練說明

license每個客戶都不一定
kms安控是用?
uuid第一次啟動會產生，跟使用者登入有關係，不能隨意換
int.pw預設帳號隨機產生，本機設定 
tomcat設定

整篇主要參考

[SmartKMS 9 build 260j.1安裝手冊_20240612.docx - Google 文件](https://docs.google.com/document/d/1M28mVjX1tq1-KhHG0q-LlSj3Nz2yIprj/edit)

安裝SmartKMS注意事項

1.tomcat
安裝完沒辦法進入目錄
大概率是沒有權限進去
右鍵內容修改權限
或是可以創個資料夾

```
-XX:MaxMetaspaceSize=256M
-XX:MetaspaceSize=256M
-Xlog:gc*:file=C:\SmartKMS\Server\logs\gc-%t.log:tags,uptime,time,level:filecount=10,filesize=10M
-XX:+UseStringDeduplication
-verbose:gc
-XX:+UseCompressedOops #這段用了會無法啟動tomcat
-XX:+DisableExplicitGC
```
![Pasted image 20250203121738.png](/img/user/img/Pasted%20image%2020250203121738.png)

2.用指令開啟solr solr網頁一直開不了最後是用solr9.7.0 網站 [http://127.0.0.1:8983/solr](http://127.0.0.1:8983/solr)

路徑 C:\solr-9.7.0\bin 下cmd
停掉之前的solr
`solr.cmd stop -all`

用指令直接執行
`solr solr.cmd start -m 1G -f -s C:\\SmartKMS\\Solr -p 8983`
![Pasted image 20250203121810.png](/img/user/img/Pasted%20image%2020250203121810.png)

3.mariadb語法 路徑 C:\Program Files\MariaDB 10.5\bin 下cmd
```
root password
mysql -u root -p
create database skms;
exit

#匯入mariadb
mysql -u root -p skms < C:\SmartKMS\dbs\MariaDB\skms.sql

#顯示資料表結構語法
describe skms.propertytype;
```
``

windows cmd裡下

`net stop mariadb`
`net start mariadb`
`net restart mariadb`

4.版本更新位子
SKMS 258>260 整包解壓到C並改名SmartKMS
要將SmartKMS.war丟到Tomcat9.0\webapps解壓縮
資料庫要重灌

JDK11.0.25切JDK11.0.13 無法開啟tomcat又切回去了
C:\Program Files (x86)\Eclipse Adoptium

jar檔更換
2.7.12 > mariadb-java-client-3.5.1.jar 
C:\Tomcat9.0\webapps\SmartKMS\WEB-INF\lib

5.258.7資料庫修改 (升級到260都不會有驚嘆號問題)

1.首頁驚嘆號問題
修改my.ini，型態改成utf8mb4
[mysqld] 
lower_case_table_names=1 (大小寫區別，1為false 2為true) character-set-server=utf8mb4
[client] 
default-character-set=utf8mb4

資料表dashboard
1,-1,1,home,null 
儲存完修改成 1,1,1,首頁,null 
語法參考 
`insert into Dashboard(companyId, isPublic, name, ownerId) value (1, 1, '首頁', null);`

2.專家-格式設定驚嘆號問題
資料表formtype
1,1,expert
語法參考
`insert into FormType (id, companyId, systemKey) value (1, 1, 'expert');`