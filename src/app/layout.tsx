 import '../global.css';
 
 export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <header>Header</header>
          {children}
          <footer>Footer</footer>
        </body>
      </html>
    );
  }
