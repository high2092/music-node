import '../../public/css/index.css';
import '../../public/css/reset.css';
import { Provider } from 'react-redux';
import { store } from '../features/store';

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
