import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="flex min-h-screen items-center justify-center bg-background p-8"
          role="alert"
          aria-labelledby="application-error-title"
        >
          <div className="flex w-full max-w-xl flex-col items-center p-8 text-center">
            <AlertTriangle
              size={48}
              aria-hidden="true"
              className="mb-6 flex-shrink-0 text-destructive"
            />

            <h1 id="application-error-title" className="mb-3 text-xl">
              No hemos podido cargar esta superficie.
            </h1>
            <p className="mb-6 max-w-md text-sm text-muted-foreground">
              Se produjo un error inesperado. Puedes intentar recargar la página.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2",
                "bg-primary text-primary-foreground",
                "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Recargar página
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
