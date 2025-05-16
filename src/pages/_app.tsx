import '../global.css';
import { AppProps } from 'next/app';

// Este componente personalizado de App se utiliza para inicializar páginas
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
