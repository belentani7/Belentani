import { useEffect, useState } from "react";
import { ArrowLeft, Bot, Send, ShieldCheck, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { trackBusinessEvent } from "@/lib/analytics";
import { notifyCompletion } from "@/lib/completionNotifications";

type Message = { role: "agent" | "user"; text: string };

export default function Agent() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      text: "Soy el agente de Belentani Studio. Puedo ayudarte a orientarte entre herramientas, recursos y decisiones de marca. ¿Qué quieres hacer visible?",
    },
  ]);
  const respond = trpc.agent.respond.useMutation();
  const recordEvent = trpc.metrics.recordBusinessEvent.useMutation();
  useEffect(() => {
    trackBusinessEvent("agent_opened", {}, event =>
      recordEvent.mutate({ event })
    );
  }, []);
  const send = async () => {
    const text = input.trim();
    if (!text || respond.isPending) return;
    trackBusinessEvent(
      "agent_query_submitted",
      { messageLength: text.length },
      event => recordEvent.mutate({ event })
    );
    const history = messages.slice(-10).map(message => ({
      role:
        message.role === "user" ? ("user" as const) : ("assistant" as const),
      content: message.text,
    }));
    setMessages(current => [...current, { role: "user", text }]);
    setInput("");
    try {
      const result = await respond.mutateAsync({ message: text, history });
      setMessages(current => [
        ...current,
        { role: "agent", text: result.answer },
      ]);
      notifyCompletion("Respuesta del agente completada");
    } catch {
      setMessages(current => [
        ...current,
        {
          role: "agent",
          text: "No puedo completar la respuesta ahora. Puedes escribir a belentani7studio@proton.me para continuar con revisión humana.",
        },
      ]);
    }
  };
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold tracking-[.24em] uppercase"
          >
            <span className="grid size-8 place-items-center rounded-full bg-foreground text-background">
              B
            </span>{" "}
            Belentani Studio
          </Link>
          <Button asChild variant="ghost" className="rounded-full">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" /> Inicio
            </Link>
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">Agente de marca</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-.06em] md:text-7xl">
            Conversación con criterio.
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Un espacio de orientación contextual. Las acciones sensibles
            permanecen bajo revisión humana.
          </p>
        </div>
        <Card className="mt-12 overflow-hidden border-border/60">
          <div className="flex items-center justify-between border-b border-border/60 p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <Bot className="size-5" />
              </span>
              <div>
                <p className="font-medium">Belentani Agent</p>
                <p className="text-xs text-muted-foreground">
                  {respond.isPending
                    ? "Pensando con contexto..."
                    : "Fallback seguro activo"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> Contexto protegido
            </div>
          </div>
          <div className="min-h-80 space-y-4 bg-muted/20 p-5">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] gap-3 rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-foreground text-background" : "bg-background text-foreground shadow-sm"}`}
                >
                  {message.role === "agent" ? (
                    <Bot className="mt-1 size-4 shrink-0 text-primary" />
                  ) : (
                    <User className="mt-1 size-4 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 border-t border-border/60 p-4">
            <Input
              value={input}
              disabled={respond.isPending}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter") void send();
              }}
              placeholder="Escribe una consulta..."
              aria-label="Mensaje para el agente"
              className="h-12 rounded-full"
            />
            <Button
              onClick={() => void send()}
              disabled={respond.isPending}
              size="icon"
              className="size-12 rounded-full"
              aria-label="Enviar mensaje"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
