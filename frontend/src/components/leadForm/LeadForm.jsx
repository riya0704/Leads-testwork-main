import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope, FaPhone, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    feedback: ""
  });

  const [errors, setErrors] = useState({});

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.feedback.trim()) newErrors.feedback = "Feedback is required";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/lead/createLead`,
      formData
    );

    if (res.data.success === 1) {
      toast.success(res.data.message);
      setFormData({ name: "", email: "", phone: "", feedback: "" });
      setErrors({});
    }
  } catch (err) {
    console.error(err);

    // Handle duplicate key error returned from backend
    if (err.response?.status === 400 && err.response?.data?.field) {
      const field = err.response.data.field; // "email" or "phone"
      setErrors((prev) => ({ ...prev, [field]: err.response.data.message }));
      toast.error(err.response.data.message);
    } else {
      toast.error(err.response?.data?.message || err.message);
    }
  }
};

  return (
    <div className="p-6 relative min-h-screen bg-gray-100">
      {/* Leads List Link */}
      <Link
        to="/showLeads"
        className="absolute top-4 right-4 bg-white shadow-md rounded-full p-3 
                   hover:bg-gray-100 transition duration-200 flex items-center gap-2"
        title="Go to Leads"
      >
        <span className="text-sm font-medium text-gray-700">Leads List</span>
        <FaArrowRight className="text-blue-600" size={18} />
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-center">Lead Form</h2>

      <div className="flex items-center justify-center px-4">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Info Section */}
          <div className="p-8 flex flex-col justify-center bg-gray-50">
            <p className="text-sm text-gray-500 uppercase font-medium">
              We’re Here To Capture New Lead
            </p>
            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              Give Us Your <br />
              <span className="text-blue-600">Leads</span>
            </h2>
            <p className="mt-4 text-gray-600">
              Add potential customer details to keep track of inquiries and
              follow-ups. Make sure to provide accurate contact information
              and notes for better engagement.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-gray-700">
                <FaEnvelope className="text-blue-600 mr-3" />
                <span>Company***@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaPhone className="text-blue-600 mr-3" />
                <span>+123 - 456 - 7890</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Feedback */}
              <div>
                <textarea
                  name="feedback"
                  placeholder="Your Feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 resize-none ${
                    errors.feedback
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                ></textarea>
                {errors.feedback && (
                  <p className="text-red-500 text-sm mt-1">{errors.feedback}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:scale-105 transform transition"
              >
                Submit Form →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
