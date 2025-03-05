import React from 'react';
import CalendarioOrari from '../components/CalendarioOrari';
import AuthGuard from '../components/AuthGuard';
import Emergenze from '../components/Emergenze';
import Navbar from '../components/Navbar';

function DashboardUtente() {
  return (
    <AuthGuard allowedRoles={['utente']}>
      <Navbar tipoUtente="utente" />
      <div className="margin-divisor"></div>
      <div className="dashboard-content">
          <CalendarioOrari /> 
          <Emergenze role="utente" />
      </div>
    </AuthGuard>
  );
}

export default DashboardUtente;