import '../styles/home.css'
import userImg from '../assets/user.jpeg'; // Corrigido para import

export function NavBar(){
    return (
        <nav>
            <div class="logo">Gameview</div>
            <button>Criar review</button>
            <img
                src={userImg}
                alt="Foto do usuário"
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
            }}/>
        </nav>
  ); 
}

export default function Home(){
    return (
        <NavBar />
    )
}