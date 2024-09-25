# WSL & Docker Desktop

## 1 使用原因

- 众所周知, **VMware** (VM) 被博通收购后, 取消了永久购买, 购买只有订阅制, (现在面向个人免费)
- 而 **VirtualBox** (VB) 在 Windows 上又有各种奇怪的报错问题, 例如 ![[VB#1 Error in Supr3]]
- 除了 VM/VB 之外, 流行的虚拟化平台还有 **KVM** (Kernel-based Virtual Machine)/**QEMU**/**Proxmox VE**/**Hyper-V** 等
	- KVM 是一个 Linux 内核模块，使得 Linux 成为一个虚拟化的 Hypervisor, 可以配合 QEMU 等工具进行使用
	- PVE 是一个基于 Debian 的开源虚拟化平台，它集成了 *KVM* 和 *LXC*（轻量级容器）虚拟化，提供了强大的 Web UI 管理虚拟机和容器，非常适合构建*虚拟化集群*和*服务器*
- 所以在 Windows 下, 建议使用基于 Hyper-V 的 **Windows Subsystem Linux** (WSL), 配合 *Docker* 构建本地开发环境, 更可以通过 *Docker Desktop* 增强和 IDE 的集成效果. 虽然和其他虚拟机相比配置比较复杂, 但是绝对值得尝试

## 2 环境配置

### 2.1 ![[WSL]]

### 2.2 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 3 应用场景

### 3.1 如果只使用 WSL 而不使用 Docker Desktop

- 部署的时候就需要物理机先 push 到仓库, 然后 WSL 内部再 pull
- 需要*手动进行端口转发*或者使用*地址回环*把虚拟机也变成 `localhost`, 容易和物理机产生*端口冲突* (VSCode/IDEA 等主流 IDE 也有端口转发功能)![[WSL & Docker Desktop-IMG-20240924095417274.png]]
- 需要安装 [Portainer](https://www.portainer.io/) 等面板进行管理

> [!warning] 删除已 push 的 commit
>
> 对于已经 `push` 的提交，使用 `--hard` 和 `rebase` 修改历史会影响远程仓库的提交记录。具体如下：
>
> - **`git reset --hard`**：如果在本地重置到某个提交并推送（使用 `git push --force`），远程仓库的历史将会被覆盖，已推送的提交会从历史中消失。
>
> - **`git rebase`**：如果你在本地进行了变基并推送（同样使用 `git push --force`），远程仓库的历史也会被修改，变基后的新提交将替代原有的提交。
>
> 无论哪种情况，强制推送（`--force`）都会导致远程历史与本地历史不一致，因此在团队协作中使用时要特别小心，确保不会影响其他开发者的工作。

### 3.2 使用 WSL + Docker Desktop

- 不需要手动连接 WSL, 通过 IDE 的插件可以使用 GUI 直接对 WSL 中的 docker 进行操作 (也可以通过 SSH 或 TCP 连接, 但是使用体验较差且 TCP 暴露端口有风险)![[WSL & Docker Desktop-IMG-20240924095102187.png]]
- 由 Docker Desktop 使用 iptables 自动进行端口转发
- 大部分 docker 的操作都可以直接通过 Desktop 现成的 GUI 进行操作 (部分功能付费, Portainer 有社区版可以免费使用. 各有优势, 自行取舍)![[WSL & Docker Desktop-IMG-20240924094726086.png]]

## 4 问题处理

### 4.1 Docker Compose

#### 4.1.1 Docker Desktop 数据持久化

- 一开始使用挂载目录的方式进行数据持久化 ![WSL & Docker Desktop-IMG-20240920141941980](assets/WSL%20&%20Docker%20Desktop/WSL%20&%20Docker%20Desktop-IMG-20240920141941980.png)  
- 由于挂载的目录本身不存在, 需要手动进行创建 (Docker Desktop 默认使用 ROOT 账户), 启动时会导致奇怪的权限问题, 又有部分容器不能使用 root 用户使用. 所以放弃使用手动创建目录, `useradd` 用户给目标容器, 再 `chown` 对应权限, 改为直接使用数据卷 ![WSL & Docker Desktop-IMG-20240920142637322](assets/WSL%20&%20Docker%20Desktop/WSL%20&%20Docker%20Desktop-IMG-20240920142637322.png)
- 通过 `Dockerfile` 把需要的配置文件传入

#### 4.1.2 Win 和 Linux 的路径问题

- 因为使用 Docker Desktop 是直接把物理机的项目在 WSL 内运行, 挂载的时候可能出现无法读取到目录的问题
- `Dockerfile` 和 `docker-compose` 文件中的路径都是相对于**构建上下文**（build context）的相对路径
	- 所以建议 compose 内指定上下文路径的时候使用相对的项目根目录, 同样传输到 `Dockerfile` 中的也是这个相对路径 ![WSL & Docker Desktop-IMG-20240920143517175](assets/WSL%20&%20Docker%20Desktop/WSL%20&%20Docker%20Desktop-IMG-20240920143517175.png)
