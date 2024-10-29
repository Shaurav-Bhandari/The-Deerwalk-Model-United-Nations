// FormComponents/PhoneInput.jsx
import PropTypes from 'prop-types';

const PhoneInput = ({ label, value, onChange, name, required }) => {
  const handlePhoneChange = (e) => {
    let inputValue = e.target.value;
    const numbersOnly = inputValue.replace(/\D/g, '');
    const truncated = numbersOnly.slice(0, 10);
    
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: truncated
      }
    };
    
    onChange(syntheticEvent);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(97|98)\d{8}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="mb-4 border border-b-slate-400 rounded-md p-3">
      <label className="block text-gray-700 mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type="tel"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={value}
        onChange={handlePhoneChange}
        name={name}
        placeholder="98XXXXXXXX"
        required={required}
        maxLength={10}
        title="Please enter a valid Nepali phone number starting with 97 or 98"
      />
      {value && !validatePhoneNumber(value) && (
        <p className="text-red-500 text-sm mt-1">
          Please enter a valid 10-digit phone number starting with 97 or 98
        </p>
      )}
    </div>
  );
};

PhoneInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool
};

export default PhoneInput;