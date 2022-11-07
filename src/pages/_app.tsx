import type { AppProps } from 'next/app';
import "../styles/_global.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
