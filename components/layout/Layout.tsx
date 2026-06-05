import { CartProvider } from "@/components/providers/CartProvider";
import { CartToast } from "@/components/features/CartToast";
import { Header } from "@/components/layout/Header";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-bone text-ink">
        <Header />
        <main>{children}</main>
        <CartToast />
      </div>
    </CartProvider>
  );
}
