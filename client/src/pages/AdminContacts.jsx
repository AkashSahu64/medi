// pages/AdminContacts.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaCalendar,
  FaCheck,
  FaReply,
  FaArchive,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
  FaSync,
  FaSpinner,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { contactService } from '../services/contact.service';
import { formatDate, getStatusColor, getStatusText } from '../utils/helpers';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    unread: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadContacts();
  }, [filters]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const response = await contactService.getContacts(filters);
      
      if (response.success) {
        setContacts(response.data);
        setStats(response.stats);
        setPagination(response.pagination);
      } else {
        toast.error(response.message || 'Failed to load contacts');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

 const handleViewContact = async (contact) => {
  setSelectedContact(contact);
  setIsModalOpen(true);
  
  // Immediate optimistic update for UI
  const wasUnread = !contact.isRead;
  
  if (wasUnread) {
    // Optimistic update first
    const updatedContacts = contacts.map(c => 
      c._id === contact._id ? { ...c, isRead: true, status: 'read' } : c
    );
    setContacts(updatedContacts);
    
    // Optimistic update stats
    setStats(prev => ({ 
      ...prev, 
      unread: Math.max(0, prev.unread - 1),
      new: Math.max(0, prev.new - 1)
    }));
    
    // Trigger event to update dashboard and sidebar
    window.dispatchEvent(new CustomEvent('contactUpdated', { 
      detail: { action: 'read', contactId: contact._id } 
    }));
  }
  
  // Then call API
  try {
    await contactService.markContactAsRead(contact._id);
    console.log('✅ Marked as read in backend');
  } catch (error) {
    console.error('Error marking as read:', error);
    // Revert optimistic update if API fails
    if (wasUnread) {
      setContacts(prev => prev.map(c => 
        c._id === contact._id ? { ...c, isRead: false, status: contact.status } : c
      ));
      setStats(prev => ({ 
        ...prev, 
        unread: prev.unread + 1,
        new: prev.new + 1
      }));
    }
  }
};

  const handleStatusChange = async (contactId, status) => {
    setActionLoading(true);
    try {
      const response = await contactService.updateContactStatus(contactId, status);
      
      if (response.success) {
        setContacts(prev => prev.map(contact => 
          contact._id === contactId ? response.data : contact
        ));
        
        // Update stats
        if (status === 'read' && selectedContact?.isRead === false) {
          setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
        }
        
        toast.success(`Message marked as ${status}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await contactService.deleteContact(contactId);
        
        if (response.success) {
          setContacts(prev => prev.filter(contact => contact._id !== contactId));
          setStats(prev => ({ ...prev, total: prev.total - 1 }));
          toast.success('Message deleted');
          
          if (selectedContact?._id === contactId) {
            setIsModalOpen(false);
          }
        }
      } catch (error) {
        toast.error('Failed to delete message');
      }
    }
  };

const handleReply = (contact) => {
  const subject = `Re: ${contact.subject}`;
  const body = `\n\n--- Original Message ---\nFrom: ${contact.name} <${contact.email}>\nSubject: ${contact.subject}\nMessage: ${contact.message}\n`;
  
  // Use window.location.href for mailto links
  const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
  
  // Mark as replied after a short delay
  setTimeout(() => {
    handleStatusChange(contact._id, 'replied');
  }, 1000);
};

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-red-500', 'bg-green-500', 'bg-blue-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const statusOptions = [
    { value: 'all', label: 'All Messages', icon: FaEnvelope },
    { value: 'new', label: 'New', icon: FaExclamationCircle, color: 'text-red-600' },
    { value: 'read', label: 'Read', icon: FaCheckCircle, color: 'text-blue-600' },
    { value: 'replied', label: 'Replied', icon: FaReply, color: 'text-green-600' },
    { value: 'archived', label: 'Archived', icon: FaArchive, color: 'text-gray-600' }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Messages | MEDIHOPE Admin</title>
      </Helmet>

      <div className="space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600">Manage all incoming messages from patients and visitors</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={loadContacts}
              variant="outline"
              leftIcon={<FaSync />}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              onClick={() => {
                setFilters({
                  search: '',
                  status: 'all',
                  page: 1,
                  limit: 20,
                  sortBy: 'createdAt',
                  sortOrder: 'desc'
                });
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-cyan-100 text-cyan-600 rounded-lg">
                <FaEnvelope className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
              <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                <FaExclamationCircle className="text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <FaCheck className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Messages
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, subject..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters({ ...filters, search: '', page: 1 })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="createdAt">Date</option>
                <option value="name">Name</option>
                <option value="subject">Subject</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value, page: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              const isActive = filters.status === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, status: option.value, page: 1 })}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <Icon className={`mr-2 ${isActive ? 'text-white' : option.color || 'text-gray-500'}`} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <FaSpinner className="animate-spin text-2xl text-primary-600" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📭</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No messages found
              </h3>
              <p className="text-gray-600">
                {filters.search || filters.status !== 'all'
                  ? 'Try changing your filter criteria'
                  : 'No contact messages yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <motion.tr
                      key={contact._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-gray-50 cursor-pointer ${!contact.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => handleViewContact(contact)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full ${getAvatarColor(contact.name)} flex items-center justify-center mr-3`}>
                            <span className="text-white font-bold text-sm">
                              {getInitials(contact.name)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {contact.name}
                              {!contact.isRead && (
                                <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <FaEnvelope className="mr-1" size={12} />
                              {contact.email}
                            </div>
                            {contact.phone && (
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <FaPhone className="mr-1" size={12} />
                                {contact.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {contact.subject}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {contact.message}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                          {getStatusText(contact.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendar className="mr-2" size={12} />
                          {formatDate(contact.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewContact(contact);
                            }}
                            className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(contact);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Reply"
                          >
                            <FaReply />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(contact._id, 'archived');
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            title="Archive"
                          >
                            <FaArchive />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contact._id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
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

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.total}</span> messages
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    size="sm"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? 'primary' : 'outline'}
                        onClick={() => setFilters({ ...filters, page: pageNum })}
                        size="sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    size="sm"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Message Details"
        size="xl"
      >
        {selectedContact && (
          <div className="space-y-6 p-6">
            {/* Sender Info */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-primary-600" />
                Sender Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {selectedContact.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1 ${getStatusColor(selectedContact.status)}`}>
                    {getStatusText(selectedContact.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaEnvelope className="mr-2 text-primary-600" />
                Message
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-gray-900 text-lg">
                    {selectedContact.subject}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200 whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <FaCalendar className="mr-2" />
                  Received: {formatDate(selectedContact.createdAt, 'EEEE, dd MMMM yyyy • hh:mm a')}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedContact._id)}
                  icon={<FaTrash />}
                >
                  Delete
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedContact._id, 'archived')}
                  variant="outline"
                  icon={<FaArchive />}
                >
                  Archive
                </Button>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleReply(selectedContact)}
                  icon={<FaReply />}
                >
                  Reply via Email
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AdminContacts;