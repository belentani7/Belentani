@echo off
title LIMPIEZA Y REPARACION MASIVA HP EliteBook 850 G6
color 0B

:: Verificar Administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo EJECUTA COMO ADMINISTRADOR
    pause
    exit /b
)

echo 1 de 8: Creando punto de restauracion...
powershell -NoProfile -Command "Checkpoint-Computer -Description 'Antes limpieza masiva' -RestorePointType MODIFY_SETTINGS -ErrorAction SilentlyContinue"

echo 2 de 8: Borrando temporales...
del /q /f /s "%TEMP%\*.*" >nul 2>&1
del /q /f /s "%SystemRoot%\Temp\*.*" >nul 2>&1
for /d %%D in ("%TEMP%\*") do rd /s /q "%%D" >nul 2>&1
for /d %%D in ("%SystemRoot%\Temp\*") do rd /s /q "%%D" >nul 2>&1

echo 3 de 8: Reparando cache de Windows Update...
net stop wuauserv >nul 2>&1
net stop bits >nul 2>&1
rd /s /q "%SystemRoot%\SoftwareDistribution\Download" >nul 2>&1
net start bits >nul 2>&1
net start wuauserv >nul 2>&1

echo 4 de 8: Vaciando papelera y prefetch...
powershell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"
del /q /f "%SystemRoot%\Prefetch\*.*" >nul 2>&1

echo 5 de 8: DISM reparando imagen de Windows (15-40 min, NO interrumpir)...
DISM /Online /Cleanup-Image /RestoreHealth

echo 6 de 8: SFC reparando archivos de sistema (10-30 min)...
sfc /scannow

echo 7 de 8: CHKDSK escaneando disco en linea...
chkdsk C: /scan

echo 8 de 8: Reinstalando drivers defectuosos (Teclado, Mouse, Touchpad)...
powershell -NoProfile -Command "Get-PnpDevice -Class Keyboard, Mouse, HIDClass -ErrorAction SilentlyContinue | Where-Object { $_.Status -ne 'OK' } | ForEach-Object { pnputil /remove-device $_.InstanceId; pnputil /scan-devices }"
ipconfig /flushdns >nul

echo.
echo ===================================================
echo FIN. REINICIA EL PC para aplicar todos los cambios.
echo ===================================================
pause
