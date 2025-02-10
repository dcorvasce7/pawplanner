import React, { useState, useEffect } from 'react';

function FormComponent({ title, inputs, buttonText, className, onSubmit, formData: propFormData }) {
  const [formData, setFormData] = useState(propFormData || {}); // Usa il formData passato come prop o un oggetto vuoto

  // Funzione per gestire il cambiamento dei valori nei campi del form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Gestione dell'invio del form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, formData); // Passa l'evento e i dati del modulo al componente genitore
  };

  useEffect(() => {
    if (propFormData) {
      setFormData(propFormData); // Se viene passato formData come prop, aggiorna lo stato
    }
  }, [propFormData]);

  return (
    <>
      {title && (
        <div className='header'>
          <h2>{title}</h2>
        </div>
      )}


      <form id="form" className={className} onSubmit={handleSubmit}>
        {inputs.map((input, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={input.id}>{input.label}</label>
            {input.type === 'select' ? (
              <select
                id={input.id}
                name={input.name}
                required={input.required}
                value={formData[input.name] || ''} // Imposta il valore della select dallo stato
                onChange={handleChange} // Aggiorna lo stato al cambiamento
                disabled={input.disabled} // Aggiungi la logica di disabilitazione
              >
                <option value="">Seleziona...</option>
                {input.options.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={input.type}
                id={input.id}
                name={input.name}
                required={input.required}
                value={formData[input.name] || ''} // Aggiungi il valore per gli altri campi
                onChange={handleChange} // Gestisci i cambiamenti per gli altri input
                disabled={input.disabled} // Aggiungi la logica di disabilitazione
                autoComplete={input.autoComplete || ''}
              />
            )}
          </div>
        ))}
        {buttonText && (
      <div className='button-container'>
        <button type="submit">{buttonText}</button>
      </div>
    )}
      </form>
    </>
  );
}

export default FormComponent;
