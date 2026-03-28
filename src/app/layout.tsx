import "./globals.css";
import { InventoryProvider } from "@/components/inventory-provider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>
        <InventoryProvider>{children}</InventoryProvider>
      </body>
    </html>
  );
}
