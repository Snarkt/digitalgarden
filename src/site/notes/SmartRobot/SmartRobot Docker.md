---
{"dg-publish":true,"permalink":"/smart-robot/smart-robot-docker/"}
---


chmod 755 /SRM/ -R

installer.sh
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
![Pasted image 20250212143911.png](/img/user/img/pasted/Pasted%20image%2020250212143911.png)

Stage 4、5
![Pasted image 20250212143929.png](/img/user/img/pasted/Pasted%20image%2020250212143929.png)

Stage 6
![Pasted image 20250212145102.png](/img/user/img/pasted/Pasted%20image%2020250212145102.png)

Stage 7
Docker Compose (`docker-compose.yml`) 版本 1.27 以後`version` 屬性可以去除掉，並且 Docker Compose 會忽略它。 (不影響就保留起來)
![Pasted image 20250212144845.png](/img/user/img/pasted/Pasted%20image%2020250212144845.png)

Stage 8
![Pasted image 20250212145223.png](/img/user/img/pasted/Pasted%20image%2020250212145223.png)

yaml位置
/SRM/PVC/poc-ap1/docker-compose.yml

cd /SRM/PVC/poc-ap1/
docker --version
docker compose version
![Pasted image 20250212160503.png](/img/user/img/pasted/Pasted%20image%2020250212160503.png)

docker compose up -d
![Pasted image 20250212160622.png](/img/user/img/pasted/Pasted%20image%2020250212160622.png)

docker ps -a
![Pasted image 20250212161019.png](/img/user/img/pasted/Pasted%20image%2020250212161019.png)

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
![Pasted image 20250212170952.png](/img/user/img/pasted/Pasted%20image%2020250212170952.png)

![Pasted image 20250212174645.png](/img/user/img/pasted/Pasted%20image%2020250212174645.png)
