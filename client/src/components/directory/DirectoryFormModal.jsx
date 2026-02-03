import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import {
  FaUser,
  FaPhoneAlt,
  FaSearch
} from "react-icons/fa";
import { INDIA_STATES } from "../../utils/indiaStates";

const DirectoryFormModal = ({
  isOpen,
  onClose,
  entry = null,
  type,
  onSubmit,
  loading = false
}) => {
  // ---------------- STATES ----------------
  const [formData, setFormData] = useState({
    state: "",
    name: "",
    mobile: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const [stateSearch, setStateSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ---------------- EFFECT ----------------
  useEffect(() => {
    if (entry) {
      setFormData({
        state: entry.state || "",
        name: entry.name || "",
        mobile: entry.mobile || "",
        address: entry.address || ""
      });
    } else {
      setFormData({
        state: "",
        name: "",
        mobile: "",
        address: ""
      });
    }

    setStateSearch("");
    setErrors({});
  }, [entry, isOpen]);

  // ---------------- VALIDATION ----------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      type,
      mobile: formData.mobile.replace(/\D/g, "")
    };

    onSubmit(payload, entry?._id);
  };

  // ---------------- FILTER STATES ----------------
  const filteredStates = INDIA_STATES.filter((state) =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  // ---------------- JSX ----------------
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={entry ? `Edit ${type} Entry` : `Add New ${type} Entry`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-4">

        {/* ================= STATE ================= */}
        {/* ================= STATE (SEARCH INSIDE DROPDOWN) ================= */}
<div className="relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    State <span className="text-red-500">*</span>
  </label>

  {/* Selected value box */}
  <button
    type="button"
    onClick={() => setDropdownOpen((prev) => !prev)}
    className={`w-full text-left px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary-500 ${
      errors.state ? "border-red-500" : "border-gray-300"
    }`}
  >
    {formData.state || "Select State"}
  </button>

  {/* Dropdown */}
  {dropdownOpen && (
    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
      
      {/* Search inside dropdown */}
      <div className="p-2 border-b">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search state..."
            value={stateSearch}
            onChange={(e) => setStateSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      {/* State list */}
      <div className="max-h-60 overflow-y-auto">
        {filteredStates.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            No state found
          </div>
        ) : (
          filteredStates.map((state) => (
            <div
              key={state}
              onClick={() => {
                setFormData({ ...formData, state });
                setDropdownOpen(false);
                setStateSearch("");
                if (errors.state) setErrors({ ...errors, state: "" });
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-primary-50 ${
                formData.state === state
                  ? "bg-primary-100 text-primary-700 font-medium"
                  : ""
              }`}
            >
              {state}
            </div>
          ))
        )}
      </div>
    </div>
  )}

  {errors.state && (
    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
  )}
</div>


        {/* ================= NAME ================= */}
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
          error={errors.name}
          leftIcon={<FaUser className="text-gray-400" />}
          placeholder="Enter full name"
          required
        />

        {/* ================= MOBILE ================= */}
        <Input
          label="Mobile Number"
          value={formData.mobile}
          onChange={(e) => {
            setFormData({ ...formData, mobile: e.target.value });
            if (errors.mobile) setErrors({ ...errors, mobile: "" });
          }}
          error={errors.mobile}
          leftIcon={<FaPhoneAlt className="text-gray-400" />}
          placeholder="Enter 10-digit mobile number"
          required
        />

        {/* ================= ADDRESS ================= */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
              if (errors.address) setErrors({ ...errors, address: "" });
            }}
            rows="3"
            placeholder="Enter complete address"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {entry ? "Update Entry" : "Add Entry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DirectoryFormModal;
