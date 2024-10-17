import { useState } from 'react';
import PropTypes from 'prop-types';
import { register_bg } from '../assets';
import { SectionWrapper } from './hoc';

const FormInput = ({ label, type, value, onChange, name, placeholder, required }) => (
  <div className="mb-4">
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

const RadioGroup = ({ label, options, value, onChange, name, required }) => (
  <div className="mb-4">
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

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactInfo: '',
    registerAs: '',
    institute: '',
    address: '',
    grade: '',
    munExperience: '',
    primaryCommittee: '',
    secondaryCommittee: '',
    foodPreference: '',
    paymentMethod: '',
    position: '',
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log('Form submitted:', formData);
  };

  const committees = [
    { value: 'UNSC', label: 'United Nations Security Council (UNSC)' },
    { value: 'FPN', label: 'Federal Parliament of Nepal (FPN)' },
    { value: 'DISEC', label: 'Disarmament and International Security Committee (DISEC)' },
    { value: 'UNHRC', label: 'United Nations Human Rights Council (UNHRC)' },
    { value: 'ECOFIN', label: 'Economic and Financial Affairs Council (ECOFIN)' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="flex w-full mx-auto items-center justify-center  min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl flex bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="basis-1/2 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(8,0,58,0.7), rgba(8,0,58,0.7)), url(${register_bg})` }} />
        <div className="w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              name="fullName"
              required
            />
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              required
            />
            <FormInput
              label="Phone Number"
              type="tel"
              value={formData.contactInfo}
              onChange={handleInputChange}
              name="contactInfo"
              required
            />
            <RadioGroup
              label="Register as"
              options={[
                { value: 'Delegate', label: 'Delegate' },
                { value: 'Executive', label: 'Executive' },
              ]}
              value={formData.registerAs}
              onChange={handleInputChange}
              name="registerAs"
              required
            />

            {formData.registerAs === 'Delegate' && (
              <>
                <FormInput
                  label="Institute"
                  type="text"
                  value={formData.institute}
                  onChange={handleInputChange}
                  name="institute"
                  placeholder="Enter your School/College/Institution"
                  required
                />
                <FormInput
                  label="Address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  name="address"
                  placeholder="Enter your Address here"
                  required
                />
                <FormInput
                  label="Grade/Level"
                  type="text"
                  value={formData.grade}
                  onChange={handleInputChange}
                  name="grade"
                  placeholder="At what grade/level do you study?"
                  required
                />
                <FormInput
                  label="MUN Experience"
                  type="number"
                  value={formData.munExperience}
                  onChange={handleInputChange}
                  name="munExperience"
                  placeholder="Enter your experience"
                  required
                />
                <RadioGroup
                  label="Select your preferred primary Committee"
                  options={committees}
                  value={formData.primaryCommittee}
                  onChange={handleInputChange}
                  name="primaryCommittee"
                  required
                />
                <RadioGroup
                  label="Select your preferred secondary Committee"
                  options={committees}
                  value={formData.secondaryCommittee}
                  onChange={handleInputChange}
                  name="secondaryCommittee"
                  required
                />
                <RadioGroup
                  label="Select your food preferences"
                  options={[
                    { value: 'Vegetarian', label: 'Vegetarian' },
                    { value: 'Non-Vegetarian', label: 'Non-Vegetarian' },
                  ]}
                  value={formData.foodPreference}
                  onChange={handleInputChange}
                  name="foodPreference"
                  required
                />
                <RadioGroup
                  label="Select a payment method"
                  options={[
                    { value: 'eSewa', label: 'eSewa' },
                    { value: 'Khalti', label: 'Khalti' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                  ]}
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  name="paymentMethod"
                  required
                />
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="transactionReceipt">Upload Transaction Receipt</label>
                  <input
                    id="transactionReceipt"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full"
                  />
                </div>
              </>
            )}

            {formData.registerAs === 'Executive' && (
              <>
                <RadioGroup
                  label="Select your preferred Committee"
                  options={committees}
                  value={formData.primaryCommittee}
                  onChange={handleInputChange}
                  name="primaryCommittee"
                  required
                />
                <RadioGroup
                  label="Select your preferred Position"
                  options={[
                    { value: 'Chairperson', label: 'Chairperson' },
                    { value: 'Vice-Chairperson', label: 'Vice-Chairperson' },
                  ]}
                  value={formData.position}
                  onChange={handleInputChange}
                  name="position"
                  required
                />
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="cv">Upload your CV</label>
                  <input
                    id="cv"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    className="w-full"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Register, "Register");