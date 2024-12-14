import { useState } from 'react';
import { FormInput, SelectInput, RadioGroup, PhoneInput } from '../components/formComponents';
import StatusPopup from '../components/statusPopup.jsx';
import { 
  committees, 
  foodPreferences, 
  paymentMethods, 
  positions, 
  roleOptions 
} from '../constants/formOpitons.js';
import { register_bg } from '../assets';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    role: '',
    institute: '',
    address: '',
    grade: '',
    munExperience: '',
    primaryCommittee: '',
    secondaryCommittee: '',
    foodPreference: '',
    paymentMethod: '',
    position: '',
    committee: '',
  });

  const [files, setFiles] = useState({
    transactionReceipt: null,
    cv: null,
  });

  const [statusPopup, setStatusPopup] = useState({
    open: false,
    message: '',
    isSuccess: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      if (name === 'transactionReceipt' && !file.type.startsWith('image/')) {
        showError('Transaction receipt must be an image file.');
        return;
      }
      if (name === 'cv' && file.type !== 'application/pdf') {
        showError('CV must be a PDF file.');
        return;
      }
      setFiles((prev) => ({ ...prev, [name]: file }));
    }
  };

  const showError = (message) => {
    setStatusPopup({
      open: true,
      message,
      isSuccess: false,
    });
  };

  const showSuccess = (message) => {
    setStatusPopup({
      open: true,
      message,
      isSuccess: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showError('');
    showSuccess('');

    const formDataToSend = new FormData();

    // Append all form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    // Append files
    if (files.transactionReceipt) {
      formDataToSend.append('transactionReceipt', files.transactionReceipt);
    }
    if (files.cv) {
      formDataToSend.append('cv', files.cv);
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/register', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      showSuccess('Registration successful!');
      resetForm();
      // Optionally, reset form or redirect user
    } catch (err) {
      showError(err.message || 'An error occurred during registration');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      contact: '',
      role: '',
      institute: '',
      address: '',
      grade: '',
      munExperience: '',
      primaryCommittee: '',
      secondaryCommittee: '',
      foodPreference: '',
      paymentMethod: '',
      position: '',
      committee: '',
    });
    setFiles({
      transactionReceipt: null,
      cv: null,
    });
  };

  const handlePaymentRedirect = (method) => {
    const urls = {
      'eSewa': 'https://esewa.com.np',
      'Khalti': 'https://khalti.com',
      'Bank Transfer': 'https://youtu.be/dQw4w9WgXcQ?si=Mc1j3oahvjrMepK7'
    };
    window.location.href = urls[method];
  };

  return (
    <div className="flex w-full mx-auto items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-7xl flex flex-col-reverse md:flex-row bg-white rounded-lg shadow-lg overflow-hidden my-4 md:my-9">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Register</h2>
          
          <StatusPopup 
            open={statusPopup.open}
            onClose={() => setStatusPopup(prev => ({ ...prev, open: false }))}
            message={statusPopup.message}
            isSuccess={statusPopup.isSuccess}
          />

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Full Name"
              type="text"
              value={formData.fullName}
              placeholder="Enter your Full name"
              onChange={handleInputChange}
              name="fullName"
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleInputChange}
              name="email"
              required
            />

            <PhoneInput
              label="Phone Number"
              value={formData.contact}
              onChange={handleInputChange}
              name="contact"
              required
            />

            <RadioGroup
              label="Register yourself as"
              options={roleOptions}
              value={formData.role}
              onChange={handleInputChange}
              name="role"
              required
            />

            {formData.role === 'Delegate' && (
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
                  label="MUN Experience (in years)"
                  type="number"
                  value={formData.munExperience}
                  onChange={handleInputChange}
                  name="munExperience"
                  placeholder="Enter your experience"
                  required
                  min="0"
                  max="10"
                />

                <SelectInput
                  label="Select your preferred primary Committee"
                  options={committees}
                  value={formData.primaryCommittee}
                  onChange={handleInputChange}
                  name="primaryCommittee"
                  required
                />

                <SelectInput
                  label="Select your preferred secondary Committee"
                  options={committees}
                  value={formData.secondaryCommittee}
                  onChange={handleInputChange}
                  name="secondaryCommittee"
                  required
                />

                <SelectInput
                  label="Select your food preferences"
                  options={foodPreferences}
                  value={formData.foodPreference}
                  onChange={handleInputChange}
                  name="foodPreference"
                  required
                />

                <SelectInput
                  label="Select a payment method"
                  options={paymentMethods}
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  name="paymentMethod"
                  required
                />

                {formData.paymentMethod && (
                  <button
                    type="button"
                    onClick={() => handlePaymentRedirect(formData.paymentMethod)}
                    className={`my-4 w-full text-white py-2 px-4 rounded-md transition duration-300 ${
                      formData.paymentMethod === 'eSewa'
                        ? 'bg-green-500 hover:bg-green-600'
                        : formData.paymentMethod === 'Khalti'
                        ? 'bg-purple-500 hover:bg-purple-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Proceed with {formData.paymentMethod}
                  </button>
                )}

                <div className="mb-4 border border-b-slate-400 rounded-md p-3">
                  <label className="block text-gray-700 mb-2" htmlFor="transactionReceipt">
                    Upload Transaction Receipt
                  </label>
                  <input
                    id="transactionReceipt"
                    name="transactionReceipt"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full"
                  />
                </div>
              </>
            )}

            {formData.role === 'Executive' && (
              <>
                <SelectInput
                  label="Select your preferred Committee"
                  options={committees}
                  value={formData.primaryCommittee}
                  onChange={handleInputChange}
                  name="primaryCommittee"
                  required
                />

                <SelectInput
                  label="Select your preferred Position"
                  options={positions}
                  value={formData.position}
                  onChange={handleInputChange}
                  name="position"
                  required
                />

                <div className="mb-4 border border-b-slate-400 rounded-md p-3">
                  <label className="block text-gray-700 mb-2" htmlFor="cv">
                    Upload your CV
                  </label>
                  <input
                    id="cv"
                    name="cv"
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

        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-48 md:h-auto">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${register_bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} 
          />
          <div className="absolute inset-0 bg-[rgba(8,0,58,0.7)] backdrop-blur-[2px]" />
          <div className="relative h-full p-6 flex flex-col justify-center items-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">JOIN US NOW</h3>
            <p className="text-center text-sm md:text-base">
              Join us for an exciting MUN experience. Fill out the form to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;