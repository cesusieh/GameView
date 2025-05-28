import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import AuthForm from './pages/Auth'
import Site from './pages/Site'
import GamePage from "./pages/GamePage";
import MyReviews from "./pages/MyReviews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/register" element={<AuthForm registerMode={true} />} />
        <Route path="/home" element={<Home />} />
        <Route path="gamepage/:id" element={<GamePage />} />
        <Route path="/my-reviews" element={<MyReviews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;