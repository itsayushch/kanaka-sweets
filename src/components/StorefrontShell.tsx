"use client";

import { usePathname } from "next/navigation";

export function StorefrontShell({
  navbar,
  footer,
  floatingContact,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  floatingContact: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      {navbar}
      <main className="flex-grow" suppressHydrationWarning>
        {children}
      </main>
      {footer}
      {floatingContact}
    </div>
  );
}
