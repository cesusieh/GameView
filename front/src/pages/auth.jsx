import React, { useState } from 'react';
import './auth.css';
import { registerUser } from '../services/auth'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login attempt:', { username, password });
    } else {
      registerUser(username, password)
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Registro'}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        
        <div className="input-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <button type="submit" className="auth-button">
          {isLogin ? 'Entrar' : 'Registrar'}
        </button>
      </form>
      <p>
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
          {isLogin ? 'Registrar' : 'Login'}
        </button>
      </p>
    </div>
  );
}
