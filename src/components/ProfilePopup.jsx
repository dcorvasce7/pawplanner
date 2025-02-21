import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormComponent from './FormComponent'; // Importiamo il FormComponent

function ProfilePopup() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    Nome: '',
    Cognome: '',
    email: '',
    telefono: '',
    ragione_sociale: '',
    partita_iva: '',
    codice_fiscale: '',
    indirizzo: '',
    cap: '',
    citta: '',
    specializzazione: '',
    num_iscrizione_albo: ''
  });

  const [isEditable, setIsEditable] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Recupera i dati dell'utente dalla sessione tramite il JWT
        const sessionResponse = await axios.get('/api/session');
        console.log(sessionResponse.data); // Aggiungi questo log
        
        if (sessionResponse.data.user) {
          const idVeterinario = sessionResponse.data.user.id;

          if (idVeterinario) {
            // Usa l'ID per fare la richiesta alla tua API per ottenere i dati del veterinario
            const response = await axios.get(`/api/veterinario?id=${idVeterinario}`);
            if (response.data) {
              setUser(response.data);
              setFormData({
                Nome: response.data.Nome || '',
                Cognome: response.data.Cognome || '',
                email: response.data.email || '',
                telefono: response.data.telefono || '',
                ragione_sociale: response.data.ragione_sociale || '',
                partita_iva: response.data.partita_iva || '',
                codice_fiscale: response.data.codice_fiscale || '',
                indirizzo: response.data.indirizzo || '',
                cap: response.data.cap || '',
                citta: response.data.citta || '',
                specializzazione: response.data.specializzazione || '',
                num_iscrizione_albo: response.data.num_iscrizione_albo || ''
              });
              setOriginalData(response.data);
            }
          } else {
            console.error('ID Veterinario non trovato nella sessione.');
          }
        } else {
          console.error('Nessun dato utente trovato');
        }
      } catch (error) {
        console.error('Errore nel recupero dei dati del veterinario:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e, formData) => {
    e.preventDefault();

    // Controlla se ci sono state modifiche rispetto ai dati originali
    const isModified = Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );

    if (!isModified) {
      alert('Nessuna modifica effettuata');
      setIsEditable(false);
      return;
    }

    try {
      const response = await axios.put(`/api/veterinario?id=${user.ID_Veterinario}`, formData);
      if (response.status === 200) {
        alert('Dati aggiornati con successo');
        setOriginalData(formData);
        setIsEditable(false);
      } else {
        alert('Errore nell\'aggiornamento dei dati');
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento dei dati:', error);
      alert('Errore nell\'aggiornamento dei dati');
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

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
    { id: 'Nome', label: 'Nome', type: 'text', name: 'Nome', value: formData.Nome, disabled: true },
    { id: 'Cognome', label: 'Cognome', type: 'text', name: 'Cognome', value: formData.Cognome, disabled: true },
    { id: 'email', label: 'Email', type: 'email', name: 'email', value: formData.email, disabled: !isEditable },
    { id: 'telefono', label: 'Telefono', type: 'text', name: 'telefono', value: formData.telefono, disabled: !isEditable },
    { id: 'ragione_sociale', label: 'Ragione Sociale', type: 'text', name: 'ragione_sociale', value: formData.ragione_sociale, disabled: !isEditable },
    { id: 'partita_iva', label: 'Partita IVA', type: 'text', name: 'partita_iva', value: formData.partita_iva, disabled: !isEditable },
    { id: 'codice_fiscale', label: 'Codice Fiscale', type: 'text', name: 'codice_fiscale', value: formData.codice_fiscale, disabled: true },
    { id: 'indirizzo', label: 'Indirizzo', type: 'text', name: 'indirizzo', value: formData.indirizzo, disabled: !isEditable },
    { id: 'cap', label: 'CAP', type: 'text', name: 'cap', value: formData.cap, disabled: !isEditable },
    { id: 'citta', label: 'Città', type: 'text', name: 'citta', value: formData.citta, disabled: !isEditable },
    { id: 'specializzazione', label: 'Specializzazione', type: 'select', name: 'specializzazione', value: formData.specializzazione, disabled: !isEditable, options: specializzazioni },
    { id: 'num_iscrizione_albo', label: 'Numero Iscrizione Albo', type: 'text', name: 'num_iscrizione_albo', value: formData.num_iscrizione_albo, disabled: true }
  ];

  return (
    <>
      <div className="header">
        <h2>Il Mio Profilo</h2>
      </div>

      <FormComponent
        inputs={inputs}
        className="login-form"
        formData={formData}
        onSubmit={handleSubmit}
      />
      <div className="button-group">
        <button onClick={handleEditClick} disabled={isEditable}>Modifica</button>
        <button type="submit" form="form" disabled={!isEditable}>Salva</button>
      </div>
    </>
  );
}

export default ProfilePopup;
