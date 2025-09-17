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

## 6 测试连接

测试 GitHub 连接：

```bash
ssh -T git@github.com
```

测试 GitLab 连接：

```bash
ssh -T git@gitlab.company.com
```

成功时会显示相应的欢迎信息。

## 7 故障排除

### 7.1 验证 SSH Agent

```bash
# 查看已加载的密钥
ssh-add -l
```

### 7.2 调试连接问题

```bash
# 使用详细模式查看连接过程
ssh -T -v git@github.com
```

### 7.3 检查文件权限

确保密钥文件权限正确：

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/*
```
