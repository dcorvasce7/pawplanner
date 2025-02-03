import React from 'react';
import FormComponent from '../components/FormComponent';
import Header from '../components/Header';


function RegistrazioneVeterinario() {
  const inputs = [
    { label: 'Nome', type: 'text', id: 'nome', name: 'nome', required: true },
    { label: 'Cognome', type: 'text', id: 'cognome', name: 'cognome', required: true },
    { label: 'Email', type: 'email', id: 'email', name: 'email', required: true },
    { label: 'Telefono', type: 'text', id: 'telefono', name: 'telefono', required: true },
    { label: 'Ragione Sociale', type: 'text', id: 'ragionesociale', name: 'ragionesociale', required: true },
    { label: 'Partita IVA', type: 'text', id: 'partitaiva', name: 'partitaiva', required: true },
    { label: 'Indirizzo', type: 'text', id: 'indirizzo', name: 'indirizzo', required: true },
    { label: 'CAP', type: 'text', id: 'cap', name: 'cap', required: true },
    { label: 'Specializzazione', type: 'text', id: 'specializzazione', name: 'specializzazione', required: false },
    { label: "N° di iscrizione all'albo", type: 'text', id: 'numiscrizione', name: 'numiscrizione', required: true },
    { label: 'Password', type: 'password', id: 'password', name: 'password', required: true },
    { label: 'Confirm Password', type: 'password', id: 'confirmpassword', name: 'confirmpassword', required: true }
  ];

  return (
    <>
      <Header title="Veterinario da Chiara" subtitle="" />
      <div className='registrationcontent'>
        <FormComponent title="Registrazione Veterinario" inputs={inputs} buttonText="Registrati" className="login-form" />
      </div>
    </>
  );
}

export default RegistrazioneVeterinario;