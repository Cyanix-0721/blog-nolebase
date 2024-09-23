# Disk Managers

在 Arch Linux 上，有几个流行的可视化磁盘管理工具，可以帮助你管理分区、文件系统和磁盘空间。以下是一些常见的选择：

## 1 **GParted**

GParted 是一个广泛使用的图形化磁盘分区工具，支持大多数的文件系统。它可以用于创建、调整、删除、格式化和检查分区。

- **安装**：

  ```bash
  sudo pacman -S gparted
  ```

- **启动**：

  ```bash
  sudo gparted
  ```

## 2 **KDE Partition Manager**

KDE Partition Manager 是 KDE 桌面环境的磁盘管理工具，功能与 GParted 类似。它可以管理分区、LVM、RAID 等。

- **安装**：

  ```bash
  sudo pacman -S partitionmanager
  ```

- **启动**：

  ```bash
  sudo partitionmanager
  ```

## 3 **Disks (gnome-disk-utility)**

Gnome Disks 是 GNOME 桌面环境提供的磁盘管理工具，界面简洁直观。除了基本的分区操作外，它还支持创建磁盘镜像、配置磁盘健康监控等。

- **安装**：

  ```bash
  sudo pacman -S gnome-disk-utility
  ```

- **启动**：

  ```bash
  gnome-disks
  ```

## 4 **QtParted**

QtParted 是基于 Qt 的磁盘管理工具，功能与 GParted 类似，适合那些使用 Qt 桌面环境（如 KDE）的用户。

- **安装**：

  ```bash
  sudo pacman -S qtparted
  ```

- **启动**：

  ```bash
  sudo qtparted
  ```

## 5 **Cockpit**

Cockpit 是一个基于 Web 的系统管理工具，其中包括磁盘管理功能。它可以通过浏览器访问并远程管理系统。

- **安装**：

  ```bash
  sudo pacman -S cockpit
  ```

- **启动并启用 Cockpit 服务**：

  ```bash
  sudo systemctl enable --now cockpit.socket
  ```

- **访问**：  
  打开浏览器并访问 `https://localhost:9090`。

这些工具各有优劣，选择适合你的工具可以根据你的桌面环境和使用习惯。如果你更喜欢命令行，也可以结合 `lsblk`、`fdisk`、`parted` 等工具进行磁盘管理。
