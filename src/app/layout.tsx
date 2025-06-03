 import '../global.css';
 
 export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          {children}
          <footer>Footer</footer>
        </body>
      </html>
    );
  }