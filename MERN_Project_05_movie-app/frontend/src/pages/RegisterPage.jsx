import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-5xl">🎬</span>
            <h1 className="text-3xl font-black text-white mt-4">Create your account</h1>
            <p className="text-zinc-500 mt-2">Join CineVerse and start tracking films</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default RegisterPage;
 