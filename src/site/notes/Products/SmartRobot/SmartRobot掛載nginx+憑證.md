---
{"dg-publish":true,"permalink":"/products/smart-robot/smart-robot-nginx/"}
---


[nginx中的正则表达式，location路径匹配规则和优先级 - 熊仔其人 - 博客园](https://www.cnblogs.com/xiongzaiqiren/p/16968651.html)   
   
```
( location = ) > ( location 完整路徑 ) > ( location ^~ 否定正規 ) > ( location ~* 正規順序 ) > ( location ~ 區分大小寫正規順序 ) > ( location 部分起始路徑 ) > ( / )
```
   
憑證記得放在 /etc/nginx/ 底下，這邊創建 cert/   
```
server {
	#listen 80;
	listen 443 ssl;
	server_name 192.168.182.129;
	ssl_certificate cert/mycrt.crt;
	ssl_certificate_key cert/mykey.key;
	index index.jsp;

	#代理到 SmartRobot 在 tomcat 的路徑
	location / {
		proxy_pass http://192.168.182.129:8023/wise/wiseadm/;
	}
	#代理到 tomcat wise 轉發
	location /wise/ {
		proxy_pass http://192.168.182.129:8023/wise/;
	}
	#靜態文件載入 (優先)
	#location ^~ /(script|styles|img|wiseadm)/ {
	#	root /SRM/SmartRobot/tomcat9/webapps/wise/;
	#	try_files $uri =404;
	}
}
```
   
%JDK%\bin\目錄下，使用 keytool將先前skms產的憑證.jks轉.p12   
-srcalias 為先前創建的別名，可以去掉   
`keytool -importkeystore -srckeystore C:\key\mykeystore.jks -destkeystore C:\key\mykeystore.p12 -srcalias skmstest`   
![Pasted image_v.png](/img/user/Assets/Img/Pasted%20image_v.png)
   
[p12证书转pem、cert、key_p12转pem-CSDN博客](https://blog.csdn.net/weixin_45191791/article/details/136226823)   
再來用openssl將p12拆成key與crt   
轉crt   
`openssl pkcs12 -in mykeystore.p12 -nokeys -out mycrt.crt`   
轉key   
`openssl pkcs12 -in mykeystore.p12 -nocerts -nodes -out mykey.key`   
   
![Pasted image_9.png](/img/user/Assets/Img/Pasted%20image_9.png)    
  
