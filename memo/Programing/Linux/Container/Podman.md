# Podman

> [!nnote]  
> [Podman 官方文档](https://podman.io/getting-started)  
> [Podman GitHub 页面](https://github.com/containers/podman)  
> [Podman - ArchWiki](https://wiki.archlinux.org/title/Podman)

## 1 安装 Podman

在 Arch Linux 上，你可以使用 `pacman` 安装 Podman：

```bash
sudo pacman -S podman
```

## 2 核心命令

### 2.1 查看 Podman 版本

```bash
podman --version
```

### 2.2 拉取镜像

```bash
podman pull <image-name>
```

例如，拉取 Alpine 镜像：

```bash
podman pull alpine
```

### 2.3 列出镜像

```bash
podman images
```

### 2.4 运行容器

```bash
podman run [OPTIONS] <image-name> [COMMAND] [ARG...]
```

例如，以交互模式运行 Alpine 容器：

```bash
podman run -it alpine sh
```

### 2.5 列出运行中的容器

```bash
podman ps
```

### 2.6 列出所有容器（包括已停止的）

```bash
podman ps -a
```

### 2.7 停止容器

```bash
podman stop <container-id>
```

### 2.8 删除容器

```bash
podman rm <container-id>
```

### 2.9 构建镜像

```bash
podman build -t <tag> <path>
```

例如，从当前目录构建一个名为 `my-image` 的镜像：

```bash
podman build -t my-image .
```

## 3 Podman Compose

Podman 支持类似 Docker Compose 的工具 `podman-compose`，用于管理多容器应用。

### 3.1 安装 `podman-compose`

在 Arch Linux 上安装：

```bash
sudo pacman -S podman-compose
```

### 3.2 使用 `podman-compose`

创建一个 `docker-compose.yml` 文件，然后用 `podman-compose` 启动服务：

```bash
podman-compose -f docker-compose.yml up
```

## 4 使用 Podman 的 Docker CLI 兼容层

Podman 提供了 `podman-docker` 包，以便可以使用 Docker CLI 命令与 Podman 交互。

### 4.1 安装 `podman-docker`

在 Arch Linux 上安装：

```bash
sudo pacman -S podman-docker
```

### 4.2 使用 Docker 命令

创建符号链接，将 Docker 命令映射到 Podman：

```bash
sudo ln -s /usr/bin/podman /usr/bin/docker
```

你现在可以使用 Docker 命令（如 `docker run`）来操作 Podman：

```bash
docker run -it alpine sh
```

## 5 高级功能

### 5.1 Pod 管理

Podman 引入了 Pod 的概念，使你可以将多个容器组合在一起共享同一网络命名空间。

#### 5.1.1 创建 Pod

```bash
podman pod create --name <pod-name>
```

#### 5.1.2 运行容器到指定 Pod

```bash
podman run -d --pod <pod-name> <image-name>
```

#### 5.1.3 查看 Pods

```bash
podman pod ps
```

#### 5.1.4 删除 Pod

```bash
podman pod rm <pod-name>
```

### 5.2 使用 Buildah 构建镜像

`Buildah` 是一个用于构建容器镜像的工具，通常与 Podman 配合使用。

#### 5.2.1 安装 Buildah

```bash
sudo pacman -S buildah
```

#### 5.2.2 使用 Buildah 构建镜像

```bash
buildah bud -t <tag> <path>
```

## 6 性能监控

### 6.1 使用 `pcp-pmda-podman` 收集性能指标

PCP 性能监控工具可以用来从 Podman 容器中收集性能数据。

#### 6.1.1 安装 `pcp-pmda-podman`

```bash
sudo pacman -S pcp-pmda-podman
```

配置 PCP 以监控 Podman 容器的性能数据。

## 7 其他工具

### 7.1 Cockpit Podman 插件

提供图形界面来管理 Podman 容器。

#### 7.1.1 安装 `cockpit-podman`

```bash
sudo pacman -S cockpit-podman
```

通过 Cockpit UI 访问并管理 Podman 容器。
