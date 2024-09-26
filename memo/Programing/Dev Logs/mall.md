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
