# Arch Linux 下效率工具指南：fzf、zoxide、ripgrep、fd、eza

## 1 安装

### 1.1 基础安装

```bash
# 使用 pacman 安装
sudo pacman -S fzf zoxide ripgrep fd eza

# 或使用 paru 从 AUR 安装（如需最新版本）
paru -S fzf-git zoxide-git ripgrep-git fd-git eza-git
```

### 1.2 依赖项说明

- **fzf**: 需要 bash、zsh 或 fish shell
- **zoxide**: 依赖 fzf 进行交互式选择
- **ripgrep**: 无特殊依赖
- **fd**: 无特殊依赖  
- **eza**: 需要 libgit2

## 2 各工具详细介绍

### 2.1 Fzf - 模糊查找器

#### 2.1.1 基本使用

```bash
# 文件搜索（递归当前目录）
fzf

# 指定搜索目录
find ~/projects | fzf

# 预览文件内容
fzf --preview 'cat {}'
```

#### 2.1.2 与 Shell 集成

在 `~/.bashrc` 或 `~/.zshrc` 中添加：

```bash
# 文件搜索快捷键 Ctrl+T
source /usr/share/fzf/key-bindings.bash
source /usr/share/fzf/completion.bash

# 或对于 zsh
source /usr/share/fzf/key-bindings.zsh
source /usr/share/fzf/completion.zsh
```

#### 2.1.3 实用别名

```bash
# 快速搜索文件并编辑
alias vf='vim $(fzf)'

# 搜索历史命令
alias hf='history | fzf'

# 搜索进程并杀死
alias pk='ps aux | fzf | awk "{print \$2}" | xargs kill -9'
```

### 2.2 Zoxide - 智能目录跳转

#### 2.2.1 初始化配置

在 shell 配置文件中添加：

```bash
eval "$(zoxide init bash)"
# 对于 zsh: eval "$(zoxide init zsh)"
# 对于 fish: zoxide init fish | source
```

#### 2.2.2 基本命令

```bash
# 跳转到目录（自动学习常用目录）
z project-name

# 交互式选择目录
zi

# 跳转到包含关键词的目录
z code proj

# 返回上一个目录
z -
```

#### 2.2.3 高级用法

```bash
# 查询目录评分（使用频率）
zoxide query -i

# 删除目录记录
zoxide remove /path/to/dir

# 使用正则表达式搜索
zoxide query -e '.*project.*'
```

### 2.3 Ripgrep (rg) - 快速文本搜索

#### 2.3.1 基本搜索

```bash
# 在当前目录递归搜索
rg "search_pattern"

# 搜索特定文件类型
rg "function" -t js

# 忽略大小写
rg -i "pattern"

# 显示行号
rg -n "pattern"
```

#### 2.3.2 高级功能

```bash
# 搜索并替换（配合sed）
rg "old_text" -l | xargs sed -i 's/old_text/new_text/g'

# 搜索二进制文件中的文本
rg -a "binary_pattern"

# 使用正则表达式
rg "^#.*" -t md

# 排除目录
rg "pattern" --glob '!node_modules'
```

### 2.4 Fd - 现代化文件查找

#### 2.4.1 基本用法

```bash
# 简单文件搜索
fd "pattern"

# 搜索特定扩展名
fd -e md

# 搜索隐藏文件
fd -H "pattern"

# 忽略大小写
fd -i "PATTERN"
```

#### 2.4.2 高级选项

```bash
# 执行命令于找到的文件
fd -e txt -x echo "Found: {}"

# 搜索空目录
fd -t d -e empty

# 限制搜索深度
fd -d 3 "pattern"

# 排除.gitignore中的文件
fd -I "pattern"
```

### 2.5 Eza - 增强的 Ls 命令

#### 2.5.1 基本使用

```bash
# 替代 ls
eza

# 显示详细信息
eza -l

# 显示隐藏文件
eza -a

# 递归显示
eza -R
```

#### 2.5.2 高级显示选项

```bash
# 树状结构显示
eza -T

# 按文件大小排序
eza -lS size

# 按修改时间排序
eza -lS modified

# 显示git状态
eza -lg --git

# 彩色网格显示
eza -G
```

## 3 工具联动使用

### 3.1 文件搜索与编辑工作流

```bash
# 使用 fd + fzf 快速查找并编辑文件
vim $(fd -t f | fzf --preview 'bat {}')

# 搜索内容并编辑匹配文件
vim $(rg -l "pattern" | fzf --preview 'rg --color=always "pattern" {}')
```

### 3.2 目录导航工作流

```bash
# 使用 zoxide + fzf 快速跳转
cd $(zoxide query -l | fzf)

# 结合 eza 预览目录内容
zoxide query -l | fzf --preview 'eza -T --color=always {}'
```

### 3.3 综合搜索工作流

```bash
# 创建综合搜索函数
search() {
    local result
    result=$(rg --color=always -n "$1" | fzf --ansi --preview 'bat --color=always {1} --highlight-line {2}' --preview-window=up:60%)
    if [ -n "$result" ]; then
        vim $(echo "$result" | cut -d: -f1) +$(echo "$result" | cut -d: -f2)
    fi
}
```

### 3.4 文件管理工作流

```bash
# 快速定位并操作文件
fd -t f | fzf -m | xargs rm -i  # 多选删除

# 批量重命名
fd -e jpg | fzf -m | while read file; do mv "$file" "${file%.jpg}.png"; done
```

## 4 配置示例

### 4.1 ~/.bashrc 或 ~/.zshrc 配置片段

```bash
# 工具别名和配置
alias ls='eza --icons'
alias ll='eza -alF --icons'
alias lt='eza -T --icons'

# fzf 配置
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

# ripgrep 配置
export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"

# zoxide 配置
eval "$(zoxide init bash --cmd j)"  # 使用 j 代替 z
```

### 4.2 ~/.ripgreprc 配置文件

```toml
# ripgrep 配置
--colors=line:style:bold
--colors=match:fg:red
--colors=path:fg:green
--smart-case
--max-columns=150
```

## 5 实用脚本示例

### 5.1 快速项目切换器

```bash
#!/bin/bash
project_switch() {
    local project
    project=$(fd -t d --max-depth 3 . ~/projects | fzf --preview 'eza -T --color=always {}')
    [ -n "$project" ] && cd "$project" && exec $SHELL
}
alias psw='project_switch'
```

### 5.2 智能文件搜索器

```bash
smart_find() {
    if [ -z "$1" ]; then
        fd -t f | fzf --preview 'bat --color=always {}'
    else
        rg -l "$1" | fzf --preview "rg --color=always '$1' {}"
    fi
}
alias sf='smart_find'
```

## 6 性能优化技巧

### 6.1 建立文件索引

```bash
# 使用 fd 建立文件数据库加速搜索
fd . ~/projects --type f > ~/.file_cache
```

### 6.2 配置合适的忽略规则

```bash
# ~/.config/fd/ignore
.git/
node_modules/
__pycache__/
*.o
*.so
```

### 6.3 并行处理优化

```bash
# 使用 parallel 与 fd 结合
fd -e jpg -x parallel convert {} {.}.png
```

## 7 故障排除

### 7.1 常见问题解决

1. **fzf 预览不工作**

   ```bash
   # 确保已安装预览工具（如 bat、highlight）
   sudo pacman -S bat highlight
   ```

2. **zoxide 学习速度慢**

   ```bash
   # 手动添加常用目录
   zoxide add ~/frequently/used/path
   ```

3. **eza 图标显示问题**

   ```bash
   # 安装 nerd-fonts
   yay -S nerd-fonts-complete
   ```
