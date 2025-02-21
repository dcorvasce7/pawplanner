import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FormComponent from '../components/FormComponent';
import Header from '../components/Header';

function RegistrazioneVeterinario() {
  const [message, setMessage] = useState('');
  const router = useRouter();  // Hook per la navigazione in Next.js

  const specializzazioni = [
    'Medicina generale',
    'Chirurgia veterinaria',
    'Dermatologia',
    'Oncologia',
    'Ortopedia',
    'Cardiologia',
    'Neurologia',
    'Odontoiatria',
    'Nutrizione animale',
    'Comportamento animale'
  ];

  const inputs = [
    { label: 'Nome', type: 'text', id: 'Nome', name: 'Nome', required: true },
    { label: 'Cognome', type: 'text', id: 'Cognome', name: 'Cognome', required: true },
    { label: 'Email', type: 'email', id: 'email', name: 'email', required: true, autoComplete: 'email' },
    { label: 'Telefono', type: 'text', id: 'telefono', name: 'telefono', required: true },
    { label: 'Ragione Sociale', type: 'text', id: 'ragione_sociale', name: 'ragione_sociale' },
    { label: 'Partita IVA', type: 'text', id: 'partita_iva', name: 'partita_iva' },
    { label: 'Codice Fiscale', type: 'text', id: 'codice_fiscale', name: 'codice_fiscale', required: true },
    { label: 'Indirizzo', type: 'text', id: 'indirizzo', name: 'indirizzo', required: true },
    { label: 'CAP', type: 'text', id: 'cap', name: 'cap', required: true },
    { label: 'Città', type: 'text', id: 'citta', name: 'citta', required: true },
    { 
      label: 'Specializzazione', 
      type: 'select', 
      id: 'specializzazione', 
      name: 'specializzazione', 
      options: specializzazioni
    },
    { label: 'Numero Iscrizione Albo', type: 'text', id: 'num_iscrizione_albo', name: 'num_iscrizione_albo', required: true },
    { label: 'Password', type: 'password', id: 'password', name: 'password', required: true, autoComplete: 'new-password' },
    { label: 'Conferma Password', type: 'password', id: 'confirmpassword', name: 'confirmpassword', required: true, autoComplete: 'new-password' }
  ];

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    console.log('handleFormSubmit chiamata con dati:', formData);
    try {
      const response = await axios.post('/api/register_veterinario', formData);
  
      if (response.status === 201) {
        setMessage('Registrazione avvenuta con successo!');
        setTimeout(() => {
          router.push('/LoginVeterinario');
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
          title="Registrazione Veterinario" 
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

export default RegistrazioneVeterinario;