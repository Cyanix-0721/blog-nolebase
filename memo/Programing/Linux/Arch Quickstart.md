# Arch Linux 快速配置指南

## 1 基础环境准备

### 1.1 安装 Git 和基础开发工具

> [[memo/Programing/Version Control/Git/Git|Git]]

```bash
sudo pacman -S --needed git base-devel
```

### 1.2 安装 Paru (推荐)

> [[Paru]]

```bash
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
cd ..
rm -rf paru
```

### 1.3 安装 Yay (备用)

```bash
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
cd ..
rm -rf yay
```

## 2 Pacman 配置和 ArchlinuxCN 仓库

### 2.1 安装 Pacman 工具

```bash
sudo pacman -S pacman-contrib reflector
```

### 2.2 配置 ArchlinuxCN 仓库

 ![[Pacman#2.2 ArchLinuxCN]]

## 3 安装 Flatpak

> [[Flatpak]]

```bash
sudo pacman -S flatpak
```

## 4 安装 rEFInd 引导管理器

```bash
sudo pacman -S refind
sudo refind-install
```

## 5 安装 Chezmoi 并初始化配置

> [[chezmoi]]

```bash
sudo pacman -S chezmoi
chezmoi init https://github.com/Cyanix-0721/dotfiles.git -a
```

## 6 安装备份工具

> [[Arch Linux + Btrfs 防滚挂]]

```bash
sudo pacman -S snapper btrfs-assistant
```

## 7 中文本地化配置

> [[Chinese]]

### 7.1 安装中文字体

```bash
sudo pacman -S adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts noto-fonts-cjk noto-fonts-emoji wqy-microhei wqy-microhei-lite wqy-bitmapfont wqy-zenhei ttf-arphic-ukai ttf-arphic-uming ttf-jetbrains-mono ttf-jetbrains-mono-nerd ttf-sarasa-gothic
```

### 7.2 清除字体缓存

```bash
fc-cache -fv
```

### 7.3 安装输入法

```bash
sudo pacman -S fcitx5-im fcitx5-rime fcitx5-chinese-addons rime-wanxiang-pinyin
```

### 7.4 配置输入法环境变量<sup>Optional</sup>

编辑 `/etc/environment` 并添加以下内容：

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
```

## 8 安装常用软件

### 8.1 通过 Pacman 安装

```bash
sudo pacman -S fzf zoxide ripgrep fd eza bat obsidian keepassxc thunderbird thunderbird-i18n-zh-cn vlc mpv yazi 7zip ffmpeg neovim lazygit github-cli btop fastfetch dex poppler resvg imagemagick jq telegram-desktop
```

### 8.2 通过 AUR 安装

```bash
paru -S localsend-bin clash-verge-rev-bin zen-browser-bin
```

## 9 一键安装脚本

```
arch-quickstart/
├── 00-arch-quickstart.sh      # 主菜单脚本
├── 01-base.sh                 # 基础工具和AUR助手
├── 02-archlinuxcn.sh          # ArchlinuxCN仓库配置
├── 03-flatpak.sh              # Flatpak安装
├── 04-refind.sh               # rEFInd引导管理器
├── 05-chezmoi.sh              # Chezmoi配置管理
├── 06-backup-tools.sh         # 备份工具
├── 07-localization.sh         # 中文本地化配置
├── 08-software-pacman.sh      # Pacman软件安装
└── 09-software-aur.sh         # AUR软件安装
```

### 9.1 `00-arch-quickstart.sh`

```bash
#!/bin/bash

set -e  # 遇到错误立即退出

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 显示主菜单
show_menu() {
    clear
    echo "=== Arch Linux 快速配置菜单 / Quick Setup Menu ==="
    echo "1. 全部运行 / Run All (Complete Setup)"
    echo "2. 基础工具和AUR助手 / Base Tools & AUR Helper"
    echo "3. ArchlinuxCN仓库配置 / ArchlinuxCN Repository Setup"
    echo "4. Flatpak安装 / Flatpak Installation"
    echo "5. rEFInd引导管理器 / rEFInd Boot Manager"
    echo "6. Chezmoi配置管理 / Chezmoi Configuration Manager"
    echo "7. 备份工具安装 / Backup Tools Installation"
    echo "8. 中文本地化配置 / Chinese Localization Setup"
    echo "9. 常用软件 (Pacman) / Common Software (Pacman)"
    echo "10. 常用软件 (AUR) / Common Software (AUR)"
    echo "0. 退出 / Exit"
    echo ""
}

# 运行指定脚本
run_script() {
    local script_num=$1
    local script_name=""
    
    case $script_num in
        0) echo "再见! / Goodbye!"; exit 0 ;;
        1) echo "开始完整配置… / Starting complete setup…" ;;
        2) script_name="01-base.sh" ;;
        3) script_name="02-archlinuxcn.sh" ;;
        4) script_name="03-flatpak.sh" ;;
        5) script_name="04-refind.sh" ;;
        6) script_name="05-chezmoi.sh" ;;
        7) script_name="06-backup-tools.sh" ;;
        8) script_name="07-localization.sh" ;;
        9) script_name="08-software-pacman.sh" ;;
        10) script_name="09-software-aur.sh" ;;
        *) echo "无效选项 / Invalid option"; return 1 ;;
    esac
    
    if [ "$script_num" -eq 0 ]; then
        # 选项 0 是退出，在 case 语句中已经处理
        return 0
    elif [ "$script_num" -eq 1 ]; then
        # 运行所有脚本（按数字顺序）
        for script in "$SCRIPT_DIR"/{01,02,03,04,05,06,07,08,09}-*.sh; do
            if [ -f "$script" ] && [ -x "$script" ]; then
                echo "执行: $(basename "$script") / Executing: $(basename "$script")"
                "$script"
                echo ""
            fi
        done
        echo "✓ 所有配置完成! / All configurations completed!"
    elif [ -n "$script_name" ]; then
        local script_path="$SCRIPT_DIR/$script_name"
        if [ -f "$script_path" ] && [ -x "$script_path" ]; then
            echo "执行: $script_name / Executing: $script_name"
            "$script_path"
        else
            echo "错误: 脚本 $script_name 不存在或不可执行 / Error: Script $script_name does not exist or is not executable"
            return 1
        fi
    fi
    
    return 0
}

# 主循环
while true; do
    show_menu
    read -p "请选择操作 / Please select an option [0-10]: " choice
    
    if run_script "$choice"; then
        # 所有成功的选项都需要等待用户按键
        echo ""
        read -p "按回车键返回主菜单… / Press Enter to return to main menu…"
    else
        echo "执行失败，请检查错误信息 / Execution failed, please check error messages"
        read -p "按回车键返回主菜单… / Press Enter to return to main menu…"
    fi
done
```

### 9.2 `01-base.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装基础工具和 AUR 助手 / Install basic tools and AUR helpers ==="

# 检查网络连接 / Check network connection
echo "检查网络连接... / Checking network connection..."
if ! ping -c 1 archlinux.org &> /dev/null; then
    echo "错误: 无法连接到网络，请检查网络连接 / Error: Cannot connect to network, please check network connection"
    exit 1
fi

# 更新系统 / Update system
echo "更新系统... / Updating system..."
sudo pacman -Syu --noconfirm
echo "✓ 系统更新完成 / ✓ System update completed"

# 安装 git 和基础开发工具 / Install git and basic development tools
echo "安装 git 和基础开发工具... / Installing git and basic development tools..."
sudo pacman -S --needed --noconfirm git base-devel
echo "✓ git 和基础开发工具安装完成 / ✓ git and basic development tools installed"

# 安装 pacman 工具 / Install pacman tools
echo "安装 pacman-contrib 和 reflector... / Installing pacman-contrib and reflector..."
sudo pacman -S --noconfirm pacman-contrib reflector
echo "✓ pacman-contrib 和 reflector 安装完成 / ✓ pacman-contrib and reflector installed"

# 配置 reflector 服务和定时器 / Configure reflector service and timer
read -p "是否配置 reflector 服务和定时器？(y/N) / Configure reflector service and timer? (y/N): " configure_reflector
if [[ $configure_reflector =~ ^[Yy]$ ]]; then
    echo "配置 reflector 服务和定时器... / Configuring reflector service and timer..."
    
    # 获取脚本所在目录 / Get script directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    REFLECTOR_SCRIPT_DIR="$(dirname "$SCRIPT_DIR")/reflector"
    
    if [[ -f "$REFLECTOR_SCRIPT_DIR/setup_reflector.sh" ]]; then
        # 运行 setup_reflector.sh
        echo "运行 reflector 安装脚本... / Running reflector setup script..."
        sudo "$REFLECTOR_SCRIPT_DIR/setup_reflector.sh"
        echo "✓ reflector 服务和定时器配置完成 / ✓ Reflector service and timer configured"
    else
        echo "警告: 未找到 reflector 安装脚本 / Warning: Reflector setup script not found at $REFLECTOR_SCRIPT_DIR/setup_reflector.sh"
        echo "跳过 reflector 配置 / Skipping reflector configuration"
    fi
else
    echo "跳过 reflector 服务配置 / Skipping reflector service configuration"
fi

# 安装 paru / Install paru
echo "安装 paru... / Installing paru..."
if ! command -v paru &> /dev/null; then
    temp_dir=$(mktemp -d)
    cd "$temp_dir"
    git clone https://aur.archlinux.org/paru.git
    cd paru
    makepkg -si --noconfirm
    cd
    rm -rf "$temp_dir"
    echo "✓ paru 安装成功 / ✓ paru installed successfully"
else
    echo "✓ paru 已安装，跳过 / ✓ paru already installed, skipping"
fi

# 可选：安装 yay / Optional: install yay
read -p "是否安装 yay 作为备用 AUR 助手？(y/N) / Install yay as alternative AUR helper? (y/N): " install_yay
if [[ $install_yay =~ ^[Yy]$ ]]; then
    echo "安装 yay... / Installing yay..."
    if ! command -v yay &> /dev/null; then
        temp_dir=$(mktemp -d)
        cd "$temp_dir"
        git clone https://aur.archlinux.org/yay.git
        cd yay
        makepkg -si --noconfirm
        cd
        rm -rf "$temp_dir"
        echo "✓ yay 安装成功 / ✓ yay installed successfully"
    else
        echo "✓ yay 已安装，跳过 / ✓ yay already installed, skipping"
    fi
fi

echo "✓ 基础工具和 AUR 助手安装完成 / ✓ Basic tools and AUR helpers installation completed"
```

### 9.3 `02-archlinuxcn.sh`

```bash
#!/bin/bash

set -e

echo "=== 配置 ArchlinuxCN 仓库 / Configuring ArchlinuxCN Repository ==="

# 检查是否已配置 archlinuxcn / Check if archlinuxcn is already configured
if ! sudo grep -q "\[archlinuxcn\]" /etc/pacman.conf; then
    echo "添加 ArchlinuxCN 仓库到 pacman.conf... / Adding ArchlinuxCN repository to pacman.conf..."
    echo -e "\n[archlinuxcn]\nServer = https://repo.archlinuxcn.org/\$arch" | sudo tee -a /etc/pacman.conf > /dev/null
    
    # 导入 GPG 密钥 / Import GPG key
    echo "导入 ArchlinuxCN GPG 密钥... / Importing ArchlinuxCN GPG key..."
    sudo pacman-key --lsign-key "farseerfc@archlinux.org"
    
    # 更新并安装密钥环 / Update and install keyring
    echo "安装 archlinuxcn-keyring... / Installing archlinuxcn-keyring..."
    sudo pacman -Sy --noconfirm archlinuxcn-keyring
    echo "✓ ArchlinuxCN 仓库配置成功 / ArchlinuxCN repository configured successfully"
else
    echo "✓ ArchlinuxCN 仓库已配置，跳过 / ArchlinuxCN repository already configured, skipping"
fi
```

### 9.4 `03-flatpak.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装 Flatpak / Installing Flatpak ==="

# 安装 Flatpak / Install Flatpak
echo "安装 Flatpak… / Installing Flatpak…"
sudo pacman -S --noconfirm flatpak
echo "✓ Flatpak 安装完成 / Flatpak installation completed"
```

### 9.5 `04-refind.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装 rEFInd 引导管理器 / Installing rEFInd Boot Manager ==="

# 安装 rEFInd / Install rEFInd
echo "安装 rEFInd 引导管理器… / Installing rEFInd boot manager…"
sudo pacman -S --noconfirm refind

echo "安装 rEFInd 到 EFI 系统分区… / Installing rEFInd to EFI system partition…"
sudo refind-install

echo "✓ rEFInd 安装完成 / rEFInd installation completed"
```

### 9.6 `05-chezmoi.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装 Chezmoi 并初始化配置 / Installing Chezmoi and Initializing Configuration ==="

# 安装 Chezmoi / Install Chezmoi
echo "安装 Chezmoi... / Installing Chezmoi..."
sudo pacman -S --noconfirm chezmoi

echo "初始化 dotfiles 配置... / Initializing dotfiles configuration..."
chezmoi init https://github.com/Cyanix-0721/dotfiles.git -a

echo "✓ Chezmoi 安装和初始化完成 / Chezmoi installation and initialization completed"
```

### 9.7 `06-backup-tools.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装备份工具 / Installing Backup Tools ==="

# 安装备份工具 / Install backup tools
echo "安装备份工具… / Installing backup tools…"
sudo pacman -S --noconfirm snapper btrfs-assistant
echo "✓ 备份工具安装完成 / Backup tools installation completed"
```

### 9.8 `07-localization.sh`

```bash
#!/bin/bash

set -e

echo "=== 中文本地化配置 / Chinese Localization Configuration ==="

# 安装中文字体 / Install Chinese fonts
echo "安装中文字体… / Installing Chinese fonts…"
sudo pacman -S --noconfirm adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts noto-fonts-cjk noto-fonts-emoji wqy-microhei wqy-microhei-lite wqy-bitmapfont wqy-zenhei ttf-arphic-ukai ttf-arphic-uming ttf-jetbrains-mono ttf-jetbrains-mono-nerd ttf-sarasa-gothic
echo "✓ 中文字体安装完成 / ✓ Chinese fonts installation completed"

# 清除字体缓存 / Clear font cache
echo "清除字体缓存… / Clearing font cache…"
fc-cache -fv
echo "✓ 字体缓存清除完成 / ✓ Font cache cleared"

# 安装输入法 / Install input method
echo "安装输入法… / Installing input method…"
sudo pacman -S --noconfirm fcitx5-im fcitx5-rime fcitx5-chinese-addons

# 检测并安装 rime-wanxiang-pinyin / Detect and install rime-wanxiang-pinyin
echo "检测 rime-wanxiang-pinyin 安装方式… / Detecting installation method for rime-wanxiang-pinyin…"
if pacman -Si rime-wanxiang-pinyin &> /dev/null; then
    # 从官方仓库安装 / Install from official repository
    echo "从官方仓库安装 rime-wanxiang-pinyin… / Installing rime-wanxiang-pinyin from official repository…"
    sudo pacman -S --noconfirm rime-wanxiang-pinyin
elif command -v paru &> /dev/null && paru -Si rime-wanxiang-pinyin &> /dev/null; then
    # 从 AUR 安装 / Install from AUR
    echo "从 AUR 安装 rime-wanxiang-pinyin… / Installing rime-wanxiang-pinyin from AUR…"
    paru -S --noconfirm rime-wanxiang-pinyin
elif command -v yay &> /dev/null && yay -Si rime-wanxiang-pinyin &> /dev/null; then
    # 从 AUR 安装 / Install from AUR
    echo "从 AUR 安装 rime-wanxiang-pinyin… / Installing rime-wanxiang-pinyin from AUR…"
    yay -S --noconfirm rime-wanxiang-pinyin
else
    echo "警告: 无法安装 rime-wanxiang-pinyin，请确保已添加 archlinuxcn 仓库或安装 AUR 助手 / Warning: Cannot install rime-wanxiang-pinyin, please ensure archlinuxcn repository is added or AUR helper is installed"
    echo "跳过 rime-wanxiang-pinyin 安装 / Skipping rime-wanxiang-pinyin installation"
fi

echo "✓ 输入法安装完成 / ✓ Input method installation completed"

# 配置输入法环境变量（可选） / Configure input method environment variables (optional)
read -p "是否配置输入法环境变量？(y/N) / Configure input method environment variables? (y/N): " -r configure_im

if [[ "$configure_im" =~ ^[Yy]$ ]]; then
    echo "配置输入法环境变量… / Configuring input method environment variables…"
    if ! sudo grep -q "GTK_IM_MODULE=fcitx" /etc/environment; then
        echo -e "\nexport GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx\nexport XMODIFIERS=@im=fcitx" | sudo tee -a /etc/environment > /dev/null
        echo "✓ 输入法环境变量配置完成 / ✓ Input method environment variables configured"
        echo "注意：需要重新登录或重启系统才能使环境变量生效 / Note: You need to re-login or reboot for environment variables to take effect"
    else
        echo "✓ 输入法环境变量已配置，跳过 / ✓ Input method environment variables already configured, skipping"
    fi
else
    echo "✓ 跳过输入法环境变量配置 / ✓ Skipping input method environment variables configuration"
fi

echo "=== 中文本地化配置完成 / Chinese Localization Configuration Completed ==="
```

### 9.9 `08-software-pacman.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装常用软件 (Pacman) / Installing Common Software (Pacman) ==="

# 安装常用软件 (Pacman) / Install common software (Pacman)
echo "安装常用软件 (Pacman)… / Installing common software (Pacman)…"

echo "安装命令行效率工具… / Installing command line efficiency tools…"
sudo pacman -S --noconfirm fzf zoxide ripgrep fd eza bat

echo "安装办公与笔记软件… / Installing office and note-taking software…"
sudo pacman -S --noconfirm obsidian keepassxc thunderbird thunderbird-i18n-zh-cn

echo "安装媒体与工具软件… / Installing media and utility software…"
sudo pacman -S --noconfirm vlc mpv yazi 7zip ffmpeg

echo "安装开发与系统工具… / Installing development and system tools…"
sudo pacman -S --noconfirm neovim lazygit github-cli btop fastfetch dex

echo "安装文档处理工具… / Installing document processing tools…"
sudo pacman -S --noconfirm poppler resvg imagemagick jq

echo "安装通讯软件… / Installing communication software…"
sudo pacman -S --noconfirm telegram-desktop

echo "✓ 常用软件 (Pacman) 安装完成 / Common software (Pacman) installation completed"
```

### 9.10 `09-software-aur.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装常用软件 (AUR) / Installing Common Software (AUR) ==="

# 检查 paru 是否已安装 / Check if paru is installed
if ! command -v paru &> /dev/null; then
    echo "错误: paru 未安装，请先运行基础工具安装脚本 / Error: paru not installed, please run the base tools installation script first"
    exit 1
fi

# 安装常用软件 (AUR) / Install common software (AUR)
echo "安装常用软件 (AUR)… / Installing common software (AUR)…"
paru -S --noconfirm localsend-bin clash-verge-rev-bin zen-browser-bin
echo "✓ 常用软件 (AUR) 安装完成 / Common software (AUR) installation completed"
```

### 9.11 使用方法

1. 将所有脚本放在同一个文件夹中
2. 给所有脚本添加执行权限：

   ```bash
   chmod +x arch-quickstart/*.sh
   ```

3. 运行主脚本：

   ```bash
   ./00-arch-quickstart.sh
   ```

4. 根据菜单选择需要执行的配置
