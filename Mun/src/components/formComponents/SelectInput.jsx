// FormComponents/SelectInput.jsx
import PropTypes from 'prop-types';

const SelectInput = ({ label, options, value, onChange, name, required }) => (
  <div className="mb-4 border border-b-slate-400 rounded-md p-3">
    <label className="block text-gray-700 mb-2" htmlFor={name}>{label}</label>
    <select
      id={name}
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={value}
      onChange={onChange}
      name={name}
      required={required}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

SelectInput.propTypes = {
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

export default SelectInput;