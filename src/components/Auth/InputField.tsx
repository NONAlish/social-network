import { forwardRef } from "react";


interface InputFieldsProps {
  type: string;
  id: string;
  name: string;
  placeholder: string;
  htmlFor: string;
  label: string;
  required?: boolean;
  pattern?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldsProps>(({
  type,
  id,
  name,
  placeholder,
  htmlFor,
  label,
  required,
  pattern,
}, ref) => {
  return (
    <div className="mb-6 flex flex-col">
      <label htmlFor={htmlFor} className="text-gray-500 text-lg mb-2">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        id={id}
        name={name}
        required={required}
        pattern={pattern}
        className=" overflow-y text-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none border-2"
        placeholder={placeholder}
      />
    </div>
  );
});

InputField.displayName = 'InputField'

export default InputField;
