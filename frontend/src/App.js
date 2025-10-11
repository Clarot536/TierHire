import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Components/Layout';
import Register from './Pages/Register';
import Login from './Pages/Login';
import DomainDashboard from './Pages/DomainDashboard';
import RecruiterRegister from './Pages/RecruiterRegister';
import RecruiterLogin from './Pages/RecruiterLogin';
import Dashboard from './Pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="register" element={<Register/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path='domain/dashboard' element={<DomainDashboard/>}/>
          <Route path='r/register' element={<RecruiterRegister/>}/>
          <Route path='r/login' element={<RecruiterLogin/>}/>
          <Route path='Dashboard' element={<Dashboard/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;