import { useState, useEffect } from 'react';
import { registerUser, login } from '../services/auth';
import { useNavigate, useLocation } from "react-router-dom";
import '../styles/auth.css';

export default function AuthForm({ registerMode = false }) {
  const [loginOrRegister, setLoginOrRegister] = useState(!registerMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formResult, setFormResult] = useState({message:"", success:false});
  
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    setLoginOrRegister(!registerMode);
  }, [registerMode]);

  useEffect(() => {
  if (location.state?.message) {
    setRedirectMessage(location.state.message);
    const timeout = setTimeout(() => {
      setRedirectMessage("");
      if (location.pathname === "/login") {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }
}, [location.pathname, location.state?.message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginOrRegister) {
      const result = await login(username, password);
      setFormResult(result);
      if (result.success) {
        localStorage.setItem("token", result.message);
        navigate("/home");
      }
    } else {
      const result = await registerUser(username, password);
      setFormResult(result);
      if (result.success) {
        setTimeout(() => {
          setLoginOrRegister(true);
          setFormResult({message: "Usuário registrado com sucesso! Faça login.", success: true});
          setUsername('');
          setPassword('');
          setTimeout(() => {
            setFormResult({message: "", success: false});
          }, 2000);
        }, 1500);
      }
    }
  };

  return (
    <div className="auth-container">
      {redirectMessage && (
        <div className="formResult error">{redirectMessage}</div>
      )}
      <h2>{loginOrRegister ? 'Login' : 'Registro'}</h2>
      <div className={`formResult ${formResult.success ? 'success' : 'error'}`}>
        {formResult.message}
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input type="text" placeholder="Digite seu usuário"
            required minLength={5}
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="input-group">
          <input type="password" placeholder="Digite sua senha"
            required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="auth-button">
          {loginOrRegister ? 'Entrar' : 'Registrar'}
        </button>
      </form>
      <p>
        {loginOrRegister ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <button onClick={() => {
          setLoginOrRegister(!loginOrRegister);
          setFormResult({message:"", success:false});
          setUsername('');
          setPassword('');
        }}
        className="toggle-button">
          {loginOrRegister ? 'Registrar' : 'Login'}
        </button>
      </p>
    </div>
  );
}
