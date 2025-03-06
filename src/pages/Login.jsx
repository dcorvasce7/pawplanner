import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Header from '../components/Header';
import FormComponent from '../components/FormComponent';

function Login() {
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { query } = router;
  const tipo = query.tipo; // Default a 'utente' se non è specificato

  const isVeterinario = tipo === 'veterinario';
  
  const inputs = [
    { name: 'email', type: 'email', label: 'Email', required: true, autoComplete: 'email' },
    { name: 'password', type: 'password', label: 'Password', required: true, autoComplete: 'current-password' }
  ];
  
  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`/api/login_${tipo}`, formData);

      if (response.status === 200) {
        setMessage('Login riuscito');
        setTimeout(() => {
          router.push(isVeterinario ? '/DashboardVeterinario' : '/DashboardUtente');
        }, 2000);
      } else {
        setMessage(response.data.error || 'Errore nel login');
      }
    } catch (error) {
      setMessage('Errore di connessione al server');
    }
  };

  return (
    <>
      <Header title="PawPlanner" subtitle="" />
      <div className='logincontent'>
        <FormComponent 
          title={`Login ${isVeterinario ? 'Veterinario' : 'Utente'}`} 
          inputs={inputs} 
          buttonText="Accedi" 
          onSubmit={handleFormSubmit} 
          className="login-form" 
        />
        {message && <div className="message">{message}</div>}
      </div>
    </>
  );
}

export default Login;
