---
tags:
  - Linux
  - Chinese
  - Font
  - Flatpak
---

# Chinese

> [!info]  
> [Localization/Simplified Chinese - ArchWiki](https://wiki.archlinux.org/title/Localization/Simplified_Chinese)  
> [Fcitx5](https://wiki.archlinuxcn.org/wiki/Fcitx5)

## 1 Basic Chinese Support

### 1.1 Locale Settings

#### 1.1.1 Install Chinese Locale

It is recommended to use UTF-8 locale. You need to modify `/etc/locale.gen` to set the locales that can be used in the system (erase the comment symbol "`#`" before the corresponding item):

```
en_US.UTF-8 UTF-8
zh_CN.UTF-8 UTF-8
```

After executing `locale-gen`, the selected locales can be used in the system. You may use `locale` to view the currently used locale(s), and `locale -a` to view the currently available locales.

#### 1.1.2 Enable Chinese Locales

**Warning:** Globally setting Chinese locales in `/etc/locale.conf` will cause tty to display garbled texts due to the [tty glyph limitation of Linux kernel](https://unix.stackexchange.com/questions/273061/273063#273063). To properly display Chinese characters under tty, install and [configure](http://zhcon.sourceforge.net/faq.html#faq1) [zhcon](https://aur.archlinux.org/packages/zhcon/)AUR.

##### 1.1.2.1 Set the Global Default Locale to English (optional)

To avoid the tty garbled text issue mentioned above, globally set the [LANG locale](https://wiki.archlinux.org/title/Locale#LANG:_default_locale "Locale") to `en_US.UTF-8` in `/etc/locale.conf`:

```
LANG=en_US.UTF-8
```

##### 1.1.2.2 User-specific Locales

You may set your own user environment variables in `~/.bashrc`, `~/.xinitrc`, or `~/.xprofile`.

- [.bashrc](https://wiki.archlinux.org/title/.bashrc ".bashrc"): Settings are applied everytime you log in **using the terminal**.
- [.xinitrc](https://wiki.archlinux.org/title/.xinitrc ".xinitrc"): Settings are applied everytime you **use [startx](https://wiki.archlinux.org/title/Startx "Startx") or [SLiM](https://wiki.archlinux.org/title/SLiM "SLiM") to start the [X](https://wiki.archlinux.org/title/X "X") interface**.
- [.xprofile](https://wiki.archlinux.org/title/.xprofile ".xprofile"): Settings are applied everytime you **log in using a display manager such as [GDM](https://wiki.archlinux.org/title/GDM "GDM")**.

##### 1.1.2.3 Set Chinese Locales for Graphical Interfaces

It is not recommended to set a global Chinese locale in `/etc/locale.conf` because it causes tty to display garbled characters.

As mentioned earlier, Chinese locale can be set separately in `~/.xinitrc` or `~/.xprofile`. Prepend the following two lines to one of the two files (if you are not sure which file to use, prepend to both):

```
export LANG=zh_CN.UTF-8  
export LANGUAGE=zh_CN:en_US
```

**Note:**

- Be sure to put them **before** the `exec __example_WM_or_DE__` line in `~/.xinitrc`.
- This method is suitable for [SLiM](https://wiki.archlinux.org/title/SLiM "SLiM") users or for people who do not use a graphical login interface (aka greeter). [GDM](https://wiki.archlinux.org/title/GDM "GDM") and [SDDM](https://wiki.archlinux.org/title/SDDM "SDDM") users can configure the display language in [GNOME](https://wiki.archlinux.org/title/GNOME "GNOME") or [KDE](https://wiki.archlinux.org/title/KDE "KDE") settings.
- It is not recommended to override all locale settings with a global `export LC_ALL`. `LC_ALL` should be reserved for diagnostic debugging purposes only. `LC_ALL` will bring unnecessary difficulties for diagnosing language settings issues.
- KDE
	- edit ~/. config/plasma-localerc
	- sudo locale-gen

```
[Formats]
LANG=zh_CN.UTF-8

[Translations]
LANGUAGE=zh_CN:en_US
```

### 1.2 Chinese Fonts

#### 1.2.1 Install Fonts

```bash
sudo pacman -S adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts noto-fonts-cjk wqy-microhei wqy-microhei-lite wqy-bitmapfont wqy-zenhei ttf-arphic-ukai ttf-arphic-uming ttf-sarasa-gothic
```

#### 1.2.2 Chinese Characters Displayed as Variant (Japanese) Glyphs

After installing Noto Sans CJK [adobe-source-han-sans-otc-fonts](https://archlinux.org/packages/?name=adobe-source-han-sans-otc-fonts) (Source Han Sans, lit. Siyuan Bold), or Noto Serif CJK [adobe-source-han-serif-otc-fonts](https://archlinux.org/packages/?name=adobe-source-han-serif-otc-fonts) (Source Han Serif, lit. Siyuan Song), in some cases (framework undefined area), rendered Chinese characters do not match the standard form, such as 门, 关, and 复.

This is because different default fonts can be set in each program, such as Arial or Tahoma, and the attributes of these fonts are controlled by [fontconfig](https://wiki.archlinux.org/title/Fontconfig "Fontconfig"). The order of use is based on the regional code and the default order of A-Z. Since `ja-JP` is before `zh_{CN,HK,SG,TW}`, Japanese fonts are used first.  
**Tip:** Fonts can be set separately in Chromium/Chrome/Firefox browser settings, for example, adjust the font option to Noto xxx CJK SC.  
You can use the following methods to solve the issue (taking simplified Chinese as an example):

- Make sure your desktop environment is using a correct locale setting. For example, [KDE may misconfigure its own locale config file](https://wiki.archlinux.org/title/KDE#Plasma_desktop_does_not_respect_locale/language_settings "KDE") and you should fix that.
- Only install fonts that follows Simplified Chinese standard. For Noto CJK fonts this means to only install the CN variant, which are Noto Sans CJK CN and Noto Serif CJK CN, [adobe-source-han-sans-cn-fonts](https://archlinux.org/packages/?name=adobe-source-han-sans-cn-fonts) and [adobe-source-han-serif-cn-fonts](https://archlinux.org/packages/?name=adobe-source-han-serif-cn-fonts), or [noto-fonts-sc](https://aur.archlinux.org/packages/noto-fonts-sc/)AUR.
- Add `LANG=zh_CN.UTF-8` to `locale.conf` to set Simplified Chinese as the default language. Since the [Locale](https://wiki.archlinux.org/title/Locale "Locale") is defined for CJK priority, the default priority is ignored.
	- Manually adjust the priority so that the Chinese fonts are set before the Japanese fonts. [Noto Sans CJK 避免中文显示为异体（日文）字形](https://tieba.baidu.com/p/4879946717):

Create a file under `/etc/fonts/conf.d/` or `/etc/fonts/conf.avail/`, such as `64-language-selector-prefer.conf`, or modify or create `~/.config/fontconfig/fonts.conf` (only effective for the user):

```html
<?xml version='1.0'?>
<!DOCTYPE fontconfig SYSTEM 'fonts.dtd'>
<fontconfig>
 <dir>~/.fonts</dir>
  <alias>
  <family>serif</family>
  <prefer>
   <family>Sarasa Gothic SC</family>
   <family>Sarasa Gothic TC</family>
   <family>Sarasa Gothic J</family>
   <family>Sarasa Gothic K</family>
  </prefer>
 </alias>
 <alias>
  <family>sans-serif</family>
  <prefer>
   <family>Sarasa Gothic SC</family>
   <family>Sarasa Gothic TC</family>
   <family>Sarasa Gothic J</family>
   <family>Sarasa Gothic K</family>
  </prefer>
 </alias>
 <alias>
  <family>monospace</family>
  <prefer>
   <family>Sarasa Mono SC</family>
   <family>Sarasa Mono TC</family>
   <family>Sarasa Mono J</family>
   <family>Sarasa Mono K</family>
  </prefer>
 </alias>
 <match target="font">
  <edit mode="assign" name="rgba">
   <const>rgb</const>
  </edit>
 </match>
 <match target="font">
  <edit mode="assign" name="hinting">
   <bool>true</bool>
  </edit>
 </match>
 <match target="font">
  <edit mode="assign" name="hintstyle">
   <const>hintslight</const>
  </edit>
 </match>
 <match target="font">
  <edit mode="assign" name="antialias">
   <bool>true</bool>
  </edit>
 </match>
</fontconfig>
```

Note that if you create an xml file under `/etc/fonts/conf.avail`, for example:

```
ln -s /etc/fonts/conf.avail/64-language-selector-prefer.conf /etc/fonts/conf.d/64-language-selector-prefer.conf
```

you have to update the font cache to take effect:

```
fc-cache -fv
```

Execute the following command to check. If `NotoSansCJK-Regular.ttc: "Noto Sans CJK SC" "Regular"` appears, the settings are successfully applied:

```
fc-match -s | grep 'Noto Sans CJK'
```

### 1.3 Chinese Input Method

#### 1.3.1 Install

```bash
sudo pacman -S fcitx5-im fcitx5-rime
```

##### 1.3.1.1 Model

要获取更好的体验，你可以根据需要安装以下模块。即使不安装，输入法在大部分的应用程序中仍可能正常工作，但你可能会遇到输入法挂起、预览窗口位置错误或没有预览的问题。

- 对于 [Qt](https://wiki.archlinuxcn.org/wiki/Qt "Qt") 程序，安装 [fcitx5-qt](https://archlinux.org/packages/?name=fcitx5-qt)<sup>包</sup>
- 对于 [GTK]( https://wiki.archlinuxcn.org/wiki/GTK "GTK") 程序，安装 [fcitx5-gtk](https://archlinux.org/packages/?name=fcitx5-gtk) <sup>包</sup>
- 对于 Qt4 程序，安装 [fcitx5-qt4-git](https://aur.archlinux.org/packages/fcitx5-qt4-git/)<sup>AUR</sup>
- 对于 Qt5 程序，安装 [fcitx5-qt5-git](https://aur.archlinux.org/packages/fcitx5-qt5-git/)<sup>AUR</sup>
- 对于 Qt6 程序，安装 [fcitx5-qt6-git](https://aur.archlinux.org/packages/fcitx5-qt6-git/)<sup>AUR</sup>
- 对于日期和时间支持，安装 [fcitx5-lua](https://archlinux.org/packages/?name=fcitx5-lua)<sup>包</sup>

**提示：通常，只需安装 [fcitx5-qt](https://archlinux.org/packages/?name=fcitx5-qt) 包和 [fcitx5-gtk](https://archlinux.org/packages/?name=fcitx5-gtk) 包就足够了。(Include in fcitx5-im)**

#### 1.3.2 Usage

##### 1.3.2.1 集成

- 安装 [fcitx5-input-support](https://aur.archlinux.org/packages/fcitx5-input-support/) <sup>AUR</sup>
- 或者编辑 `/etc/environment` 并添加以下几行，然后重新登录 [Setup Fcitx 5](https://fcitx-im.org/wiki/Setup_Fcitx_5#Environment_variables) ：

```
GTK_IM_MODULE=fcitx
QT_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
SDL_IM_MODULE=fcitx
INPUT_METHOD=fcitx
GLFW_IM_MODULE=fcitx
```

###### 1.3.2.1.1 KDE Wayland

- 要使用 Wayland 输入法协议, 首先退出正在运行的 Fcitx 5 进程, 前往 _系统设置_ > _输入设备_ > _虚拟键盘_, 选择 _Fcitx 5_.  
- 对于 XWayland 程序, 设置 `XMODIFIERS` 环境变量

#### 1.3.3 Configure

##### 1.3.3.1 配置工具

[fcitx5](https://archlinux.org/packages/?name=fcitx5) 包的配置文件位于 `~/.config/fcitx5`，尽管您可以使用文本编辑器编辑配置文件，但是使用 GUI 配置显然更方便。安装 [fcitx5-configtool](https://archlinux.org/packages/?name=fcitx5-configtool) <sup>包</sup> 软件包。**(Include in fcitx5-im)**

## 2 Cultural Configuration in Software

### 2.1 Firefox

```
sudo pacman -S firefox-i18n-zh-cn
```

### 2.2 Libreoffice

```
sudo pacman -S libreoffice-fresh-zh-cn
```

## 3 Fix Chinese under Flatpak

> [!info] [XDG_Desktop_Portal](https://wiki.archlinux.org/title/XDG_Desktop_Portal)  

1. **安装 `xdg-desktop-portal` 和 `xdg-desktop-portal-gtk`**  
   这些组件有助于改进 Flatpak 应用的字体渲染和整体显示效果：

   ```sh
   sudo pacman -S xdg-desktop-portal xdg-desktop-portal-gtk
   ```

2. **安装 Flatseal**  
   `Flatseal` 是一个管理 Flatpak 应用权限的工具，可以轻松调整应用的设置：

   ```sh
   flatpak install flathub com.github.tchx84.Flatseal
   ```

3. **配置 Flatpak 应用的字体访问权限**  
   使用 `Flatseal` 配置应用权限以访问系统字体：
   - 打开 `Flatseal`。
   - 在 `All Applications` 中选择你想要调整的应用。
   - 进入 `Filesystem` 选项。
   - 在 `Other files` 中添加以下路径：

	 ```
     xdg-config/fontconfig:ro
     ```

- 在 `Environment` 中添加以下变量：

	 ```
     export GDK_DPI_SCALE=1
     ```

1. **设置 DPI 环境变量**  
   在你的配置文件中添加 `GDK_DPI_SCALE` 环境变量以调整应用的 DPI 设置：
   - 编辑你的 `.profile` 或 `.bashrc` 文件，添加如下行：

	 ```bash
     export GDK_DPI_SCALE=1
     ```

   - 保存文件后，执行以下命令来应用更改：

	 ```bash
     source ~/.profile  # 或者 source ~/.bashrc
     ```
