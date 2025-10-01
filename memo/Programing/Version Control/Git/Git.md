---
tags:
  - Git
  - Github
---

# Git

> [!info]  
> [Git](https://git-scm.com/)  
> [Git docs](https://git-scm.com/docs)  
> [gitignore](https://git-scm.com/docs/gitignore)  
> [git-secrets](https://github.com/awslabs/git-secrets)  
> [BFG Repo-Cleaner Repo](https://github.com/rtyley/bfg-repo-cleaner)  
> [BFG Repo-Cleaner Doc](https://rtyley.github.io/bfg-repo-cleaner/)

## 1 Git 基础应用命令

Git 是一款功能强大的分布式版本控制系统，旨在追踪代码库的变更，为开发者提供高效的项目管理工具。它通过记录每一次的改动，使得开发者能够轻松地回溯到以前的版本，并支持多人协作开发，极大地提高了开发效率。

### 1.1 Git 配置

```bash
git config [--global] user.name "Your Name"  # 设置用户名
git config [--global] user.email "your_email@example.com"  # 设置邮箱
git config [--global] http.proxy http://127.0.0.1:7897 # 设置 http 代理
git config [--global] https.proxy http://127.0.0.1:7897 # 设置 https 代理
```

### 1.2 Init 初始化仓库

```bash
git init [--bare] [--initial-branch=<branch-name>]
```

- `--bare`：创建一个裸仓库，不包含工作区，通常用于远程中央仓库。
- `--initial-branch=<branch-name>`：设置初始分支的名称，默认为 `main`。

### 1.3 Clone 克隆远程仓库

```bash
git clone <repository_url> [<directory>] [--branch=<branch-name>] [--depth=<depth>]
```

- `<directory>`：指定克隆到本地的目录名称，默认为远程仓库的名称。
- `--branch=<branch-name>`：指定克隆的分支，默认为 `main`。
- `--depth=<depth>`：指定克隆的深度，即只克隆最近的若干次提交，可以加快克隆速度。

### 1.4 Add 添加

```bash
git add [<file_name> | .] [-p | -u | -A]
```

- `-p`：交互式添加，逐块选择要添加到暂存区的内容。
- `-u`：只添加已跟踪文件的修改和删除，不添加新文件。
- `-A`：添加所有修改、删除和新文件。

### 1.5 Commit 提交

```bash
git commit [-m "commit message"] [-a] [--amend]
```

- `-a`：跳过 `git add`，直接提交所有已跟踪文件的修改。
- `--amend`：修改最近一次提交，可以修改提交信息或添加/删除文件。

### 1.6 Status 查看仓库状态

```bash
git status [-s | -u]
```

- `-s`：短格式输出，更简洁。
- `-u`：显示未跟踪的文件。

### 1.7 Diff 查看差异

```bash
git diff [<commit_id> | <branch_name>] [--staged] [<file_name>]
```

- `--staged`：查看暂存区与 HEAD 的差异。
- `<file_name>`：指定要查看差异的文件。

### 1.8 Stash 贮藏更改

`git stash` 是一个用于暂时保存工作目录和索引中未提交更改的命令。它可以帮助你在不提交更改的情况下切换分支、拉取代码或进行其他操作。

#### 1.8.1 基本用法

- **`git stash push [-u | --include-untracked] [-a | --all] [-m | --message <msg>] [<pathspec>…]`:** 贮藏当前更改，并可选择包含未跟踪的文件、所有忽略的文件以及添加自定义消息。
- **`git stash list`:** 列出所有已贮藏的更改集。
- **`git stash show [<stash>]`:** 显示最近一次或指定贮藏的更改。
- **`git stash apply [<stash>]`:** 应用最近一次或指定贮藏的更改。
- **`git stash pop [<stash>]`:** 应用最近一次或指定贮藏的更改，并将其从贮藏列表中移除。
- **`git stash drop [<stash>]`:** 移除最近一次或指定贮藏。
- **`git stash clear`:** 移除所有贮藏。
- **`git stash branch <branchname> [<stash>]`:** 基于最近一次或指定贮藏创建一个新分支。

#### 1.8.2 常用选项

- **`-u` | `--include-untracked`:** 包含未跟踪的文件。
- **`-a` | `--all`:** 包含所有忽略的文件。
- **`-m` | `--message <msg>`:** 添加自定义贮藏消息。

#### 1.8.3 示例

```bash
# 贮藏当前更改
git stash push -u -m "my stash"

# 查看贮藏列表
git stash list

# 应用最近的贮藏
git stash apply

# 应用并移除指定的贮藏
git stash pop stash@{1} 
```

### 1.9 Pull 拉取更新

```bash
git pull [<repository> [<refspec>]] [--rebase]
```

- `<repository>`：指定远程仓库的名称，默认为 `origin`。
- `<refspec>`：指定要拉取的分支或标签。
- `--rebase`：在拉取后将本地提交变基到远程分支上，保持提交历史的线性。

### 1.10 Push 推送更改

```bash
git push [-u <repository> <branch>] [--force | -f]
```

- `--force` | `-f`：强制推送，覆盖远程分支上的提交，谨慎使用。

### 1.11 Branch 查看/创建/删除分支

```bash
git branch
git branch <branch_name>
git branch -d <branch_name>
```

### 1.12 Checkout 切换分支

```bash
git checkout <branch_name>
```

- `--orphan`：创建一个没有历史记录的孤立分支。

### 1.13 Merge 合并分支

```bash
git merge <branch_name> [--no-ff]
```

- `--no-ff`：禁用 Fast-forward 合并，保留分支的独立信息。

### 1.14 Cherry-pick 选择性应用提交

```bash
git cherry-pick <commit_hash> [-e | --edit] [-x] [-n | --no-commit]
```

- `-e` 或 `--edit`：应用提交后，打开编辑器让您修改提交信息。
- `-x`：在提交信息的末尾添加一行 `(cherry picked from commit …)`，方便追踪提交来源。
- `-n` 或 `--no-commit`：只将修改应用到工作区和暂存区，不自动提交。

### 1.15 Rebase 改变提交历史

```bash
git rebase <base_branch> [-i | --interactive] [--onto <newbase>] [--abort] [--continue] [--skip]
```

- `-i` 或 `--interactive`：进入交互式 rebase 模式，让您选择要保留、合并、修改或删除的提交。
- `--onto <newbase>`：将提交变基到指定的新基底分支。
- `--abort`：中止 rebase 操作，恢复到 rebase 之前的状态。
- `--continue`：解决冲突后，继续 rebase 操作。
- `--skip`：跳过当前提交，继续 rebase 下一个提交。

### 1.16 Log 查看提交历史

```bash
git log
```

### 1.17 Reset 版本回退

> [!tip] `HEAD`  
> HEAD 是一个指向当前分支最新提交的指针。

```bash
git reset HEAD~1
git reset <commit_id>
git reset --hard <commit_id>
```

### 1.18 Tag 标签

```bash
git tag <tag_name>
git tag
git tag -d <tag_name>
```

### 1.19 Remote 远程仓库

```bash
git remote add <remote_name> <repository_url>
git remote -v
git remote remove <remote_name>
```

### 1.20 Proxy

```bash
git config [--global] [--unset] http.proxy http://<ip>:<port>
git config [--global] [--unset] https.proxy http://<ip>:<port>
```

### 1.21 Worktree

`git worktree` 是一个非常有用的工具，它允许您在同一个 Git 仓库中创建多个工作目录，从而能够同时处理多个分支。以下是 `git worktree` 的一些常用操作：

**1. 添加新的工作区：**

```bash
git worktree add <路径> <分支>
# 例如，创建一个新的工作区并检出 dev 分支
git worktree add ../dev-workspace dev
```

**2. 列出所有工作区：**

```bash
git worktree list
```

**3. 移除工作区：**

```bash
git worktree remove <路径>
# 例如，移除 dev-workspace 工作区
git worktree remove ../dev-workspace
```

**4. 强制移除工作区：**

如果工作区正在使用，可以使用 `--force` 选项强制移除：

```bash
git worktree remove --force <路径>
```

## 2 协作开发

### 2.1 Rebase & Merge

> [!tip] 当前开发分支最好 `push` 前，`pull -rebase <父级分支>` 进行 DEBUG，然后 `父级分支 merge <开发分支>`

为了确保在 `dev` 分支合并多个开发者分支后，保留每个提交的原始作者信息，并最终将这些信息准确地推送到主分支 `main`，您可以采用以下策略：

**1. 使用 `git merge --no-ff` 禁用 Fast-forward 合并：**

默认情况下，Git 会尝试进行 Fast-forward 合并，这会导致丢失分支信息。使用 `--no-ff` 选项可以强制创建一个新的合并提交，从而保留每个开发者分支的提交历史和作者信息。

```bash
git checkout dev  # 切换到 dev 分支
git merge --no-ff <developer_branch>  # 合并开发者分支，禁用 fast-forward
```

**2. 避免使用 `git merge --squash`：**

`--squash` 选项会将多个提交合并为一个，这会丢失原始提交的作者信息。

**3. 使用 `git cherry-pick` 或交互式 rebase (`git rebase -i`)：**

这两种方法都允许您选择性地将开发者分支上的提交应用到 `dev` 分支，并保留原始作者信息。

- **`git cherry-pick`：**

   ```bash
   git checkout dev
   git cherry-pick <commit_hash>  # 选择开发者分支上的提交
   ```

- **`git rebase -i`：**

   ```bash
   git checkout dev
   git rebase -i origin/main  # 将 dev 分支变基到 main 分支，并进入交互式 rebase
   # 在编辑器中，选择要保留的提交，并修改 `pick` 为 `edit`
   # 保存并退出编辑器后，Git 会逐个应用提交，您可以修改作者信息
   ```

**4. 推送 `dev` 分支到 `main` 分支：**

在 `dev` 分支完成合并并确保所有提交的作者信息正确后，您可以将 `dev` 分支推送到 `main` 分支：

```bash
git checkout main
git merge dev
```

**5. 使用 `git commit -am "temp"` 暂存修改：**

如果您需要暂时提交工作进度，可以使用以下命令：

```bash
git commit -am "temp"  # 将所有已修改的文件暂存并提交
```

**6. 使用 `git reset --soft ^` 撤销提交：**

在需要撤销上一次提交但保留更改时，可以使用以下命令：

```bash
git reset --soft HEAD^  # 撤销上一次提交但保留工作区更改
```

**7. 使用 `git commit --amend -m` 修改提交信息：**

如果需要修改最后一次提交的提交信息，可以使用以下命令：

```bash
git commit --amend -m "新的提交信息"  # 修改最后一次提交的提交信息
```

**最佳实践：**

- **建立明确的分支管理策略：** 规定每个开发者在自己的分支上开发，并在完成开发后提交 Pull Request (PR) 到 `dev` 分支。
- **在 PR 中进行代码审查：** 确保代码质量和提交信息的准确性。
- **在合并 PR 时，使用 `--no-ff` 选项：** 保留每个开发者分支的提交历史和作者信息。
- **定期将 `dev` 分支合并到 `main` 分支：** 保持主分支的更新。

**注意事项：**

- **修改提交历史可能会导致协作问题，请谨慎操作。**
- **在团队协作中，确保所有成员都了解并遵循分支管理策略。**

通过遵循上述策略，您可以确保在合并多个开发者分支时保留每个提交的原始作者信息，并将其准确地推送到主分支，从而维护清晰的项目历史记录。

### 2.2 Feature Branch Workflow

1. 从开发分支创建功能分支

   ```
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   ```

   这样可以确保你的功能分支基于最新的开发分支。

2. 在功能分支上进行开发  
   正常进行代码编写、提交等工作。

3. 定期从开发分支合并更新

   ```
   git checkout feature/new-feature
   git merge develop
   ```

   这可以保持你的功能分支与开发分支同步,减少最终合并时的冲突。

4. 功能完成后,创建Pull Request  
   将你的功能分支推送到远程仓库,然后创建一个Pull Request到开发分支。

5. 代码审查和讨论  
   团队成员可以在Pull Request中进行代码审查和讨论。

6. 合并到开发分支  
   一旦Pull Request被批准,就可以将功能分支合并到开发分支。

   ```
   git checkout develop
   git merge --no-ff feature/new-feature
   git push origin develop
   ```

7. 删除功能分支

   ```
   git branch -d feature/new-feature
   ```

这种方法的优点:

1. 简单直观: 每个功能都有自己的分支,易于理解和管理。

2. 隔离开发: 每个功能独立开发,不会互相干扰。

3. 便于协作: 多人可以在同一个功能分支上协作,或者并行开发不同的功能。

4. 清晰的历史: 保留了完整的开发历史,包括每个功能的详细变更。

5. 容易回滚: 如果某个功能出现问题,可以很容易地回滚整个功能。

6. 有利于持续集成: 可以在合并前对每个功能进行独立测试。

7. 减少合并冲突: 通过定期从开发分支合并更新,可以减少最终合并时的冲突。

## 3 [Conversatonal Git](https://www.conventionalcommits.org/zh-hans/v1.0.0/)

## 4 Gitignore

gitignore文件是Git用来指定要忽略的文件的配置文件，可以帮助您保持代码仓库的整洁，避免跟踪那些不需要或不适合纳入版本控制的文件。

### 4.1 创建 Gitignore 文件

- 通常命名为 `.gitignore`
	- `.` 表示隐藏文件

### 4.2 基础语法

- Git会从上到下逐行检查 `gitignore` 文件中的模式
- 注释使用 `#`
- 排除文件使用 `!` 作为前缀
- 匹配字符使用 `?`
	- `?` 通配符**不**匹配反斜杠 (`\`) 或空格 ()。如果您需要匹配这些字符，则需要使用转义字符或其他通配符。
	- `?` 通配符**不**匹配空目录。如果要匹配空目录，请使用 `*` 通配符。
	- `?` 通配符**不**匹配文件或目录名称中的句点 (`.`)。如果要匹配句点，您需要使用转义字符或其他通配符。
- `*` 匹配单级目录
- `**` 匹配多级目录

### 4.3 Gitignore E.G.

```
### IntelliJ IDEA ###
**/.idea/
**/out/
!**/src/main/**/out/
!**/src/test/**/out/
**/target/
**/.target/
!**/src/main/**/.target/
!**/src/test/**/.target/
**/*.iml
**/*.ipr
**/*.iws
**/*.bak

### Eclipse ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache
bin/
!**/src/main/**/bin/
!**/src/test/**/bin/

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/

### VS Code ###
.vscode/

### Mac OS ###
.DS_Store
```

## 5 统一换行符

### 5.1 **为什么要统一换行符？**

1. **跨平台一致性**：
   - Windows 默认使用 `CRLF`（`\r\n`）。
   - Linux/macOS 默认使用 `LF`（`\n`）。
   - 如果不统一，可能导致文件在不同系统上显示换行符不一致，甚至引发编译或执行错误。

2. **避免不必要的变更**：
   - 如果换行符不统一，Git 可能会将换行符变化识别为文件修改，导致提交历史混乱。

### 5.2 **如何通过 Git 设置自动转换**

#### 5.2.1 **全局设置**

   ```bash
   # 提交时转换为 LF，检出时不转换（适用于 Linux/macOS 用户）
   git config --global core.autocrlf input

   # 提交时转换为 LF，检出时转换为 CRLF（适用于 Windows 用户）
   git config --global core.autocrlf true
   ```

#### 5.2.2 **针对单个项目设置**

   在项目根目录的 `.gitattributes` 文件中指定规则：

   ```gitattributes
   # 所有文件统一使用 LF，不自动转换
   * text=auto eol=lf

   # 针对特定文件类型设置
   *.sh text eol=lf
   *.bat text eol=crlf
   ```

### 5.3 **其他注意事项**

1. **二进制文件**：
   - 确保二进制文件（如图片、压缩包）不被转换，否则会损坏文件。
   - 在 `.gitattributes` 中标记二进制文件：

     ```gitattributes
     *.png binary
     *.jpg binary
     ```

2. **现有仓库的清理**：
   - 如果仓库中已有换行符混乱的问题，可以通过以下命令清理：

     ```bash
     git rm --cached -r .
     git reset --hard
     ```

## 6 Git 密钥鉴权

### 6.1 HTTPS

#### 6.1.1 启用凭证助手

> [!tip] `git-credential-manager`  
> Git 2.29 及更高版本内置的凭证助手，安全性高。  
> `GCM core` 的 `core` 后缀被移除。

运行以下命令，将 `git-credential-manager` 设置为默认凭证助手：

```bash
git config --global credential.helper manager
```

#### 6.1.2 HTTPS Token 验证

1. **生成 Personal Access Token (PAT):**
   - 登录您的 Git 托管平台（如 GitHub、GitLab、Bitbucket 等）。
   - 在设置中找到 "Personal Access Tokens" 或类似选项。
   - 创建一个新的 PAT，并授予所需的权限（例如 repo、user）。
   - 复制生成的 PAT，妥善保管。

2. **使用 PAT 进行身份验证：**
   - 当您通过 HTTPS 克隆或推送代码时，Git 会提示您输入用户名和密码。
   - 在用户名处输入您的 Git 用户名。
   - 在密码处粘贴您生成的 PAT。

### 6.2 SSH 密钥验证

![SSH 密钥验证](SSH)
