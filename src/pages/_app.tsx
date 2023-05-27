import '../../public/css/index.css';
import '../../public/css/reset.css';
import { Provider } from 'react-redux';
import { store } from '../features/store';
import { ModalContainer } from '../components/modal/ModalContainer';

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
      <ModalContainer />
    </Provider>
  );
}

export default App;
