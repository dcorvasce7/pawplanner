import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormComponent from './FormComponent'; // Importa il componente

function Orario() {
  const [orari, setOrari] = useState([]);
  const [userId, setUserId] = useState(null);
  const formData = {
    orario_inizio: '',
    orario_fine: '',
    giorno: 'Lun',
  };

  
  useEffect(() => {
    fetchUserId();
  }, []);  // Questo useEffect si attiva solo al primo rendering per recuperare l'ID dell'utente

  useEffect(() => {
    if (userId) {
      fetchOrari();
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const sessionResponse = await axios.get('/api/session');
      if (sessionResponse.data.user) {
        setUserId(sessionResponse.data.user.id);
      } else {
        console.error('Nessun dato utente trovato');
      }
    } catch (error) {
      console.error('Errore nel recupero dei dati della sessione:', error);
    }
  };

  //aggiungere if controllo
  const fetchOrari = async () => {
    try {
      const res = await axios.get(`/api/orario?id_veterinario=${userId}`);
      setOrari(res.data);
    } catch (error) {
      console.error('Errore nel recupero degli orari:', error);
    }
  };

  
  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();
  
    if (!userId) {
      alert('Errore: ID utente non disponibile. Riprova.');
      return; // Interrompe l'invio della richiesta
    }
  
    
    try {
      await axios.post('/api/orario', { ...formData, id_veterinario: userId });
      fetchOrari();
      alert('Orario aggiunto con successo');
    
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Errore durante l\'aggiunta, riprova più tardi');
      }
      console.error('Errore nell\'aggiunta:', error);
    }
  };
  

  const handleDelete = async (id_orario) => {
    try {
      await axios.delete('/api/orario', { data: { id_orario } });
      fetchOrari();
    } catch (error) {
      console.error('Errore nella rimozione:', error);
    }
  };

  // Dati per il form
  const formInputs = [
    {
      id: 'giorno',
      label: 'Giorno',
      type: 'select',
      name: 'giorno',
      options: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
      required: true,
    },
    {
      id: 'orario_inizio',
      label: 'Orario Inizio',
      type: 'time',
      name: 'orario_inizio',
      required: true,
    },
    {
      id: 'orario_fine',
      label: 'Orario Fine',
      type: 'time',
      name: 'orario_fine',
      required: true,
    },
  ];

  return (
    <div className="time-popup">
      <div className="header">
        <h2>Gestione Orario</h2>
      </div>

      {/* Usa il componente FormComponent */}
      <FormComponent
        inputs={formInputs}
        className="time-form"
        onSubmit={handleFormSubmit}
        formData={formData}  // Passa formData
      />
      <div className="button-group">
        <button type="submit" form="form">Aggiungi Orario</button>
      </div>
      <ul className='time-list'>
        {orari.map(orario => (
          <li className='time-item' key={orario.ID_Orario}>
            <strong>{orario.Giorno}</strong><p className='time-text'>{orario.Orario_Inizio} - {orario.Orario_Fine}</p>
            <button onClick={() => handleDelete(orario.ID_Orario)}>Elimina</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orario;