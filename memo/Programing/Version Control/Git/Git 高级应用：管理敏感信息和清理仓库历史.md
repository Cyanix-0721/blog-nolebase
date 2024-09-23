# Git 高级应用：管理敏感信息和清理仓库历史

Git 作为分布式版本控制系统，在代码管理方面发挥着至关重要的作用。除了常规的版本控制功能，Git 还提供了更高级的应用场景，帮助开发者更好地管理敏感信息和清理仓库历史，提升团队协作效率和安全性。

## 1 Git-secrets：保护敏感信息安全

在实际开发工作中，难免会涉及一些敏感信息，例如 API 密钥、密码、个人信息等。如果这些信息不小心被提交到公共仓库，可能会造成严重的安全问题。

**Git-secrets** 是一款专门用于在 Git 仓库中查找和加密敏感信息的工具。它可以帮助您有效地识别并保护敏感信息，避免其意外泄露。

### 1.1 Git-secrets 工作原理

Git-secrets 利用预定义的敏感信息模式来扫描仓库中的文件。一旦发现匹配的模式，它会将这些文件标记为包含敏感信息。

随后，您可以选择将这些文件加密或忽略。加密后的文件将无法被解密，即使拥有访问权限的用户也无法查看其中的敏感信息。

### 1.2 Git-secrets 使用指南

1. 安装 `git-secrets`。使用 Git Bash 并运行以下命令：

	```bash
	git clone https://github.com/awslabs/git-secrets.git
	
	cd git-secrets/
	
	# *nix (Linux/macOS)
	
	make install
	
	# Windows
	
	PS > ./install.ps1
	```

2. 安装 `git-secrets` 到你的仓库：

	```bash
	cd your-repo
	
	git secrets --install
	```

3. 添加密钥检测规则：

	```bash
	# 检测 AWS 密钥
	
	git secrets --register-aws
	
	# git secrets --add 'AKIA[0-9A-Z]{16}'
	
	# git secrets --add '(([^A-Z0-9]|^)(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}([^A-Z0-9]|$))'
	
	# 检测 Google Cloud 平台的 API 密钥：
	
	git secrets --add 'AIza[0-9A-Za-z\\-_]{35}'
	
	# 检测 SSH 私钥：
	
	git secrets --add '-----BEGIN RSA PRIVATE KEY-----'
	
	# 检测密码（这可能会产生很多误报，因为 "password" 是一个常见的单词）：
	
	git secrets --add 'password'
	```

	请注意，这些规则可能会产生误报，因为它们可能会匹配到不是真正的密钥的字符串。你应该根据你的具体需求来调整这些规则。

4. 添加自定义的检测规则。这个命令会添加一个规则，用于检测以 "SECRET_" 开头的字符串：

	```bash
	git secrets --add 'SECRET_.*'
	```

5. 删除自定义检测规则：

	```bash
	git secrets --rm 'SECRET_.*'
	```

6. 列出当前的所有检测规则：

	```bash
	git secrets --list
	```

7. 扫描你的仓库，查找是否有任何违反规则的提交：

	```bash
	git secrets --scan
	```

8. 扫描你的仓库的历史记录，查找是否有任何违反规则的提交：

	```bash
	git secrets --scan-history
	```

9. 如果你想在提交时跳过 `git-secrets` 的检查，你可以使用 `--no-verify` 选项：

	```bash
	git commit --no-verify
	```

	请注意，你应该只在确信你的更改不包含敏感数据时才使用 `--no-verify` 选项。

- 要避免上传私密信息，你应该：

	不要在代码中硬编码私密信息。相反，应该使用环境变量或配置文件，并确保这些文件不被添加到 Git 仓库中（可以在 `.gitignore` 文件中指定）。  
	使用 `git-secrets` 或类似的工具来扫描你的 Git 历史记录，以确保你没有意外地提交了私密信息。  
	如果你发现已经提交了私密信息，应立即更改这些信息（例如，更改密码或重新生成 API 密钥），并使用 `git filter-branch` 或 `BFG Repo-Cleaner` 等工具从 Git 历史记录中删除这些信息。

## 2 Git Filter-branch 和 BFG Repo-Cleaner：清理仓库历史

随着项目开发的进行，Git 仓库的历史记录会不断增长。其中可能包含一些无用的数据，例如大型文件、测试代码、甚至是遗留的敏感信息。这些冗余数据会占用存储空间，降低仓库的性能，并可能造成安全隐患。

**Git filter-branch** 和 **BFG Repo-Cleaner** 都是用于清理 Git 仓库历史记录的工具。它们可以帮助您移除无用数据，优化仓库结构，提升安全性。

### 2.1 Git Filter-branch 工作原理

Git filter-branch 通过创建一个新的分支并过滤原始分支的方式来清理仓库历史。您可以指定要移除的文件类型、大小等条件，从而精细地控制清理范围。

### 2.2 BFG Repo-Cleaner 工作原理

BFG Repo-Cleaner 基于 Git filter-branch 的原理，但采用了更优化的算法，尤其擅长处理大型文件。它可以高效地识别并删除冗余数据，而不会对提交历史造成影响。

### 2.3 BFG Repo-Cleaner 使用指南

1. First Clone a Fresh Copy of Your Repo, Using the [`--mirror`](https://stackoverflow.com/q/3959924/438886) Flag:

	```bash
	git clone --mirror git://example.com/some-big-repo.git
	```

This is a [bare](https://git-scm.com/docs/gitglossary.html#def_bare_repository) repo, which means your normal files won't be visible, but it is a _full_ copy of the Git database of your repository, and at this point you should **make a backup of it** to ensure you don't lose anything.

1. Now You Can Run the BFG to Clean Your Repository Up:

	```bash
	#Remove all blobs bigger than 100 megabytes
	
	java -jar bfg.jar --strip-blobs-bigger-than 100M some-big-repo.git
	
	#Delete all files named 'id_rsa' or 'id_dsa'
	
	java -jar bfg.jar --delete-files id_{dsa,rsa} some-big-repo.git
	
	#Replace all passwords listed in a file _(prefix lines 'regex:' or 'glob:' if required)_ with `***REMOVED***` wherever they occur in your repository
	
	java -jar bfg.jar --replace-text passwords.txt some-big-repo.git
	
	#Remove all folders or files named '.git' - a [reserved filename](https://github.com/git/git/blob/d29e9c89d/fsck.c#L228-L229) in Git. These often [become a problem](https://stackoverflow.com/q/16821649/438886) when migrating to Git from other source-control systems like Mercurial
	
	java -jar bfg.jar --delete-folders .git --delete-files .git  --no-blob-protection  my-repo.git
	```

2. The BFG Will Update Your Commits and All Branches and Tags so They Are Clean, but it Doesn't Physically Delete the Unwanted Stuff. Examine the Repo to Make Sure Your History Has Been Updated, and then Use the Standard [`git gc`](https://git-scm.com/docs/git-gc) Command to Strip out the Unwanted Dirty Data, Which Git Will now Recognise as Surplus to Requirements:

	```bash
	cd some-big-repo.git
	
	git reflog expire --expire=now --all && git gc --prune=now --aggressive
	```

3. Finally , once You're Happy with the Updated State of Your Repo, Push it back up _(note that because Your Clone Command Used the `--mirror` Flag, This Push Will Update **all** Refs on Your Remote server)_:

	```bash
	git push
	```
