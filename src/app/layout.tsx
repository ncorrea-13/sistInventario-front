import '../global.css';
import Sidebar from './componentes/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex' }}>
          <Sidebar />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
