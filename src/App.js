import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Layout from './Components/Layout';
import Register from './Pages/Register';
import Login from './Pages/Login';
import DomainDashboard from './Pages/DomainDashboard';
import RecruiterRegister from './Pages/RecruiterRegister';
import RecruiterLogin from './Pages/RecruiterLogin';
import UpdateDashboard from './Pages/UpdateDashboard';
import Dashboard from './Pages/Dashboard';
import { ThemeAndAuthProvider } from './ThemeAndAuthContext';
import CandidateDomainDashboard from './CandidateDomainDashboard';
// Assuming you have components for these new pages
import ExamsPage from './Pages/ExamsPage'; 
import DsaExam from './Pages/DsaExam'; 

function App() {
  return (
    <ThemeAndAuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          
          {/* Authentication & User Routes */}
          <Route path="register" element={<Register/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='updatedashboard' element={<UpdateDashboard/>}/>
          
          {/* Recruiter Routes */}
          <Route path='r/register' element={<RecruiterRegister/>}/>
          <Route path='r/login' element={<RecruiterLogin/>}/>
          
          {/* Domain & Candidate Routes */}
          {/* Main domain overview/landing */}
          <Route path='domain' element={<CandidateDomainDashboard/>}/> 
          <Route path='domain/dashboard' element={<DomainDashboard/>}/>
          
          {/* Added New Routes */}
          <Route path='exams' element={<ExamsPage/>}/> 
          <Route path='dsa' element={<DsaExam/>}/> 

        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeAndAuthProvider>
  );
}

export default App;