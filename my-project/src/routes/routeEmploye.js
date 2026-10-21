import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EmployeLayout from '../layouts/EmployeLayout';
import DemandeAttestation from '../pages/employe/FormDemande';
import AttestationsList from '../pages/employe/AttestationsList';
import FullWidthNotifications from '../pages/components/Notifications';
import ProfileEmploye from '../pages/employe/ProfileEmploye';
import ModifierProfile from '../pages/employe/ModifierEmploye';

export default function Employeroutes() {
  return (
    <Routes>
      <Route element={<EmployeLayout />}>
        <Route path="demandes" element={<DemandeAttestation />} />
        <Route path="attestations" element={<AttestationsList />} />
        <Route path="notifications" element={<FullWidthNotifications />} />
        <Route path="profil" element={<ProfileEmploye />} />
        <Route path="profil/modifier/:id" element={<ModifierProfile />} />
        
        {/* Route par défaut pour /employe */}
        <Route index element={<DemandeAttestation />} />
      </Route>
    </Routes>
  );
}