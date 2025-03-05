import React from 'react';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';
import Feedback from '../components/Feedback';

function FeedbackRecensioni() {
  return (
    <AuthGuard allowedRoles={['veterinario']}>
      <Navbar tipoUtente="veterinario" />
      <div className="margin-divisor"></div>
          <Feedback role={'veterinario'} />
    </AuthGuard>
  );
}

export default FeedbackRecensioni;