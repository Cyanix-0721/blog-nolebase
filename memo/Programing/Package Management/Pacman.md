# Pacman

## 1 Usage

> [!info] [Pacman Wiki](https://wiki.archlinuxcn.org/wiki/Pacman)

### 1.1 Install

#### 1.1.1 安装软件包

**警告：** 在 Arch 上安装软件包时，请避免在还没有[更新系统](https://wiki.archlinuxcn.org/wiki/Pacman#升级软件包)前刷新同步软件包列表（例如，当官方软件仓库[不再提供某个软件包](https://wiki.archlinuxcn.org/wiki/Pacman#安装时无法获取软件包)时）  
	实际操作上，请使用 `pacman -Syu`, 而**不要**使用 `pacman -Sy`

##### 1.1.1.1 安装指定的包

要安装单个或者一系列软件包（包含软件包的依赖），请使用如下命令：

```bash
Pacman -S package_name1 [package_name2]...
```

要通过正则表达式安装一系列软件包（参见 [这个论坛帖子](https://bbs.archlinux.org/viewtopic.php?id=7179)）：

```bash
Pacman -S $(pacman -Ssq Package_Regular_Expressions)
```

有时软件包有多个版本，放在不同的仓库内（例如 _extra_ 和 _testing_）。在以下示例中，要安装 _extra_ 仓库的版本，需要在包名称前定义仓库名：

```bash
Pacman -S extra/package_name
```

要安装多个含有相似名称的软件包，可以使用花括号扩展。例如：

```bash
Pacman -S plasma-{desktop,mediacenter,nm}
```

可以多层扩展到需要的层次：

```bash
pacman -S plasma-{workspace{,-wallpapers},pa}
```

##### 1.1.1.2 安装包组

一些包属于一个可以同时安装的[软件包组]( https://wiki.archlinuxcn.org/wiki/Meta_package_and_package_group "Meta package and package group")。例如，运行下面的命令

```bash
$ pacman -S gnome
```

选择或排除某个区间内的的软件包  
	选中序号 1 至 10 和 15 的软件包  
	选中除了序号 5 至 8 和2 之外的所有软件包

```bash
Enter a selection (default=all): 1-10 15
```

```bash
Enter a selection (default=all): ^5-8 ^2
```

想要查看哪些包属于 gnome 组，运行：

```bash
pacman -Sg gnome
```

也可以访问 [https://archlinux.org/groups/](https://archlinux.org/groups/) 查看可用的包组

**注意：** 如果列表中的包已经安装在系统中，它会被重新安装，即使它已经是最新的。可以用 `--needed` 选项覆盖这种行为

##### 1.1.1.3 下载包而不安装

```bash
pacman -Sw package_name
```

##### 1.1.1.4 安装本地包/远程包（不在 pacman）

```bash
pacman -U path/package_name-version.pkg.tar.zst
```

### 1.2 Uninstall

#### 1.2.1 删除指定软件包

```bash
pacman -R[options] package_name
```

- s
	- 删除指定软件包，及其所有没有被其他已安装软件包使用的依赖关系
		- 上面这条命令在移除包含其他所需包的组时有时候会拒绝运行。这种情况下可以尝试 su
		- sc : 删除软件包和所有依赖这个软件包的程序
			- **警告：** 此操作是递归的，请小心检查，可能会一次删除大量的软件包  
- n
	- _pacman_ 删除某些程序时会备份重要配置文件，在其后面加上*.pacsave扩展名。-n 选项可以避免备份这些文件  
**注意：** _pacman_ 不会删除软件自己创建的文件（例如主目录中的“点文件”不会被删除。）

### 1.3 Update

```bash
pacman -Syu
```

### 1.4 Clean Cache

#### 1.4.1 Paccache

```bash
sudo pacman -S pacman-contrib
```

[pacman-contrib](https://archlinux.org/packages/?name=pacman-contrib) 包提供的 [paccache(8)](https://man.archlinux.org/man/paccache.8) 脚本默认会删除所有缓存的版本和已卸载的软件包，除了最近的3个会被保留：

```bash
Paccache -r
```

[启用]( https://wiki.archlinuxcn.org/wiki/Enable "Enable") 和 [启动]( https://wiki.archlinuxcn.org/wiki/Start "Start") `paccache.timer` 来每周删除不使用的包

```bash
sudo systemctl enable paccache.timer
```

```bash
sudo systemctl start paccache.timer
```

```bash
sudo systemctl status paccache.timer
```

```bash
sudo journalctl -u paccache.timer
```

#### 1.4.2 Pacman

删除目前没有安装的所有缓存的包，和没有被使用的同步数据库

```bash
Pacman -Sc
```

删除缓存中的全部文件，使用两次`-c`开关。这是最为激进的方式，将会清空缓存文件夹

```bash
Pacman -Scc
```

## 2 PacmanMirror

### 2.1 Official Repo

#### 2.1.1 Install Reflector

```bash
sudo pacman -S reflector
```

#### 2.1.2 Update

```bash
sudo reflector --sort rate --limit 10 --protocol https --save /etc/pacman.d/mirrorlist
```

### 2.2 ArchLinuxCN

#### 2.2.1 在 `/etc/pacman.conf` 文件末尾添加以下两行（或者从后边的链接中选择一个镜像）[Arch Linux CN Community repo mirrors list](https://github.com/archlinuxcn/mirrorlist-repo)

```
[archlinuxcn]
Server = https://repo.archlinuxcn.org/$arch
```

#### 2.2.2 之后通过以下命令安装 `archlinuxcn-keyring` 包导入 GPG Key

```bash
sudo pacman -Sy archlinuxcn-keyring
```

##### 2.2.2.1 如果报错密钥过时，需要在本地信任 Farseerfc 的 GPG Key

```bash
sudo pacman-key --lsign-key "farseerfc@archlinux.org"
```
