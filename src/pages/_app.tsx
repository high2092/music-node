import '../../public/css/index.css';
import '../../public/css/reset.css';
import { Provider } from 'react-redux';
import { store } from '../features/store';
import { ModalContainer } from '../components/modal/ModalContainer';
import Head from 'next/head';

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Music Node</title>
      </Head>
      <Component {...pageProps} />
      <ModalContainer />
    </Provider>
  );
}

export default App;
