import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import FormComponent from '../components/FormComponent';

function Registrazione() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { query } = router;
  const tipo = query.tipo || 'utente'; // Default a 'utente' se non è specificato

  const isVeterinario = tipo === 'veterinario';

  // Definizione dei campi comuni
  const commonInputs = [
    { label: 'Nome', type: 'text', id: 'Nome', name: 'Nome', required: true },
    { label: 'Cognome', type: 'text', id: 'Cognome', name: 'Cognome', required: true },
    { label: 'Email', type: 'email', id: 'email', name: 'email', required: true, autoComplete: 'email' },
    { label: 'Telefono', type: 'text', id: 'telefono', name: 'telefono', required: true },
    { label: 'Password', type: 'password', id: 'password', name: 'password', required: true, autoComplete: 'new-password' },
    { label: 'Conferma Password', type: 'password', id: 'confirmpassword', name: 'confirmpassword', required: true, autoComplete: 'new-password' }
  ];

  const specializzazioni = [
    'Medicina generale', 'Chirurgia veterinaria', 'Dermatologia', 'Oncologia',
    'Ortopedia', 'Cardiologia', 'Neurologia', 'Odontoiatria', 'Nutrizione animale', 'Comportamento animale'
  ];

  const veterinarioInputs = [
    { label: 'Ragione Sociale', type: 'text', id: 'ragione_sociale', name: 'ragione_sociale' },
    { label: 'Partita IVA', type: 'text', id: 'partita_iva', name: 'partita_iva' },
    { label: 'Codice Fiscale', type: 'text', id: 'codice_fiscale', name: 'codice_fiscale', required: true },
    { label: 'Indirizzo', type: 'text', id: 'indirizzo', name: 'indirizzo', required: true },
    { label: 'CAP', type: 'text', id: 'cap', name: 'cap', required: true },
    { label: 'Città', type: 'text', id: 'citta', name: 'citta', required: true },
    { label: 'Numero Iscrizione Albo', type: 'text', id: 'num_iscrizione_albo', name: 'num_iscrizione_albo', required: true },
    { label: 'Specializzazione', type: 'select', id: 'specializzazione', name: 'specializzazione', options: specializzazioni }
  ];

  const inputs = isVeterinario ? [...commonInputs, ...veterinarioInputs] : commonInputs;

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();
    setMessage('');

    if (formData.password !== formData.confirmpassword) {
      setMessage('Le password non coincidono');
      return;
    }

    try {
      const endpoint = isVeterinario ? '/api/register_veterinario' : '/api/register_utente';
      const response = await axios.post(endpoint, formData);

      if (response.status === 201) {
        setMessage('Registrazione avvenuta con successo!');
        setTimeout(() => {
          router.push(isVeterinario ? '/Login?tipo=veterinario' : '/Login?tipo=utente');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Errore di connessione al server');
    }
  };

  return (
    <>
      <Header title="PawPlanner" subtitle="" />
      <div className='registrationcontent'>
        <FormComponent 
          title={`Registrazione ${isVeterinario ? 'Veterinario' : 'Utente'}`} 
          inputs={inputs} 
          buttonText="Registrati" 
          onSubmit={handleFormSubmit} 
          className="login-form" 
        />
        {message && <div className="message">{message}</div>}
      </div>
    </>
  );
}

export default Registrazione;
