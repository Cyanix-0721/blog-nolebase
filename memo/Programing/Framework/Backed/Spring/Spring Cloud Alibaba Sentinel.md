---
tags:
  - Framework
  - SpringCloud
---

# Spring Cloud Alibaba Sentinel

**Spring Cloud Alibaba Sentinel** 是 Spring Cloud Alibaba 生态系统中的服务治理组件，主要用于**熔断**、**限流**和**系统保护**。Sentinel 为分布式系统提供了强大的流量控制、熔断降级、系统自适应保护、热点参数限流等多种功能，尤其适合高并发、复杂的微服务架构。

在电商平台中，Sentinel 可以有效地保护各个微服务，防止因流量激增或服务异常导致的系统崩溃，并能通过熔断和限流保证服务的稳定性。以下是 Sentinel 在熔断和限流方面的主要应用和实现方式。

> [!summary]
>
> Spring Cloud Alibaba Sentinel 提供了丰富的流量控制和熔断降级功能，能够有效地提升电商平台的稳定性和容错能力。通过限流、熔断、热点参数限流等机制，开发者可以在高并发场景下保护微服务，确保系统在高负载下仍然能够稳定运行。

> [!info] 在电商平台中的应用场景
>
> - **限流保护**：防止在促销活动或流量高峰期时，单个微服务或接口因流量激增而崩溃。通过限流，系统可以优雅地拒绝部分请求，确保关键服务的正常运行。
>
> - **熔断降级**：在某些服务不可用或响应时间过长时，可以通过熔断机制触发回退逻辑，防止整个系统因服务链路问题而瘫痪。电商平台可以为支付服务、物流服务等设置熔断规则，以保证订单系统的稳定性。
>
> - **热点参数限流**：在电商平台中，某些商品（如爆款商品）的访问量可能异常高，通过热点参数限流可以防止单一商品 ID 过多访问导致系统资源被耗尽。

## 1 Sentinel 核心功能

- **流量控制（限流）**：通过定义规则限制请求的流量，如 QPS、并发量等，确保服务在负载下稳定运行。
- **熔断降级**：根据响应时间或失败率进行熔断，防止连锁反应影响整个系统。
- **热点参数限流**：针对特定参数（如商品 ID）的访问进行限流，防止单一热点资源耗尽系统资源。
- **系统保护**：监控系统的整体状况（如 CPU 使用率、内存使用等），防止因系统过载导致崩溃。

## 2 添加 Sentinel 依赖

在 `pom.xml` 中添加 Spring Cloud Alibaba Sentinel 的依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
</dependency>
```

## 3 配置 Sentinel

在 `application.yml` 中，配置 Sentinel 的基础信息：

```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080  # Sentinel 控制台地址
      eager: true  # 启动时即加载 Sentinel
```

启动 Sentinel 控制台并访问 `http://localhost:8080` 监控微服务的运行状况。

## 4 实现限流

### 4.1 基于资源的限流

Sentinel 可以基于方法或资源名进行限流。通过 `@SentinelResource` 注解，可以对某个方法设置限流规则。

**示例：限制库存查询接口的访问频率**

在电商平台中，库存查询是一个高频访问接口，通过 Sentinel 对其进行限流，确保系统稳定。

```java
import com.alibaba.csp.sentinel.annotation.SentinelResource;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    @SentinelResource(value = "checkInventory", blockHandler = "handleFlowLimit")
    public String checkInventory(String productId) {
        // 查询库存逻辑
        return "Product ID: " + productId + ", inventory available";
    }

    // 限流后的回调方法
    public String handleFlowLimit(String productId, BlockException ex) {
        return "Too many requests. Please try again later.";
    }
}
```

在该示例中，`checkInventory` 方法是受保护的资源。当请求频率超过限流阈值时，`handleFlowLimit` 方法会被调用，返回一个友好的错误提示。

### 4.2 配置限流规则

限流规则可以通过 Sentinel 控制台进行配置，也可以通过代码进行动态配置。以下示例展示了如何通过代码为资源设置限流规则：

```java
import com.alibaba.csp.sentinel.slots.block.RuleConstant;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRule;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRuleManager;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class SentinelConfig {

    @PostConstruct
    public void initFlowRules() {
        List<FlowRule> rules = new ArrayList<>();
        FlowRule rule = new FlowRule();
        rule.setResource("checkInventory");
        rule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        rule.setCount(10);  // 每秒最多10个请求
        rules.add(rule);
        FlowRuleManager.loadRules(rules);
    }
}
```

通过该配置，`checkInventory` 方法的访问频率限制为每秒 10 个请求。超出限制时，将触发限流回调方法。

## 5 实现熔断降级

### 5.1 熔断机制

熔断机制是通过检测请求的响应时间和失败率来判断是否应该熔断。熔断后，Sentinel 会快速失败，直接返回预定义的回退结果，而不再调用目标服务。熔断恢复后，可以重新尝试调用服务。

**示例：订单服务调用库存服务，使用熔断机制**

```java
import com.alibaba.csp.sentinel.annotation.SentinelResource;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @SentinelResource(value = "placeOrder", fallback = "fallbackPlaceOrder")
    public String placeOrder(String productId) {
        // 调用库存服务
        return inventoryService.checkInventory(productId);
    }

    // 熔断后的回退方法
    public String fallbackPlaceOrder(String productId, Throwable throwable) {
        return "Order placement failed. Please try again later.";
    }
}
```

在上述代码中，当库存服务调用失败或响应过慢时，Sentinel 会触发熔断，执行 `fallbackPlaceOrder` 回退方法，避免用户长时间等待。

### 5.2 配置熔断规则

熔断规则同样可以通过 Sentinel 控制台进行配置，也可以通过代码设置。以下示例展示了如何为资源配置熔断规则：

```java
import com.alibaba.csp.sentinel.slots.block.degrade.DegradeRule;
import com.alibaba.csp.sentinel.slots.block.degrade.DegradeRuleManager;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class SentinelDegradeConfig {

    @PostConstruct
    public void initDegradeRules() {
        List<DegradeRule> rules = new ArrayList<>();
        DegradeRule rule = new DegradeRule();
        rule.setResource("placeOrder");
        rule.setGrade(RuleConstant.DEGRADE_GRADE_RT);
        rule.setCount(200);  // 平均响应时间超过200ms时熔断
        rule.setTimeWindow(10);  // 熔断10秒后尝试恢复
        rules.add(rule);
        DegradeRuleManager.loadRules(rules);
    }
}
```

通过该配置，`placeOrder` 方法的平均响应时间如果超过 200 ms，将触发熔断，熔断时间持续 10 秒后，再次尝试调用服务。

## 6 热点参数限流

Sentinel 提供的**热点参数限流**功能非常适合电商平台中的商品查询、下单等场景。某些商品（如热门商品或促销商品）在短时间内可能会被大量访问，可以通过 Sentinel 的热点限流功能限制特定参数的访问频率。

**示例：基于商品 ID 的热点限流**

```java
import com.alibaba.csp.sentinel.annotation.SentinelResource;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @SentinelResource(value = "getProductInfo", blockHandler = "handleHotParamLimit")
    public String getProductInfo(String productId) {
        // 获取商品信息逻辑
        return "Product ID: " + productId + " info";
    }

    // 热点限流后的回调方法
    public String handleHotParamLimit(String productId, BlockException ex) {
        return "Too many requests for product " + productId + ". Please try again later.";
    }
}
```

在此示例中，`getProductInfo` 方法会根据传入的 `productId` 执行限流，当某个特定商品的查询过多时，会触发限流回调。
