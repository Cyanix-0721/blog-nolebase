# SSH

## 1 免密登录

### 1.1 配置 SSH 服务`sshd`自动运行

```bash
systemctl status sshd
```

```bash
systemctl start sshd
```

```bash
systemctl enable sshd
```

### 1.2 密钥生成

```bash
ssh-keygen -t rsa
```

```bash
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
```

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 1.3 确认 `ssh-agent` 环境变量

#### 1.3.1 确认环境变量

```bash
echo $SSH_AUTH_SOCK
```

#### 1.3.2 重启`ssh-agent`

```bash
eval $(ssh-agent -k)
eval $(ssh-agent -s)
```

#### 1.3.3 添加私钥到`ssh-agent`

```bash
ssh-add ~/.ssh/id_rsa
```
