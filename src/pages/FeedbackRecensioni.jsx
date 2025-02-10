import React from 'react';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';

function FeedbackRecensioni() {
  return (
    <AuthGuard>
      <Navbar />
      <div className="content">
        <div>
          <h2>Feedback e Recensioni</h2>
          <p>Qui puoi visualizzare i feedback e le recensioni dei clienti.</p>
        </div>
      </div>
    </AuthGuard>
  );
}

export default FeedbackRecensioni;