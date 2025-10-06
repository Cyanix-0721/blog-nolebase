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

## 5 安装备份工具

> [[Arch Linux + Btrfs 防滚挂]]

```bash
sudo pacman -S snapper btrfs-assistant
```

## 6 安装 Chezmoi 并初始化配置

> [[chezmoi]]

```bash
sudo pacman -S chezmoi
chezmoi init https://github.com/Cyanix-0721/dotfiles.git -a
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

![[Chinese#2.2 Usage]]

## 8 安装常用软件

### 8.1 通过 Pacman 安装

```bash
sudo pacman -S fzf zoxide ripgrep fd eza bat obsidian keepassxc thunderbird thunderbird-i18n-zh-cn vlc mpv yazi 7zip ffmpeg neovim lazygit github-cli btop fastfetch dex poppler resvg imagemagick jq telegram-desktop podman podman-compose uv libreoffice-fresh libreoffice-fresh-zh-cn gimp stow ast-grep git-delta dolphin nautilus mako fuzzel
```

### 8.2 通过 AUR 安装

```bash
paru -S localsend-bin clash-verge-rev-bin zen-browser-bin ungoogled-chromium-bin bibata-cursor-theme-bin qt6ct-kde
```

## 9 一键安装脚本

```
arch-quickstart/
├── 00-arch-quickstart.sh       # 主菜单脚本
├── 01-system-foundation.sh     # 系统基础环境配置
├── 02-system-tools.sh          # 系统工具
├── 03-chinese-localization.sh  # 中文本地化配置
└── 04-essential-packages.sh    # 必备软件包
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
    echo "2. 系统基础环境配置 / System Foundation Setup"
    echo "3. 系统工具安装 / System Tools Installation"
    echo "4. 中文本地化配置 / Chinese Localization Setup"
    echo "5. 必备软件包安装 / Essential Packages Installation"
    echo "0. 退出 / Exit"
    echo ""
}

# 运行指定脚本
run_script() {
    local script_num=$1
    local script_name=""
    
    case $script_num in
        0) echo "再见! / Goodbye!"; exit  ;;
        1) echo "开始完整配置… / Starting complete setup…" ;;
        2) script_name="01-system-foundation.sh" ;;
        3) script_name="02-system-tools.sh" ;;
        4) script_name="03-chinese-localization.sh" ;;
        5) script_name="04-essential-packages.sh" ;;
        *) echo "无效选项 / Invalid option"; return 1 ;;
    esac
    
    if [ "$script_num" -eq 0 ]; then
        # 选项 0 是退出，在 case 语句中已经处理
        return 0
    elif [ "$script_num" -eq 1 ]; then
        # 运行所有脚本（按数字顺序）
        for script in "$SCRIPT_DIR"/{01,02,03,04}-*.sh; do
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
    read -p "请选择操作 / Please select an option [0-5]: " choice
    
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

### 9.2 `01-system-foundation.sh`

```bash
#!/bin/bash

set -e

echo "=== 系统基础环境配置 / System Foundation Setup ==="

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

# 配置 ArchlinuxCN 仓库 / Configure ArchlinuxCN Repository
read -p "是否配置 ArchlinuxCN 仓库？(y/N) / Configure ArchlinuxCN repository? (y/N): " configure_archlinuxcn
if [[ $configure_archlinuxcn =~ ^[Yy]$ ]]; then
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
else
    echo "跳过 ArchlinuxCN 仓库配置 / Skipping ArchlinuxCN repository configuration"
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

# 安装 Flatpak / Install Flatpak
read -p "是否安装 Flatpak？(Y/n) / Install Flatpak? (Y/n): " install_flatpak
if [[ ! $install_flatpak =~ ^[Nn]$ ]]; then
    echo "=== 安装 Flatpak / Installing Flatpak ==="
    
    # 安装 Flatpak / Install Flatpak
    echo "安装 Flatpak… / Installing Flatpak…"
    sudo pacman -S --noconfirm flatpak
    echo "✓ Flatpak 安装完成 / Flatpak installation completed"
else
    echo "跳过 Flatpak 安装 / Skipping Flatpak installation"
fi

echo "✓ 系统基础环境配置完成 / ✓ System foundation setup completed"
```

### 9.3 `02-system-tools.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装系统工具 / Installing System Tools ==="

# rEFInd 引导管理器
echo "=== rEFInd 引导管理器 / rEFInd Boot Manager ==="

# 检查 rEFInd 是否已安装
if command -v refind-install &> /dev/null; then
    echo "✓ rEFInd 已安装 / rEFInd is already installed"
    refind_available=true
else
    read -p "是否安装 rEFInd 引导管理器？(Y/n) / Install rEFInd boot manager? (Y/n): " install_refind
    if [[ ! $install_refind =~ ^[Nn]$ ]]; then
        echo "安装 rEFInd 引导管理器… / Installing rEFInd boot manager…"
        sudo pacman -S --noconfirm refind
        
        # 验证安装是否成功
        if command -v refind-install &> /dev/null; then
            echo "✓ rEFInd 安装完成 / rEFInd installation completed"
            refind_available=true
        else
            echo "✗ rEFInd 安装失败 / rEFInd installation failed"
            refind_available=false
        fi
    else
        echo "跳过 rEFInd 安装 / Skipping rEFInd installation"
        refind_available=false
    fi
fi

# 询问是否运行 refind-install (仅在工具可用时)
if [[ $refind_available == "true" ]]; then
    read -p "是否运行 refind-install 安装到 EFI 系统分区？(Y/n) / Run refind-install to install to EFI system partition? (Y/n): " run_refind_install
    if [[ ! $run_refind_install =~ ^[Nn]$ ]]; then
        echo "安装 rEFInd 到 EFI 系统分区… / Installing rEFInd to EFI system partition…"
        sudo refind-install
        echo "✓ rEFInd 已安装到 EFI 系统分区 / rEFInd installed to EFI system partition"
    else
        echo "跳过 refind-install / Skipping refind-install"
    fi
fi

# 安装 rEFInd 主题 (仅在 rEFInd 可用时)
if [[ $refind_available == "true" ]]; then
    echo "=== rEFInd 主题安装 / rEFInd Theme Installation ==="
    read -p "是否安装 Catppuccin 主题？(Y/n) / Install Catppuccin theme? (Y/n): " install_refind_theme
    if [[ ! $install_refind_theme =~ ^[Nn]$ ]]; then
        
        # 查找 rEFInd 目录
        REFIND_DIR=""
        if [[ -d "/boot/EFI/refind" ]]; then
            REFIND_DIR="/boot/EFI/refind"
            echo "找到 rEFInd 目录: $REFIND_DIR / Found rEFInd directory: $REFIND_DIR"
        else
            # 在 /boot 下搜索 refind 文件夹
            echo "在 /boot 下搜索 rEFInd 目录… / Searching for rEFInd directory in /boot…"
            REFIND_SEARCH=$(find /boot -type d -name "refind" 2>/dev/null | head -n1)
            if [[ -n "$REFIND_SEARCH" && -d "$REFIND_SEARCH" ]]; then
                REFIND_DIR="$REFIND_SEARCH"
                echo "找到 rEFInd 目录: $REFIND_DIR / Found rEFInd directory: $REFIND_DIR"
            else
                echo "✗ 未找到 rEFInd 目录，跳过主题安装 / rEFInd directory not found, skipping theme installation"
            fi
        fi
        
        # 如果找到 rEFInd 目录，安装主题
        if [[ -n "$REFIND_DIR" ]]; then
            # 创建 themes 目录
            THEMES_DIR="$REFIND_DIR/themes"
            echo "创建主题目录: $THEMES_DIR / Creating theme directory: $THEMES_DIR"
            sudo mkdir -p "$THEMES_DIR"
            
            # 克隆主题
            echo "克隆 Catppuccin 主题… / Cloning Catppuccin theme…"
            if command -v git &> /dev/null; then
                sudo git clone https://github.com/catppuccin/refind.git "$THEMES_DIR/catppuccin"
                
                # 选择主题口味
                echo "请选择主题口味 / Please select theme flavor:"
                echo "1) latte"
                echo "2) frappe" 
                echo "3) macchiato"
                echo "4) mocha (默认/default)"
                read -p "输入选择 (1-4) / Enter choice (1-4) [4]: " flavor_choice
                
                case $flavor_choice in
                    1) FLAVOR="latte" ;;
                    2) FLAVOR="frappe" ;;
                    3) FLAVOR="macchiato" ;;
                    *) FLAVOR="mocha" ;;
                esac
                
                echo "选择的口味: $FLAVOR / Selected flavor: $FLAVOR"
                
                # 检查主题文件是否存在
                THEME_CONF="$THEMES_DIR/catppuccin/${FLAVOR}.conf"
                if [[ -f "$THEME_CONF" ]]; then
                    # 备份原配置文件
                    REFIND_CONF="$REFIND_DIR/refind.conf"
                    if [[ -f "$REFIND_CONF" ]]; then
                        sudo cp "$REFIND_CONF" "$REFIND_CONF.bak"
                        echo "已备份原配置文件: $REFIND_CONF.bak / Original config backed up: $REFIND_CONF.bak"
                    fi
                    
                    # 添加主题配置到 refind.conf
                    echo "添加主题配置到 refind.conf… / Adding theme configuration to refind.conf…"
                    INCLUDE_LINE="include themes/catppuccin/${FLAVOR}.conf"
                    
                    # 检查是否已包含该主题
                    if ! sudo grep -q "include themes/catppuccin/" "$REFIND_CONF" 2>/dev/null; then
                        echo "$INCLUDE_LINE" | sudo tee -a "$REFIND_CONF" > /dev/null
                        echo "✓ 主题配置已添加 / Theme configuration added"
                    else
                        echo "✓ 主题配置已存在 / Theme configuration already exists"
                    fi
                    
                    echo "✓ Catppuccin 主题安装完成 / Catppuccin theme installation completed"
                else
                    echo "✗ 主题配置文件不存在: $THEME_CONF / Theme config file not found: $THEME_CONF"
                fi
            else
                echo "✗ git 未安装，无法克隆主题 / git not installed, cannot clone theme"
            fi
        fi
    else
        echo "跳过 rEFInd 主题安装 / Skipping rEFInd theme installation"
    fi
fi

# 备份工具
echo "=== 备份工具 / Backup Tools ==="
read -p "是否安装备份工具？(Y/n) / Install backup tools? (Y/n): " install_backup_tools
if [[ ! $install_backup_tools =~ ^[Nn]$ ]]; then
    echo "安装备份工具… / Installing backup tools…"
    sudo pacman -S --noconfirm snapper btrfs-assistant
    echo "✓ 备份工具安装完成 / Backup tools installation completed"
else
    echo "跳过备份工具安装 / Skipping backup tools installation"
fi

# Chezmoi 配置管理工具
echo "=== Chezmoi 配置管理工具 / Chezmoi Configuration Management Tool ==="

# 检查 Chezmoi 是否已安装
if command -v chezmoi &> /dev/null; then
    echo "✓ Chezmoi 已安装 / Chezmoi is already installed"
    chezmoi_available=true
else
    read -p "是否安装 Chezmoi 配置管理工具？(Y/n) / Install Chezmoi configuration management tool? (Y/n): " install_chezmoi
    if [[ ! $install_chezmoi =~ ^[Nn]$ ]]; then
        echo "安装 Chezmoi… / Installing Chezmoi…"
        sudo pacman -S --noconfirm chezmoi
        
        # 验证安装是否成功
        if command -v chezmoi &> /dev/null; then
            echo "✓ Chezmoi 安装完成 / Chezmoi installation completed"
            chezmoi_available=true
        else
            echo "✗ Chezmoi 安装失败 / Chezmoi installation failed"
            chezmoi_available=false
        fi
    else
        echo "跳过 Chezmoi 安装 / Skipping Chezmoi installation"
        chezmoi_available=false
    fi
fi

# 询问是否初始化 dotfiles (仅在工具可用时)
if [[ $chezmoi_available == "true" ]]; then
    read -p "是否初始化 dotfiles 配置？(Y/n) / Initialize dotfiles configuration? (Y/n): " init_chezmoi
    if [[ ! $init_chezmoi =~ ^[Nn]$ ]]; then
        echo "初始化 dotfiles 配置… / Initializing dotfiles configuration…"
        chezmoi init https://github.com/Cyanix-0721/dotfiles.git -a
        echo "✓ dotfiles 配置初始化完成 / dotfiles configuration initialized"
    else
        echo "跳过 dotfiles 配置初始化 / Skipping dotfiles configuration initialization"
    fi
fi

echo "✓ 系统工具安装完成 / System tools installation completed"
```

### 9.4 `03-chinese-localization.sh`

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
    
    # 创建配置目录（如果不存在）
    mkdir -p ~/.config/environment.d
    
    # 创建输入法环境变量配置文件
    cat > ~/.config/environment.d/fcitx.conf << 'EOF'
# 基础输入法环境变量
INPUT_METHOD=fcitx
XMODIFIERS=@im=fcitx

# 各框架输入法模块
QT_IM_MODULE=fcitx
GTK_IM_MODULE=fcitx
SDL_IM_MODULE=fcitx
GLFW_IM_MODULE=fcitx
EOF

    echo "✓ 输入法环境变量配置完成 / ✓ Input method environment variables configured"
    echo "配置文件位置：~/.config/environment.d/fcitx.conf"
    echo "注意：需要重新登录或重启系统才能使环境变量生效 / Note: You need to re-login or reboot for environment variables to take effect"
else
    echo "✓ 跳过输入法环境变量配置 / ✓ Skipping input method environment variables configuration"
fi

echo "=== 中文本地化配置完成 / Chinese Localization Configuration Completed ==="
```

### 9.5 `04-essential-packages.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装常用软件 / Installing Common Software ==="

# 检查 paru 是否已安装
if ! command -v paru &>/dev/null; then
  echo "错误: paru 未安装，请先运行系统基础环境配置脚本 / Error: paru not installed, please run the system foundation setup script first"
  exit 1
fi

echo "安装命令行工具… / Installing command line tools…"
sudo pacman -S --noconfirm fzf zoxide ripgrep fd eza bat stow btop fastfetch dex

echo "安装开发工具… / Installing development tools…"
sudo pacman -S --noconfirm neovim lazygit github-cli uv ast-grep git-delta poppler resvg imagemagick jq

echo "安装系统工具… / Installing system tools…"
sudo pacman -S --noconfirm mako fuzzel

echo "安装网络工具… / Installing network tools…"
paru -S --noconfirm clash-verge-rev-bin

echo "安装日常应用… / Installing daily applications…"
sudo pacman -S --noconfirm obsidian keepassxc thunderbird thunderbird-i18n-zh-cn libreoffice-fresh libreoffice-fresh-zh-cn vlc mpv ffmpeg gimp yazi 7zip telegram-desktop dolphin nautilus
paru -S --noconfirm zen-browser-bin ungoogled-chromium-bin localsend-bin bibata-cursor-theme-bin qt6ct-kde

# 询问是否安装 Podman
echo -n "是否安装 Podman 和 podman-compose？[Y/n] / Install Podman and podman-compose? [Y/n]: "
read -r install_podman

install_podman=${install_podman:-Y}

if [[ $install_podman =~ ^[Yy]$ ]]; then
  echo "安装容器工具… / Installing container tools…"
  sudo pacman -S --noconfirm podman podman-compose

  echo "配置 Podman 镜像源… / Configuring Podman registry mirror…"
  sudo tee /etc/containers/registries.conf.d/10-unqualified-search-registries.conf <<EOF
unqualified-search-registries = ["docker.io"]
EOF

  echo "✓ Podman 安装和配置完成 / Podman installation and configuration completed"
else
  echo "跳过 Podman 安装 / Skipping Podman installation"
fi

# 询问是否安装 LazyVim
echo -n "是否安装 LazyVim Starter？[y/N] / Install LazyVim Starter? [y/N]: "
read -r install_lazyvim

install_lazyvim=${install_lazyvim:-N}

if [[ $install_lazyvim =~ ^[Yy]$ ]]; then
  echo "安装 LazyVim Starter… / Installing LazyVim Starter…"

  # 询问是否备份现有配置
  echo -n "是否备份现有 Neovim 配置？[Y/n] / Backup existing Neovim configuration? [Y/n]: "
  read -r backup_nvim

  backup_nvim=${backup_nvim:-Y}

  if [[ $backup_nvim =~ ^[Yy]$ ]]; then
    echo "备份 Neovim 配置… / Backing up Neovim configuration…"
    # 必需备份
    mv ~/.config/nvim ~/.config/nvim.bak 2>/dev/null || echo "无现有 nvim 配置可备份 / No existing nvim configuration to backup"

    # 可选但推荐的备份
    mv ~/.local/share/nvim ~/.local/share/nvim.bak 2>/dev/null || echo "无 nvim 共享数据可备份 / No nvim share data to backup"
    mv ~/.local/state/nvim ~/.local/state/nvim.bak 2>/dev/null || echo "无 nvim 状态数据可备份 / No nvim state data to backup"
    mv ~/.cache/nvim ~/.cache/nvim.bak 2>/dev/null || echo "无 nvim 缓存可备份 / No nvim cache to backup"

    echo "✓ Neovim 配置备份完成 / Neovim configuration backup completed"
  fi

  # 克隆 LazyVim starter
  git clone https://github.com/LazyVim/starter ~/.config/nvim

  # 删除 .git 文件夹
  rm -rf ~/.config/nvim/.git

  echo "✓ LazyVim Starter 安装完成 / LazyVim Starter installation completed"
  echo ""
  echo "提示 / Tip:"
  echo "  1. 运行 'nvim' 启动 Neovim / Run 'nvim' to start Neovim"
  echo "  2. 建议运行 :LazyHealth 检查安装状态 / It is recommended to run :LazyHealth to check if everything is working correctly"
  echo "  3. 参考配置文件中的注释来自定义 LazyVim / Refer to the comments in the files on how to customize LazyVim"
else
  echo "跳过 LazyVim 安装 / Skipping LazyVim installation"
fi

echo "✓ 常用软件安装完成 / Common software installation completed"
```

### 9.6 使用方法

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
