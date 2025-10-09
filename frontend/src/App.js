import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Layout';
import Register from './Register';
import Login from './Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="register" element={<Register/>}/>
          <Route path="login" element={<Login/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;