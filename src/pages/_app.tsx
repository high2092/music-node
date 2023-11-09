import '../../public/css/index.css';
import '../../public/css/reset.css';
import '../../public/css/reactflow.css';
import { Provider } from 'react-redux';
import { store } from '../features/store';
import { ModalContainer } from '../components/modals/ModalContainer';
import Head from 'next/head';
import { ErrorBoundary } from '../components/ErrorBoundary';

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Music Node</title>
      </Head>
      <ErrorBoundary>
        <Component {...pageProps} />
        <ModalContainer />
      </ErrorBoundary>
    </Provider>
  );
}

export default App;
