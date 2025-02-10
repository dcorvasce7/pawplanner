import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FormComponent from '../components/FormComponent';
import Header from '../components/Header';

function RegistrazioneUtente() {
  const [message, setMessage] = useState('');
  const router = useRouter();  // Hook per la navigazione in Next.js

  const inputs = [
    { label: 'Nome', type: 'text', id: 'nome', name: 'nome', required: true },
    { label: 'Cognome', type: 'text', id: 'cognome', name: 'cognome', required: true },
    { label: 'Email', type: 'email', id: 'email', name: 'email', required: true, autoComplete: 'email' },
    { label: 'Telefono', type: 'text', id: 'telefono', name: 'telefono', required: true },
    { label: 'Password', type: 'password', id: 'password', name: 'password', required: true, autoComplete: 'new-password' },
    { label: 'Conferma Password', type: 'password', id: 'confirmpassword', name: 'confirmpassword', required: true, autoComplete: 'new-password' }
  ];

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    console.log('handleFormSubmit chiamata con dati:', formData);
    try {
      const response = await axios.post('/api/register_utente', formData);
  
      if (response.status === 201) {
        setMessage('Registrazione avvenuta con successo!');
        setTimeout(() => {
          router.push('/LoginUtente');
        }, 2000);
      } else {
        setMessage(response.data.error || 'Errore nella registrazione');
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Errore di connessione al server');
    }
  };

  return (
    <>
      <Header title="Veterinario da Chiara" subtitle="" />
      <div className='registrationcontent'>
        <FormComponent 
          title="Registrazione Utente" 
          inputs={inputs} 
          buttonText="Registrati" 
          onSubmit={handleFormSubmit} 
          className="login-form" 
        />
        {message && <div className="message">{message}</div>} {/* Mostra il messaggio sotto il form */}
      </div>
    </>
  );
}

export default RegistrazioneUtente;