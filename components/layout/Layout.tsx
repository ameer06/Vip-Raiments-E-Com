import { Header } from "@/components/layout/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <Header />
      <main>{children}</main>
    </div>
  );
}
