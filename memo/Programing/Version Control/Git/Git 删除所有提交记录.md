# Git 删除所有提交记录

要删除现有所有的 commit 记录，可以通过以下步骤重置 Git 仓库的历史记录：

1. **重置到初始状态**（假设你希望保留当前的文件状态）：

   ```bash
   git checkout --orphan latest_branch
   ```

2. **添加所有文件**：

   ```bash
   git add -A
   ```

3. **提交文件**：

   ```bash
   git commit -m "Initial commit"
   ```

4. **删除旧的分支**（如果需要）：

   ```bash
   git branch -D master  # 或者使用当前分支名称
   ```

5. **重命名新分支为主分支**：

   ```bash
   git branch -m master  # 或者使用当前分支名称
   ```

6. **强制推送到远程**（小心使用）：

   ```bash
   git push -f origin master  # 替换为你的远程分支名称
   ```

这些步骤将删除所有的 commit 历史，只保留当前文件状态作为一个新的初始 commit。请确保你已经备份了重要的数据，因为这个操作是不可逆的。
