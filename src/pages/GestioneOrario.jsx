import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AuthGuard from '../components/AuthGuard';
import FormComponent from '../components/FormComponent'; // Importa il componente

function GestioneOrario() {
  const [orari, setOrari] = useState([]);
  const [formData, setFormData] = useState({
    orario_inizio: '',
    orario_fine: '',
    stato: 'Libero',
    giorno: 'Lun',
  });
  const id_veterinario = 25; // Da cambiare con l'ID reale

  useEffect(() => {
    fetchOrari();
  }, []);

  const fetchOrari = async () => {
    try {
      const res = await axios.get(`/api/orario?id_veterinario=${id_veterinario}`);
      setOrari(res.data);
    } catch (error) {
      console.error('Errore nel recupero degli orari:', error);
    }
  };

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    try {
      // Chiamata per aggiungere l'orario
      await axios.post('/api/orario', { ...formData, id_veterinario });
      fetchOrari();
      alert('Orario aggiunto con successo');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);  // Mostra l'alert con il messaggio di errore
      } else if (error.response) {
        alert('Errore sconosciuto dal server, riprova più tardi');
      } else if (error.request) {
        alert('Nessuna risposta dal server, riprova più tardi');
      } else {
        alert('Errore nella richiesta, riprova più tardi');
      }
      console.error('Errore nell\'aggiunta:', error);
      return; // Termina l'esecuzione per evitare propagazione dell'errore
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
    {
      id: 'stato',
      label: 'Stato',
      type: 'select',
      name: 'stato',
      options: ['Libero', 'Occupato', 'Non disponibile'],
      required: true,
    },
    {
      id: 'giorno',
      label: 'Giorno',
      type: 'select',
      name: 'giorno',
      options: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'],
      required: true,
    },
  ];

  return (
    <AuthGuard allowedRoles={['veterinario']}>
      <Navbar />
      <div className="margin-divisor"></div>
      <div className="popup">
        <div className="header">
          <h2>Gestione Orario</h2>
        </div>

        {/* Usa il componente FormComponent */}
        <FormComponent
          inputs={formInputs}
          buttonText="Aggiungi Orario"
          className="time-form"
          onSubmit={handleFormSubmit}
          formData={formData}  // Passa formData
        />

        <ul>
          {orari.map(orario => (
            <li key={orario.ID_Orario}>
              {orario.Orario_Inizio} - {orario.Orario_Fine} ({orario.Stato}) - {orario.Giorno}
              <button onClick={() => handleDelete(orario.ID_Orario)}>Elimina</button>
            </li>
          ))}
        </ul>
      </div>
    </AuthGuard>
  );
}

export default GestioneOrario;
