import React from 'react';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';
import Feedback from '../components/Feedback';

function FeedbackRecensioni() {
  return (
    <AuthGuard allowedRoles={['veterinario']}>
      <Navbar />
      <div className="margin-divisor"></div>
      <div className="content">
        <div>
          <h2>Feedback e Recensioni</h2>
          <Feedback role={'veterinario'} />
        </div>
      </div>
    </AuthGuard>
  );
}

export default FeedbackRecensioni;