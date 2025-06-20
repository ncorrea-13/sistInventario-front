'use client';

import { usePathname } from 'next/navigation';
import '../global.css';
import Sidebar from './componentes/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex' }}>
          {!isHomePage && <Sidebar />}
          <main style={{ flex: 1 }}>{children}</main>
        </div>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
