import '../styles/globals.css';
import Modal from 'react-modal';

// Definisci l'elemento principale dell'app
Modal.setAppElement('#__next');

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;