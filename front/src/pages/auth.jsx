import { useState } from 'react';
import { registerUser, login } from '../services/auth'
import './auth.css';

export default function AuthForm() {
  const [loginOrRegister, setLoginOrRegister] = useState(true); 
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [formResult, setFormResult] = useState({message:"", success:false});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = loginOrRegister
    ? await login(username, password)
    : await registerUser(username, password)

    setFormResult(result)
  };

  return (
    <div className="auth-container">
      <h2>{loginOrRegister ? 'Login' : 'Registro'}</h2>
      <div className = {`formResult ${formResult.success ? 'success' : 'error'}`}>
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
          setPassword('');}}
          className="toggle-button">
          {loginOrRegister ? 'Registrar' : 'Login'}
        </button>
      </p>
    </div>
  );
}
