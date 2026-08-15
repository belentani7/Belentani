import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "./pages/Home";
import Transparency from "./pages/Transparency";
import Catalog from "@/pages/Catalog";
import Agent from "@/pages/Agent";
import Changelog from "@/pages/Changelog";
import Admin from "@/pages/Admin";
import Resources from "@/pages/Resources";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalogo" component={Catalog} />
      <Route path="/agente" component={Agent} />
      <Route path="/changelog" component={Changelog} />
      <Route path="/admin" component={Admin} />
      <Route path="/recursos" component={Resources} />
      <Route path={"/transparencia"} component={Transparency} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
