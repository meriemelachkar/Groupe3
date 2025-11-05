import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from "../components/Navbar";
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 

export default function LoginForm() {
  const { signIn, loading: authLoading } = useAuth();
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false); 
  const loading = localLoading || authLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);

    try {
      const userId = await signIn({ email, motDePasse });
      console.log('Connexion réussie. UserId retourné par signIn:', userId);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-emerald-100 p-3 rounded-full">
              <LogIn className="text-emerald-600" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">Connexion</h2>
          <p className="text-center text-slate-600 mb-6">Accédez à votre compte BuildWealth</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition disabled:bg-emerald-400"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Pas encore de compte ?{' '}
              <button
                onClick={() => (window.location.href = '/SignUp')}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}