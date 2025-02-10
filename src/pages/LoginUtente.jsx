import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import FormComponent from '../components/FormComponent';

function LoginUtente() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const inputs = [
    { name: 'email', type: 'email', label: 'Email', required: true, autoComplete: 'email'},
    { name: 'password', type: 'password', label: 'Password', required: true, autoComplete: 'current-password'}
  ];
  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login_utente', formData);

      if (response.status === 200) {
        console.log('Login successful:', response.data);
        setMessage('Login riuscito');
        setTimeout(() => {
          router.push('/'); // Reindirizza alla pagina di dashboard
        }, 2000);
      } else {
        // Se ci sono errori nel backend
        setMessage(response.data.error || 'Errore nel login');
      }
    } catch (error) {
      setMessage('Errore di connessione al server');
    }
  };

  return (
    <>
      <Header title="Veterinario da Chiara" subtitle="" />
      <div className='logincontent'>
        <FormComponent 
          title="Login Utente" 
          inputs={inputs} 
          buttonText="Accedi" 
          onSubmit={handleFormSubmit} 
          className="login-form" 
        />
        {message && <div className="message">{message}</div>} {/* Mostra il messaggio sotto il form */}
      </div>
    </>
  );
}

export default LoginUtente;