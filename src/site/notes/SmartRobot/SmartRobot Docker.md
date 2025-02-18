---
{"dg-publish":true,"permalink":"/smart-robot/smart-robot-docker/"}
---


> [!tip] 修改權限
chmod 755 /SRM/ -R

/SRM/PVC/poc-ap1
##### installer.sh
修改root的判斷式
```
  # Make sure using [root] account for implementation.

  if [ $(id -u) -ne 0 ]; then
    Echo_Msg_Warn "Please using [root] account for implementation."; echo
    exit
  else
    Echo_Msg_Info "Check account was [root] OK!"; echo
  fi
}
```

修改完再tar回去
tar-czvf SmartRobot-AOAI-POC-Install_v2.3-4.tar.gz SmartRobot-AOAI-POC-Install_v2.3-4/

> [!info] installer.sh有支援的OS
Rocky-Linux-8
Rocky-Linux-9
Red Hat Enterprise Linux 8
Red Hat Enterprise Linux 9 >此篇安裝red hat 9.5
ubuntu 20.04
ubuntu 22.04

```
Check_is_support_OS() {

  # Reading OS info from os-release

  . /etc/os-release

  if [ "${ID}" == "rocky" ] && [ "${ROCKY_SUPPORT_PRODUCT}" == "Rocky-Linux-8" ]; then

    Echo_Msg_Info "Found supported OS, Install docker-ce for ${PRETTY_NAME}"; echo

    Docker_Install_Path=${CurrDir}/docker-ce/rhel8

    Tool_Install_Path=${CurrDir}/tool/rhel8

  elif [ "${ID}" == "rocky" ] && [ "${ROCKY_SUPPORT_PRODUCT}" == "Rocky-Linux-9" ]; then

    Echo_Msg_Info "Found supported OS, Install docker-ce for ${PRETTY_NAME}"; echo

    Docker_Install_Path=${CurrDir}/docker-ce/rhel9

    Tool_Install_Path=${CurrDir}/tool/rhel9

  elif [ "${ID}" == "rhel" ] && [ "${REDHAT_BUGZILLA_PRODUCT}" == "Red Hat Enterprise Linux 8" ]; then

    Echo_Msg_Info "Found supported OS, Install docker-ce for ${PRETTY_NAME}"; echo

    Docker_Install_Path=${CurrDir}/docker-ce/rhel8

    Tool_Install_Path=${CurrDir}/tool/rhel8

  elif [ "${ID}" == "rhel" ] && [ "${REDHAT_BUGZILLA_PRODUCT}" == "Red Hat Enterprise Linux 9" ]; then

    Echo_Msg_Info "Found supported OS, Install docker-ce for ${PRETTY_NAME}"; echo

    Docker_Install_Path=${CurrDir}/docker-ce/rhel9

    Tool_Install_Path=${CurrDir}/tool/rhel9

  elif [ "${ID}" == "ubuntu" ] && [ "${VERSION_ID}" == "20.04" ]; then

    Echo_Msg_Info "Found supported OS, Install docker-ce for ${PRETTY_NAME}"; echo

    Docker_Install_Path=${CurrDir}/docker-ce/focal

    Tool_Install_Path=${CurrDir}/tool/focal

  elif [ "${ID}" == "ubuntu" ] && [ "${VERSION_ID}" == "22.04" ]; then

    Echo_Msg_Info "Found supported OS, Install docker-ce for ${PRETTY_NAME}"; echo

    Docker_Install_Path=${CurrDir}/docker-ce/jammy

    Tool_Install_Path=${CurrDir}/tool/jammy

  else

    Echo_Msg_Warn "No supported OS version was found, Stop implementation..."; echo

    exit

  fi

}
```

修改完installer.sh後正常安裝
Stage 1~3
![Pasted image 20250212143911.png](/img/user/img/Pasted%20image%2020250212143911.png)

Stage 4、5
![Pasted image 20250212143929.png](/img/user/img/Pasted%20image%2020250212143929.png)

Stage 6
![Pasted image 20250212145102.png](/img/user/img/Pasted%20image%2020250212145102.png)

Stage 7
Docker Compose (`docker-compose.yml`) 版本 1.27 以後`version` 屬性可以去除掉，並且 Docker Compose 會忽略它。 (不影響就保留起來)
![Pasted image 20250212144845.png](/img/user/img/Pasted%20image%2020250212144845.png)

Stage 8
![Pasted image 20250212145223.png](/img/user/img/Pasted%20image%2020250212145223.png)

yaml位置
/SRM/PVC/poc-ap1/docker-compose.yml

cd /SRM/PVC/poc-ap1/
docker --version
docker compose version
![Pasted image 20250212160503.png](/img/user/img/Pasted%20image%2020250212160503.png)

docker compose up -d
![Pasted image 20250212160622.png](/img/user/img/Pasted%20image%2020250212160622.png)

docker ps -a
![Pasted image 20250212161019.png](/img/user/img/Pasted%20image%2020250212161019.png)

##### poc-db1-mariadb

docker logs feb52a5c88a9
docker logs poc-db1-mariadb
密碼在log裡面
```
[i] mysqld not found, creating....
[i] MySQL data directory not found, creating initial DBs
[i] Creating database: WiSe
[i] with character set [utf8mb4] and collation [utf8mb4_general_ci]
[i] Creating user: intumit with password 5i6UbkiqjH1q
2025-02-12  6:39:18 0 [Note] Starting MariaDB 10.11.8-MariaDB source revision 3a069644682e336e445039e48baae9693f9a08ee as process 88
```

查看log有--skip-name-resolve mode，但是到容器內查看並沒有修改到
```
2025-02-12  6:39:18 1 [Warning] 'user' entry '@poc-db1-mariadb' ignored in --skip-name-resolve mode.
2025-02-12  6:39:18 1 [Warning] 'proxies_priv' entry '@% mysql@poc-db1-mariadb' ignored in --skip-name-resolve mode.
2025-02-12  6:39:18 1 [Warning] 'user' entry '@poc-db1-mariadb' ignored in --skip-name-resolve mode.
2025-02-12  6:39:18 1 [Warning] 'proxies_priv' entry '@% mysql@poc-db1-mariadb' ignored in --skip-name-resolve mode.
```

找到mariadb進入容器
docker exec -it feb52a5c88a9 sh
docker exec -it poc-db1-mariadb sh

退出容器而不停止：
輸入 Ctrl + P 然後按 Ctrl + Q
exit、Ctrl+D會讓容器中止，需要再start

[解决docker安装MariaDB后其他容器访问报Access denied for user 'root'@'127.0.0.1' (using password: YES) - 会coding的HAM](https://blog.bg7zag.com/2773)
vi /etc/my.cnf
```
在mysqld區塊底下添加skip-grant-tables
[mysqld]
skip-grant-tables
```

![Pasted image 20250212170952.png](/img/user/img/Pasted%20image%2020250212170952.png)

重新啟動即可連結到mariadb
docker restart poc-db1-mariadb
![Pasted image 20250212174645.png](/img/user/img/Pasted%20image%2020250212174645.png)

無法使用mysql
apk update
apk upgrade
apk add --no-cache mariadb mariadb-client
##### poc-web1-nginx

SmartRobot網址
https://192.168.182.144/wise/wiseadm/

docker exec -it b6260ac0c07b sh
docker exec -it poc-web1-nginx sh

安裝vim
`cat /etc/os-release`
NAME="Alpine Linux"
ID=alpine
VERSION_ID=3.20.2
PRETTY_NAME="Alpine Linux v3.20"
HOME_URL="https://alpinelinux.org/"
BUG_REPORT_URL="https://gitlab.alpinelinux.org/alpine/aports/-/issues"

Alpine是極小的docker images os
`apk add vim`

###### nginx proxy_pass
`vim /etc/nginx/conf.d/https_location_conf/location-https_SmartRobot_AP`

![Pasted image 20250213111642.png](/img/user/img/Pasted%20image%2020250213111642.png)
> [!tip] 
在Linux查看Windows創建的文本時會出現^M
解決方式
`dos2unix filename`
[Linux下去掉^M的方法_linux 消除^m-CSDN博客](https://blog.csdn.net/zhuyunier/article/details/78831989)

###### 01設定https憑證 (主要連結頁 >04、05)
`vim 01-server_https.conf`

`include /etc/nginx/conf.d/https_location_conf/location-https_SmartRobot_AP;`
![Pasted image 20250213154852.png](/img/user/img/Pasted%20image%2020250213154852.png)

![Pasted image 20250213113339.png](/img/user/img/Pasted%20image%2020250213113339.png)
1. `listen 443 ssl;`
2. `listen [::]:443 ssl;`
	這行配置是用來啟用 IPv6 上的 HTTPS。[::] 是 IPv6 的通配符地址，代表接受所有來自 IPv6 地址的連線
3. `server_name _`
	這行設置 server_name，指定服務器的域名。`_`是一個通配符的寫法，通常用來捕捉所有未明確指定的請求。在這裡你可以用具體的域名來替換 `_`。
4. `ssl_certificate ...`
		這行配置指定了 SSL 證書的路徑
5. `include /etc/nginx/conf.d/04;`
	這行是用來引入其他配置文件的內容，讓 Nginx 可以在當前配置中載入 `/etc/nginx/conf.d/04` 文件的設定。

###### 04設定https通用安全性檔案
`vim 04-server_common_https_settings`

![Pasted image 20250213140355.png](/img/user/img/Pasted%20image%2020250213140355.png)
SSL安全設定
![Pasted image 20250213142103.png](/img/user/img/Pasted%20image%2020250213142103.png)
proxy快取設定
![Pasted image 20250213142150.png](/img/user/img/Pasted%20image%2020250213142150.png)

安全性HTTP headers
![Pasted image 20250213142321.png](/img/user/img/Pasted%20image%2020250213142321.png)
![Pasted image 20250213142409.png](/img/user/img/Pasted%20image%2020250213142409.png)

特殊漏洞安全性區塊
![Pasted image 20250213143840.png](/img/user/img/Pasted%20image%2020250213143840.png)
$websocket_same_origin_policy
WebSocket 可以跨來源（不同的域名、協議或端口）建立連接，這樣有時會帶來安全風險，所以這邊有設定限制

**"allow non-browser clients"**（允許非瀏覽器客戶端），這指的是允許來自非典型瀏覽器的客戶端（如手機應用、桌面應用或其他後端服務）連接到你的 WebSocket 伺服器或與你的 API 進行交互。

###### 05設定location 自訂 error 頁面
`vim 05-location_custom_error_page`

![Pasted image 20250213152757.png](/img/user/img/Pasted%20image%2020250213152757.png)

###### 02設定http沒有憑證 (主要連結頁 >03、05)
`vim 02-server_http.conf.disabled`

`include /etc/nginx/conf.d/http_location_conf/location-http_SmartRobot_AP;`
![Pasted image 20250213154938.png](/img/user/img/Pasted%20image%2020250213154938.png)
![Pasted image 20250213155039.png](/img/user/img/Pasted%20image%2020250213155039.png)
###### 03設定http通用安全性檔案 (設定同04)

##### poc-ap1-smartrobot

> [!tip]
>根據nginx設定的網址
>記得要有https跟去掉port號

https://192.168.182.144/wise/wiseadm/

> [!NOTE]
登入為SmartRobot的後台，創建的使用者也是

###### AOAI
登入AOAI的帳密需要到
權限管理>其他>重製管理密碼
![Pasted image 20250217102405.png](/img/user/img/Pasted%20image%2020250217102405.png)

最後在登入右鍵新分頁 (建議用新瀏覽器)
admin
S&"k.fcG
![Pasted image 20250217104451.png](/img/user/img/Pasted%20image%2020250217104451.png)

一般用戶前台還是相同的地方
右鍵複製連結開啟分新頁
![Pasted image 20250217110036.png](/img/user/img/Pasted%20image%2020250217110036.png)

沒有文客只會顯示選項1
![Pasted image 20250217111349.png](/img/user/img/Pasted%20image%2020250217111349.png)