import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function Emergenze({ role }) {
  const [emergenze, setEmergenze] = useState([]);
  const [descrizione, setDescrizione] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasActiveEmergenza, setHasActiveEmergenza] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchEmergenze();
    }
  }, [userId]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('/api/session');
      setUserId(response.data.user.id);
    } catch (error) {
      console.error('Errore nel recupero dell\'ID utente:', error);
    }
  };

  const fetchEmergenze = async () => {
    try {
      const response = await axios.get('/api/emergenze', { params: { role } });
      setEmergenze(response.data);
      setLoading(false);

      // Controlla se l'utente ha un'emergenza attiva
      if (role === 'utente') {
        const activeEmergenza = response.data.find(emergenza => emergenza.Stato === 'Attiva' && emergenza.ID_Utente === userId);
        setHasActiveEmergenza(!!activeEmergenza);
      }
    } catch (error) {
      console.error('Errore nel recupero delle emergenze:', error);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('/api/emergenze', { descrizione });
      setDescrizione('');
      fetchEmergenze(); // Aggiorna le emergenze dopo la creazione
    } catch (error) {
      console.error('Errore nella creazione dell\'emergenza:', error);
    }
  };

  const handleUpdate = async (id, stato) => {
    try {
      await axios.put(`/api/emergenze?id=${id}`, { stato });
      fetchEmergenze(); // Aggiorna le emergenze dopo l'aggiornamento
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'emergenza:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/emergenze?id=${id}`);
      fetchEmergenze(); // Aggiorna le emergenze dopo la cancellazione
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'emergenza:', error);
    }
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className='emergence-content'>
      <div className="header">
        <h2>Gestione Emergenze</h2>
        <button onClick={fetchEmergenze}>Aggiorna</button>
      </div>

      {role === 'utente' && !hasActiveEmergenza && (
        <div className="form-group">
          <input
            type="text"
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            placeholder="Descrizione"
          />
          <button onClick={handleCreate}>Crea Emergenza</button>
        </div>
      )}
      
      {role === 'utente' && hasActiveEmergenza && (
        <p>Hai già un'emergenza attiva. Risolvila o annullala prima di crearne una nuova.</p>
      )}

      <ul className="emergence-list">
        {emergenze.map((emergenza) => {
          const dataOra = new Date(`${emergenza.Data}`);
          const dataFormattata = isNaN(dataOra) ? 'Data non valida' : format(dataOra, 'dd/MM/yyyy hh:mm');
          return (

            <li key={emergenza.ID_Emergenza} className='emergence-item'>
              <p className='description'>{emergenza.Descrizione}</p>
              <p className='date'>{dataFormattata}</p>
              <p className='state'>Stato: {emergenza.Stato}</p>
              {role === 'veterinario' && (
                <>
                  <p>Creato da: {emergenza.Nome} {emergenza.Cognome}</p>
                  <div className="heade">
                  {emergenza.Stato !== 'Risolta' && (
                      <button onClick={() => handleUpdate(emergenza.ID_Emergenza, 'Risolta')}>Risolta</button>
                  )}
                      <button onClick={() => handleDelete(emergenza.ID_Emergenza)}>Elimina</button>
                    </div>
                </>
              )}
              {role === 'utente' && emergenza.Stato === 'Attiva' && emergenza.ID_Utente === userId && (
                <button onClick={() => handleDelete(emergenza.ID_Emergenza)}>Elimina</button>
              )}
            </li>
          );
        })}
      </ul>
      
    </div>
  );
}

export default Emergenze;