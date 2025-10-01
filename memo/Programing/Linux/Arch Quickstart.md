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

## 7 安装命令行效率工具

```bash
sudo pacman -S fzf zoxide ripgrep fd eza
```

## 8 安装常用软件

### 8.1 通过 Pacman 安装

```bash
sudo pacman -S obsidian keepassxc vlc mpv 7zip yazi ffmpeg jq poppler resvg imagemagick neovim dex btop fastfetch github-cli lazygit
```

### 8.2 通过 AUR 安装

```bash
paru -S localsend-bin clash-verge-rev-bin zen-browser-bin
```

## 9 中文本地化配置

### 9.1 安装中文字体

```bash
sudo pacman -S adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts noto-fonts-cjk noto-fonts-emoji wqy-microhei wqy-microhei-lite wqy-bitmapfont wqy-zenhei ttf-arphic-ukai ttf-arphic-uming ttf-jetbrains-mono ttf-jetbrains-mono-nerd ttf-sarasa-gothic
```

### 9.2 清除字体缓存

```bash
fc-cache -fv
```

### 9.3 安装输入法

```bash
sudo pacman -S fcitx5-im fcitx5-rime fcitx5-chinese-addons rime-wanxiang-pinyin
```

### 9.4 配置输入法环境变量<sup>Optional</sup>

编辑 `/etc/environment` 并添加以下内容：

```bash
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS=@im=fcitx
```

## 10 一键安装脚本

```
arch-quickstart/
├── 00-arch-quickstart.sh      # 主菜单脚本
├── 01-base.sh                 # 基础工具和AUR助手
├── 02-archlinuxcn.sh          # ArchlinuxCN仓库配置
├── 03-flatpak.sh              # Flatpak安装
├── 04-refind.sh               # rEFInd引导管理器
├── 05-chezmoi.sh              # Chezmoi配置管理
├── 06-backup-tools.sh         # 备份工具
├── 07-cli-tools.sh            # 命令行效率工具
├── 08-software-pacman.sh      # Pacman软件安装
├── 09-software-aur.sh         # AUR软件安装
└── 10-localization.sh         # 中文本地化配置
```

### 10.1 `00-arch-quickstart.sh`

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
    echo "8. 命令行效率工具 / CLI Efficiency Tools"
    echo "9. 常用软件 (Pacman) / Common Software (Pacman)"
    echo "10. 常用软件 (AUR) / Common Software (AUR)"
    echo "11. 中文本地化配置 / Chinese Localization Setup"
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
        8) script_name="07-cli-tools.sh" ;;
        9) script_name="08-software-pacman.sh" ;;
        10) script_name="09-software-aur.sh" ;;
        11) script_name="10-localization.sh" ;;
        *) echo "无效选项 / Invalid option"; return 1 ;;
    esac
    
    if [ "$script_num" -eq 0 ]; then
        # 选项 0 是退出，在 case 语句中已经处理
        return 0
    elif [ "$script_num" -eq 1 ]; then
        # 运行所有脚本（按数字顺序）
        for script in "$SCRIPT_DIR"/{01,02,03,04,05,06,07,08,09,10}-*.sh; do
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
    read -p "请选择操作 / Please select an option [0-11]: " choice
    
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

### 10.2 `01-base.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装基础工具和 AUR 助手 ==="

# 检查网络连接
echo "检查网络连接..."
if ! ping -c 1 archlinux.org &> /dev/null; then
    echo "错误: 无法连接到网络，请检查网络连接"
    exit 1
fi

# 更新系统
echo "更新系统..."
sudo pacman -Syu --noconfirm
echo "✓ 系统更新完成"

# 安装 git 和基础开发工具
echo "安装 git 和基础开发工具..."
sudo pacman -S --needed --noconfirm git base-devel
echo "✓ git 和基础开发工具安装完成"

# 安装 pacman 工具
echo "安装 pacman-contrib 和 reflector..."
sudo pacman -S --noconfirm pacman-contrib reflector
echo "✓ pacman-contrib 和 reflector 安装完成"

# 安装 paru
echo "安装 paru..."
if ! command -v paru &> /dev/null; then
    temp_dir=$(mktemp -d)
    cd "$temp_dir"
    git clone https://aur.archlinux.org/paru.git
    cd paru
    makepkg -si --noconfirm
    cd
    rm -rf "$temp_dir"
    echo "✓ paru 安装成功"
else
    echo "✓ paru 已安装，跳过"
fi

# 可选：安装 yay
read -p "是否安装 yay 作为备用 AUR 助手？(y/N): " install_yay
if [[ $install_yay =~ ^[Yy]$ ]]; then
    echo "安装 yay..."
    if ! command -v yay &> /dev/null; then
        temp_dir=$(mktemp -d)
        cd "$temp_dir"
        git clone https://aur.archlinux.org/yay.git
        cd yay
        makepkg -si --noconfirm
        cd
        rm -rf "$temp_dir"
        echo "✓ yay 安装成功"
    else
        echo "✓ yay 已安装，跳过"
    fi
fi

echo "✓ 基础工具和 AUR 助手安装完成"
```

### 10.3 `02-archlinuxcn.sh`

```bash
#!/bin/bash

set -e

echo "=== 配置 ArchlinuxCN 仓库 ==="

# 检查是否已配置 archlinuxcn
if ! sudo grep -q "\[archlinuxcn\]" /etc/pacman.conf; then
    echo "添加 ArchlinuxCN 仓库到 pacman.conf..."
    echo -e "\n[archlinuxcn]\nServer = https://repo.archlinuxcn.org/\$arch" | sudo tee -a /etc/pacman.conf > /dev/null
    
    # 导入 GPG 密钥
    echo "导入 ArchlinuxCN GPG 密钥..."
    sudo pacman-key --lsign-key "farseerfc@archlinux.org"
    
    # 更新并安装密钥环
    echo "安装 archlinuxcn-keyring..."
    sudo pacman -Sy --noconfirm archlinuxcn-keyring
    echo "✓ ArchlinuxCN 仓库配置成功"
else
    echo "✓ ArchlinuxCN 仓库已配置，跳过"
fi
```

### 10.4 `03-flatpak.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装 Flatpak ==="

# 安装 Flatpak
echo "安装 Flatpak..."
sudo pacman -S --noconfirm flatpak
echo "✓ Flatpak 安装完成"
```

### 10.5 `04-refind.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装 rEFInd 引导管理器 ==="

# 安装 rEFInd
echo "安装 rEFInd 引导管理器..."
sudo pacman -S --noconfirm refind
echo "安装 rEFInd 到 EFI 系统分区..."
sudo refind-install
echo "✓ rEFInd 安装完成"
```

### 10.6 `05-chezmoi.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装 Chezmoi 并初始化配置 ==="

# 安装 Chezmoi
echo "安装 Chezmoi..."
sudo pacman -S --noconfirm chezmoi
echo "初始化 dotfiles 配置..."
chezmoi init https://github.com/Cyanix-0721/dotfiles.git -a
echo "✓ Chezmoi 安装和初始化完成"
```

### 10.7 `06-backup-tools.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装备份工具 ==="

# 安装备份工具
echo "安装备份工具..."
sudo pacman -S --noconfirm snapper btrfs-assistant
echo "✓ 备份工具安装完成"
```

### 10.8 `07-cli-tools.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装命令行效率工具 ==="

# 安装命令行效率工具
echo "安装命令行效率工具..."
sudo pacman -S --noconfirm fzf zoxide ripgrep fd eza
echo "✓ 命令行效率工具安装完成"
```

### 10.9 `08-software-pacman.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装常用软件 (Pacman) ==="

# 安装常用软件 (Pacman)
echo "安装常用软件 (Pacman)..."
sudo pacman -S --noconfirm obsidian keepassxc vlc mpv 7zip yazi ffmpeg jq poppler resvg imagemagick neovim dex btop fastfetch github-cli lazygit
echo "✓ 常用软件 (Pacman) 安装完成"
```

### 10.10 `09-software-aur.sh`

```bash
#!/bin/bash

set -e

echo "=== 安装常用软件 (AUR) ==="

# 检查 paru 是否已安装
if ! command -v paru &> /dev/null; then
    echo "错误: paru 未安装，请先运行基础工具安装脚本"
    exit 1
fi

# 安装常用软件 (AUR)
echo "安装常用软件 (AUR)..."
paru -S --noconfirm localsend-bin clash-verge-rev-bin zen-browser-bin
echo "✓ 常用软件 (AUR) 安装完成"
```

### 10.11 `10-localization.sh`

```bash
#!/bin/bash

set -e

echo "=== 中文本地化配置 ==="

# 安装中文字体
echo "安装中文字体…"
sudo pacman -S --noconfirm adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts noto-fonts-cjk noto-fonts-emoji wqy-microhei wqy-microhei-lite wqy-bitmapfont wqy-zenhei ttf-arphic-ukai ttf-arphic-uming ttf-jetbrains-mono ttf-jetbrains-mono-nerd ttf-sarasa-gothic
echo "✓ 中文字体安装完成"

# 清除字体缓存
echo "清除字体缓存…"
fc-cache -fv
echo "✓ 字体缓存清除完成"

# 安装输入法
echo "安装输入法…"
sudo pacman -S --noconfirm fcitx5-im fcitx5-rime fcitx5-chinese-addons rime-wanxiang-pinyin
echo "✓ 输入法安装完成"

# 配置输入法环境变量（可选）
echo "是否配置输入法环境变量？(y/N)"
read -r configure_im

if [[ "$configure_im" =~ ^[Yy]$ ]]; then
    echo "配置输入法环境变量…"
    if ! sudo grep -q "GTK_IM_MODULE=fcitx" /etc/environment; then
        echo -e "\nexport GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx\nexport XMODIFIERS=@im=fcitx" | sudo tee -a /etc/environment > /dev/null
        echo "✓ 输入法环境变量配置完成"
        echo "注意：需要重新登录或重启系统才能使环境变量生效"
    else
        echo "✓ 输入法环境变量已配置，跳过"
    fi
else
    echo "✓ 跳过输入法环境变量配置"
fi

echo "=== 中文本地化配置完成 ==="
```

### 10.12 使用方法

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
