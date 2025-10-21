import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ExamView from './ExamView';

import CodeRunner from './CodeRunner';
import ExamLobby from './ExamLobby';
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/CodeRunner" element={<CodeRunner/>}/>
          <Route path="/exams" element={<ExamLobby/>}/>
          <Route path="/exam/:problemId" element={<ExamView/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;