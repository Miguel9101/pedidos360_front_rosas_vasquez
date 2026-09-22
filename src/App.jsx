import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import awsConfig from './aws-exports';
import { ProtectedRoute } from './components/ProtectedRoute';
import { apiFetch } from './apiFetch'; // Importamos el interceptor

Amplify.configure(awsConfig);

// Componentes de vista rápidos para la prueba
const Inicio = () => {
  const [mensaje, setMensaje] = useState("Cargando datos del backend...");

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const respuesta = await apiFetch('/api/pedidos');
        if (respuesta.ok) {
          const texto = await respuesta.text();
          setMensaje(texto);
        } else {
          setMensaje(`Error HTTP: ${respuesta.status}`);
        }
      } catch (error) {
        setMensaje("Error al conectar con el backend. ¿Está encendido el servidor Java?");
      }
    };
    obtenerPedidos();
  }, []);

  return (
    <div>
      <h2>Panel General de Pedidos</h2>
      <div style={{ padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
        <strong>Respuesta del Servidor:</strong> {mensaje}
      </div>
    </div>
  );
};
const AdminPanel = () => {
  const [mensajeAdmin, setMensajeAdmin] = useState("Cargando datos administrativos...");

  useEffect(() => {
    const obtenerDatosAdmin = async () => {
      try {
        const respuesta = await apiFetch('/api/pedidos/admin');
        if (respuesta.ok) {
          const texto = await respuesta.text();
          setMensajeAdmin(texto);
        } else {
          setMensajeAdmin(`Error HTTP: ${respuesta.status} - Acceso Denegado por el Backend`);
        }
      } catch (error) {
        setMensajeAdmin("Error al conectar con el backend.");
      }
    };
    obtenerDatosAdmin();
  }, []);

  return (
    <div>
      <h2>Panel de Control Administrativo</h2>
      <div style={{ padding: '15px', background: '#ffeeba', borderRadius: '5px' }}>
        <strong>Respuesta del Servidor Seguro:</strong> {mensajeAdmin}
      </div>
    </div>
  );
};
const NoAutorizado = () => <h2 style={{color: 'red'}}>Acceso denegado: Rol insuficiente</h2>;

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <BrowserRouter>
          <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <div>
                <strong>Usuario: {user?.username} </strong>
                <nav style={{ marginTop: '10px', display: 'flex', gap: '15px' }}>
                  <Link to="/">Ver Pedidos</Link>
                  <Link to="/admin">Administración</Link>
                </nav>
              </div>
              <button onClick={signOut} style={{ height: '35px', cursor: 'pointer' }}>Cerrar sesión</button>
            </header>

            <main style={{ marginTop: '20px' }}>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/no-autorizado" element={<NoAutorizado />} />
                {/* Ruta protegida que exige el rol ADMIN */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="ADMIN">
                      <AdminPanel />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      )}
    </Authenticator>
  );
}

export default App;