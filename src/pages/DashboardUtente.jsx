import React from 'react';
import NavbarUtente from '../components/NavbarUtente';
import CalendarioOrari from '../components/CalendarioOrari';
import AuthGuard from '../components/AuthGuard';
import Emergenze from '../components/Emergenze';

function DashboardUtente() {
  return (
    <AuthGuard allowedRoles={['utente']}>
      <NavbarUtente />
      <div className="margin-divisor"></div>
      <div className="dashboard-content">
          <CalendarioOrari /> 
          <Emergenze role="utente" />
      </div>
    </AuthGuard>
  );
}

export default DashboardUtente;