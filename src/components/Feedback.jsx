import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function Feedback({ role }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [testo, setTesto] = useState('');
  const [valutazione, setValutazione] = useState(1);
  const [idVeterinario, setIdVeterinario] = useState('');
  const [veterinari, setVeterinari] = useState([]);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  

  useEffect(() => {
    fetchUserId();
    fetchVeterinari();
    fetchFeedbacks();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('/api/session');
      if (response.data.user) {
        setUserId(response.data.user.id);
      } else {
        console.error('Nessun dato utente trovato');
      }
    } catch (error) {
      console.error('Errore nel recupero dei dati della sessione:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('/api/feedback');
      if (response.data.length === 0) {
        setMessage('Non ci sono feedback da visualizzare.');
      } else {
        setMessage('');
      }
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei feedback:', error);
    }
  };

  const fetchVeterinari = async () => {
    try {
      const response = await axios.get('/api/veterinario');
      setVeterinari(response.data);
    } catch (error) {
      console.error('Errore nel recupero dei veterinari:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('/api/feedback', { testo, valutazione, idVeterinario });
      setTesto('');
      setValutazione(1);
      setIdVeterinario('');
      fetchFeedbacks(); // Aggiorna i feedback dopo la creazione
    } catch (error) {
      console.error('Errore nella creazione del feedback:', error);
    }
  };

  const handleDelete = async (feedback) => {
    try {

      if (feedback.ID_Utente != userId) {
        console.error('Non autorizzato a eliminare questo feedback');
        return;
      }

      const response = await axios.delete(`/api/feedback?id=${feedback.ID_Feedback}`);
        fetchFeedbacks(); // Aggiorna i feedback dopo la cancellazione

    } catch (error) {
      console.error('Errore nell\'eliminazione del feedback:', error);
    }
  };


  return (
    <div className='feedback-content'>
      <div className="header">
        <h2>Feedback e Recensioni</h2>
      </div>
      {role === 'utente' && (
        <div className='form-group'>
          <input
            type="text"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            placeholder="Testo"
          />
          <select className='val' value={valutazione} onChange={(e) => setValutazione(e.target.value)}>
            {[1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
          <select className='vet' value={idVeterinario} onChange={(e) => setIdVeterinario(e.target.value)}>
            <option value="">Seleziona Veterinario</option>
            {veterinari.map((vet) => (
              <option key={vet.ID_Veterinario} value={vet.ID_Veterinario}>
                {vet.Nome} {vet.Cognome}
              </option>
            ))}
          </select>
          <button onClick={handleCreate} disabled={!testo.trim() || !idVeterinario}>Crea</button>
        </div>
      )}
      <ul className="feedback-list">
        {feedbacks.map((feedback) => {
          const dataOra = new Date(feedback.data);
          const dataFormattata = isNaN(dataOra) ? 'Data non valida' : format(dataOra, 'dd/MM/yyyy HH:mm');
          return (
            <li key={feedback.ID_Feedback} className='feedback-item'>
              <p className='user'><strong>{feedback.Nome} {feedback.Cognome}</strong></p>
              <p className='descripion'>Testo: {feedback.Testo}</p>
              <p className='valutation'>Valutazione: {feedback.Valutazione}</p>
              <p className='veterinario'>Dott. {feedback.CognomeVet} {feedback.NomeVet}</p>
              <p className='date'>Data: {dataFormattata}</p>
              <div className="button-group">
                {role === 'utente' && feedback.ID_Utente === userId ? (
                  <button onClick={() => handleDelete(feedback)}>Cancella</button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default Feedback;