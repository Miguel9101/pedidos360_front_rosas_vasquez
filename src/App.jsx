import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import awsConfig from './aws-exports';
import { ProtectedRoute } from './components/ProtectedRoute';
import { apiFetch } from './apiFetch';

Amplify.configure(awsConfig);

const Inicio = () => {
  const [pedidos, setPedidos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [total, setTotal] = useState("");

  const cargarPedidos = async () => {
    try {
      const respuesta = await apiFetch('/api/pedidos');
      if (respuesta.ok) setPedidos(await respuesta.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { cargarPedidos(); }, []);

  const crearPedido = async (e) => {
    e.preventDefault();
    await apiFetch('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify({ descripcion, total: parseInt(total) })
    });
    setDescripcion(""); setTotal("");
    cargarPedidos(); // Recarga la lista
  };

  return (
    <div>
      <h2>Ingresar Nuevo Pedido</h2>
      <form onSubmit={crearPedido} style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '5px' }}>
        <input 
          type="text" 
          placeholder="Descripción..." 
          value={descripcion} 
          onChange={e => setDescripcion(e.target.value)} 
          required 
          style={{ marginRight: '10px', padding: '5px' }} 
        />
        <input 
          type="number" 
          placeholder="Total ($)" 
          value={total} 
          onChange={e => setTotal(e.target.value)} 
          required 
          style={{ marginRight: '10px', padding: '5px' }} 
        />
        <button type="submit" style={{ padding: '6px 15px', cursor: 'pointer' }}>Guardar</button>
      </form>

      <h3>Pedidos Registrados</h3>
      <ul style={{ textAlign: 'left', background: '#e9ecef', padding: '15px', borderRadius: '5px', listStylePosition: 'inside' }}>
        {pedidos.length === 0 ? <li>No hay pedidos registrados.</li> : null}
        {pedidos.map(p => <li key={p.id}>ID {p.id}: {p.descripcion} - ${p.total}</li>)}
      </ul>
    </div>
  );
};

const AdminPanel = () => {
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = async () => {
    try {
      const respuesta = await apiFetch('/api/pedidos');
      if (respuesta.ok) setPedidos(await respuesta.json());
    } catch (error) { console.error(error); }
  };

  useEffect(() => { cargarPedidos(); }, []);

  const eliminarPedido = async (id) => {
    const respuesta = await apiFetch(`/api/pedidos/${id}`, { method: 'DELETE' });
    if (respuesta.ok) cargarPedidos();
  };

  return (
    <div>
      <h2>Panel de Control Administrativo</h2>
      <div style={{ padding: '15px', background: '#ffeeba', borderRadius: '5px' }}>
        <p>Como administrador, tienes permisos destructivos sobre la base de datos.</p>
        <ul style={{ textAlign: 'left', listStylePosition: 'inside', paddingLeft: 0 }}>
          {pedidos.length === 0 ? <li>No hay pedidos registrados.</li> : null}
          {pedidos.map(p => (
            <li key={p.id} style={{ marginBottom: '10px' }}>
              <strong>ID {p.id}:</strong> {p.descripcion} - ${p.total} 
              <button 
                onClick={() => eliminarPedido(p.id)} 
                style={{ marginLeft: '15px', background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
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