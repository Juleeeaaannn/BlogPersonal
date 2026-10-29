import { useState } from 'react';
import BlogManager from './BlogManager';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function AdminArea() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('blogAuth') === 'true';
  });
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);
    
    try {
      const inputHash = await hashPassword(password);
      
      if (inputHash === import.meta.env.VITE_BLOG_PASSWORD_HASH) {
        setIsAuthenticated(true);
        sessionStorage.setItem('blogAuth', 'true');
        setPassword('');
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error calculando el hash:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('blogAuth');
  };

  if (isAuthenticated) {
    return (
      <div>
        <div className="bg-[#6c0820] text-white p-2 flex justify-between items-center px-6 shadow-md">
          <span className="text-sm font-bold text-[#fe9bb8]">Modo Administrador Activo</span>
          <button 
            onClick={handleLogout}
            className="text-sm border border-white px-3 py-1 rounded hover:bg-[#fe9bb8] hover:text-[#6c0820] hover:border-[#fe9bb8] transition-colors cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>
        <BlogManager />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4dcdc] font-sans">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#6c0820] w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-[#6c0820] mb-6 text-center">
          Acceso al Blog
        </h2>
        
        <div className="mb-4">
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá la contraseña"
            disabled={isLoading}
            className={`w-full border-2 p-3 rounded-lg outline-none transition-colors ${
              error ? 'border-red-500' : 'border-gray-200 focus:border-[#6c0820]'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">Contraseña incorrecta.</p>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full bg-[#6c0820] hover:bg-[#fe9bb8] hover:text-[#6c0820] text-white py-3 rounded-lg font-bold transition-colors cursor-pointer ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}