import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from "./routes/routeAdmin";
import Employeroutes from './routes/routeEmploye';  // <== Import ici
import Login from './auth/Login';
import Validateurroutes from './routes/routeValidateur';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Routes Admin */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Routes Employé & Stagiaire */}
        <Route path="/employe/*" element={<Employeroutes />} />

        {/* Routes Validateur */}
        <Route path="/validateur/*" element={<Validateurroutes />} />



        {/* Page 404 */}
        <Route path="*" element={<h1>Page non trouvée</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
