import { useNavigate } from "react-router-dom";
import "../styles/site.css";
import NavBar from "../common/navBar";

export default function Site() {
  const navigate = useNavigate();

  return (
    <div className="site-root">
      <NavBar>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={() => navigate("/")}>Login</button>
          <button className="nav-btn" onClick={() => navigate("/register")}>Registrar</button>
        </div>
      </NavBar>
      <main className="site-main">
        <section className="intro-section">
          <div className="intro-text">
            <h1>Bem-vindo ao GameView!</h1>
            <p>
              O GameView é uma plataforma onde você pode compartilhar suas opiniões sobre jogos, ler reviews de outros usuários e descobrir novos títulos para jogar. 
              Cadastre-se, faça login e comece a explorar o universo dos games com a nossa comunidade!
            </p>
          </div>
          <div className="intro-image">
            <img src="/images/banner.png" alt="Banner de jogos" />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <span>GameView &copy; {new Date().getFullYear()} &mdash; Desenvolvido por Sua Equipe</span>
      </footer>
    </div>
  );
}