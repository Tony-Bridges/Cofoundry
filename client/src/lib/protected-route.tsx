import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  allowGuest = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  allowGuest?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If this route allows guests OR user is authenticated, render the component
  if (allowGuest || user) {
    return <Route path={path} component={Component} />;
  }

  // Otherwise redirect to auth page
  return (
    <Route path={path}>
      <Redirect to="/auth" />
    </Route>
  );
}
