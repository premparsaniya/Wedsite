import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './reduxState/store';
import { AppContextProvider } from '~/context';
import { Provider } from 'react-redux';
import App from './App';
import "./index.css";
import 'vite/modulepreload-polyfill';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </PersistGate>
    </Provider>
  // </React.StrictMode>
)
