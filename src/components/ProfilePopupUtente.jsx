import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormComponent from './FormComponent'; // Importiamo il FormComponent

function ProfilePopupUtente() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    Nome: '',
    Cognome: '',
    Email: '',
    Numero_di_telefono: '',
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
          const idUtente = sessionResponse.data.user.id;

          if (idUtente) {
            // Usa l'ID per fare la richiesta alla tua API per ottenere i dati del veterinario
            const response = await axios.get(`/api/utente?id=${idUtente}`);
            if (response.data) {
              setUser(response.data);
              setFormData({
                Nome: response.data.Nome || '',
                Cognome: response.data.Cognome || '',
                Email: response.data.Email || '',
                Numero_di_telefono: response.data.Numero_di_telefono || '',
              });
              setOriginalData(response.data);
            }
          } else {
            console.error('ID Utente non trovato nella sessione.');
          }
        } else {
          console.error('Nessun dato utente trovato');
        }
      } catch (error) {
        console.error('Errore nel recupero dei dati dell\'utente:', error);
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
      const response = await axios.put(`/api/utente?id=${user.ID_Utente}`, formData);
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

  const inputs = [
    { id: 'Nome', label: 'Nome', type: 'text', name: 'Nome', value: formData.Nome, disabled: true },
    { id: 'Cognome', label: 'Cognome', type: 'text', name: 'Cognome', value: formData.Cognome, disabled: true },
    { id: 'Email', label: 'Email', type: 'email', name: 'Email', value: formData.Email, disabled: !isEditable },
    { id: 'Numero_di_telefono', label: 'Telefono', type: 'text', name: 'Numero_di_telefono', value: formData.Numero_di_telefono, disabled: !isEditable }
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

export default ProfilePopupUtente;
