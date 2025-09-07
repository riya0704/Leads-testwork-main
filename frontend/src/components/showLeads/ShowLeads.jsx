import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTrash, FaChevronLeft, FaChevronRight, FaArrowLeft, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ShowLeads = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null); // for modal

  useEffect(() => {
    fetchLeads();
  }, [page]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/lead/showLeads?page=${page}&limit=10`
      );
      setLeads(res.data.leads);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching leads", err);
      toast.error("Failed to fetch leads");
    }
  };

  const updateStatus = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/lead/${id}/updateLead`,
        { status: "Contacted" }
      );
      if (res.data.success === 1) {
        toast.success(res.data.message);
        setLeads((prev) =>
          prev.map((lead) =>
            lead._id === id ? { ...lead, status: res.data.lead.status } : lead
          )
        );
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const deleteLead = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/lead/${id}/deleteLead`
      );
      if (res.data.success === 1) {
        toast.success(res.data.message);
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
        if (selectedLead?._id === id) setSelectedLead(null);
      } else {
        toast.error(res.data.error || "Failed to delete lead");
      }
    } catch (err) {
      toast.error("Error deleting lead");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Link
        to="/"
        className="absolute top-4 left-4 bg-white shadow-md rounded-full p-3 flex items-center justify-center hover:bg-gray-100 transition"
      >
        <FaArrowLeft className="text-blue-600" size={18} />
      </Link>

      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">All Leads</h2>

      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[1400px] mx-auto">
        {/* Table for desktop */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Created At</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="bg-white hover:shadow-md transition-all rounded-xl border-b border-gray-200 cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="py-3 px-6">{lead.name}</td>
                  <td className="py-3 px-6">{lead.email}</td>
                  <td className="py-3 px-6">{lead.phone}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === "New"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-6 flex justify-center items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(lead._id);
                      }}
                      disabled={lead.status === "Contacted"}
                      className={`text-lg ${
                        lead.status === "New" ? "text-green-600 hover:text-green-800" : "text-gray-400"
                      } transition`}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLead(lead._id);
                      }}
                      className="text-lg text-red-600 hover:text-red-800 transition"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards for mobile */}
        <div className="md:hidden space-y-4">
          {leads.map((lead) => (
            <div
              key={lead._id}
              className="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-200 cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{lead.name}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lead.status === "New"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{lead.email}</p>
              <p className="text-sm text-gray-600">{lead.phone}</p>
              <p className="text-sm mt-2 truncate">{lead.feedback}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center py-6 gap-4 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`p-3 rounded-full ${
              page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"
            } transition`}
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className={`p-3 rounded-full ${
              page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"
            } transition`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Modal for Lead Details */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-lg relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedLead(null)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedLead.name}</h2>
            <p><span className="font-semibold">Email:</span> {selectedLead.email}</p>
            <p><span className="font-semibold">Phone:</span> {selectedLead.phone}</p>
            <p><span className="font-semibold">Feedback:</span> {selectedLead.feedback}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedLead.status === "New"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {selectedLead.status}
              </span>
            </p>
            <p><span className="font-semibold">Created At:</span> {new Date(selectedLead.createdAt).toLocaleString()}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => updateStatus(selectedLead._id)}
                disabled={selectedLead.status === "Contacted"}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  selectedLead.status === "New"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-400 cursor-not-allowed"
                } transition`}
              >
                Mark as Contacted
              </button>
              <button
                onClick={() => deleteLead(selectedLead._id)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowLeads;
