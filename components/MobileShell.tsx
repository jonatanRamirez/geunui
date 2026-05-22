"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-20 bg-mcdRed text-white">
        <div className="mx-auto max-w-md px-4 pb-3 pt-[calc(env(safe-area-inset-top)+14px)]">
          <div className="flex items-center justify-between">
            <div className="text-base font-semibold">{title}</div>
            <div className="text-xs opacity-95">McDonald&apos;s Assistant</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pb-24 pt-4">{children}</main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 pb-[env(safe-area-inset-bottom)] pt-2">
          <Tab href="/" active={pathname === "/"} label="Home" />
          <Tab
            href="/settings"
            active={pathname === "/settings"}
            label="Settings"
          />
        </div>
      </nav>
    </div>
  );
}

function Tab({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className="flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium"
      aria-current={active ? "page" : undefined}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          active ? "bg-mcdYellow" : "bg-transparent",
        ].join(" ")}
      />
      {label}
    </Link>
  );
}
