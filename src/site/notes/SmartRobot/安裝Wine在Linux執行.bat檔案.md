---
{"dg-publish":true,"permalink":"/smart-robot/wine-linux-bat/"}
---

參考文件: [How To Install Wine on CentOS Stream 10 - idroot](https://idroot.us/install-wine-centos-stream-10/)

1. 安裝 EPEL 存儲庫 首先，需要啟用 EPEL (Extra Packages for Enterprise Linux) 存儲庫，這樣才能安裝 Wine 和其他所需的開發包： 更新system packages
    
    sudo dnf update -y 啟用epel repository sudo dnf install epel-release -y
    
2. 安裝 Wine 所需的依賴 安裝編譯 Wine 所需的開發工具和依賴包：
    
    sudo yum groupinstall "Development Tools"
    
    sudo yum install freetype-devel.x86_64 fontconfig-devel.x86_64
    
    sudo yum install libX11-devel.x86_64 libXext-devel.x86_64 libXrandr-devel.x86_64
    
3. 安裝 Source Code cd /tmp wget <https://dl.winehq.org/wine/source/9.x/wine-9.1.tar.xz> tar -xvf wine-9.1.tar.xz
4. 配置 Wine 以啟用 64 位元支持並禁用圖形界面 在編譯 Wine 之前，需要配置 Wine，使其支持 64 位元架構並禁用 X11 圖形支持（僅使用命令行版本）。執行以下命令來配置 Wine： 到 wine-9.1路徑下
    
    cd wine-9.1 ./configure --enable-win64 --without-x
    
5. 編譯並安裝 Wine 執行以下命令來編譯並安裝 Wine： 安裝時間可能需要30分鐘以上 make sudo make install
6. 將 Wine 添加到 PATH 如果你希望能夠直接使用 wine 命令而不每次都輸入完整路徑，可以將 wine 所在的目錄添加到 PATH 環境變數中。 查詢 Wine 安裝位置
    
    sudo find / -name wine 編輯你的 ~/.bashrc 文件 vim ~/.bashrc 在文件末尾添加以下行，將 /tmp/wine-9.1 或 /usr/local/bin 添加到 PATH 中 export PATH=$PATH:/tmp/wine-9.1 export PATH=$PATH:/usr/local/bin 保存並退出 nano，然後讓變更生效： source ~/.bashrc
    
7. 使用 Wine 執行 .bat 文件 安裝完成後，可以使用 Wine 執行 .bat 文件。假設有一個 .bat 文件，使用以下命令來執行它：
    
    wine cmd /c <path_to_your_bat_file.bat> 例如 wine cmd /c /SRM/SmartRobot/kernel/jStartup.bat
    
8. 最後執行 jStartup.bat
    
    修改 jStartup.bat 內容
    
    Z:\SRM\SmartRobot\openjdk\bin\java
    
    執行.bat
    
    wine cmd /c /SRM/SmartRobot/kernel/jStartup.bat