# SSH

## 1 算法选择

> [!NOTE] 关于 Ed25519 算法  
> Ed25519 是目前推荐的 SSH 密钥算法，相比传统的 RSA 算法具有以下优势：
> - **更强的安全性**：抵抗侧信道攻击，提供更好的加密强度
> - **更快的性能**：签名验证速度更快
> - **更短的密钥**：密钥长度更短，便于管理
> - **前向安全**：即使私钥泄露，过去的通信也不会被解密

## 2 密钥生成

### 2.1 Linux / WSL / Git Bash

生成个人 GitHub 密钥：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_github -C "your_personal_email@example.com"
```

生成公司 GitLab 密钥：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_gitlab -C "your_work_email@company.com"
```

### 2.2 Windows (PowerShell)

生成个人 GitHub 密钥：

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\id_ed25519_github -C "your_personal_email@example.com"
```

生成公司 GitLab 密钥：

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\id_ed25519_gitlab -C "your_work_email@company.com"
```

## 3 部署公钥到服务器

### 3.1 将公钥复制到远程服务器

```bash
# 使用 ssh-copy-id (Linux/Git Bash)
ssh-copy-id -i ~/.ssh/id_ed25519_github.pub user@remote-server

# 或者手动复制 (Windows/Linux通用)
cat ~/.ssh/id_ed25519_github.pub | ssh user@remote-server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3.2 设置正确的文件权限

在远程服务器上执行：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## 4 配置 SSH Agent 管理密钥

### 4.1 Linux / WSL / Git Bash

启动 SSH Agent 并添加密钥：

```bash
# 启动 SSH Agent
eval "$(ssh-agent -s)"

# 添加个人 GitHub 密钥
ssh-add ~/.ssh/id_ed25519_github

# 添加公司 GitLab 密钥
ssh-add ~/.ssh/id_ed25519_gitlab

# 查看已添加的密钥
ssh-add -l
```

### 4.2 Windows (PowerShell)

启动 SSH Agent 服务并添加密钥：

```powershell
# 确保 SSH Agent 服务已启动并设置为自动启动
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent

# 添加个人 GitHub 密钥
ssh-add $env:USERPROFILE\.ssh\id_ed25519_github

# 添加公司 GitLab 密钥
ssh-add $env:USERPROFILE\.ssh\id_ed25519_gitlab

# 查看已添加的密钥
ssh-add -l
```

## 5 配置 SSH Config 文件管理多密钥

创建或编辑 `~/.ssh/config` 文件（Windows: `$HOME\.ssh\config`），添加以下内容：

```config
# 个人 GitHub 账户
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes

# 公司 GitLab 账户
Host gitlab.company.com
  HostName gitlab.company.com
  User git
  IdentityFile ~/.ssh/id_ed25519_gitlab
  IdentitiesOnly yes

# 通用配置 - 适用于所有其他连接
Host *
  AddKeysToAgent yes
  # 如果使用 Windows，可能需要指定 SSH 可执行文件路径
  # ProxyCommand C:/Windows/System32/OpenSSH/ssh.exe -W %h:%p
```

> [!TIP] SSH Config 高级技巧
> - 使用 `IdentitiesOnly yes` 确保 SSH 只使用指定的密钥，避免尝试其他密钥
> - `AddKeysToAgent yes` 会自动将使用的密钥添加到 SSH Agent
> - 可以为同一服务的不同账户创建不同配置块

## 6 确保 SSH Agent 运行

### 6.1 确保 SSH 配置正确

您的 `~/.ssh/config` 应该包含：

```config
Host *
  AddKeysToAgent yes
```

### 6.2 简化 Fish Shell 配置

在 `~/.config/fish/config.fish` 中添加以下内容：

```fish
# 使用临时文件静默启动
if not set -q SSH_AUTH_SOCK
  ssh-agent -c | sed 's/^setenv/set -gx/' | source > /dev/null 2>&1
end
```

## 7 测试连接

测试 GitHub 连接：

```bash
ssh -T git@github.com
```

测试 GitLab 连接：

```bash
ssh -T git@gitlab.company.com
```

成功时会显示相应的欢迎信息。

## 8 故障排除

### 8.1 验证 SSH Agent

```bash
# 查看已加载的密钥
ssh-add -l
```

### 8.2 调试连接问题

```bash
# 使用详细模式查看连接过程
ssh -T -v git@github.com
```

### 8.3 检查文件权限

|文件/目录|推荐权限|说明|
|---|---|---|
|`~/.ssh`|`700` (drwx------)|只有所有者可以读、写、执行|
|`~/.ssh/authorized_keys`|`600` (-rw-------)|只有所有者可以读写|
|`~/.ssh/id_ed25519_github` (私钥)|`600` (-rw-------)|只有所有者可以读写|
|`~/.ssh/id_ed25519_github.pub` (公钥)|`644` (-rw-r--r--)|所有者可读写，其他人只读|
|`~/.ssh/known_hosts`|`644` (-rw-r--r--)|所有者可读写，其他人只读|
|`~/.ssh/config`|`600` (-rw-------) 或 `644`|建议 `600` 以提高安全性|

#### 8.3.1 一键设置所有权限的脚本

```sh
#!/bin/bash

# SSH 目录权限设置脚本
# 安全地设置 ~/.ssh 目录及其文件的权限

set -e # 遇到错误立即退出

SSH_DIR="$HOME/.ssh"

echo "正在设置 SSH 目录权限…"

# 检查 SSH 目录是否存在
if [ ! -d "$SSH_DIR" ]; then
  echo "错误: SSH 目录不存在: $SSH_DIR"
  exit 1
fi

# 设置 SSH 目录权限为 700 (drwx------)
chmod 700 "$SSH_DIR"
echo "✓ 设置目录权限: $SSH_DIR -> 700"

# 设置文件权限
for file in "$SSH_DIR"/*; do
  if [ -f "$file" ]; then
    case "$(basename "$file")" in
    # 配置文件设置为 600 (-rw-------)
    "config" | "known_hosts" | "known_hosts.old" | "authorized_keys")
      chmod 600 "$file"
      echo "✓ 设置文件权限: $(basename "$file") -> 600"
      ;;
    # 公钥文件设置为 644 (-rw-r--r--)
    *.pub)
      chmod 644 "$file"
      echo "✓ 设置文件权限: $(basename "$file") -> 644"
      ;;
    # 私钥文件设置为 600 (-rw-------)
    id_*)
      if [[ "$file" != *.pub ]]; then
        chmod 600 "$file"
        echo "✓ 设置文件权限: $(basename "$file") -> 600"
      fi
      ;;
    # 其他文件设置为 600
    *)
      chmod 600 "$file"
      echo "✓ 设置文件权限: $(basename "$file") -> 600"
      ;;
    esac
  fi
done

# 设置目录所有权（确保属于当前用户）
chown -R "$USER:$USER" "$SSH_DIR"
echo "✓ 设置目录所有权: $USER:$USER"

echo ""
echo "✅ SSH 目录权限设置完成！"
echo "当前权限状态:"
ls -la "$SSH_DIR"
```

将上述内容保存为 `setup_ssh_permissions`，然后运行：

```sh
chmod +x setup_ssh_permissions.sh
./setup_ssh_permissions.sh
```
