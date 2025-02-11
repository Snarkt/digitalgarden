---
{"dg-publish":true,"permalink":"/文章/Docker/"}
---


Docker介紹
[輕量虛擬化改寫IT歷史　Docker容器技術細說從頭 | 網管人](https://www.netadmin.com.tw/netadmin/zh-tw/feature/1DB50AE57AC1401F98C641366F8D0720)
[Docker Architecture & O.S Virtualization in Docker | by KUSHAGRA BANSAL | Medium](https://bansalkushagra.medium.com/docker-architecture-o-s-virtualization-in-docker-a32ba4042215)
開放原始碼軟體專案Docker是一個輕量級的虛擬化技術
屬於作業系統層虛擬化 O.S Virtualization，可以讓應用程式部署在軟體容器下的工作自動化執行。
虛擬機是基於硬體層的虛擬化技術，Docker 相對來說更加輕量和高效，但虛擬機則提供了更強的隔離性

Docker與虛擬機比較

- **容器與虛擬機**：
    - **虛擬機**：每個虛擬機都有完整的操作系統，並且運行在宿主操作系統之上。虛擬機需要較多的資源（例如 CPU 和記憶體），因為每個虛擬機都包含了操作系統和應用程式。
    - **容器（Docker）**：容器則是共享宿主操作系統內核的輕量級虛擬化技術。每個容器運行在同一個操作系統內核上，這使得容器比虛擬機更高效，占用的資源也少。
- **效能與啟動時間**：
    - 由於容器不需要啟動一個完整的操作系統，它們的啟動時間非常快，通常只需要幾秒鐘。而虛擬機需要啟動整個操作系統，這會需要更多的時間。
- **資源利用**：
    - 虛擬機因為每個都有自己的操作系統，資源使用會比較高。而容器因為共享操作系統內核，因此資源使用效率較高，對系統的負擔較小。
- **可攜性**：
    - Docker 容器提供了更好的跨平台可攜性，因為它可以在任何安裝了 Docker 的環境中運行，而無需關心底層操作系統的差異。這使得 Docker 在開發、測試和部署中都非常有用。

Docker架構
Docker Architecture
![Pasted image 20250211110914.png](/img/user/img/Pasted%20image%2020250211110914.png)

常用指令
```
apt install docker.io  #下載docker
docker search nginx
docker pull nginx    #下載nginx
docker ps -a          #查看目前有哪些容器
docker start 容器名子  #啟動容器
docker stop  容器名子  #停止容器
docker rm -f 容器代號  #刪除容器  -f  強制刪除
docker logs -f 容器名子 #查看容器的log
docker rmi images    #刪除用不到的images檔，如果有容器在使用該映像檔，需先刪除容器才能刪除映像檔
docker exec -it 容器代號 /bin/bash
docker run -it image名子 /bin/bash #建立一個新的容器並執行
docker run --name some-nginx -v /some/content:/usr/share/nginx/html:ro -d nginx
docker run --name some-nginx -d some-content-nginx
docker run --name some-nginx -d -p 8080:80 nginx
docker run --name some-nginx -d -p 8080:80 nginx
docker run --name some-nginx -d -p 8080:80 -v /var/www/html/docker:/usr/share/nginx/html nginx
docker save -o 檔案.tar images名子
docker load -i 檔案.tar
apt install docker-compose
docker-compose up -d  #執行所有在docker-compose.yaml檔案設定的 Docker Image
docker-compose stop  #停止docker-compose執行的所有Container
docker-compose rm    #刪除docker-compose的所有Container
docker-compose logs -f #t查看log

```