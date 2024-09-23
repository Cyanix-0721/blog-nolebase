# Windows Subsystem Linux

## 1 Install

> [!info] [WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

- 开启 Windows 功能
	1. WSL

	```sh
	dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
	```

	2. 虚拟机平台

	```sh
	dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
	```

	3. 检查系统版本  
		1. To update to WSL 2, you must be running Windows 10…
			- For x64 systems: **Version 1903** or later, with **Build 18362.1049** or later.
			- For ARM64 systems: **Version 2004** or later, with **Build 19041** or later.
		2. or Windows 11.

- 设置 wsl 版本为 2

	```sh
	wsl --set-version 2
	```

- 安装&升级

	```shell
	wsl --install Debian
	```

	```shell
	wsl --update
	```

- 查看所有 wsl 的版本

	```sh
	wsl -l -v
	```

## 2 [配置文件](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)

> [!warning] Hyper-V 防火墙  
>
> 使用管理员权限在 PowerShell 窗口中运行以下命令，以[配置 Hyper-V 防火墙](https://learn.microsoft.com/zh-cn/windows/security/operating-system-security/network-security/windows-firewall/hyper-v-firewall)设置，从而允许入站连接：`Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow`

> [!warning] Windows 防火墙  
>
> powershell 管理员模式
> 1. `ipconfig` 获取网卡名称  
> 2. `New-NetFirewallRule -DisplayName "WSL" -Direction Inbound -InterfaceAlias "vEthernet (WSL (Hyper-V firewall))" -Action Allow`

> [!tip]
>
> - **[.wslconfig](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#wslconfig)** 用于在 WSL 2 上运行的所有已安装发行版中配置**全局设置**。
> - **[wsl.conf](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config#wslconf)** 用于为在 WSL 1 或 WSL 2 上运行的每个 Linux 发行版按各个发行版配置**本地设置**。

`%USER_PROFILE%\.wslconfig`

```wslconfig
[wsl2]
memory=6GB
processors=6
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
[experimental]
autoMemoryReclaim=gradual
sparseVhd=true
```

`etc/wsl.conf`

```conf
# 自动挂载 Windows 驱动器，当发行版启动时
[automount]

# 设置为 true 将自动挂载固定驱动器（C:/ 或 D:/），使用 DrvFs 挂载到上述根目录。设置为 false 则表示驱动器不会自动挂载，需要手动挂载或使用 fstab。
enabled = true

# 设置自动挂载固定驱动器的目录。
root = /mnt

# 可以指定 DrvFs 特定的选项。
options = "metadata,uid=1000,gid=1000,umask=077,fmask=11,case=off"

# 设置在启动 WSL 发行版时处理的 `/etc/fstab` 文件。
mountFsTab = true

# 网络主机设置，启用 WSL 2 使用的 DNS 服务器。此示例更改主机名，设置 generateHosts 为 false，防止 WSL 自动生成 /etc/hosts，并设置 generateResolvConf 为 false，防止 WSL 自动生成 /etc/resolv.conf，以便您可以创建自己的配置（例如 nameserver 1.1.1.1）。
[network]
hostname = Debian
generateHosts = true
generateResolvConf = host

# 设置 WSL 是否支持互操作进程，例如启动 Windows 应用程序和添加路径变量。将这些设置为 false 将阻止启动 Windows 进程并阻止添加 $PATH 环境变量。
[interop]
enabled = true
appendWindowsPath = false

# 设置启动 WSL 发行版时的用户为 root。
# [user]
# default = root

# 启用 systemd 支持
[boot]
systemd = true

# 设置在新 WSL 实例启动时运行的命令。此示例启动 Docker 容器服务。
# command = service docker start
```

## 3 模板

### 3.1 导出当前的 WSL 实例

使用 `wsl --export` 命令来导出当前的实例为 `.tar` 文件。

```bash
wsl --export <实例名称> <保存路径>/<文件名>.tar
```

例如，导出名为 `Ubuntu` 的实例到 `D:\Backups` 目录下：

```bash
wsl --export Ubuntu D:\Backups\ubuntu-template.tar
```

### 3.2 导入模板为新的实例

如果你需要使用这个模板来创建新的实例，可以使用 `wsl --import` 命令。

```bash
wsl --import <新实例名称> <实例存储路径> <模板文件路径>
```

例如，使用刚刚导出的模板创建一个名为 `UbuntuClone` 的新实例：

```bash
wsl --import UbuntuClone D:\WSL\UbuntuClone D:\Backups\ubuntu-template.tar
```

这样你就可以使用这个新实例了。

### 3.3 查看现有的 WSL 实例

你可以使用以下命令查看当前系统中所有的 WSL 实例：

```bash
wsl --list --all
```

### 3.4 启动新的实例

在创建新的实例之后，可以通过 `wsl -d` 命令启动：

```bash
wsl -d UbuntuClone
```

## 4 Docker

### 4.1 设置 Docker 代理

1. **创建或编辑 Docker 配置文件**:
   - 在 WSL 2 中，您需要编辑 Docker 的配置文件，通常位于 `/etc/systemd/system/docker.service.d/http-proxy.conf`。如果该目录不存在，您可以创建它。

2. **添加代理设置**:
   - 使用文本编辑器（如 `nano` 或 `vim`）打开或创建该文件，并添加以下内容：

	 ```conf
     [Service]
     Environment="HTTP_PROXY=http://your-proxy-server:port/"
     Environment="HTTPS_PROXY=http://your-proxy-server:port/"
     Environment="NO_PROXY=localhost,127.0.0.1"
     ```

3. **重启 Docker 服务**:
   - 保存文件后，您需要重启 Docker 服务以使更改生效。可以使用以下命令：

	 ```bash
     sudo systemctl daemon-reload
     sudo systemctl restart docker
     ```

### 4.2 关闭 `iptables`

> [!warning] Docker Desktop 通过 iptables 进行端口转发, 如果使用 Docker Desktop 可以跳过该步骤

如果连接不上 docker socket 可尝试修改 `/etc/docker/daemon.json`

```json
{
	"iptables": false
}
```

或者

```json
{
  "hosts": ["tcp://0.0.0.0:2375", "unix:///var/run/docker.sock"]
}
```
