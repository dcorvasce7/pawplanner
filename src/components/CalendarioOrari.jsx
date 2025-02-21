import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from 'react-modal';

// Mappa l'enum dei giorni (come "Lun", "Mar", ...) al formato richiesto da FullCalendar
// In FullCalendar: 0 = Domenica, 1 = Lunedì, …, 6 = Sabato.

function CalendarioOrari() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrariDisponibili();
  }, []);
  
  const fetchOrariDisponibili = async () => {
    try {
      const start = '2025-02-01';
      const end = '2025-02-28';
      const response = await axios.get('/api/getOrariDisponibili', {
        params: { start, end, id_veterinario: 25 }
      });
  
      // Filtrare gli eventi dove la data non è nulla
      const events = response.data
        .filter(event => event.data)  // Filtra solo gli eventi con una data
        .map(event => ({
          id: `${event.ID_Orario}-${event.data}`,
          title: event.ID_Appuntamento ? 'Prenotato' : 'Orario disponibile',
          start: event.data ? event.data : null,
          end: event.data ? new Date(new Date(event.data).getTime() + 30 * 60000).toISOString() : null,  // Imposta un orario di fine (30 minuti)
          extendedProps: {
            ID_Orario: event.ID_Orario,
            Giorno: event.Giorno,
            Orario_Inizio: event.Orario_Inizio,
            Orario_Fine: event.Orario_Fine,
            Prenotato: !!event.ID_Appuntamento
          }
        }));
  
      setEvents(events); // Impostare gli eventi filtrati
    } catch (error) {
      console.error('Errore nel recupero degli orari disponibili:', error);
    }
  };
  

  // Gestore del click sugli eventi: solo se lo Stato è "Libero"
  const handleEventClick = (info) => {
    if (info.event.extendedProps.stato !== "Libero") {
      return; // Se lo Stato non è "Libero", non fa nulla
    }
    setSelectedEvent(info.event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="calendario-orari">
      <h2>Calendario Orari Disponibili</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="timeGridWeek"  // Vista settimanale
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventTimeFormat={{ // Aggiungi questa configurazione per il formato orario
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false, // Disabilita AM/PM
          }}
        height="70vh"
        contentHeight="auto"
      />

      {/* Modal per visualizzare i dettagli dell'orario (cliccabile solo se libero) */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Dettaglio Orario"
      >
        {selectedEvent && (
          <>
            <h2>Dettaglio Orario</h2>
            <p><strong>Giorno:</strong> {selectedEvent.extendedProps.giorno}</p>
            <p><strong>Orario Inizio:</strong> {selectedEvent.extendedProps.orario_inizio}</p>
            <p><strong>Orario Fine:</strong> {selectedEvent.extendedProps.orario_fine}</p>
            <p><strong>Stato:</strong> {selectedEvent.extendedProps.stato}</p>
          </>
        )}
        <button onClick={closeModal}>Chiudi</button>
      </Modal>
    </div>
  );
}

export default CalendarioOrari;
