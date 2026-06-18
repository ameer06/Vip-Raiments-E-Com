import { CartProvider } from "@/components/providers/CartProvider";
import { CartToast } from "@/components/features/CartToast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <CartProvider>
      <div className="min-h-screen overflow-x-clip bg-white text-ink">
        <Header />
        <main className="w-full">{children}</main>
        <Footer />
        <CartToast />
      </div>
    </CartProvider>
  );
}
