---
{"dg-publish":true,"permalink":"/obsidian/"}
---

# Obsidian

##### 自動推git的方法
在需要推git的資料夾有個.obsidian的目錄先用gitgub desktop創建repo 
![Pasted image 20250204134531.png](/img/user/img/Pasted%20image%2020250204134531.png)
載三方套件git之後再載git設定git.exe路徑(git.exe也要填)

安裝git的路徑
C:\Program Files\Git\bin\git.exe
設定推git的路徑
C:/Users/user/Documents/Obsidian/intumit/.git

![Pasted image 20250204134602.png](/img/user/img/Pasted%20image%2020250204134602.png)
剛才創建repo會在.obsidian創建.git將此路徑也填寫進去 

![Pasted image 20250204134620.png](/img/user/img/Pasted%20image%2020250204134620.png)
最後會多個套件插槽可以直接進行版控  
設定那邊也有auto commit

##### 建立網站分享筆記
參考如下
[Obsidian 简明发布方式](https://enneaa.netlify.app/pages/obsidian%20%E7%AE%80%E6%98%8E%E5%8F%91%E5%B8%83%E6%96%B9%E5%BC%8F/)
[Obsidian 免费建站发布网页 | 基于 Digital Garden + Github + Netlify - Another Dayu](https://anotherdayu.com/2022/4222/)

插件 "Digital Garden" 的設置頁面如下
Slugify Note URL的選項不能取消勾選，不然會連笑臉都沒辦法出現
創建資料夾不要用中文否則無法存取底下的文章
![Pasted image 20250204141301.png](/img/user/img/Pasted%20image%2020250204141301.png)
![Pasted image 20250204135747.png](/img/user/img/Pasted%20image%2020250204135747.png)

最後在需要推的筆記按Ctrl+P 輸入dg
選擇快速建立或是先添加標籤，屬性會多出 dg-publish v
![Pasted image 20250204142019.png](/img/user/img/Pasted%20image%2020250204142019.png)

到首頁添加連結
![Pasted image 20250204142524.png](/img/user/img/Pasted%20image%2020250204142524.png)

同步到Netlify
![Pasted image 20250204142707.png](/img/user/img/Pasted%20image%2020250204142707.png)
![Pasted image 20250204142948.png](/img/user/img/Pasted%20image%2020250204142948.png)

最後畫面如下
![Pasted image 20250204143108.png](/img/user/img/Pasted%20image%2020250204143108.png)

##### 好用插件分享

###### 1.Linter
Lint on save，用 Ctrl+S 直接套用
![Pasted image 20250204140051.png](/img/user/img/Pasted%20image%2020250204140051.png)
YAML頁簽底下可以設定Timestamp
![Pasted image 20250204140133.png](/img/user/img/Pasted%20image%2020250204140133.png)
![Pasted image 20250204140218.png](/img/user/img/Pasted%20image%2020250204140218.png)
具體效果如下
![Pasted image 20250204140400.png](/img/user/img/Pasted%20image%2020250204140400.png)

###### 2.Style Text
markdown只能使用css，所以需要插件另外變紅字跟背景高亮黃
![Pasted image 20250204140520.png](/img/user/img/Pasted%20image%2020250204140520.png)

##### Obsidian小技巧

###### 修改圖片大小方式

輸入要更改的png檔名
Pasted image 20250211124511.png 
後面加上style 高跟寬，一個設定完另一個auto比較不會變形
`<img src="Pasted image 20250211124511.png" style="width: 350px; height: auto;"/>`

如果要分享到網頁又想修改大小的話，可以填入上傳到圖片空間的網址 (imgur)
`<img src="https://i.imgur.com/0wEzHDB.png" style="width: 350px; height: auto;"/>`

##### Callout功能預覽

> [!note] 
> 這是編輯

> [!tip] 
> 這是小技巧

> [!important] 
> 這是重要

> [!info] 
> 這是資訊

> [!warning] 
> 這是警告

> [!danger] 
> 這是危險

> [!error] 
> 這是錯誤

> [!bug] 
> 這是Bug

> [!question] 
> 這是問題

> [!example] 
> 這是範例

> [!quote]
> 這是引述

> [!success] 
> 這是成功

> [!fail] 
> 這是失敗

> [!abstract] 
> 這是摘要

> [!todo] 
> 這是todo
