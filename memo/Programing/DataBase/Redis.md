---
tags:
  - Cache
  - Redis
---

# Redis

## 1 Redis 简要介绍

Redis 是一个开源的内存数据库，以其速度快、支持多种数据结构（如字符串、哈希、列表、集合、有序集合等）而著称。它不仅可以作为数据库，还可以用作缓存、消息队列等。Redis 的持久化机制确保数据即使在断电或崩溃时也能恢复。

### 1.1 Redis 在 Java 中的应用

#### 1.1.1 引入依赖

在使用 Spring 框架时，首先需要在项目的 `pom.xml` 文件中引入 Redis 和 Lettuce 的相关依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>io.lettuce.core</groupId>
    <artifactId>lettuce-core</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

#### 1.1.2 配置 Redis 连接

在 `application.properties` 或 `application.yml` 中配置 Redis 的连接信息：

```properties
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.password=yourpassword
```

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: yourpassword
```

#### 1.1.3 创建 Redis 配置类

创建一个 Redis 配置类，以便在 Spring 中使用 Lettuce：

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory());
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
```

#### 1.1.4 使用 RedisTemplate 进行操作

在业务逻辑中，可以使用 `RedisTemplate` 进行各种 Redis 操作，例如存取数据、操作列表和集合等：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class RedisService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void saveValue(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    public Object getValue(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteValue(String key) {
        redisTemplate.delete(key);
    }
}
```

#### 1.1.5 使用注解简化缓存操作

> [!note] SpringCache  
>
> | 注解               | 描述                                                              |
| ---------------- | --------------------------------------------------------------- |
| `@EnableCaching` | 开启缓存注解功能，用于启动类或配置类                                              |
| `@Cacheable`     | 标记方法的返回值会被缓存。如果缓存中存在数据，则直接返回缓存数据，否则执行方法并缓存结果。                   |
| `@CachePut`      | 标记方法的返回值会更新缓存。每次调用方法时，都会执行方法并将结果更新到缓存中。                         |
| `@CacheEvict`    | 标记方法会清除缓存中的数据。可以指定清除特定的缓存项或整个缓存。                                |
| `@Caching`       | 组合多个缓存操作注解（如 `@Cacheable`、`@CachePut`、`@CacheEvict`），用于复杂的缓存逻辑。 |
| `@CacheConfig`   | 类级别注解，用于配置共享的缓存名称和其他缓存配置。                                       |

##### 1.1.5.1 `@Cacheable`

```java
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Cacheable(value = "users", key = "#userId")
    public User getUserById(String userId) {
        // 模拟从数据库获取用户信息
        return new User(userId, "John Doe");
    }
}
```

##### 1.1.5.2 `@CachePut`

```java
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        // 更新用户信息
        return user;
    }
}
```

##### 1.1.5.3 `@CacheEvict`

```java
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @CacheEvict(value = "users", key = "#userId")
    public void deleteUserById(String userId) {
        // 删除用户信息
    }
}
```

##### 1.1.5.4 `@Caching`

```java
import org.springframework.cache.annotation.Caching;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Caching(
        cacheable = { @Cacheable(value = "users", key = "#userId") },
        put = { @CachePut(value = "users", key = "#result.id") }
    )
    public User getUserById(String userId) {
        // 模拟从数据库获取用户信息
        return new User(userId, "John Doe");
    }
}
```

##### 1.1.5.5 `@CacheConfig`

```java
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@CacheConfig(cacheNames = "users")
public class UserService {
    @Cacheable(key = "#userId")
    public User getUserById(String userId) {
        // 模拟从数据库获取用户信息
        return new User(userId, "John Doe");
    }
}```
