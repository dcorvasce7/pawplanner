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
        <div className="content">
          <CalendarioOrari /> 
        </div>
        <div className="content">
          <Emergenze role="utente" />
      </div>
      </div>
    </AuthGuard>
  );
}

export default DashboardUtente;