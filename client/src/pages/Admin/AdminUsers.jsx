import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import {
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaShieldAlt,
  FaBan,
  FaCheck,
  FaEye,
  FaKey,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { userService } from "../../services/user.service";

// Helper functions for avatar
const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return (
    parts[0][0]?.toUpperCase() +
    parts[1][0]?.toUpperCase()
  );
};

const avatarColors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-cyan-500",
];

const getAvatarColor = (name = "") => {
  if (!name || name.trim() === "") return avatarColors[0];
  const index =
    name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;
  return avatarColors[index];
};

// Avatar Component
const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-20 h-20 text-xl",
  };

  const initials = getInitials(user?.name);
  const colorClass = getAvatarColor(user?.name);

  return (
    <div
      className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-bold`}
    >
      {initials}
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState("view");
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user",
    status: "active",
  });
  const [editUser, setEditUser] = useState({});
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    suspendedUsers: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filters, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log("🔄 Loading users...");

      const response = await userService.getUsers();
      console.log("✅ Users loaded:", response.data?.length || 0, "users");

      if (response.data) {
        setUsers(response.data);
        setFilteredUsers(response.data);
      } else {
        console.error("❌ No data in response:", response);
        toast.error("No user data received");
      }
    } catch (error) {
      console.error("❌ Failed to load users:", error);
      console.error("❌ Error response:", error.response);

      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to view users.");
      } else {
        toast.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await userService.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.phone && user.phone.includes(term)),
      );
    }

    if (filters.role !== "all") {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  };

  const validateForm = (userData) => {
    const errors = {};

    if (!userData.name?.trim()) {
      errors.name = "Name is required";
    }

    if (!userData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = "Invalid email format";
    }

    if (!userData.phone?.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(userData.phone.replace(/\D/g, ""))) {
      errors.phone = "Invalid phone number (10 digits required)";
    }

    return errors;
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalType("view");
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    });
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(id);

        const updated = users.filter((user) => user._id !== id);
        setUsers(updated);

        toast.success("User deleted successfully");
        loadStats();
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await userService.updateUser(id, { status });

      const updated = users.map((user) =>
        user._id === id ? { ...user, status } : user,
      );
      setUsers(updated);

      toast.success(`User ${status} successfully`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await userService.updateUser(id, { role });

      const updated = users.map((user) =>
        user._id === id ? { ...user, role } : user,
      );
      setUsers(updated);

      toast.success(`User role updated to ${role}`);
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await userService.resetPassword(id);
      toast.success("Password reset link sent to user email");
    } catch (error) {
      console.error("Failed to reset password:", error);
      toast.error("Failed to reset password");
    }
  };

  const handleAddUser = async () => {
    const errors = validateForm(newUser);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      console.log("🔄 Creating user with data:", newUser);

      const response = await userService.createUser(newUser);
      console.log("✅ User created successfully:", response);

      await loadUsers();
      await loadStats();

      toast.success("User added successfully");
      setIsModalOpen(false);

      setNewUser({
        name: "",
        email: "",
        phone: "",
        role: "user",
        status: "active",
      });
      setFormErrors({});
    } catch (error) {
      console.error("❌ Failed to add user:", error);
      console.error("❌ Error details:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add user";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    const errors = validateForm(editUser);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await userService.updateUser(selectedUser._id, editUser);

      await loadUsers();

      toast.success("User updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update user";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    suspended: "bg-red-100 text-red-800",
  };

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    user: "bg-cyan-100 text-cyan-800",
    therapist: "bg-green-100 text-green-800",
  };

  const renderModalContent = () => {
    if (modalType === "add") {
      return (
        <div className="space-y-4 mx-4 mb-4">
          <Input
            label="Name"
            value={newUser.name}
            onChange={(e) => {
              setNewUser({ ...newUser, name: e.target.value });
              if (formErrors.name) setFormErrors({ ...formErrors, name: "" });
            }}
            error={formErrors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => {
              setNewUser({ ...newUser, email: e.target.value });
              if (formErrors.email) setFormErrors({ ...formErrors, email: "" });
            }}
            error={formErrors.email}
            required
          />

          <Input
            label="Phone"
            value={newUser.phone}
            onChange={(e) => {
              setNewUser({ ...newUser, phone: e.target.value });
              if (formErrors.phone) setFormErrors({ ...formErrors, phone: "" });
            }}
            error={formErrors.phone}
            required
          />

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Role</h4>
            <div className="flex space-x-3">
              {["user", "admin", "therapist"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setNewUser({ ...newUser, role })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    newUser.role === role
                      ? `${roleColors[role]} border-transparent font-medium`
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">Status</h4>
            <div className="flex space-x-3">
              {["active", "inactive", "suspended"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setNewUser({ ...newUser, status })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    newUser.status === status
                      ? `${statusColors[status]} border-transparent font-medium`
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setNewUser({
                  name: "",
                  email: "",
                  phone: "",
                  role: "user",
                  status: "active",
                });
                setFormErrors({});
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleAddUser} loading={submitting}>
              Add User
            </Button>
          </div>
        </div>
      );
    }

    if (selectedUser && modalType === "edit") {
      return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-4">
          <div className="flex items-center space-x-4">
            <UserAvatar user={selectedUser} size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedUser.name}
              </h3>
              <p className="text-gray-600">{selectedUser.email}</p>
              <div className="flex space-x-2 mt-2">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${roleColors[selectedUser.role]}`}
                >
                  {selectedUser.role.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[selectedUser.status]}`}
                >
                  {selectedUser.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                label="Name"
                value={editUser.name}
                onChange={(e) => {
                  setEditUser({ ...editUser, name: e.target.value });
                  if (formErrors.name)
                    setFormErrors({ ...formErrors, name: "" });
                }}
                error={formErrors.name}
                required
              />
              <Input
                label="Email"
                type="email"
                value={editUser.email}
                onChange={(e) => {
                  setEditUser({ ...editUser, email: e.target.value });
                  if (formErrors.email)
                    setFormErrors({ ...formErrors, email: "" });
                }}
                error={formErrors.email}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Phone"
                value={editUser.phone}
                onChange={(e) => {
                  setEditUser({ ...editUser, phone: e.target.value });
                  if (formErrors.phone)
                    setFormErrors({ ...formErrors, phone: "" });
                }}
                error={formErrors.phone}
                required
              />
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">
                  Joined Date
                </h4>
                <p className="font-medium w-full py-2 px-4 border border-gray-200 rounded-lg">
                  {selectedUser.joinedAt || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Role Management
            </h4>
            <div className="flex space-x-3">
              {["user", "admin", "therapist"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setEditUser({ ...editUser, role })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    editUser.role === role
                      ? `${roleColors[role]} border-transparent font-medium`
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Status Management
            </h4>
            <div className="flex space-x-3">
              {["active", "inactive", "suspended"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setEditUser({ ...editUser, status })}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    editUser.status === status
                      ? `${statusColors[status]} border-transparent font-medium`
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUser} loading={submitting}>
              Save Changes
            </Button>
          </div>
        </div>
      );
    }

    if (selectedUser && modalType === "view") {
      return (
        <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-4">
          <div className="flex items-center space-x-4">
            <UserAvatar user={selectedUser} size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedUser.name}
              </h3>
              <p className="text-gray-600">{selectedUser.email}</p>
              <div className="flex space-x-2 mt-2">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${roleColors[selectedUser.role]}`}
                >
                  {selectedUser.role.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[selectedUser.status]}`}
                >
                  {selectedUser.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Phone Number
                </h4>
                <p className="mt-1 font-medium">
                  {selectedUser.phone || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Joined Date
                </h4>
                <p className="mt-1 font-medium">
                  {selectedUser.joinedAt || "N/A"}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Last Active
                </h4>
                <p className="mt-1 font-medium">
                  {selectedUser.lastActive || "N/A"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Total Appointments
                </h4>
                <p className="mt-1 font-medium">
                  {selectedUser.appointments || 0}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Role Management
            </h4>
            <div className="flex space-x-3">
              {["user", "admin", "therapist"].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(selectedUser._id, role)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedUser.role === role
                      ? `${roleColors[role]} border-transparent font-medium`
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Status Management
            </h4>
            <div className="flex space-x-3">
              {["active", "inactive", "suspended"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(selectedUser._id, status)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedUser.status === status
                      ? `${statusColors[status]} border-transparent font-medium`
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleResetPassword(selectedUser._id)}>
              Reset Password
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>User Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage patient accounts and user permissions
            </p>
          </div>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setModalType("add");
              setIsModalOpen(true);
              setFormErrors({});
            }}
          >
            <FaUserPlus className="mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <FaUser className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeUsers}
                </p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <FaCheck className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Admin Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.adminUsers}
                </p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FaShieldAlt className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.suspendedUsers}
                </p>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <FaBan className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
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
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) =>
                  setFilters({ ...filters, role: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">Patient</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-end my-1.5">
              <Button
                variant="secondary"
                onClick={() => {
                  setFilters({ search: "", role: "all", status: "all" });
                  loadUsers();
                }}
                fullWidth
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <FaSpinner className="animate-spin text-2xl text-primary-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role & Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <UserAvatar user={user} size="md" />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaEnvelope
                              className="mr-2 text-gray-400"
                              size={12}
                            />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaPhone className="mr-2 text-gray-400" size={12} />
                            {user.phone || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}
                          >
                            {user.role.toUpperCase()}
                          </span>
                          <div>
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColors[user.status]}`}
                            >
                              {user.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            {user.appointments || 0} appointments
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendar className="mr-2" size={12} />
                            Joined: {user.joinedAt || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Last active: {user.lastActive || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(user)}
                            className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            title="Edit User"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Reset Password"
                          >
                            <FaKey />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete User"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                {filters.search ||
                filters.role !== "all" ||
                filters.status !== "all"
                  ? "Try changing your filter criteria"
                  : "No users registered yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormErrors({});
        }}
        title={
          modalType === "view"
            ? "User Details"
            : modalType === "edit"
              ? "Edit User"
              : "Add New User"
        }
        size="lg"
      >
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default AdminUsers;