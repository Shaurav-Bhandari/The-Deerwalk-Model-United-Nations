// FormComponents/RadioGroup.jsx
import PropTypes from 'prop-types';

const RadioGroup = ({ label, options, value, onChange, name, required }) => (
  <div className="mb-4 border border-b-slate-400 rounded-md p-3">
    <label className="block text-gray-700 mb-2">{label}</label>
    {options.map((option) => (
      <div key={option.value} className="flex items-center mb-2">
        <input
          type="radio"
          id={`${name}-${option.value}`}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          required={required}
          className="mr-2"
        />
        <label htmlFor={`${name}-${option.value}`} className="text-gray-700">
          {option.label}
        </label>
      </div>
    ))}
  </div>
);

RadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool
};

export default RadioGroup;