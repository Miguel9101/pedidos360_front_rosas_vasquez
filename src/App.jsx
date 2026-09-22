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
    cargarPedidos();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Formulario */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: '1px solid #f0f2f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '10px', borderRadius: '12px', fontSize: '1.2rem' }}>📦</div>
          <div>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: '700' }}>Nuevo Pedido</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Registra un producto en el sistema</p>
          </div>
        </div>

        <form onSubmit={crearPedido} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Descripción</label>
            <input 
              type="text" 
              placeholder="Ej. Pizza Pepperoni Familiar" 
              value={descripcion} 
              onChange={e => setDescripcion(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s' }} 
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total ($)</label>
            <input 
              type="number" 
              placeholder="Ej. 12990" 
              value={total} 
              onChange={e => setTotal(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#1e293b', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s' }} 
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
          <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', transition: 'transform 0.1s' }}>
            Guardar Pedido
          </button>
        </form>
      </div>

      {/* Lista de Pedidos */}
      <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)', border: '1px solid #f0f2f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#f1f5f9', color: '#475569', padding: '8px 12px', borderRadius: '10px', fontSize: '1rem' }}>📋</div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: '700' }}>Pedidos Registrados</h3>
          </div>
          <span style={{ background: '#e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
            {pedidos.length} total
          </span>
        </div>

        {pedidos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <p style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>📂</p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>No hay pedidos registrados en el sistema.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pedidos.map(p => (
              <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>#{p.id}</span>
                  <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.95rem' }}>{p.descripcion}</span>
                </div>
                <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.9rem' }}>
                  ${p.total.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
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
    <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', border: '1px solid #f0f2f5', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '12px', fontSize: '1.2rem' }}>🛡️</div>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: '700' }}>Panel de Control Administrativo</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Gestión avanzada y permisos destructivos sobre la base de datos.</p>
        </div>
      </div>
      
      <div style={{ marginTop: '25px' }}>
        {pedidos.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '30px 0' }}>No hay registros para administrar.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pedidos.map(p => (
              <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' }}>#{p.id}</span>
                  <span style={{ color: '#1e293b', fontWeight: '600' }}>{p.descripcion}</span>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>(${p.total.toLocaleString()})</span>
                </div>
                <button 
                  onClick={() => eliminarPedido(p.id)} 
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', boxShadow: '0 2px 6px rgba(239, 68, 68, 0.2)' }}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const NoAutorizado = () => <h2 style={{color: '#ef4444', textAlign: 'center'}}>Acceso denegado: Rol de Administrador requerido</h2>;

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <BrowserRouter>
          <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '16px 28px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)', marginBottom: '30px', border: '1px solid #f0f2f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>
                    <span>👤</span> {user?.username}
                  </div>
                  <nav style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.95rem' }}>Ver Pedidos</Link>
                    <Link to="/admin" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.95rem' }}>Administración</Link>
                  </nav>
                </div>
                <button onClick={signOut} style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'background 0.2s' }}>
                  Cerrar sesión
                </button>
              </header>
              <main>
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
          </div>
        </BrowserRouter>
      )}
    </Authenticator>
  );
}

export default App;