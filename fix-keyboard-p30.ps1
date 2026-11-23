# Fix permanente para Ctrl+Shift=V en P30 Pro companion
Set-ItemProperty -Path "HKCU:\Control Panel\Accessibility\StickyKeys" -Name "Flags" -Value 0 -ErrorAction SilentlyContinue
Set-ItemProperty -Path "HKCU:\Control Panel\Accessibility\Keyboard Response" -Name "Flags" -Value 0 -ErrorAction SilentlyContinue
Stop-Process -Name "VoiceAccess","VoiceActivation","HotKeyServiceUWP" -Force -ErrorAction SilentlyContinue
