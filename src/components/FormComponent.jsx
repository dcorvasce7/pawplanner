import React from 'react';

function FormComponent({ title, inputs, buttonText, className }) {
  return (
    <>
      <div className='header'>
      <h2>{title}</h2>
      </div>
      
      <form className={className}>
        {inputs.map((input, index) => (
          <div className="form-group" key={index}>
            <label htmlFor={input.id}>{input.label}</label>
            <input
              type={input.type}
              id={input.id}
              name={input.name}
              required={input.required}
            />
          </div>
        ))}
        <div class="button-container">
          <button type="submit">{buttonText}</button>
        </div>
      </form>
    </>
  );
}

export default FormComponent;