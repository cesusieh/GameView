import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home'
import AuthForm from './pages/auth'
import Site from './pages/site'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/register" element={<AuthForm registerMode={true} />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;