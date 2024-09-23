# Nginx

## 1 概述

Nginx 是一个高性能的反向代理服务器和负载均衡器。它可以用于处理 HTTP 请求、提供反向代理、负载均衡以及静态内容服务。

## 2 反向代理

反向代理是指将客户端的请求转发到后台服务器，并将服务器的响应返回给客户端的过程。Nginx 可以轻松地配置为反向代理服务器，以保护后台服务器的隐私和安全，或负载分担。

### 2.1 基本反向代理配置

```nginx
server {
    listen       80; # 监听80端口
    server_name  example.com; # 服务器名称

    location / {
        proxy_pass http://backend/; # 转发请求到后台服务器
        proxy_set_header Host $host; # 保留客户端请求中的主机名
        proxy_set_header X-Real-IP $remote_addr; # 传递客户端的真实IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 保留客户端IP的转发信息
        proxy_set_header X-Forwarded-Proto $scheme; # 保留客户端使用的协议（HTTP/HTTPS）
    }
}
```

在上述配置中，`proxy_pass` 指令指定了请求的目标服务器，`proxy_set_header` 用于设置转发请求时的头信息。

## 3 负载均衡

负载均衡用于分配客户端请求到多个后台服务器，以提高应用的可用性和性能。Nginx 支持多种负载均衡策略，如轮询、权重、IP哈希等。  

| **名称**     | **说明**                         |
| ---------- | ------------------------------ |
| 轮询         | 默认方式                           |
| weight     | 权重方式，默认为1，权重越高，被分配的客户端请求就越多    |
| ip_hash    | 依据ip分配方式，这样每个访客可以固定访问一个后端服务    |
| least_conn | 依据最少连接方式，把请求优先分配给连接数少的后端服务     |
| url_hash   | 依据url分配方式，这样相同的url会被分配到同一个后端服务 |
| fair       | 依据响应时间方式，响应时间短的服务将会被优先分配       |

### 3.1 基本负载均衡配置

```nginx
# 定义上游服务器组
upstream backend {
    server 192.168.1.1:8080; # 后台服务器1
    server 192.168.1.2:8080; # 后台服务器2
    server 192.168.1.3:8080; # 后台服务器3
}

server {
    listen       80;
    server_name  example.com;

    location / {
        proxy_pass http://backend/; # 使用上游服务器组
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

在这个配置中，我们定义了一个名为 `backend` 的上游服务器组，包含了多个服务器。客户端的请求将根据 Nginx 的默认策略（轮询）被分配到这些服务器。

### 3.2 权重轮询

可以使用 `weight` 参数为不同的服务器分配不同的权重，使请求按照特定比例分配：

```nginx
upstream backend {
    server 192.168.1.1:8080 weight=3;
    server 192.168.1.2:8080 weight=1;
    server 192.168.1.3:8080 weight=1;
}
```

在上述配置中，`192.168.1.1` 服务器将接收约 60% 的请求，而另外两个服务器各接收约 20% 的请求。

### 3.3 IP 哈希

IP 哈希策略确保来自同一客户端 IP 的请求总是发送到同一个服务器：

```nginx
upstream backend {
    ip_hash;
    server 192.168.1.1:8080;
    server 192.168.1.2:8080;
    server 192.168.1.3:8080;
}
```

## 4 高可用性配置

为了提高服务的高可用性，可以在 `upstream` 块中添加备用服务器：

```nginx
upstream backend {
    server 192.168.1.1:8080;
    server 192.168.1.2:8080;
    server 192.168.1.3:8080;
    server 192.168.1.4:8080 backup; # 备用服务器，仅在其他服务器不可用时使用
}
```

## 5 WebSocket 支持

为了支持 WebSocket，必须设置 `Upgrade` 和 `Connection` 头信息：

```nginx
location /ws/ {
    proxy_pass http://backend/ws/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 3600s;
}
```

## 6 `nginx.conf` 示例

```conf
# 设置工作进程数  
worker_processes  auto;  
  
events {  
    # 每个工作进程的最大连接数  
    worker_connections  1024;  
}  
  
http {  
    # 包含MIME类型定义文件  
    include       mime.types;  
    # 默认的MIME类型  
    default_type  application/octet-stream;  
  
    # 启用高效文件传输模式  
    sendfile        on;  
    # 设置长连接超时时间  
    keepalive_timeout  65;  
  
    # 根据HTTP头部的Upgrade字段设置连接类型  
    map $http_upgrade $connection_upgrade {  
        default upgrade;  
        '' close;  
    }  
  
    # 定义上游服务器组  
    upstream webservers {  
        server 127.0.0.1:8080 weight=90;  # 主服务器  
        # 备用服务器  
        # server 127.0.0.1:8088 weight=10;  
    }  
  
    server {  
        # 监听80端口  
        listen       80;  
        # 服务器名称  
        server_name  localhost;  
  
        location / {  
            # 设置根目录  
            # root   html/sky;  
            root   /usr/share/nginx/html/sky;  
            # 默认首页文件  
            index  index.html index.htm;  
        }  
  
        # 自定义错误页面  
        error_page   500 502 503 504  /50x.html;  
        location = /50x.html {  
            # root    html;  
            root    /usr/share/nginx/html;  
        }  
  
        # 反向代理配置，处理管理端发送的请求  
        location /api/ {  
            proxy_pass   http://127.0.0.1:8080/admin/;  
            # 使用上游服务器组  
            # proxy_pass   http://webservers/admin/;  
            # 传递请求头部信息  
            # proxy_set_header Host $host;  
            # proxy_set_header X-Real-IP $remote_addr;
			# proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # proxy_set_header X-Forwarded-Proto $scheme;
        }  
  
        # 反向代理配置，处理用户端发送的请求  
        location /user/ {  
            proxy_pass   http://webservers/user/;  
        }  
  
        # WebSocket代理配置  
        location /ws/ {  
            proxy_pass   http://webservers/ws/;  
            proxy_http_version 1.1;  
            proxy_read_timeout 3600s;  
            proxy_set_header Upgrade $http_upgrade;  
            proxy_set_header Connection "$connection_upgrade";  
        }  
  
		# 媒体文件位置配置（已注释）  
		    # location /media {  
		    #     root 配置媒体文件位置;  # 例如: D:/static  
		    #     # 注：在 D:/static 目录下创建 media 文件夹  
		    # }  
		  
		    # 处理PHP脚本的FastCGI配置（已注释）  
		    # location ~ \.php$ {  
		    #     root           html;    #     fastcgi_pass   127.0.0.1:9000;    #     fastcgi_index  index.php;    #     fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;    #     include        fastcgi_params;    # }  
		    # 禁止访问.htaccess文件（已注释）  
		    # location ~ /\.ht {  
		    #     deny  all;    # }}  
		  
		# 另一个虚拟主机配置示例（已注释）  
		# server {  
		#     listen       8000;  
		#     listen       somename:8080;  
		#     server_name  somename  alias  another.alias;  
		#     location / {  
		#         root   html;  
		#         index  index.html index.htm;  
		#     }  
		# }  
		  
		# HTTPS服务器配置示例（已注释）  
		# server {  
		#     listen       443 ssl;  
		#     server_name  localhost;  
		#     ssl_certificate      cert.pem;  
		#     ssl_certificate_key  cert.key;  
		#     ssl_session_cache    shared:SSL:1m;  
		#     ssl_session_timeout  5m;  
		#     ssl_ciphers  HIGH:!aNULL:!MD5;  
		#     ssl_prefer_server_ciphers  on;  
		#     location / {  
		#         root   html;  
		#         index  index.html index.htm;  
		#     }  
		# }
```
