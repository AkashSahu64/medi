import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
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
  FaKey
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Mock users data
const MOCK_USERS = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '9876543210',
    role: 'user',
    status: 'active',
    appointments: 5,
    lastActive: '2024-01-28',
    joinedAt: '2023-12-15',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    _id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    role: 'user',
    status: 'active',
    appointments: 3,
    lastActive: '2024-01-27',
    joinedAt: '2024-01-10',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    _id: '3',
    name: 'Dr. Arjun Mehta',
    email: 'arjun@medihope.com',
    phone: '9876543212',
    role: 'admin',
    status: 'active',
    appointments: 0,
    lastActive: '2024-01-28',
    joinedAt: '2023-11-01',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    _id: '4',
    name: 'Suresh Patel',
    email: 'suresh@example.com',
    phone: '9876543213',
    role: 'user',
    status: 'inactive',
    appointments: 2,
    lastActive: '2024-01-20',
    joinedAt: '2024-01-05',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg'
  },
  {
    _id: '5',
    name: 'Anjali Verma',
    email: 'anjali@example.com',
    phone: '9876543214',
    role: 'user',
    status: 'suspended',
    appointments: 1,
    lastActive: '2024-01-15',
    joinedAt: '2024-01-12',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    _id: '6',
    name: 'Rahul Singh',
    email: 'rahul@example.com',
    phone: '9876543215',
    role: 'user',
    status: 'active',
    appointments: 4,
    lastActive: '2024-01-28',
    joinedAt: '2024-01-08',
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
  }
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState('view');
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filters, users]);

  const loadUsers = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(MOCK_USERS);
      setFilteredUsers(MOCK_USERS);
      setLoading(false);
    }, 500);
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }

    // Filter by role
    if (filters.role !== 'all') {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(user => user._id !== id);
      setUsers(updated);
      toast.success('User deleted successfully');
    }
  };

  const handleStatusChange = (id, status) => {
    const updated = users.map(user =>
      user._id === id ? { ...user, status } : user
    );
    setUsers(updated);
    toast.success(`User ${status} successfully`);
  };

  const handleRoleChange = (id, role) => {
    const updated = users.map(user =>
      user._id === id ? { ...user, role } : user
    );
    setUsers(updated);
    toast.success(`User role updated to ${role}`);
  };

  const handleResetPassword = (id) => {
    // Implement password reset logic
    toast.success('Password reset link sent to user email');
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    therapist: 'bg-green-100 text-green-800'
  };

  return (
    <>
      <Helmet>
        <title>User Management | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage patient accounts and user permissions</p>
          </div>
          <Button>
            <FaUserPlus className="mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <FaUser className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'active').length}
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
                  {users.filter(u => u.role === 'admin').length}
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
                  {users.filter(u => u.status === 'suspended').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <FaBan className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6">
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
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => setFilters({ search: '', role: 'all', status: 'all' })}
                fullWidth
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
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
                          <FaEnvelope className="mr-2 text-gray-400" size={12} />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaPhone className="mr-2 text-gray-400" size={12} />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                          {user.role.toUpperCase()}
                        </span>
                        <div>
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusColors[user.status]}`}>
                            {user.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          {user.appointments} appointments
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendar className="mr-2" size={12} />
                          Joined: {user.joinedAt}
                        </div>
                        <div className="text-xs text-gray-500">
                          Last active: {user.lastActive}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
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

          {/* Empty State */}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">👤</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                {filters.search || filters.role !== 'all' || filters.status !== 'all'
                  ? 'Try changing your filter criteria'
                  : 'No users registered yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'view' ? 'User Details' : 'Edit User'}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Info Header */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex space-x-2 mt-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${roleColors[selectedUser.role]}`}>
                    {selectedUser.role.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[selectedUser.status]}`}>
                    {selectedUser.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                  <p className="mt-1 font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Joined Date</h4>
                  <p className="mt-1 font-medium">{selectedUser.joinedAt}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Active</h4>
                  <p className="mt-1 font-medium">{selectedUser.lastActive}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Appointments</h4>
                  <p className="mt-1 font-medium">{selectedUser.appointments}</p>
                </div>
              </div>
            </div>

            {/* Role Management */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Role Management</h4>
              <div className="flex space-x-3">
                {['user', 'admin', 'therapist'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(selectedUser._id, role)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedUser.role === role
                        ? `${roleColors[role].replace('bg-', 'bg-').replace('text-', 'text-')} border-transparent`
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {role.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Management */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Status Management</h4>
              <div className="flex space-x-3">
                {['active', 'inactive', 'suspended'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedUser._id, status)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedUser.status === status
                        ? `${statusColors[status].replace('bg-', 'bg-').replace('text-', 'text-')} border-transparent`
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              {modalType === 'edit' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success('User updated successfully');
                      setIsModalOpen(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleResetPassword(selectedUser._id)}
                  >
                    Reset Password
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminUsers;