# Disk Mounted

## 1 安装 `ntfs-3g`

确保系统中已安装`ntfs-3g`软件包，它提供了对NTFS分区的支持。

```shell
sudo pacman -S ntfs-3g
```

## 2 确定分区设备路径

使用以下命令来确定你要挂载的NTFS分区的设备路径：

```shell
lsblk
```

假设你的NTFS分区在 `/dev/nvme1n1p4` 上。

## 3 修复磁盘 (Optional)

```shell
sudo ntfsfix /dev/nvme1n1p4
```

## 4 创建挂载点

在 `/mnt` 目录下创建一个挂载点，比如 `/mnt/DDDD`：

```shell
sudo mkdir -p /mnt/DDDD
```

## 5 自动挂载

编辑 `/etc/fstab` 文件，添加一个条目来实现开机自动挂载。

首先，使用编辑器（比如 `nano` 或 `vim`）打开 `/etc/fstab` 文件：

```shell
sudo nano /etc/fstab
```

在文件末尾添加如下一行（假设要挂载的分区为 `/dev/nvme1n1p4`，挂载点为 `/mnt/DDDD`）：

```fstab
/dev/nvme1n1p4  /mnt/DDDD  ntfs-3g  defaults  0  0
```

这行的含义是：

- `/dev/nvme1n1p4`：NTFS分区的设备路径。
- `/mnt/DDDD`：挂载点。
- `ntfs-3g`：文件系统类型。
- `defaults`：默认挂载选项。
- `0 0`：用于fsck检测的选项（一般设为0）。

## 6 手动挂载

（假设要挂载的分区为 `/dev/nvme1n1p4`，挂载点为 `/mnt/DDDD`）：

```shell
sudo mount -t ntfs-3g /dev/nvme1n1p4 /mnt/DDDD
```

## 7 测试挂载

现在，可以手动测试挂载，确保没有问题：

```shell
sudo mount -a
```

如果没有报错，说明挂载配置正确。
