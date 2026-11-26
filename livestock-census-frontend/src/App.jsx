import { HashRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './store/AuthContext';
import { CensusProvider } from './store/CensusContext';
import { ToastProvider } from './store/ToastContext';

function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <CensusProvider>
            <AppRoutes />
          </CensusProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
