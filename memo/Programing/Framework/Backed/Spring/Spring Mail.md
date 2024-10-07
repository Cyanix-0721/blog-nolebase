---
tags:
  - SpringBoot
  - Mail
---

# Spring Mail

## 1 概述

Spring Mail 是 Spring Framework 提供的一个模块，用于简化电子邮件的发送和管理。它封装了 JavaMail API，使得在 Spring 应用中发送邮件变得更加方便。支持多种邮件服务器和协议，包括 SMTP、IMAP 和 POP3。

## 2 依赖引入

在使用 Spring Mail 之前，需要在 `pom.xml` 中添加相应的依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

## 3 配置邮件服务

在 `application.properties` 或 `application.yml` 中配置邮件服务的属性，例如 SMTP 服务器的信息：

### 3.1 application.properties 示例

```properties
spring.mail.host=smtp.example.com
spring.mail.port=587
spring.mail.username=your_email@example.com
spring.mail.password=your_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### 3.2 application.yml 示例

```yaml
spring:
  mail:
    host: smtp.example.com
    port: 587
    username: your_email@example.com
    password: your_password
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
```

## 4 创建邮件发送服务

使用 `JavaMailSender` 接口来发送电子邮件。可以创建一个服务类来封装邮件发送的逻辑：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}
```

## 5 发送邮件

在应用中使用 `EmailService` 来发送电子邮件：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AppRunner implements CommandLineRunner {

    @Autowired
    private EmailService emailService;

    @Override
    public void run(String… args) throws Exception {
        emailService.sendSimpleEmail("recipient@example.com", "测试邮件", "这是邮件内容。");
    }
}
```

## 6 发送 HTML 邮件

如果需要发送 HTML 格式的邮件，可以使用 `MimeMessageHelper` 类：

```java
import org.springframework.mail.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // 设置为 HTML
        mailSender.send(message);
    }
}
```

## 7 附件支持

可以通过 `MimeMessageHelper` 添加附件：

```java
public void sendEmailWithAttachment(String to, String subject, String body, String attachmentPath) throws Exception {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setText(body);
    FileSystemResource file = new FileSystemResource(new File(attachmentPath));
    helper.addAttachment("附件名称", file); // 添加附件
    mailSender.send(message);
}
```

## 8 发送邮件的注意事项

- 确保 SMTP 服务器配置正确，能够正常发送邮件。
- 有些邮箱服务（如 Gmail）可能需要特定的安全设置，允许不太安全的应用访问。
- 注意处理可能出现的异常，例如网络错误或认证错误。

## 9 总结

Spring Mail 提供了简化的电子邮件发送功能，使得在 Spring 应用中集成邮件服务变得简单易行。通过配置和 JavaMailSender，可以轻松发送简单邮件、HTML 邮件及带附件的邮件，为应用增加了丰富的通讯能力。
