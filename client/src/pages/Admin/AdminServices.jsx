import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { serviceService } from "../../services/service.service";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaClock,
  FaRupeeSign,
  FaStar,
  FaCheck,
  FaTimes,
  FaSync,
  FaSpinner,
} from "react-icons/fa";
import {
  SERVICE_CATEGORIES,
  SERVICE_CATEGORY_LABELS,
} from "../../utils/constants";
import toast from "react-hot-toast";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalType, setModalType] = useState("create");
  const [submitting, setSubmitting] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    isActive: "all",
    featured: "all",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      console.log("🔄 Loading services with filters:", filters);

      const response = await serviceService.getAllServicesForAdmin({
        search: filters.search || undefined,
        category: filters.category !== "all" ? filters.category : undefined,
        isActive: filters.isActive !== "all" ? filters.isActive : undefined,
        featured: filters.featured !== "all" ? filters.featured : undefined,
      });

      console.log("✅ Services loaded:", response);

      if (response.success && response.data) {
        setServices(response.data);
      } else {
        console.error("❌ Failed to load services:", response.message);
        toast.error(response.message || "Failed to load services");
      }
    } catch (error) {
      console.error("❌ Error loading services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
    toast.success("Services refreshed");
  };

  const handleCreate = () => {
    setSelectedService(null);
    setModalType("create");
    reset({
      title: "",
      description: "",
      category: SERVICE_CATEGORIES.MUSCULOSKELETAL,
      duration: 30,
      price: "",
      benefits: "",
      featured: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setModalType("edit");
    reset({
      title: service.title,
      description: service.description,
      category: service.category,
      duration: service.duration,
      price: service.price,
      benefits: service.benefits?.join("\n") || "",
      featured: service.featured,
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this service permanently?",
      )
    ) {
      try {
        const response = await serviceService.deleteService(id);

        if (response.success) {
          // Remove from local state
          setServices(services.filter((s) => s._id !== id));
          toast.success(response.message || "Service deleted successfully");
        } else {
          toast.error(response.message || "Failed to delete service");
        }
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service");
      }
    }
  };

  const handleStatusToggle = async (service) => {
    try {
      const response = await serviceService.updateService(service._id, {
        isActive: !service.isActive,
      });

      if (response.success) {
        // Update local state
        const updated = services.map((s) =>
          s._id === service._id ? { ...s, isActive: !service.isActive } : s,
        );
        setServices(updated);

        toast.success(
          `Service ${!service.isActive ? "activated" : "deactivated"}`,
        );
      } else {
        toast.error(response.message || "Failed to update service status");
      }
    } catch (error) {
      console.error("Error updating service status:", error);
      toast.error("Failed to update service status");
    }
  };

  const handleFeaturedToggle = async (service) => {
    try {
      const response = await serviceService.updateService(service._id, {
        featured: !service.featured,
      });

      if (response.success) {
        // Update local state
        const updated = services.map((s) =>
          s._id === service._id ? { ...s, featured: !service.featured } : s,
        );
        setServices(updated);

        toast.success(
          `Service ${!service.featured ? "marked as featured" : "removed from featured"}`,
        );
      } else {
        toast.error(response.message || "Failed to update featured status");
      }
    } catch (error) {
      console.error("Error updating featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      if (modalType === "create") {
        const response = await serviceService.createService(data);

        if (response.success) {
          // Add new service to the list
          setServices([response.data, ...services]);
          toast.success(response.message || "Service created successfully");
          setIsModalOpen(false);
        } else {
          toast.error(response.message || "Failed to create service");
        }
      } else {
        const response = await serviceService.updateService(
          selectedService._id,
          data,
        );

        if (response.success) {
          // Update local state
          const updated = services.map((s) =>
            s._id === selectedService._id ? response.data : s,
          );
          setServices(updated);
          toast.success(response.message || "Service updated successfully");
          setIsModalOpen(false);
        } else {
          toast.error(response.message || "Failed to update service");
        }
      }
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error(error.message || "Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    ...Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <>
      <Helmet>
        <title>Services Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Services Management
            </h1>
            <p className="text-gray-600">
              Manage all physiotherapy services and treatments
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <FaSpinner className="mr-2 animate-spin" />
              ) : (
                <FaSync className="mr-2" />
              )}
              Refresh
            </Button>
            <Button onClick={handleCreate}>
              <FaPlus className="mr-2" />
              Add New Service
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.isActive}
                onChange={(e) =>
                  setFilters({ ...filters, isActive: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="flex items-end space-x-2 my-1.5">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters({
                    search: "",
                    category: "all",
                    isActive: "all",
                    featured: "all",
                  });
                }}
                className="flex-1 text-[13px] lg:text-[14px] px-1 py-2"
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
              <Button
                onClick={loadServices}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <FaSpinner className="mr-2 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size="lg" />
            <span className="ml-3 text-gray-600">Loading services...</span>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-6">🩺</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search ||
              filters.category !== "all" ||
              filters.isActive !== "all" ||
              filters.featured !== "all"
                ? "Try changing your filter criteria"
                : "No services added yet"}
            </p>
            <Button onClick={handleCreate}>
              <FaPlus className="mr-2" />
              Add Your First Service
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
              <p className="text-gray-600 text-sm sm:text-base">
                Showing <span className="font-semibold">{services.length}</span>{" "}
                services
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="w-full sm:w-auto"
              >
                <FaSync
                  className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh List
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {/* Service Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    {/* Top Row (Desktop) */}
                    <div className="hidden sm:flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                          {SERVICE_CATEGORY_LABELS[service.category] ||
                            service.category}
                        </span>

                        {service.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}

                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            service.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleStatusToggle(service)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${
                          service.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            service.isActive ? "left-5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {service.title}
                    </h3>

                    {/* Bottom Row (Mobile) */}
                    <div className="flex sm:hidden items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {service.featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                            Featured
                          </span>
                        )}

                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            service.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleStatusToggle(service)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${
                          service.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            service.isActive ? "left-5" : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 lg:mt-0 mt-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-xs" />
                        {service.duration} mins
                      </div>

                      <div className="flex items-center font-semibold text-gray-900 whitespace-nowrap">
                        <FaRupeeSign className="mr-1" />
                        {service.price}
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {service.benefits?.slice(0, 3).map((benefit, index) => (
                        <li
                          key={index}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <FaCheck className="text-green-500 mr-2 mt-0.5 text-xs flex-shrink-0" />
                          <span className="break-words">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="p-1 sm:p-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="px-1 lg:px-3 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg text-sm font-medium flex items-center justify-center"
                        >
                          <FaEdit className="mr-2" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(service._id)}
                          className="px-1 lg:px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center justify-center"
                        >
                          <FaTrash className="mr-2" />
                          Delete
                        </button>

                        <button
                          onClick={() => handleFeaturedToggle(service)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg flex items-center justify-center"
                          title={
                            service.featured
                              ? "Remove from featured"
                              : "Mark as featured"
                          }
                        >
                          {service.featured ? <FaTimes /> : <FaStar />}
                        </button>
                      </div>

                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        Created:{" "}
                        {new Date(service.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === "create" ? "Add New Service" : "Edit Service"}
        size="lg"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 px-4 md:px-6 mb-4"
        >
          <Input
            label="Service Title"
            type="text"
            placeholder="Enter service title"
            error={errors.title?.message}
            required
            {...register("title", {
              required: "Service title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter service description"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                {...register("category", { required: "Category is required" })}
              >
                {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => (
                  <option key={value} value={value}>
                    {SERVICE_CATEGORY_LABELS[value]}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="120"
                step="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register("duration", {
                  required: "Duration is required",
                  min: { value: 15, message: "Minimum 15 minutes" },
                  max: { value: 120, message: "Maximum 120 minutes" },
                })}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register("isActive")}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits (Add each benefit on a new line)
            </label>
            <textarea
              rows={4}
              placeholder="Enter benefits, one per line...
Example:
Relief from back pain
Improved mobility
Personalized treatment plan"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              {...register("benefits", {
                required: "At least one benefit is required",
              })}
            />
            {errors.benefits && (
              <p className="mt-1 text-sm text-red-600">
                {errors.benefits.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Each line will be treated as a separate benefit
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              {...register("featured")}
            />
            <label
              htmlFor="featured"
              className="ml-2 block text-sm text-gray-700"
            >
              Mark as featured service
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {modalType === "create" ? "Create Service" : "Update Service"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminServices;
