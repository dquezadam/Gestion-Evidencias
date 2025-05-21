// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard';
import SubirEvidencia from './components/Evidencias/SubirEvidencias';
import ListaEvidencias from './components/Evidencias/ListaEvidencias';
import GenerarCobro from './components/cobros/GenerarCobro';
import { AppBar, Toolbar, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

// Configurar Axios para incluir token en todas las peticiones
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Componente para rutas privadas
const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

// Componente de navegación
const Navigation = () => {
  const { user, setUser } = React.useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de Evidencias
        </Typography>
        {user && (
          <>
            {user.tipoUsuario === 'OP_CD' && (
              <Button color="inherit" component={Link} to="/evidencias">
                Mis Evidencias
              </Button>
            )}
            {user.tipoUsuario === 'LOG_CL' && (
              <Button color="inherit" component={Link} to="/evidencias-pendientes">
                Revisiones Pendientes
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Navigation />
          <Container sx={{ mt: 4 }}>
            <Routes>
              {/* Ruta pública */}
              <Route path="/login" element={<Login />} />

              {/* Rutas privadas */}
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }/>

              <Route path="/evidencias" element={
                <PrivateRoute>
                  <ListaEvidencias />  {/* Usa el nombre correcto */}
                </PrivateRoute>
              }/>

              <Route path="/subir-evidencia" element={
                <PrivateRoute>
                  <SubirEvidencia />
                </PrivateRoute>
              }/>

              <Route path="/evidencias-pendientes" element={
                <PrivateRoute>
                  <ListaEvidencias />
                </PrivateRoute>
              }/>

              <Route path="/generar-cobros" element={
                <PrivateRoute allowedRoles={['LOG_CL']}>
                <GenerarCobro />
              </PrivateRoute>
  }
/>

              {/* Redirección para rutas no encontradas */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;