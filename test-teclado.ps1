# test-teclado.ps1 - Prueba objetiva de teclado para HP EliteBook 850 G6
# Uso: doble clic, o bien:  powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\Desktop\test-teclado.ps1"
# No requiere administrador. No modifica nada. Solo lee las teclas que pulsas.

$ErrorActionPreference = 'Stop'
$target = 'abcdefghijklmnopqrstuvwxyz0123456789'

Clear-Host
Write-Host "=== PRUEBA DE TECLADO - HP EliteBook 850 G6 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Objetivo: escribir la secuencia de abajo 3 veces, sin prisa." -ForegroundColor Yellow
Write-Host "La ventana de esta consola debe tener el foco (haz clic en ella antes de teclear)."
Write-Host ""
Write-Host "SECUENCIA A ESCRIBIR:" -ForegroundColor Green
Write-Host $target -ForegroundColor White
Write-Host ""
Write-Host "Escribe la secuencia y pulsa ENTER. Se repetira 3 rondas. Al final veras el informe."
Write-Host ""
Read-Host "Pulsa ENTER para empezar"

$allMissing = @()
$allExtra = @()
for ($round = 1; $round -le 3; $round++) {
    Write-Host ""
    Write-Host "--- Ronda $round de 3: escribe la secuencia y pulsa ENTER ---" -ForegroundColor Cyan
    $typed = Read-Host
    $clean = ($typed -replace '[^a-zA-Z0-9]', '').ToLower()
    $missing = @()
    $extra = @()
    foreach ($ch in $target.ToCharArray()) {
        $need = ([regex]::Matches($target, [regex]::Escape($ch))).Count
        $got = ([regex]::Matches($clean, [regex]::Escape($ch))).Count
        if ($got -lt $need) { $missing += $ch }
        if ($got -gt $need) { $extra += $ch }
    }
    foreach ($ch in $clean.ToCharArray()) {
        if ($target.IndexOf($ch) -lt 0) { $extra += $ch }
    }
    Write-Host ("Esperados: {0} | Recibidos: {1} | Teclas distintas perdidas: {2}" -f $target.Length, $clean.Length, ($missing | Sort-Object -Unique).Count)
    if ($missing.Count -gt 0) {
        Write-Host ("Teclas que NO llegaron en esta ronda: {0}" -f (($missing | Sort-Object -Unique) -join ' ')) -ForegroundColor Red
        $allMissing += $missing
    } else {
        Write-Host "Todas las teclas llegaron en esta ronda." -ForegroundColor Green
    }
    if ($extra.Count -gt 0) {
        Write-Host ("Caracteres repetidos/no pedidos (posible rebote): {0}" -f (($extra | Sort-Object -Unique) -join ' ')) -ForegroundColor Magenta
        $allExtra += $extra
    }
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
if ($allMissing.Count -eq 0) {
    Write-Host "No se detectaron teclas perdidas en 3 rondas. El teclado respondio completo." -ForegroundColor Green
    Write-Host "Si aun notas fallos, repite con el cargador puesto y sin el, y prueba el test UEFI (F2 al arrancar)."
} else {
    $sum = $allMissing | Group-Object | Sort-Object Count -Descending | ForEach-Object { "{0} (x{1})" -f $_.Name, $_.Count }
    Write-Host "Teclas perdidas (suma de las 3 rondas):" -ForegroundColor Red
    Write-Host ($sum -join '  ')
    Write-Host ""
    Write-Host "Esto es evidencia de fallo fisico/intermitente. Guarda una foto de esta pantalla." -ForegroundColor Yellow
    Write-Host "Siguiente paso: test UEFI (F2 al arrancar > Component Tests > Keyboard) y caso a HP Care Pack." -ForegroundColor Yellow
}
Write-Host ""
Read-Host "Pulsa ENTER para cerrar"
