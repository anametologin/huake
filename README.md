# Huake

[Kwin6](https://en.wikipedia.org/wiki/KWin) script that gives your terminal Alacritty, Kitty(or any other window that can change the own window class to: `huake1`, `huake2`) the ability to drop down by shortcut.

`Huake` - in the language of the ancestors of the ancient Sumerians means preparing a product for the final stage

`Why?` - Do you love drop down terminals as much as I do? -I don't think so. [Yakuake](https://apps.kde.org/yakuake/) perfectly worked until Wayland, now if it is open on one virtual desktop, it no longer opens on another, cannot disable the right click menu. The latters concerns [Tilda](https://github.com/lanoxx/tilda) [issue](https://github.com/lanoxx/tilda/issues/473) from 2021.

## Features

- show and hide by shortcut, `Alacritty` or `Kitty` or any other program that can override your window class to `huake1` and `huake2`
- maximize the window or configure his size and position on the screen
- always open on configured screen or open on active screen
- configure Kwin properties of these windows: `skip Taskbar`, `keep above`, `no Border`, `on all desktops`

## Requirements

- kwin 6.x.x
- Desktop session: Plasma(Wayland) (X11 will work too, but not supported)

## Installation

- install kwinscript
- add a program(`alacritty`,`kitty` tested) with parameters that override the window class to `huake1` or `huake2` to Autostart [video](https://github.com/anametologin/huake/issues/1#issue-2754649047)
- if you are using tiling scripts you need exclude `huake1` and `huake2` window classes if you don't want to dropdown terminals will be tiled

### Install huake-x.x.x.kwinscript package file

#### You can download `huake-x.x.x.kwinscript` file, and install it through _System Settings_.

1.  Download the kwinscript file
2.  Open `System Settings` > `Window Management` > `KWin Scripts`
3.  Press `Import KWin script...` on the top-right corner
4.  Select the downloaded file

#### Alternatively, through command-line:

Alternatively, through command-line:

get info about package:

```
kpackagetool6 -t KWin/Script -s huake
```

install:

```
kpackagetool6 -t KWin/Script -i huake-x.x.x.x.kwinscript
```

upgrade:

```
kpackagetool6 -t KWin/Script -u huake-x.x.x.x.kwinscript
```

uninstall:

```
kpackagetool6 -t KWin/Script -r huake
```

#### Installing from Git repository

Make sure you have `npm` and `7zip` packages installed.
The simplest method to automatically build and install kwinscript package would be:

```
 make install
```

You can also build `.kwinscript` package file using:

```
make package
```

uninstall package:

```
make uninstall
```

2. Reboot.

#### Autorun Alacritty or kitty with overridden window class to `huake1` or `huake2`

Kitty

```
kitty --class 'huake1'
```

Alacritty

```
alacritty --class huake1
```

[![installation](media/installation_huake.mp4)](https://github.com/anametologin/huake/issues/1#issue-2754649047)
