# Hyprland 自启动

在 **Arch Linux + Hyprland** 环境下，`~/.config/autostart` 可能不会自动生效，因为 Hyprland 是一个 Wayland 合成器，不直接支持传统的 X11 自启动机制（如 `autostart` 目录）。

## 1 使用 Hyprland 的 `exec` 或 `exec-once`

Hyprland 的配置文件（通常是 `~/.config/hypr/hyprland.conf`）支持 `exec` 和 `exec-once` 命令来启动程序：

```ini
# 启动程序（每次 Hyprland 重启都会运行）
exec = /path/to/your/command

# 仅运行一次（推荐用于自启动）
exec-once = /path/to/your/command
```

**示例**：

```ini
# 启动 Waybar
exec-once = waybar

# 启动 NetworkManager Applet
exec-once = nm-applet --indicator

# 启动 Cliphist（剪贴板管理）
exec-once = wl-paste --watch cliphist store
```

**优点**：
- 直接集成到 Hyprland，无需额外依赖。
- 可以精确控制启动顺序。

## 2 使用 `dex`（Desktop Entry Execution）

如果仍然希望使用 `.desktop` 文件，可以安装 `dex`：

```bash
sudo pacman -S dex
```

然后在 `hyprland.conf` 里添加：

```ini
exec-once = dex --autostart --environment hyprland
```

**优点**：
- 兼容传统的 `.desktop` 自启动文件。
- 适用于从 GNOME/KDE 迁移过来的用户。

## 3 使用 `systemd` 用户服务（适合后台服务）

如果程序是守护进程（如 `syncthing`、`mpd`），可以创建 `systemd` 用户服务：

```bash
mkdir -p ~/.config/systemd/user/
nano ~/.config/systemd/user/my-service.service
```

**示例**（`redshift` 服务）：

```ini
[Unit]
Description=Redshift

[Service]
ExecStart=/usr/bin/redshift -v
Restart=always

[Install]
WantedBy=default.target
```

然后启用：

```bash
systemctl --user enable --now my-service.service
```

**优点**：
- 适合长期运行的服务。
- 可以设置依赖关系和自动重启。

## 4 使用 `autostart` 脚本

如果仍然希望使用 `~/.config/autostart`，可以手动编写一个脚本：
1. 创建 `~/.config/autostart/autostart.sh`：

   ```bash
   #!/bin/sh
   sleep 5  # 等待 Hyprland 完全启动
   dex --autostart --environment hyprland
   ```

2. 赋予执行权限：

   ```bash
   chmod +x ~/.config/autostart/autostart.sh
   ```

3. 在 `hyprland.conf` 里调用：

```ini
   exec-once = ~/.config/autostart/autostart.sh
```

## 5 常见问题排查

### 5.1 程序没有启动

- 检查日志：

  ```bash
  journalctl --user -u my-service.service -b  # 如果是 systemd 服务
  ```

- 尝试手动运行：

  ```bash
  /path/to/your/command
  ```

  看看是否报错（如缺少依赖）。

### 5.2 程序启动但崩溃

- 可能是 Wayland 兼容性问题，尝试：

```ini
exec-once = GDK_BACKEND=wayland /path/to/command
```

  或：

```ini
exec-once = QT_QPA_PLATFORM=wayland /path/to/command
```

### 5.3 启动顺序问题

- 如果某些程序依赖 `dbus` 或 `polkit`，可以延迟启动：

```ini
exec-once = sleep 3 && /path/to/command
```
