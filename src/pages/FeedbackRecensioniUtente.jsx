import React from 'react';
import NavbarUtente from '../components/NavbarUtente';
import AuthGuard from '../components/AuthGuard';
import Feedback from '../components/Feedback';

function FeedbackRecensioniUtente() {
  return (
    <AuthGuard allowedRoles={['utente']}>
      <NavbarUtente />
      <div className="margin-divisor"></div>
          <Feedback role={'utente'} />
    </AuthGuard>
  );
}

export default FeedbackRecensioniUtente;