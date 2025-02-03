import React from 'react';
import FormComponent from '../components/FormComponent';
import Header from '../components/Header';


function LoginVeterinario() {
  const inputs = [
    { label: 'Email', type: 'email', id: 'email', name: 'email', required: true },
    { label: 'Password', type: 'password', id: 'password', name: 'password', required: true }
  ];

  return (
    <>
      <Header title="Veterinario da Chiara" subtitle="" />
      <div className='logincontent'>
        <FormComponent title="Login Veterinario" inputs={inputs} buttonText="Accedi" className="login-form" />
      </div>
    </>
  );
}

export default LoginVeterinario;