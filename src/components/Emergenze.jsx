import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function Emergenze({ role }) {
  const [emergenze, setEmergenze] = useState([]);
  const [descrizione, setDescrizione] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasActiveEmergenza, setHasActiveEmergenza] = useState(false);

  useEffect(() => {
    fetchEmergenze();
  }, []);

  const fetchEmergenze = async () => {
    try {
      const response = await axios.get('/api/emergenze', { params: { role } });
      setEmergenze(response.data);
      setLoading(false);

      // Controlla se l'utente ha un'emergenza attiva
      if (role === 'utente') {
        const activeEmergenza = response.data.find(emergenza => emergenza.Stato === 'Attiva');
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
    <div>
      <h2>Gestione Emergenze</h2>
      <button onClick={fetchEmergenze}>Aggiorna</button>
      {role === 'utente' && !hasActiveEmergenza && (
        <div>
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
      <ul>
        {emergenze.map((emergenza) => {
          const dataOra = new Date(`${emergenza.Data}`);
          const dataFormattata = isNaN(dataOra) ? 'Data non valida' : format(dataOra, 'dd/MM/yyyy');
          return (
            <li key={emergenza.ID_Emergenza}>
              <p>{emergenza.Descrizione}</p>
              <p>{dataFormattata} {emergenza.Ora}</p>
              <p>Stato: {emergenza.Stato}</p>
              {role === 'veterinario' && (
                <>
                  <button onClick={() => handleUpdate(emergenza.ID_Emergenza, 'Risolta')}>Risolta</button>
                  <button onClick={() => handleDelete(emergenza.ID_Emergenza)}>Annulla</button>
                </>
              )}
              {role === 'utente' && emergenza.Stato === 'Attiva' && (
                <button onClick={() => handleDelete(emergenza.ID_Emergenza)}>Annulla</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Emergenze;