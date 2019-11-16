# samples-electron

Code samples for Electron app:

1. Notifications for Mac/Windows
2. Autoupdater (not working on Mac, need good signing certificate)
3. Electron log
4. Progress bar

## Updater cache

/Users/mike/Library/Application Support/Caches/<app name>/pending

## electron-log

on Linux: ~/.config/<app name>/log.log
on macOS: ~/Library/Logs/<app name>/log.log
on Windows: %USERPROFILE%\AppData\Roaming\<app name>\log.log
