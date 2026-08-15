import { useEffect, useState } from "react";
import { Bell, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getCompletionNotificationPreferences,
  notifyCompletion,
  requestDesktopNotificationPermission,
  setCompletionNotificationPreferences,
  type CompletionNotificationPreferences,
} from "@/lib/completionNotifications";

export function CompletionNotificationSettings() {
  const [preferences, setPreferences] =
    useState<CompletionNotificationPreferences>(() =>
      getCompletionNotificationPreferences()
    );
  const [permission, setPermission] = useState<string>(() =>
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);
  }, []);

  const updatePreference = (
    key: keyof CompletionNotificationPreferences,
    value: boolean
  ) => {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    setCompletionNotificationPreferences(next);
  };

  const enableDesktop = async () => {
    const result = await requestDesktopNotificationPermission();
    setPermission(result);
    if (result === "granted") updatePreference("desktop", true);
  };

  const testCompletion = () => {
    notifyCompletion("Prueba completada", "Las preferencias están activas.");
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bell className="size-5" aria-hidden="true" />
          Avisos de finalización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Activa estos avisos solo si los necesitas. La solicitud de permiso se
          realiza después de pulsar el botón y nunca durante la carga inicial.
        </p>
        <div className="flex items-start gap-3">
          <Checkbox
            id="completion-sound"
            checked={preferences.sound}
            onCheckedChange={value => updatePreference("sound", value === true)}
          />
          <div className="grid gap-1">
            <Label
              htmlFor="completion-sound"
              className="flex items-center gap-2"
            >
              <Volume2 className="size-4" aria-hidden="true" />
              Sonido sintético al completar
            </Label>
            <p className="text-xs text-muted-foreground">
              Si el navegador bloquea Web Audio, la interfaz continúa sin
              sonido.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={enableDesktop}
            disabled={permission === "denied" || permission === "unsupported"}
          >
            <Bell className="size-4" aria-hidden="true" />
            {permission === "granted"
              ? "Permiso concedido"
              : "Permitir avisos de escritorio"}
          </Button>
          <Checkbox
            id="completion-desktop"
            checked={preferences.desktop && permission === "granted"}
            disabled={permission !== "granted"}
            onCheckedChange={value =>
              updatePreference("desktop", value === true)
            }
          />
          <Label htmlFor="completion-desktop">Aviso al completar</Label>
        </div>
        <Button type="button" variant="ghost" onClick={testCompletion}>
          Probar aviso de finalización
        </Button>
        <p
          className="text-xs text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          Estado del permiso: {permission}.
        </p>
      </CardContent>
    </Card>
  );
}
