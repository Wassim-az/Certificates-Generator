import React from 'react';
import { Routes, Route } from 'react-router-dom';

import EmployesList from '../pages/admin/EmployesList';
import AjouterEmploye from '../pages/admin/AjouterEmploye';
import ModifierEmploye from '../pages/admin/ModifierEmploye';

export default function AdminRoutes() {
    return (
        <Routes>
            
                <Route path="employes" element={<EmployesList />} />
                <Route path="employes/ajouter" element={<AjouterEmploye />} />
                <Route path="employes/modifier/:id" element={<ModifierEmploye />} />
            
        </Routes>
    );
}
