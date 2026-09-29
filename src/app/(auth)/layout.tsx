import { Coffee } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--color-espresso)_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.03]" />

      <div className="relative flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-latte/20 bg-espresso text-latte shadow-md">
              <Coffee className="size-5" />
            </div>

            <span className="text-2xl font-bold tracking-tight text-espresso">
              Ankow Coffee
            </span>
          </div>

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Digital Ordering & Management System
          </p>
        </div>

        {children}

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Ankow Coffee. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}
