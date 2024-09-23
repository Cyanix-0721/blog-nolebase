# Flathub

## 1 Install Flatpak

```bash
sudo pacman -S flatpak
```

## 2 Add Flathub Repository [Optional]

```bash
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

## 3 Install Flatpak Software

```bash
flatpak install flathub package_name
```

## 4 Run Flatpak Software

```
flatpak run package_name
```

## 5 Update Flatpak Software

```bash
flatpak update package_name
```

## 6 Uninstall Flatpak Software

```bash
flatpak uninstall package_name
```
