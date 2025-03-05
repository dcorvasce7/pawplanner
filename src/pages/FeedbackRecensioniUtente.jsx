import React from 'react';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';
import Feedback from '../components/Feedback';

function FeedbackRecensioniUtente() {
  return (
    <AuthGuard allowedRoles={['utente']}>
      <Navbar tipoUtente="utente" />
      <div className="margin-divisor"></div>
          <Feedback role={'utente'} />
    </AuthGuard>
  );
}

export default FeedbackRecensioniUtente;