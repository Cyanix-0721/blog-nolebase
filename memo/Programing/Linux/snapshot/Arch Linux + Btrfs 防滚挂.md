# Arch Linux 上 Btrfs 快照与 Btrbk 工具的使用

## 1 介绍

在 Arch Linux 使用 Btrfs 时，为了防止系统更新导致无法启动或出现重大问题（俗称 "滚挂"），你可以采用多种方案。本文将详细介绍如何使用 Btrfs 快照功能以及 btrbk 工具来管理快照和备份。

## 2 防止滚挂的方案

### 2.1 快照与回滚

Btrfs 支持内置的快照功能，可以在系统更新前创建快照，以便在出现问题时快速回滚到更新前的状态。

- **手动创建快照**：  
  使用 `btrfs` 命令手动创建快照，例如：

  ```bash
  sudo btrfs subvolume snapshot / /mnt/@snapshot
  ```

  这会在 `/mnt/@snapshot` 目录下创建一个当前根分区的快照。

- **自动快照**：  
  可以使用 `snapper` 或 `btrbk` 等工具来自动管理快照。
  - **Snapper**：配置后可以在每次 `pacman` 更新前自动创建快照。  
	安装 `snapper`：

	```bash
    sudo pacman -S snapper
    ```

	配置 snapper 后，可以在每次更新前自动创建快照：

	```bash
    sudo snapper -c root create -d "Pre-update snapshot"
    ```

  - [[#3 Btrbk 详细配置与使用|btrbk]]：更灵活的 Btrfs 快照与备份管理工具，支持本地和远程备份（详细配置见下文）。

### 2.2 系统分区和数据分区分离

将系统分区和用户数据分开，可以降低系统分区滚挂时对数据的影响。这样即使系统出问题，数据分区仍然是安全的，可以通过快照回滚系统分区。

### 2.3 双系统或双根分区

设置双根分区（例如，一个用于正常使用，另一个用于备用），在进行大版本更新或不稳定更新时，可以先更新备用分区，确保系统稳定后再切换到主用分区。

### 2.4 慎重选择软件源

使用 Arch Linux 官方仓库或者更为稳定的镜像源，并定期进行系统备份。你也可以使用 `Arch Linux Archive (ALA)`，如果滚挂，能够通过 ALA 将系统恢复到某个具体的时间点。

### 2.5 定期离线备份

尽管快照非常有用，但面对硬件故障或无法通过快照恢复的问题时，定期的离线备份（例如使用 `rsync` 或 `btrbk`）仍然是最安全的选择。

### 2.6 使用稳定的内核

对于生产环境或需要高稳定性的系统，考虑使用 `linux-lts` 内核包，该内核相对较少地更新，并且更稳定。

## 3 Btrbk 详细配置与使用

`btrbk` 是一个强大的工具，用于自动化 Btrfs 快照管理和备份。它可以定期创建和删除快照，支持本地和远程备份。

### 3.1 安装 Btrbk

首先，安装 `btrbk`：

```bash
sudo pacman -S btrbk
```

### 3.2 配置 Btrbk

- **配置文件位置**：`/etc/btrbk/btrbk.conf`

- **基本配置示例**：

  ```bash
  snapshot_dir = /mnt/snapshots                # 存放快照的目录
  target = /mnt/backups                        # 本地或远程备份目标
  
  volume /                                    # 指定要管理的卷
      snapshot create = daily                 # 每日快照
      snapshot create = hourly                # 每小时快照
      snapshot keep = 10d                     # 保留10天的快照
      snapshot keep = 24h                     # 保留24小时的快照
      snapshot keep = 12m                     # 保留12个月的快照
  ```

  - `snapshot create` 指定快照的创建频率（如 `hourly`、`daily`）。
  - `snapshot keep` 指定保留多长时间的快照。

### 3.3 运行 Btrbk

- **手动运行快照创建**：

  ```bash
  sudo btrbk run
  ```

  这会根据配置文件中的策略立即创建快照。

- **设置定时任务**：  
  为了自动化，你可以将 `btrbk run` 添加到定时任务中，例如使用 `cron`：

  ```bash
  sudo crontab -e
  ```

  添加如下行来每日运行 `btrbk`：

  ```bash
  0 2 * * * /usr/bin/btrbk run
  ```

  这将在每天凌晨 2 点运行 `btrbk`。

### 3.4 备份快照到远程

btrbk 还支持将快照备份到远程服务器：

- **配置远程备份**：

  ```bash
  target = user@remote:/path/to/backup           # 配置远程目标
  
  volume /                                       # 管理本地根分区
      snapshot create = daily
      snapshot keep = 7d                         # 保留7天的本地快照
      send receive = user@remote:/path/to/backup # 发送快照到远程服务器
      receive keep = 30d                         # 在远程保留30天的快照
  ```

- **SSH 无密码登录**：  
  如果你计划自动备份到远程服务器，建议配置 SSH 无密码登录：

  ```bash
  ssh-keygen -t rsa -b 4096
  ssh-copy-id user@remote
  ```

  然后，`btrbk` 将能够在没有密码提示的情况下备份到远程服务器。

### 3.5 Btrbk 的高级功能

- **压缩和加密**：你可以配置 `btrbk` 在备份时启用压缩和加密。
- **多目标备份**：btrbk 支持同时备份到多个目标，包括本地和远程。
- **日志和邮件通知**：你可以配置 `btrbk` 在备份完成后发送邮件通知或写入日志文件。

通过使用 `btrbk` 进行自动化管理，你可以确保系统在出现问题时能够轻松回滚，同时也能将关键数据安全地备份到其他位置。
