import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ValidateurLayout from '../layouts/ValidateurLayout';
import ValidationAttestationsPage from '../pages/validateur/ValidationAttestationsPage';
import HistoriqueValidationsPage from '../pages/validateur/HistoriqueValidationsPage';
import FullWidthNotifications from '../pages/components/Notifications';
import ProfilPage from '../pages/validateur/ProfilPage';
import ModifierValidateur from '../pages/validateur/ModifierValidateur';

export default function ValidateurRoutes() {
    return (
        <Routes>
            <Route element={<ValidateurLayout />}>
                <Route path="valider" element={<ValidationAttestationsPage />} />
                <Route path="validees" element={<HistoriqueValidationsPage />} />
                <Route path="notifications" element={<FullWidthNotifications />} />
                <Route path="profil" element={<ProfilPage />} />
                <Route path="profil/modifier/:id" element={<ModifierValidateur />} />
                <Route index element={<ValidationAttestationsPage />} />
            </Route>
        </Routes>
    );
}