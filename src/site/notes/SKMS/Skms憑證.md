---
{"dg-publish":true,"permalink":"/skms/skms/"}
---


###### 1. 執行下列命令產生Keystore file

[ Windows ]

%JDK%\bin\目錄下，輸入 keytool -genkey -alias <span style="color: red">keyname</span> -keyalg RSA -keysize 2048 -keystore <span style="color: red">C:\mykeystore.jks</span>

C:\Program Files (x86)\Eclipse Adoptium\jdk-11.0.25.9-hotspot\bin

keytool -genkey -alias <span style="color: red">skmstest</span> -keyalg RSA -keysize 2048 -keystore <span style="color: red">C:\key\mykeystore.jks</span>
![Pasted image 20250203143648.png](/img/user/img/Pasted%20image%2020250203143648.png)
password
![Pasted image 20250203144201.png](/img/user/img/Pasted%20image%2020250203144201.png)
![Pasted image 20250203144647.png](/img/user/img/Pasted%20image%2020250203144647.png)
![Pasted image 20250203144856.png](/img/user/img/Pasted%20image%2020250203144856.png)
![Pasted image 20250203144916.png](/img/user/img/Pasted%20image%2020250203144916.png)
![Pasted image 20250203144926.png](/img/user/img/Pasted%20image%2020250203144926.png)
![Pasted image 20250203144935.png](/img/user/img/Pasted%20image%2020250203144935.png)
![Pasted image 20250203144944.png](/img/user/img/Pasted%20image%2020250203144944.png)

![Pasted image 20250203145011.png](/img/user/img/Pasted%20image%2020250203145011.png)
2.產生憑證請求檔CSR

在%JSK%\bin\目錄下，輸入

keytool -certreq -alias <span style="color: red">keyname</span> -file <span style="color: red">c:\mycsr.txt</span> -keystore <span style="color: red">c:\mykeystore.jks</span>

C:\Program Files (x86)\Eclipse Adoptium\jdk-11.0.25.9-hotspot\bin

keytool -certreq -alias <span style="color: red">skmstest</span> -file <span style="color: red">c:\key\mycsr.txt</span> -keystore <span style="color: red">c:\key\mykeystore.jks</span>

![Pasted image 20250203145322.png](/img/user/img/Pasted%20image%2020250203145322.png)
password

![Pasted image 20250203145337.png](/img/user/img/Pasted%20image%2020250203145337.png)

取消註解
![Pasted image 20250203145352.png](/img/user/img/Pasted%20image%2020250203145352.png)
```xml
     <Connector
           protocol="org.apache.coyote.http11.Http11NioProtocol"
           port="8443" maxThreads="200"
           maxParameterCount="1000"
           scheme="https" secure="true" SSLEnabled="true"
           keystoreFile="C:\Tomcat9.0\conf\cert\mykeystore.jks" keystorePass="password"
           clientAuth="false" sslProtocol="TLS"/>
```