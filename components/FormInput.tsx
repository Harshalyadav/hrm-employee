import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, type = 'text', value, onChange, placeholder, required }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2 text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
      />
    </div>
  );
};

export default FormInput;
