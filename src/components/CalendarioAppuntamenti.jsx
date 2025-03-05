import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Modal from 'react-modal';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

function CalendarioAppuntamenti() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetchEvents();
  }, []);


      const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/getEvents');
        const results = response.data; // Dati grezzi

        // Mappiamo i risultati in modo da formare gli eventi per FullCalendar
        const combinedEvents = results.map(event => ({
          id: event.ID_Appuntamento,
          title: event.Descrizione,
          start: `${format(new Date(event.data), 'yyyy-MM-dd')}T${event.Orario_Inizio}`,
          end: `${format(new Date(event.data), 'yyyy-MM-dd')}T${event.Orario_Fine}`,
          nome: event.Nome,
          cognome: event.Cognome
        }));

        setEvents(combinedEvents);
      } catch (error) {
        console.error('Errore nel recupero eventi: ', error);
      }
    };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="calendario-appuntamenti">
      <h2>Calendario Appuntamenti</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
        height="70vh"
        contentHeight="auto"
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Dettaglio Evento"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <div className="modal-header">
          <h2>{selectedEvent ? selectedEvent.title : 'Evento'}</h2>
        </div>
        <div className="modal-content">
          <p><strong>Prenotato da:</strong> {selectedEvent ? `${selectedEvent.extendedProps.nome} ${selectedEvent.extendedProps.cognome}` : ''}</p>
          <p><strong>Data:</strong> {selectedEvent ? format(new Date(selectedEvent.start), 'dd MMMM yyyy', { locale: it }) : ''}</p>
          <p><strong>Ora:</strong> {selectedEvent ? format(new Date(selectedEvent.start), 'HH:mm', { locale: it }) : ''} - {selectedEvent ? format(new Date(selectedEvent.end), 'HH:mm', { locale: it }) : ''}</p>
        </div>
        <div className="modal-footer">
          <button onClick={closeModal}>Chiudi</button>
        </div>
      </Modal>
    </div>
  );
}

export default CalendarioAppuntamenti;