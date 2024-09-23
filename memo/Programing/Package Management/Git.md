# Git

## 1 Install

```bash
sudo pacman -S git
```

## 2 Install Package

### 2.1 Clone the Repo

```bash
git clone git_url
```

### 2.2 Cd to Package Root Directory

```bash
cd package_name
```

### 2.3 Configure[Optional]

```bash
./configure [options]
```

* --prefix：指定软件的安装前缀

	* 默认情况下，软件将安装到 /usr/local

	* --prefix=/usr

		* 安装到/usr

* --bindir：指定软件的可执行文件安装目录

	* 默认情况下，可执行文件将安装到 /usr/local/bin

* --libdir：指定软件的库文件安装目录

	* 默认情况下，库文件将安装到 /usr/local/lib

* --includedir：指定软件的头文件安装目录

	* 默认情况下，头文件将安装到 /usr/local/include

* --mandir：指定软件的手册页安装目录

	* 默认情况下，手册页将安装到 /usr/local/man

### 2.4 Compile[Optional]

```bash
[sudo] make
```

### 2.5 Run the Software's Installation Script or just Make Install

```
./install. sh
```

Or

```bash
[sudo] make install
```

## 3 Uninstall Package

### 3.1 Uninstall Script

#### 3.1.1 Go to the Software Installation Directory

```bash
cd /usr/local/package_name
```

#### 3.1.2 Run Uninstall Script

```bash
[sudo] ./uninstall.sh
```

Or

```bash
[sudo] make uninstall
```

### 3.2 If You Did not Specify the --prefix Option during Installation and the Source Package Does not provide a Make Uninstall Command, You Can Uninstall it in the following Way:

#### 3.2.1 Find `make instal` Generated ` install_manifest.txt `

```bash
$ cat install_manifest.txt | sudo xargs rm
```
