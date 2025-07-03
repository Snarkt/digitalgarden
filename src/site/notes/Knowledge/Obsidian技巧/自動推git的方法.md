---
{"dg-publish":true,"permalink":"/knowledge/obsidian/git/"}
---

###### 創建git並使用三方套件推送

在需要推git的資料夾有個.obsidian的目錄先用gitgub desktop創建repo
![Pasted image 20250204134531.png](/img/user/Assets/Img/Pasted%20image%2020250204134531.png)
載三方套件git之後再載git設定git.exe路徑(git.exe也要填)

安裝git的路徑
C:\Program Files\Git\bin\git.exe
設定推git的路徑
C:/Users/user/Documents/Obsidian/intumit/.git

![Pasted image 20250204134602.png](/img/user/Assets/Img/Pasted%20image%2020250204134602.png)
剛才創建repo會在.obsidian創建.git將此路徑也填寫進去

![Pasted image 20250204134620.png](/img/user/Assets/Img/Pasted%20image%2020250204134620.png)
最後會多個套件插槽可以直接進行版控
設定那邊也有auto commit

###### git推送失敗時
![Pasted image 20250220160628.png](/img/user/Assets/Img/Pasted%20image%2020250220160628.png)

手動設定你的 Git 使用者名稱和電子郵件
命令提示字元cmd
git config --global user.name "sethfu"
git config --global user.email "chabc.9654@gmail.com"
