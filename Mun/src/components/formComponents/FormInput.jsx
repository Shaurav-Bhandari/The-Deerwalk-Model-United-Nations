// FormComponents/FormInput.jsx
import PropTypes from 'prop-types';

const FormInput = ({ label, type, value, onChange, name, placeholder, required }) => (
  <div className="mb-4 border border-b-slate-400 rounded-md p-3">
    <label className="block text-gray-700 mb-2" htmlFor={name}>{label}</label>
    <input
      id={name}
      type={type}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};

export default FormInput;