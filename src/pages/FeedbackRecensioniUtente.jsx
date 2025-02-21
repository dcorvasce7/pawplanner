import React from 'react';
import NavbarUtente from '../components/NavbarUtente';
import AuthGuard from '../components/AuthGuard';
import Feedback from '../components/Feedback';

function FeedbackRecensioniUtente() {
  return (
    <AuthGuard allowedRoles={['utente']}>
      <NavbarUtente />
      <div className="margin-divisor"></div>
      <div className="content">
        <div>
          <h2>Feedback e Recensioni</h2>
          <Feedback role={'utente'} />
        </div>
      </div>
    </AuthGuard>
  );
}

export default FeedbackRecensioniUtente;