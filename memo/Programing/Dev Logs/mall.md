# Mall

## 1 MyBatis Generator (MBG)

### 1.1 配置文件

`generatorConfig.xml` 生成 pojo 时指定 `useJSR310Types` 以使用 `LocalDateTime` 等类型

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE generatorConfiguration  
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"  
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">  
<generatorConfiguration>  
    <!-- 引用外部属性文件 -->  
    <properties resource="generator.properties"/>  
  
    <context id="MySqlContext" targetRuntime="MyBatis3" defaultModelType="flat">  
        <!-- 设置数据库标识符的起始和结束分隔符 -->  
        <property name="beginningDelimiter" value="`"/>  
        <property name="endingDelimiter" value="`"/>  
        <!-- 设置生成的Java文件的编码 -->  
        <property name="javaFileEncoding" value="UTF-8"/>  
  
        <!-- 插件：为模型生成序列化方法 -->  
        <!--        <plugin type="org.mybatis.generator.plugins.SerializablePlugin"/>-->  
        <plugin type="com.mole.mall.mbg.CustomSerializablePlugin"/>  
        <!-- 插件：为生成的Java模型创建一个toString方法 -->  
        <!--        <plugin type="org.mybatis.generator.plugins.ToStringPlugin"/>-->  
        <!-- 插件：为生成的Java模型增加equals和hashCode方法 -->  
        <!--        <plugin type="org.mybatis.generator.plugins.EqualsHashCodePlugin"/>-->  
        <!-- 插件：为生成的Java模型添加Lombok注解 -->  
        <plugin type="com.mole.mall.mbg.LombokPlugin"/>  
        <!-- 插件：为生成的Java模型删除get/set方法 -->  
        <plugin type="com.mole.mall.mbg.RemoveMethodsPlugin"/>  
        <!-- 插件：生成mapper.xml时覆盖原文件 -->  
        <plugin type="org.mybatis.generator.plugins.UnmergeableXmlMappersPlugin"/>  
  
        <!-- 自定义注释生成器配置 -->  
        <commentGenerator type="com.mole.mall.mbg.CommentGenerator">  
            <!-- 是否去除自动生成的注释 true：是 ： false:否 -->  
            <property name="suppressAllComments" value="true"/>  
            <!-- 是否去除生成的注释中的日期 -->  
            <property name="suppressDate" value="true"/>  
            <!-- 是否添加备注注释 -->  
            <property name="addRemarkComments" value="true"/>  
        </commentGenerator>  
  
        <!-- 数据库连接配置 -->  
        <jdbcConnection driverClass="${jdbc.driverClass}"  
                        connectionURL="${jdbc.connectionURL}"  
                        userId="${jdbc.userId}"  
                        password="${jdbc.password}">  
            <!-- 解决MySQL驱动升级到8.0后不生成指定数据库代码的问题 -->  
            <property name="nullCatalogMeansCurrent" value="true"/>  
        </jdbcConnection>  
  
        <javaTypeResolver>  
            <!-- 类型解析器 -->  
            <property name="forceBigDecimals" value="false"/>  
            <property name="useJSR310Types" value="true"/>  
        </javaTypeResolver>  
  
        <!-- Java模型生成器配置 -->  
        <javaModelGenerator targetPackage="com.mole.mall.mbg.pojo" targetProject="mall-mbg\src\main\java">  
            <!-- 是否让schema作为包后缀 -->  
            <property name="enableSubPackages" value="false"/>  
            <!-- 从数据库返回的值被清理前后的空格 -->  
            <property name="trimStrings" value="true"/>  
        </javaModelGenerator>  
  
        <!-- SQL映射文件生成器配置 -->  
        <sqlMapGenerator targetPackage="mapper" targetProject="mall-mbg\src\main\resources">  
            <property name="enableSubPackages" value="false"/>  
        </sqlMapGenerator>  
  
        <!-- Java客户端生成器配置 -->  
        <javaClientGenerator type="XMLMAPPER" targetPackage="com.mole.mall.mbg.mapper"  
                             targetProject="mall-mbg\src\main\java">  
            <property name="enableSubPackages" value="false"/>  
        </javaClientGenerator>  
  
        <!-- 表配置，生成全部表的代码 -->  
        <table tableName="%">  
            <!-- 设置主键生成策略 -->  
            <generatedKey column="id" sqlStatement="MySql" identity="true"/>  
        </table>  
    </context>  
</generatorConfiguration>
```

`generator.properties`

```properties
jdbc.driverClass=com.mysql.cj.jdbc.Driver  
jdbc.connectionURL=jdbc:mysql://localhost:3306/mall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai  
jdbc.userId=root  
jdbc.password=root
```

### 1.2 生成工具类

`Generator`

```java
package com.mole.mall.mbg;  
  
import org.mybatis.generator.api.MyBatisGenerator;  
import org.mybatis.generator.config.Configuration;  
import org.mybatis.generator.config.xml.ConfigurationParser;  
import org.mybatis.generator.internal.DefaultShellCallback;  
  
import java.io.InputStream;  
import java.util.ArrayList;  
import java.util.List;  
  
/**  
 * 用于生成MBG的代码  
 * Created by macro on 2018/4/26.  
 * Modified by Cyanix-0721 on 2024/9/25. 
 */
 public class Generator {  
    public static void main(String[] args) throws Exception {  
       // MBG 执行过程中的警告信息  
       List<String> warnings = new ArrayList<>();  
       // 当生成的代码重复时，覆盖原代码  
       boolean overwrite = true;  
  
       // 读取我们的 MBG 配置文件  
       try (InputStream is = Generator.class.getClassLoader().getResourceAsStream("generatorConfig.xml")) {  
          ConfigurationParser cp = new ConfigurationParser(warnings);  
          Configuration config = cp.parseConfiguration(is);  
  
          DefaultShellCallback callback = new DefaultShellCallback(overwrite);  
          // 创建 MBG          MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config, callback, warnings);  
          // 执行生成代码  
          myBatisGenerator.generate(null);  
       }  
  
       // 输出警告信息  
       warnings.forEach(System.out::println);  
    }  
}
```

`CommentGenerator`

```java
package com.mole.mall.mbg;  
  
import org.mybatis.generator.api.IntrospectedColumn;  
import org.mybatis.generator.api.IntrospectedTable;  
import org.mybatis.generator.api.dom.java.CompilationUnit;  
import org.mybatis.generator.api.dom.java.Field;  
import org.mybatis.generator.api.dom.java.FullyQualifiedJavaType;  
import org.mybatis.generator.internal.DefaultCommentGenerator;  
import org.mybatis.generator.internal.util.StringUtility;  
  
import java.util.Properties;  
  
/**  
 * 自定义注释生成器  
 * Created by macro on 2018/4/26.  
 * Modified by Cyanix-0721 on 2024/9/25. */public class CommentGenerator extends DefaultCommentGenerator {  
    private boolean addRemarkComments = false;  
    private static final String EXAMPLE_SUFFIX = "Example";  
    private static final String MAPPER_SUFFIX = "Mapper";  
    private static final String API_MODEL_PROPERTY_FULL_CLASS_NAME = "io.swagger.v3.oas.annotations.media.Schema";  
  
    /**  
     * 设置用户配置的参数  
     *  
     * @param properties 用户配置的属性  
     */  
    @Override  
    public void addConfigurationProperties(Properties properties) {  
       super.addConfigurationProperties(properties);  
       this.addRemarkComments = StringUtility.isTrue(properties.getProperty("addRemarkComments"));  
    }  
  
    /**  
     * 给字段添加注释  
     *  
     * @param field              字段  
     * @param introspectedTable  内省表  
     * @param introspectedColumn 内省列  
     */  
    @Override  
    public void addFieldComment(Field field, IntrospectedTable introspectedTable,  
                                IntrospectedColumn introspectedColumn) {  
       String remarks = introspectedColumn.getRemarks();  
       // 根据参数和备注信息判断是否添加 Swagger 注解信息  
       if (addRemarkComments && StringUtility.stringHasValue(remarks)) {  
          // 数据库中特殊字符需要转义  
          if (remarks.contains("\"")) {  
             remarks = remarks.replace("\"", "'");  
          }  
          // 给模型的字段添加 Swagger 注解  
          field.addJavaDocLine("@Schema(title = \"" + remarks + "\")");  
       }  
    }  
  
    /**  
     * 给模型的字段添加注释  
     *  
     * @param field   字段  
     * @param remarks 备注信息  
     */  
    private void addFieldJavaDoc(Field field, String remarks) {  
       // 文档注释开始  
       field.addJavaDocLine("/**");  
       // 获取数据库字段的备注信息  
       String[] remarkLines = remarks.split(System.lineSeparator());  
       for (String remarkLine : remarkLines) {  
          field.addJavaDocLine(" * " + remarkLine);  
       }  
       addJavadocTag(field, false);  
       field.addJavaDocLine(" */");  
    }  
  
    /**  
     * 给 Java 文件添加注释  
     *  
     * @param compilationUnit 编译单元  
     */  
    @Override  
    public void addJavaFileComment(CompilationUnit compilationUnit) {  
       super.addJavaFileComment(compilationUnit);  
       // 只在模型文件中添加 Swagger 注解类的导入，不在 Example 或 Mapper 文件中添加  
       if (! compilationUnit.getType().getFullyQualifiedName().contains(MAPPER_SUFFIX) &&  
             ! compilationUnit.getType().getFullyQualifiedName().contains(EXAMPLE_SUFFIX)) {  
          compilationUnit.addImportedType(new FullyQualifiedJavaType(API_MODEL_PROPERTY_FULL_CLASS_NAME));  
       }  
    }  
}
```

### 1.3 插件

`LombokPlugin` Lombok 替代原生 get/set/equals 等方法

```java
package com.mole.mall.mbg;  
  
import org.mybatis.generator.api.IntrospectedTable;  
import org.mybatis.generator.api.PluginAdapter;  
import org.mybatis.generator.api.dom.java.FullyQualifiedJavaType;  
import org.mybatis.generator.api.dom.java.TopLevelClass;  
  
import java.util.List;  
  
/**  
 * LombokPlugin 是一个自定义的 MyBatis Generator 插件，  
 * 用于在生成的模型类中添加 Lombok 注解 (@Data, @NoArgsConstructor, @AllArgsConstructor)。  
 */  
public class LombokPlugin extends PluginAdapter {  
  
    /**  
     * 验证插件配置。  
     *  
     * @param warnings 如果配置无效，添加警告信息。  
     * @return true 如果配置有效。  
     */  
    @Override  
    public boolean validate(List<String> warnings) {  
        return true;  
    }  
  
    /**  
     * 在基础记录类中添加 Lombok 注解。  
     *  
     * @param topLevelClass 生成的基础记录类。  
     * @param introspectedTable 从数据库中内省的表。  
     * @return true 继续处理。  
     */  
    @Override  
    public boolean modelBaseRecordClassGenerated(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {  
        addLombokAnnotations(topLevelClass);  
        return true;  
    }  
  
    /**  
     * 在主键类中添加 Lombok 注解。  
     *  
     * @param topLevelClass 生成的主键类。  
     * @param introspectedTable 从数据库中内省的表。  
     * @return true 继续处理。  
     */  
    @Override  
    public boolean modelPrimaryKeyClassGenerated(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {  
        addLombokAnnotations(topLevelClass);  
        return true;  
    }  
  
    /**  
     * 在包含 BLOB 的记录类中添加 Lombok 注解。  
     *  
     * @param topLevelClass 生成的包含 BLOB 的记录类。  
     * @param introspectedTable 从数据库中内省的表。  
     * @return true 继续处理。  
     */  
    @Override  
    public boolean modelRecordWithBLOBsClassGenerated(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {  
        addLombokAnnotations(topLevelClass);  
        return true;  
    }  
  
    /**  
     * 为指定的类添加 Lombok 注解 (@Data, @NoArgsConstructor, @AllArgsConstructor)。  
     *  
     * @param topLevelClass 要添加注解的类。  
     */  
    private void addLombokAnnotations(TopLevelClass topLevelClass) {  
        topLevelClass.addImportedType(new FullyQualifiedJavaType("lombok.Data"));  
        topLevelClass.addImportedType(new FullyQualifiedJavaType("lombok.NoArgsConstructor"));  
        topLevelClass.addImportedType(new FullyQualifiedJavaType("lombok.AllArgsConstructor"));  
        topLevelClass.addAnnotation("@Data");  
        topLevelClass.addAnnotation("@NoArgsConstructor");  
        topLevelClass.addAnnotation("@AllArgsConstructor");  
    }  
}
```

`RemoveMethodsPlugin`

```java
package com.mole.mall.mbg;  
  
import org.mybatis.generator.api.IntrospectedTable;  
import org.mybatis.generator.api.PluginAdapter;  
import org.mybatis.generator.api.dom.java.TopLevelClass;  
  
import java.util.List;  
  
/**  
 * RemoveMethodsPlugin 是一个自定义的 MyBatis Generator 插件，  
 * 用于移除生成的 get 和 set 方法。  
 */  
public class RemoveMethodsPlugin extends PluginAdapter {  
  
    /**  
     * 验证插件配置。  
     *  
     * @param warnings 如果配置无效，添加警告信息。  
     * @return true 如果配置有效。  
     */  
    @Override  
    public boolean validate(List<String> warnings) {  
       return true;  
    }  
  
    /**  
     * 移除基础记录类中的 get 和 set 方法。  
     *  
     * @param topLevelClass     生成的基础记录类。  
     * @param introspectedTable 从数据库中内省的表。  
     * @return true 继续处理。  
     */  
    @Override  
    public boolean modelBaseRecordClassGenerated(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {  
       removeGettersAndSetters(topLevelClass);  
       return true;  
    }  
  
    /**  
     * 移除主键类中的 get 和 set 方法。  
     *  
     * @param topLevelClass     生成的主键类。  
     * @param introspectedTable 从数据库中内省的表。  
     * @return true 继续处理。  
     */  
    @Override  
    public boolean modelPrimaryKeyClassGenerated(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {  
       removeGettersAndSetters(topLevelClass);  
       return true;  
    }  
  
    /**  
     * 移除包含 BLOB 的记录类中的 get 和 set 方法。  
     *  
     * @param topLevelClass     生成的包含 BLOB 的记录类。  
     * @param introspectedTable 从数据库中内省的表。  
     * @return true 继续处理。  
     */  
    @Override  
    public boolean modelRecordWithBLOBsClassGenerated(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {  
       removeGettersAndSetters(topLevelClass);  
       return true;  
    }  
  
    /**  
     * 移除指定类中的 get 和 set 方法。  
     *  
     * @param topLevelClass 要移除方法的类。  
     */  
    private void removeGettersAndSetters(TopLevelClass topLevelClass) {  
       topLevelClass.getMethods().removeIf(method -> method.getName().startsWith("get") || method.getName().startsWith("set"));  
    }  
}
```

`CustomSerializablePlugin` serialVersionUID 字段添加 @Serial 注解

```java
package com.mole.mall.mbg;  
  
import org.mybatis.generator.api.IntrospectedTable;  
import org.mybatis.generator.api.dom.java.Field;  
import org.mybatis.generator.api.dom.java.FullyQualifiedJavaType;  
import org.mybatis.generator.api.dom.java.TopLevelClass;  
import org.mybatis.generator.plugins.SerializablePlugin;  
  
/**  
 * 自定义插件，用于在生成的类中为 serialVersionUID 字段添加 @Serial 注解。  
 */  
public class CustomSerializablePlugin extends SerializablePlugin {  
  
    @Override  
    protected void makeSerializable(TopLevelClass topLevelClass, IntrospectedTable introspectedTable) {  
       super.makeSerializable(topLevelClass, introspectedTable);  
       addSerialAnnotation(topLevelClass);  
    }  
  
    /**  
     * 为指定类中的 serialVersionUID 字段添加 @Serial 注解。  
     *  
     * @param topLevelClass 要添加注解的类。  
     */  
    private void addSerialAnnotation(TopLevelClass topLevelClass) {  
       for (Field field : topLevelClass.getFields()) {  
          if ("serialVersionUID".equals(field.getName())) {  
             field.addAnnotation("@Serial");  
             topLevelClass.addImportedType(new FullyQualifiedJavaType("java.io.Serial"));  
          }  
       }  
    }  
}
```

## 2 日志

### 2.1 `WebLogAspect.java`

通过 AOP 实现记录 Controller 操作记录, 通过 Logstash 传输到 Elasticsearch

```java
package com.mole.mall.common.log;  
  
import cn.hutool.core.util.StrUtil;  
import cn.hutool.core.util.URLUtil;  
import cn.hutool.json.JSONUtil;  
import com.mole.mall.common.domain.WebLog;  
import io.swagger.v3.oas.annotations.Operation;  
import jakarta.servlet.http.HttpServletRequest;  
import net.logstash.logback.marker.Markers;  
import org.aspectj.lang.JoinPoint;  
import org.aspectj.lang.ProceedingJoinPoint;  
import org.aspectj.lang.Signature;  
import org.aspectj.lang.annotation.*;  
import org.aspectj.lang.reflect.MethodSignature;  
import org.slf4j.Logger;  
import org.slf4j.LoggerFactory;  
import org.springframework.core.annotation.Order;  
import org.springframework.stereotype.Component;  
import org.springframework.util.StringUtils;  
import org.springframework.web.bind.annotation.RequestBody;  
import org.springframework.web.bind.annotation.RequestParam;  
import org.springframework.web.context.request.RequestContextHolder;  
import org.springframework.web.context.request.ServletRequestAttributes;  
  
import java.lang.reflect.Method;  
import java.lang.reflect.Parameter;  
import java.util.ArrayList;  
import java.util.HashMap;  
import java.util.List;  
import java.util.Map;  
  
/**  
 * 统一日志处理切面  
 * Created by macro on 2018/4/26.  
 * Modified by Cyanix-0721 on 2024/09/28. 
 */
@Aspect  
@Component  
@Order(1)  
public class WebLogAspect {  
    private static final Logger LOGGER = LoggerFactory.getLogger(WebLogAspect.class);  
  
    /**  
     * 定义切点，匹配所有控制器中的公共方法  
     */  
    @Pointcut("execution(public * com.mole.mall.*.controller.*.*(..))")  
    public void webLog() {  
    }  
    /**  
     * 在切点方法执行前执行  
     */  
    @Before("webLog()")  
    public void doBefore(JoinPoint joinPoint) throws Throwable {  
       // 目前不需要实现  
    }  
  
    /**  
     * 在切点方法返回后执行  
     */  
    @AfterReturning(value = "webLog()", returning = "ret")  
    public void doAfterReturning(Object ret) throws Throwable {  
       // 目前不需要实现  
    }  
  
    /**  
     * 环绕切点方法执行  
     *  
     * @param joinPoint 连接点，表示被拦截的方法  
     * @return 方法执行结果  
     * @throws Throwable 如果方法执行过程中抛出异常  
     */  
    @Around("webLog()")  
    public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {  
       long startTime = System.currentTimeMillis();  
  
       // 获取当前请求对象  
       ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();  
       HttpServletRequest request = attributes != null ? attributes.getRequest() : null;  
  
       // 记录请求信息（通过Logstash传入Elasticsearch）  
       WebLog webLog = new WebLog();  
       Object result = joinPoint.proceed(); // 执行目标方法  
       Signature signature = joinPoint.getSignature(); // 获取方法签名  
       MethodSignature methodSignature = (MethodSignature) signature; // 强转为方法签名  
       Method method = methodSignature.getMethod(); // 获取方法对象  
  
       // 如果方法上有 @Operation 注解，获取其描述信息  
       if (method.isAnnotationPresent(Operation.class)) {  
          Operation log = method.getAnnotation(Operation.class);  
          webLog.setDescription(log.summary());  
       }  
  
       long endTime = System.currentTimeMillis();  
  
       String urlStr = request != null ? request.getRequestURL().toString() : null;  
  
       // 设置 WebLog 对象的属性  
       webLog.setBasePath(urlStr != null ? StrUtil.removeSuffix(urlStr, URLUtil.url(urlStr).getPath()) : null);  
       webLog.setIp(request != null ? request.getRemoteUser() : null);  
       webLog.setMethod(request != null ? request.getMethod() : null);  
       webLog.setParameter(getParameter(method, joinPoint.getArgs()));  
       webLog.setResult(result);  
       webLog.setSpendTime((int) (endTime - startTime));  
       webLog.setStartTime(startTime);  
       webLog.setUri(request != null ? request.getRequestURI() : null);  
       webLog.setUrl(request != null ? request.getRequestURL().toString() : null);  
  
       // 构建日志信息  
       Map<String, Object> logMap = new HashMap<>();  
       logMap.put("url", webLog.getUrl());  
       logMap.put("method", webLog.getMethod());  
       logMap.put("parameter", webLog.getParameter());  
       logMap.put("spendTime", webLog.getSpendTime());  
       logMap.put("description", webLog.getDescription());  
  
       // 记录日志信息  
       LOGGER.info(Markers.appendEntries(logMap), JSONUtil.parse(webLog).toString());  
  
       return result;  
    }  
  
    /**  
     * 根据方法和传入的参数获取请求参数  
     *  
     * @param method 方法对象  
     * @param args   方法参数  
     * @return 请求参数对象  
     */  
    private Object getParameter(Method method, Object[] args) {  
       List<Object> argList = new ArrayList<>();  
       Parameter[] parameters = method.getParameters();  
       for (int i = 0; i < parameters.length; i++) {  
          // 将 RequestBody 注解修饰的参数作为请求参数  
          RequestBody requestBody = parameters[i].getAnnotation(RequestBody.class);  
          if (requestBody != null) {  
             argList.add(args[i]);  
          }  
          // 将 RequestParam 注解修饰的参数作为请求参数  
          RequestParam requestParam = parameters[i].getAnnotation(RequestParam.class);  
          if (requestParam != null) {  
             Map<String, Object> map = new HashMap<>();  
             String key = parameters[i].getName();  
             if (StringUtils.hasLength(requestParam.value())) {  
                key = requestParam.value();  
             }  
             map.put(key, args[i]);  
             argList.add(map);  
          }  
       }  
       if (argList.isEmpty()) {  
          return null;  
       } else if (argList.size() == 1) {  
          return argList.get(0);  
       } else {  
          return argList;  
       }  
    }  
}
```

### 2.2 `WebLog.java`

```java
package com.mole.mall.common.domain;  
  
import lombok.Data;  
import lombok.EqualsAndHashCode;  
  
/**  
 * Controller层的日志封装类  
 * Created by macro on 2018/4/26.  
 */
@Data  
@EqualsAndHashCode(callSuper = false)  
public class WebLog {  
    /**  
     * 操作描述  
     */  
    private String description;  
  
    /**  
     * 操作用户  
     */  
    private String username;  
  
    /**  
     * 操作时间  
     */  
    private Long startTime;  
  
    /**  
     * 消耗时间  
     */  
    private Integer spendTime;  
  
    /**  
     * 根路径  
     */  
    private String basePath;  
  
    /**  
     * URI     */    private String uri;  
  
    /**  
     * URL     */    private String url;  
  
    /**  
     * 请求类型  
     */  
    private String method;  
  
    /**  
     * IP地址  
     */  
    private String ip;  
  
    /**  
     * 请求参数  
     */  
    private Object parameter;  
  
    /**  
     * 返回结果  
     */  
    private Object result;  
  
}
```

### 2.3 `logback-spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<!DOCTYPE configuration>  
<configuration>  
    <!-- 引用默认日志配置 -->  
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>  
    <!-- 使用默认的控制台日志输出实现 -->  
    <include resource="org/springframework/boot/logging/logback/console-appender.xml"/>  
    <!-- 应用名称 -->  
    <springProperty scope="context" name="APP_NAME" source="spring.application.name" defaultValue="springBoot"/>  
    <!-- 日志文件保存路径 -->  
    <property name="LOG_FILE_PATH" value="${LOG_FILE:-${LOG_PATH:-${LOG_TEMP:-${java.io.tmpdir:-/tmp}}}/logs}"/>  
    <!-- LogStash访问host -->  
    <springProperty name="LOG_STASH_HOST" scope="context" source="logstash.host" defaultValue="localhost"/>  
    <!-- 是否开启LogStash插件内部日志 -->  
    <springProperty name="ENABLE_INNER_LOG" scope="context" source="logstash.enableInnerLog" defaultValue="false"/>  
    <!-- 配置不打印logback内部的状态信息，排查logback配置问题时可注释掉 -->  
    <statusListener class="ch.qos.logback.core.status.NopStatusListener" />  
  
    <!-- DEBUG日志输出到文件 -->  
    <appender name="FILE_DEBUG" class="ch.qos.logback.core.rolling.RollingFileAppender">  
        <!-- 输出DEBUG以上级别日志 -->  
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">  
            <level>DEBUG</level>  
        </filter>  
        <encoder>  
            <!-- 设置为默认的文件日志格式 -->  
            <pattern>${FILE_LOG_PATTERN}</pattern>  
            <charset>UTF-8</charset>  
        </encoder>  
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">  
            <!-- 设置文件命名格式 -->  
            <fileNamePattern>${LOG_FILE_PATH}/debug/${APP_NAME}-%d{yyyy-MM-dd}-%i.log</fileNamePattern>  
            <!-- 设置日志文件大小，超过就重新生成文件，默认10M -->  
            <maxFileSize>${LOG_FILE_MAX_SIZE:-10MB}</maxFileSize>  
            <!-- 日志文件保留天数，默认30天 -->  
            <maxHistory>${LOG_FILE_MAX_HISTORY:-30}</maxHistory>  
        </rollingPolicy>  
    </appender>  
  
    <!-- ERROR日志输出到文件 -->  
    <appender name="FILE_ERROR" class="ch.qos.logback.core.rolling.RollingFileAppender">  
        <!-- 只输出ERROR级别的日志 -->  
        <filter class="ch.qos.logback.classic.filter.LevelFilter">  
            <level>ERROR</level>  
            <onMatch>ACCEPT</onMatch>  
            <onMismatch>DENY</onMismatch>  
        </filter>  
        <encoder>  
            <!-- 设置为默认的文件日志格式 -->  
            <pattern>${FILE_LOG_PATTERN}</pattern>  
            <charset>UTF-8</charset>  
        </encoder>  
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">  
            <!-- 设置文件命名格式 -->  
            <fileNamePattern>${LOG_FILE_PATH}/error/${APP_NAME}-%d{yyyy-MM-dd}-%i.log</fileNamePattern>  
            <!-- 设置日志文件大小，超过就重新生成文件，默认10M -->  
            <maxFileSize>${LOG_FILE_MAX_SIZE:-10MB}</maxFileSize>  
            <!-- 日志文件保留天数，默认30天 -->  
            <maxHistory>${LOG_FILE_MAX_HISTORY:-30}</maxHistory>  
        </rollingPolicy>  
    </appender>  
  
    <!-- DEBUG日志输出到LogStash -->  
    <appender name="LOG_STASH_DEBUG" class="net.logstash.logback.appender.LogstashTcpSocketAppender">  
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">  
            <level>DEBUG</level>  
        </filter>  
        <destination>${LOG_STASH_HOST}:4560</destination>  
        <addDefaultStatusListener>${ENABLE_INNER_LOG}</addDefaultStatusListener>  
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">  
            <providers>  
                <timestamp>  
                    <timeZone>Asia/Shanghai</timeZone>  
                </timestamp>  
                <!-- 自定义日志输出格式 -->  
                <pattern>  
                    <pattern>  
                        {  
                        "project": "mall",  
                        "level": "%level",  
                        "service": "${APP_NAME:-}",  
                        "pid": "${PID:-}",  
                        "thread": "%thread",  
                        "class": "%logger",  
                        "message": "%message",  
                        "stack_trace": "%exception{20}"  
                        }  
                    </pattern>  
                </pattern>  
            </providers>  
        </encoder>  
    </appender>  
  
    <!-- ERROR日志输出到LogStash -->  
    <appender name="LOG_STASH_ERROR" class="net.logstash.logback.appender.LogstashTcpSocketAppender">  
        <filter class="ch.qos.logback.classic.filter.LevelFilter">  
            <level>ERROR</level>  
            <onMatch>ACCEPT</onMatch>  
            <onMismatch>DENY</onMismatch>  
        </filter>  
        <destination>${LOG_STASH_HOST}:4561</destination>  
        <addDefaultStatusListener>${ENABLE_INNER_LOG}</addDefaultStatusListener>  
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">  
            <providers>  
                <timestamp>  
                    <timeZone>Asia/Shanghai</timeZone>  
                </timestamp>  
                <!-- 自定义日志输出格式 -->  
                <pattern>  
                    <pattern>  
                        {  
                        "project": "mall",  
                        "level": "%level",  
                        "service": "${APP_NAME:-}",  
                        "pid": "${PID:-}",  
                        "thread": "%thread",  
                        "class": "%logger",  
                        "message": "%message",  
                        "stack_trace": "%exception{20}"  
                        }  
                    </pattern>  
                </pattern>  
            </providers>  
        </encoder>  
    </appender>  
  
    <!-- 业务日志输出到LogStash -->  
    <appender name="LOG_STASH_BUSINESS" class="net.logstash.logback.appender.LogstashTcpSocketAppender">  
        <destination>${LOG_STASH_HOST}:4562</destination>  
        <addDefaultStatusListener>${ENABLE_INNER_LOG}</addDefaultStatusListener>  
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">  
            <providers>  
                <timestamp>  
                    <timeZone>Asia/Shanghai</timeZone>  
                </timestamp>  
                <!-- 自定义日志输出格式 -->  
                <pattern>  
                    <pattern>  
                        {  
                        "project": "mall",  
                        "level": "%level",  
                        "service": "${APP_NAME:-}",  
                        "pid": "${PID:-}",  
                        "thread": "%thread",  
                        "class": "%logger",  
                        "message": "%message",  
                        "stack_trace": "%exception{20}"  
                        }  
                    </pattern>  
                </pattern>  
            </providers>  
        </encoder>  
    </appender>  
  
    <!-- 接口访问记录日志输出到LogStash -->  
    <appender name="LOG_STASH_RECORD" class="net.logstash.logback.appender.LogstashTcpSocketAppender">  
        <destination>${LOG_STASH_HOST}:4563</destination>  
        <addDefaultStatusListener>${ENABLE_INNER_LOG}</addDefaultStatusListener>  
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder">  
            <providers>  
                <timestamp>  
                    <timeZone>Asia/Shanghai</timeZone>  
                </timestamp>  
                <!-- 自定义日志输出格式 -->  
                <pattern>  
                    <pattern>  
                        {  
                        "project": "mall",  
                        "level": "%level",  
                        "service": "${APP_NAME:-}",  
                        "class": "%logger",  
                        "message": "%message"  
                        }  
                    </pattern>  
                </pattern>  
            </providers>  
        </encoder>  
    </appender>  
  
    <!-- 控制框架输出日志 -->  
    <logger name="org.slf4j" level="INFO"/>  
    <logger name="springfox" level="INFO"/>  
    <logger name="io.swagger" level="INFO"/>  
    <logger name="org.springframework" level="INFO"/>  
    <logger name="org.hibernate.validator" level="INFO"/>  
    <logger name="com.alibaba.nacos.client.naming" level="INFO"/>  
  
    <!-- 根日志记录器配置 -->  
    <root>  
        <level value="ERROR"/>  
        <appender-ref ref="CONSOLE"/>  
        <appender-ref ref="FILE_DEBUG"/>  
        <appender-ref ref="FILE_ERROR"/>  
        <appender-ref ref="LOG_STASH_DEBUG"/>  
        <appender-ref ref="LOG_STASH_ERROR"/>  
    </root>  
  
    <!-- WebLogAspect类的日志配置 -->  
    <logger name="com.mole.mall.common.log.WebLogAspect" level="DEBUG">  
        <appender-ref ref="LOG_STASH_RECORD"/>  
    </logger>  
  
    <!-- com.mole.mall包的日志配置 -->  
    <logger name="com.mole.mall" level="DEBUG">  
        <appender-ref ref="LOG_STASH_BUSINESS"/>  
    </logger>  
</configuration>
```

## 3 Redis

### 3.1 `BaseRedisConfig.java`

```java
package com.mole.mall.common.config;  
  
import com.fasterxml.jackson.annotation.JsonAutoDetect;  
import com.fasterxml.jackson.annotation.PropertyAccessor;  
import com.fasterxml.jackson.databind.ObjectMapper;  
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;  
import org.springframework.context.annotation.Bean;  
import org.springframework.data.redis.cache.RedisCacheConfiguration;  
import org.springframework.data.redis.cache.RedisCacheManager;  
import org.springframework.data.redis.cache.RedisCacheWriter;  
import org.springframework.data.redis.connection.RedisConnectionFactory;  
import org.springframework.data.redis.core.RedisTemplate;  
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;  
import org.springframework.data.redis.serializer.RedisSerializationContext;  
import org.springframework.data.redis.serializer.RedisSerializer;  
import org.springframework.data.redis.serializer.StringRedisSerializer;  
  
import java.time.Duration;  
  
/**  
 * Redis基础配置  
 * Created by macro on 2020/6/19.  
 * Modified by Cyanix-0721 on 2024/9/28.
 */
 public class BaseRedisConfig {  
  
    /**  
     * 配置 RedisTemplate  
     *     * @param redisConnectionFactory Redis 连接工厂  
     * @return RedisTemplate 实例  
     */  
    @Bean  
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {  
       // 创建一个 RedisSerializer 对象，用于序列化 Redis 中的值  
       RedisSerializer<Object> serializer = redisSerializer();  
  
       // 创建一个 RedisTemplate 对象，用于执行 Redis 操作  
       RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();  
  
       // 设置 Redis 连接工厂  
       redisTemplate.setConnectionFactory(redisConnectionFactory);  
  
       // 设置键的序列化器为 StringRedisSerializer       redisTemplate.setKeySerializer(new StringRedisSerializer());  
  
       // 设置值的序列化器为自定义的 JSON 序列化器  
       redisTemplate.setValueSerializer(serializer);  
  
       // 设置哈希键的序列化器为 StringRedisSerializer
	   redisTemplate.setHashKeySerializer(new StringRedisSerializer());  
  
       // 设置哈希值的序列化器为自定义的 JSON 序列化器  
       redisTemplate.setHashValueSerializer(serializer);  
  
       // 在设置完所有属性后，调用 afterPropertiesSet 方法，确保所有属性都已设置  
       redisTemplate.afterPropertiesSet();  
  
       // 返回配置好的 RedisTemplate 实例  
       return redisTemplate;  
    }  
  
    /**  
     * 配置 Redis 序列化器  
     *  
     * @return RedisSerializer 实例  
     */  
    @Bean  
    public RedisSerializer<Object> redisSerializer() {  
  
       // 创建 ObjectMapper 对象，用于配置 JSON 序列化  
       ObjectMapper objectMapper = new ObjectMapper();  
  
       // 设置所有访问权限的可见性  
       objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);  
  
       // 启用默认类型，必须设置，否则无法将 JSON 转化为对象，会转化成 Map 类型  
       objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);  
  
       // 创建 JSON 序列化器, 将配置好的 ObjectMapper 设置到 JSON 序列化器中  
       return new Jackson2JsonRedisSerializer<>(objectMapper, Object.class);  
    }  
  
    /**  
     * 配置 Redis 缓存管理器  
     *  
     * @param redisConnectionFactory Redis 连接工厂  
     * @return RedisCacheManager 实例  
     */  
    @Bean  
    public RedisCacheManager redisCacheManager(RedisConnectionFactory redisConnectionFactory) {  
       // 创建一个 RedisCacheWriter 对象，不会锁定缓存  
       RedisCacheWriter redisCacheWriter = RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory);  
  
       // 配置 Redis 缓存，设置默认过期时间为 1 天  
       RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()  
             .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(redisSerializer()))  
             .entryTtl(Duration.ofDays(1));  
  
       // 返回配置好的 RedisCacheManager 实例  
       return new RedisCacheManager(redisCacheWriter, redisCacheConfiguration);  
    }  
}
```

### 3.2 `RedisService.java`

封装 Redis 操作到 Service 层是有意义的，主要有以下几个原因：  

- 抽象化：通过封装 Redis 操作，可以将底层的实现细节隐藏起来，提供一个更高层次的抽象接口。这使得代码更易于理解和维护。  
- 重用性：将 Redis 操作集中在一个 Service 中，可以在应用的不同部分重用这些操作，避免代码重复。  
- 简化代码：提供更高层次的方法来执行常见的 Redis 操作，减少样板代码，使业务逻辑更简洁。  
- 测试性：通过封装，可以更容易地对 Redis 操作进行单元测试。你可以通过 Mock Service 来测试业务逻辑，而不需要依赖实际的 Redis 实例。  
- 灵活性：如果将来需要更换底层的缓存实现（例如从 Redis 切换到其他缓存系统），只需要修改 Service 的实现，而不需要修改业务代码。  

总之，封装 Redis 操作到 Service 层可以提高代码的可维护性、可重用性和可测试性，是一种良好的实践。

```java
package com.mole.mall.common.service;  
  
import java.util.List;  
import java.util.Map;  
import java.util.Set;  
  
/**  
 * redis操作Service  
 * Created by macro on 2020/3/3. 
 */
 public interface RedisService {  
  
    /**  
     * 保存属性  
     */  
    void set(String key, Object value, long time);  
  
    /**  
     * 保存属性  
     */  
    void set(String key, Object value);  
  
    /**  
     * 获取属性  
     */  
    Object get(String key);  
  
    /**  
     * 删除属性  
     */  
    Boolean del(String key);  
  
    /**  
     * 批量删除属性  
     */  
    Long del(List<String> keys);  
  
    /**  
     * 设置过期时间  
     */  
    Boolean expire(String key, long time);  
  
    /**  
     * 获取过期时间  
     */  
    Long getExpire(String key);  
  
    /**  
     * 判断是否有该属性  
     */  
    Boolean hasKey(String key);  
  
    /**  
     * 按delta递增  
     */  
    Long incr(String key, long delta);  
  
    /**  
     * 按delta递减  
     */  
    Long decr(String key, long delta);  
  
    /**  
     * 获取Hash结构中的属性  
     */  
    Object hGet(String key, String hashKey);  
  
    /**  
     * 向Hash结构中放入一个属性  
     */  
    Boolean hSet(String key, String hashKey, Object value, long time);  
  
    /**  
     * 向Hash结构中放入一个属性  
     */  
    void hSet(String key, String hashKey, Object value);  
  
    /**  
     * 直接获取整个Hash结构  
     */  
    Map<Object, Object> hGetAll(String key);  
  
    /**  
     * 直接设置整个Hash结构  
     */  
    Boolean hSetAll(String key, Map<String, Object> map, long time);  
  
    /**  
     * 直接设置整个Hash结构  
     */  
    void hSetAll(String key, Map<String, ?> map);  
  
    /**  
     * 删除Hash结构中的属性  
     */  
    void hDel(String key, Object… hashKey);  
  
    /**  
     * 判断Hash结构中是否有该属性  
     */  
    Boolean hHasKey(String key, String hashKey);  
  
    /**  
     * Hash结构中属性递增  
     */  
    Long hIncr(String key, String hashKey, Long delta);  
  
    /**  
     * Hash结构中属性递减  
     */  
    Long hDecr(String key, String hashKey, Long delta);  
  
    /**  
     * 获取Set结构  
     */  
    Set<Object> sMembers(String key);  
  
    /**  
     * 向Set结构中添加属性  
     */  
    Long sAdd(String key, Object… values);  
  
    /**  
     * 向Set结构中添加属性  
     */  
    Long sAdd(String key, long time, Object… values);  
  
    /**  
     * 是否为Set中的属性  
     */  
    Boolean sIsMember(String key, Object value);  
  
    /**  
     * 获取Set结构的长度  
     */  
    Long sSize(String key);  
  
    /**  
     * 删除Set结构中的属性  
     */  
    Long sRemove(String key, Object… values);  
  
    /**  
     * 获取List结构中的属性  
     */  
    List<Object> lRange(String key, long start, long end);  
  
    /**  
     * 获取List结构的长度  
     */  
    Long lSize(String key);  
  
    /**  
     * 根据索引获取List中的属性  
     */  
    Object lIndex(String key, long index);  
  
    /**  
     * 向List结构中添加属性  
     */  
    Long lPush(String key, Object value);  
  
    /**  
     * 向List结构中添加属性  
     */  
    Long lPush(String key, Object value, long time);  
  
    /**  
     * 向List结构中批量添加属性  
     */  
    Long lPushAll(String key, Object… values);  
  
    /**  
     * 向List结构中批量添加属性  
     */  
    Long lPushAll(String key, Long time, Object… values);  
  
    /**  
     * 从List结构中移除属性  
     */  
    Long lRemove(String key, long count, Object value);  
}
```

```java
package com.mole.mall.common.service.impl;  
  
import com.mole.mall.common.service.RedisService;  
import org.springframework.beans.factory.annotation.Autowired;  
import org.springframework.data.redis.core.RedisTemplate;  
import org.springframework.stereotype.Service;  
  
import java.util.List;  
import java.util.Map;  
import java.util.Set;  
import java.util.concurrent.TimeUnit;  
  
/**  
 * redis操作实现类  
 * Created by macro on 2020/3/3.  
 * Modified by Cyanix-0721 on 2024/9/28. 
 */
@Service  
public class RedisServiceImpl implements RedisService {  
  
    @Autowired  
    private RedisTemplate<String, Object> redisTemplate;  
  
    @Override  
    public void set(String key, Object value, long time) {  
       // 设置带有过期时间的键值对  
       redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);  
    }  
  
    @Override  
    public void set(String key, Object value) {  
       // 设置键值对  
       redisTemplate.opsForValue().set(key, value);  
    }  
  
    @Override  
    public Object get(String key) {  
       // 获取键对应的值  
       return redisTemplate.opsForValue().get(key);  
    }  
  
    @Override  
    public Boolean del(String key) {  
       // 删除键  
       return redisTemplate.delete(key);  
    }  
  
    @Override  
    public Long del(List<String> keys) {  
       // 批量删除键  
       return redisTemplate.delete(keys);  
    }  
  
    @Override  
    public Boolean expire(String key, long time) {  
       // 设置键的过期时间  
       return redisTemplate.expire(key, time, TimeUnit.SECONDS);  
    }  
  
    @Override  
    public Long getExpire(String key) {  
       // 获取键的过期时间  
       return redisTemplate.getExpire(key, TimeUnit.SECONDS);  
    }  
  
    @Override  
    public Boolean hasKey(String key) {  
       // 判断键是否存在  
       return redisTemplate.hasKey(key);  
    }  
  
    @Override  
    public Long incr(String key, long delta) {  
       // 增加键的值  
       return redisTemplate.opsForValue().increment(key, delta);  
    }  
  
    @Override  
    public Long decr(String key, long delta) {  
       // 减少键的值  
       return redisTemplate.opsForValue().increment(key, - delta);  
    }  
  
    @Override  
    public Object hGet(String key, String hashKey) {  
       // 获取哈希键对应的值  
       return redisTemplate.opsForHash().get(key, hashKey);  
    }  
  
    @Override  
    public Boolean hSet(String key, String hashKey, Object value, long time) {  
       // 设置哈希键值对并设置过期时间  
       redisTemplate.opsForHash().put(key, hashKey, value);  
       return expire(key, time);  
    }  
  
    @Override  
    public void hSet(String key, String hashKey, Object value) {  
       // 设置哈希键值对  
       redisTemplate.opsForHash().put(key, hashKey, value);  
    }  
  
    @Override  
    public Map<Object, Object> hGetAll(String key) {  
       // 获取哈希表中所有键值对  
       return redisTemplate.opsForHash().entries(key);  
    }  
  
    @Override  
    public Boolean hSetAll(String key, Map<String, Object> map, long time) {  
       // 批量设置哈希键值对并设置过期时间  
       redisTemplate.opsForHash().putAll(key, map);  
       return expire(key, time);  
    }  
  
    @Override  
    public void hSetAll(String key, Map<String, ?> map) {  
       // 批量设置哈希键值对  
       redisTemplate.opsForHash().putAll(key, map);  
    }  
  
    @Override  
    public void hDel(String key, Object… hashKey) {  
       // 删除哈希键  
       redisTemplate.opsForHash().delete(key, hashKey);  
    }  
  
    @Override  
    public Boolean hHasKey(String key, String hashKey) {  
       // 判断哈希键是否存在  
       return redisTemplate.opsForHash().hasKey(key, hashKey);  
    }  
  
    @Override  
    public Long hIncr(String key, String hashKey, Long delta) {  
       // 增加哈希键的值  
       return redisTemplate.opsForHash().increment(key, hashKey, delta);  
    }  
  
    @Override  
    public Long hDecr(String key, String hashKey, Long delta) {  
       // 减少哈希键的值  
       return redisTemplate.opsForHash().increment(key, hashKey, - delta);  
    }  
  
    @Override  
    public Set<Object> sMembers(String key) {  
       // 获取集合中的所有成员  
       return redisTemplate.opsForSet().members(key);  
    }  
  
    @Override  
    public Long sAdd(String key, Object… values) {  
       // 向集合中添加成员  
       return redisTemplate.opsForSet().add(key, values);  
    }  
  
    @Override  
    public Long sAdd(String key, long time, Object… values) {  
       // 向集合中添加成员并设置过期时间  
       Long count = redisTemplate.opsForSet().add(key, values);  
       expire(key, time);  
       return count;  
    }  
  
    @Override  
    public Boolean sIsMember(String key, Object value) {  
       // 判断值是否是集合中的成员  
       return redisTemplate.opsForSet().isMember(key, value);  
    }  
  
    @Override  
    public Long sSize(String key) {  
       // 获取集合的大小  
       return redisTemplate.opsForSet().size(key);  
    }  
  
    @Override  
    public Long sRemove(String key, Object… values) {  
       // 移除集合中的成员  
       return redisTemplate.opsForSet().remove(key, values);  
    }  
  
    @Override  
    public List<Object> lRange(String key, long start, long end) {  
       // 获取列表中的元素  
       return redisTemplate.opsForList().range(key, start, end);  
    }  
  
    @Override  
    public Long lSize(String key) {  
       // 获取列表的长度  
       return redisTemplate.opsForList().size(key);  
    }  
  
    @Override  
    public Object lIndex(String key, long index) {  
       // 获取列表中指定索引的元素  
       return redisTemplate.opsForList().index(key, index);  
    }  
  
    @Override  
    public Long lPush(String key, Object value) {  
       // 向列表中添加元素  
       return redisTemplate.opsForList().rightPush(key, value);  
    }  
  
    @Override  
    public Long lPush(String key, Object value, long time) {  
       // 向列表中添加元素并设置过期时间  
       Long index = redisTemplate.opsForList().rightPush(key, value);  
       expire(key, time);  
       return index;  
    }  
  
    @Override  
    public Long lPushAll(String key, Object… values) {  
       // 批量向列表中添加元素  
       return redisTemplate.opsForList().rightPushAll(key, values);  
    }  
  
    @Override  
    public Long lPushAll(String key, Long time, Object… values) {  
       // 批量向列表中添加元素并设置过期时间  
       Long count = redisTemplate.opsForList().rightPushAll(key, values);  
       expire(key, time);  
       return count;  
    }  
  
    @Override  
    public Long lRemove(String key, long count, Object value) {  
       // 移除列表中的元素  
       return redisTemplate.opsForList().remove(key, count, value);  
    }  
}
```

## 4 Feign

### 4.1 `FeignConfig.java`

```java
package com.mole.mall.demo.config;  
  
import com.mole.mall.demo.component.FeignRequestInterceptor;  
import feign.Logger;  
import feign.RequestInterceptor;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
/**  
 * Feign客户端的配置类  
 * Created by macro on 2019/9/5.  
 * Modified by Cyanix on 2024/09/29. 
 */
@Configuration  
public class FeignConfig {  
    /**  
     * 配置Feign的日志级别  
     *  
     * @return FULL日志级别  
     */  
    @Bean  
    Logger.Level feignLoggerLevel() {  
       return Logger.Level.FULL;  
    }  
  
    /**  
     * 配置Feign请求拦截器  
     *  
     * @return FeignRequestInterceptor实例  
     */  
    @Bean  
    RequestInterceptor requestInterceptor() {  
       return new FeignRequestInterceptor();  
    }  
}
```

### 4.2 `FeignRequestInterceptor.java`

请求头可能会在以下情况下丢失：

1. **跨服务调用**：在微服务架构中，一个服务调用另一个服务时，原始请求头不会自动传递到下一个服务。例如，使用 Feign 客户端进行服务间调用时，默认情况下不会传递原始请求头。

2. **负载均衡**：在负载均衡器（如 Nginx 或 Spring Cloud Gateway）前面，负载均衡器可能不会将所有原始请求头传递给后端服务。

3. **代理服务器**：代理服务器（如 API 网关）可能会过滤或修改请求头，导致某些头信息丢失。

4. **安全策略**：某些安全策略或中间件可能会移除敏感的请求头信息以保护数据安全。

5. **客户端限制**：某些客户端（如浏览器或移动应用）可能会限制或移除某些请求头。

使用 `FeignRequestInterceptor` 可以确保在服务间调用时，重要的请求头信息（如认证令牌）不会丢失。

```java
package com.mole.mall.demo.component;  
  
import feign.RequestInterceptor;  
import feign.RequestTemplate;  
import jakarta.servlet.http.HttpServletRequest;  
import org.springframework.web.context.request.RequestContextHolder;  
import org.springframework.web.context.request.ServletRequestAttributes;  
  
import java.util.Enumeration;  
  
/**  
 * 用于Feign传递请求头的拦截器  
 * Created by macro on 2019/10/18.  
 * Modified by Cyanix-0721 on 2024/09/29. 
 */
 public class FeignRequestInterceptor implements RequestInterceptor {  
    @Override  
    public void apply(RequestTemplate requestTemplate) {  
       // 获取当前请求的属性  
       ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();  
       if (attributes != null) {  
          // 获取当前HTTP请求  
          HttpServletRequest request = attributes.getRequest();  
          // 获取请求中的所有头信息  
          Enumeration<String> headerNames = request.getHeaderNames();  
          // 在调用需要认证的内部接口时，需要获取原认证头并设置到requestTemplate中  
          if (headerNames != null) {  
             while (headerNames.hasMoreElements()) {  
                String name = headerNames.nextElement();  
                // 传递content-length头会导致java.io.IOException: Incomplete output stream问题  
                if ("content-length".equalsIgnoreCase(name)) {  
                   continue;  
                }  
                // 获取头的值  
                String values = request.getHeader(name);  
                // 将头信息设置到requestTemplate中  
                requestTemplate.header(name, values);  
             }  
          }  
       }  
    }  
}
```

## 5 OpenAPI 3

通过 `addSecurityItem`, 给所有 http 接口添加 JWT 验证, Header `Authorization`, 前缀 `Bearer `

```java
package com.mole.mall.demo.config;  
  
import com.mole.mall.common.constant.AuthConstant;  
import io.swagger.v3.oas.models.Components;  
import io.swagger.v3.oas.models.OpenAPI;  
import io.swagger.v3.oas.models.info.Info;  
import io.swagger.v3.oas.models.info.License;  
import io.swagger.v3.oas.models.security.SecurityRequirement;  
import io.swagger.v3.oas.models.security.SecurityScheme;  
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;  
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;  
  
/**  
 * SpringDoc相关配置  
 * Created by macro on 2024/3/5.  
 * Modify by Cyanix-0721 on 2024/9/29.
 */
@Configuration  
public class SpringDocConfig implements WebMvcConfigurer {  
  
    private static final String SECURITY_SCHEME_NAME = AuthConstant.JWT_TOKEN_HEADER;  
  
    /**  
     * 配置OpenAPI的基本信息和安全设置  
     *  
     * @return OpenAPI实例  
     */  
    @Bean  
    public OpenAPI mallAdminOpenAPI() {  
       return new OpenAPI()  
             .info(new Info().title("mall-demo系统")  
                   .version("v1.0.0")  
                   .license(new License().name("Apache 2.0")  
                         .url("https://github.com/macrozheng/mall-learning")))  
             .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))  
             .components(new Components()  
                   .addSecuritySchemes(SECURITY_SCHEME_NAME,  
                         new SecurityScheme()  
                               .name(SECURITY_SCHEME_NAME)  
                               .type(SecurityScheme.Type.HTTP)  
                               .scheme("bearer ")  
                               .bearerFormat("JWT")));  
    }  
  
    /**  
     * 配置视图控制器，用于将`/swagger-ui/`路径重定向到`/swagger-ui/index.html`  
     *     * @param registry  
     *        视图控制器注册表  
     */  
    @Override  
    public void addViewControllers(ViewControllerRegistry registry) {  
       registry.addViewController("/swagger-ui/").setViewName("redirect:/swagger-ui/index.html");  
    }  
  
    /**  
     * 配置全局OpenApi自定义器，解决Knife4j配置认证后无法自动添加认证头的问题  
     *  
     * @return GlobalOpenApiCustomizer实例  
     */  
    @Bean  
    public GlobalOpenApiCustomizer orderGlobalOpenApiCustomizer() {  
       return openApi -> {  
          if (openApi.getPaths() != null) {  
             openApi.getPaths().forEach((s, pathItem) -> {  
                pathItem.readOperations().forEach(operation -> {  
                   operation.addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME));  
                });  
             });  
          }  
       };  
    }  
}
```

## 6 `spring-boot-starter-validation`

`spring-boot-starter-validation` 中有 `hibernate-validator`  

通过创建注解 `!FlagValidator` 实现对字段的合法性检测

```java
package com.mole.mall.demo.validator;  
  
import jakarta.validation.Constraint;  
import jakarta.validation.Payload;  
  
import java.lang.annotation.*;  
  
/**  
 * 用户验证状态是否在指定范围内的注解  
 */  
@Documented  
@Retention(RetentionPolicy.RUNTIME)  
@Target({ElementType.FIELD, ElementType.PARAMETER})  
@Constraint(validatedBy = FlagValidatorClass.class)  
public @interface FlagValidator {  
    // 指定允许的值范围  
    String[] value() default {};  
  
    // 验证失败时的错误消息  
    String message() default "flag is not found";  
  
    // 分组  
    Class<?>[] groups() default {};  
  
    // 负载  
    Class<? extends Payload>[] payload() default {};  
}
```

```java
package com.mole.mall.demo.validator;  
  
import jakarta.validation.ConstraintValidator;  
import jakarta.validation.ConstraintValidatorContext;  
  
/**  
 * 状态标记校验器  
 */  
public class FlagValidatorClass implements ConstraintValidator<FlagValidator, Integer> {  
    private String[] values;  
  
    @Override  
    public void initialize(FlagValidator flagValidator) {  
       // 初始化允许的值范围  
       this.values = flagValidator.value();  
    }  
  
    @Override  
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {  
       // 验证值是否在允许的范围内  
       boolean isValid = false;  
       for (String s : values) {  
          if (s.equals(String.valueOf(value))) {  
             isValid = true;  
             break;  
          }  
       }  
       return isValid;  
    }  
}
```
