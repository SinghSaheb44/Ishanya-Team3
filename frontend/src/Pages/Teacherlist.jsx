import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, User, LogOut, ChevronDown, X, Eye, Trash2, BarChart, Filter, Download, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const TeachersListPage = () => {
  // Sample teachers data
  const navigate = useNavigate();
  // State for UI controls
  const [teachers, setTeachers] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [searchFilter, setSearchFilter] = useState('name');
  // const [subjectFilter, setSubjectFilter] = useState('All');
  // const [cityFilter, setCityFilter] = useState('All');
  // const [sortBy, setSortBy] = useState('name');
  // const [sortOrder, setSortOrder] = useState('asc');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState({});
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'dashboard'
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [confirmDelete, setConfirmDelete] = useState(null);
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const API = import.meta.env.VITE_API_BASE_URL; // Replace with your API base URL
        const response = await axios.get(`http://127.0.0.1:8000/all-educators`);
        setTeachers(response.data); // Assuming the API returns an array of teachers
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);
  // Filter teachers based on search and other filters
  const filteredTeachers = teachers.filter(teacher => {
    // Search filter
    if (searchTerm) {
      const searchValue = searchTerm.toLowerCase();
      const fieldValue = teacher[searchFilter]?.toLowerCase() || '';
      if (!fieldValue.includes(searchValue)) return false;
    }

    // Subject filter
    if (subjectFilter !== 'All' && teacher.subject !== subjectFilter) return false;

    // City filter
    if (cityFilter !== 'All' && teacher.city !== cityFilter) return false;

    return true;
  }).sort((a, b) => {
    // Sort logic
    const aValue = a[sortBy]?.toLowerCase() || '';
    const bValue = b[sortBy]?.toLowerCase() || '';

    if (sortOrder === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });
  const navigateToDashboard = (id) => {
    navigate(`/educator-dashboard/${id}`);
  };
  // Teacher selection for details view
  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setEditedTeacher({ ...teacher });
    setIsEditMode(false);
    setIsViewMode(true);
    setIsAddMode(false);
  };

  // Close details panel
  const handleCloseDetails = () => {
    setSelectedTeacher(null);
    setIsEditMode(false);
    setIsAddMode(false);
    setIsViewMode(false);
  };

  // Handle view mode
  const handleViewClick = (teacher) => {
    setSelectedTeacher(teacher);
    setEditedTeacher({ ...teacher });
    setIsEditMode(false);
    setIsViewMode(true);
    setIsAddMode(false);
  };

  // Handle edit mode
  const handleEditClick = (teacher = null) => {
    if (teacher) {
      setSelectedTeacher(teacher);
      setEditedTeacher({ ...teacher });
    }
    setIsEditMode(true);
    setIsViewMode(false);
    setIsAddMode(false);
  };

  // Handle add new teacher mode
  const handleAddNewClick = () => {
    setIsAddMode(true);
    setSelectedTeacher(null);
    setIsEditMode(false);
    setIsViewMode(false);
    setEditedTeacher({
      id: `T${String(teachers.length + 1).padStart(3, '0')}`,
      name: '',
      role: 'Educator',
      email: '',
      dob: '',
      address: '',
      phone: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setEditedTeacher(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Mock function for saving changes/////////
  const handleSaveChanges = async () => {
    const isNew = isAddMode;
    const API = import.meta.env.VITE_API_BASE_URL;

    if (isNew) {
      try {
        console.log(editedTeacher)
        const response = await axios.post(`http://127.0.0.1:8000/add-educator/`, editedTeacher, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTeachers(prev => [...prev, { ...editedTeacher }]);
        console.log("Educator added successfully:", response.data);
      } catch (error) {
        console.error("Error adding educator:", error);
      }
    } else {
      try {
        const response = await axios.put(`http://127.0.0.1:8000/update-educator/${editedTeacher.id}`, editedTeacher, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTeachers((prev) =>
          prev.map((teacher) =>
            teacher.id === editedTeacher.id ? { ...editedTeacher } : teacher
          )
        );
        setNotification({
          type: "success",
          message: "Teacher updated successfully!",
        });
      } catch (error) {
        console.error("Error updating educator:", error);
        setNotification({
          type: "error",
          message: "Failed to update teacher. Please try again.",
        });
      }
    }
    setNotification({
      type: 'success',
      message: isNew ? 'Teacher added successfully!' : 'Teacher updated successfully!'
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);

    setIsAddMode(false);
    setIsEditMode(false);
    setIsViewMode(true);
    setSelectedTeacher(editedTeacher);
  };

  // Handle cancel action
  const handleCancel = () => {
    if (isAddMode) {
      handleCloseDetails();
    } else {
      setIsEditMode(false);
      setIsViewMode(true);
      setEditedTeacher({ ...selectedTeacher });
    }
  };

  // Handle delete action
  const handleDeleteTeacher = (teacher) => {
    setConfirmDelete(teacher);
  };

  // Confirm delete action
  const confirmDeleteTeacher = () => {
    setTeachers(prev => prev.filter(t => t.id !== confirmDelete.id));
    setNotification({
      type: 'success',
      message: 'Teacher deleted successfully!'
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);

    setConfirmDelete(null);
    handleCloseDetails();
  };

  // Cancel delete action
  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  // Get statistics for dashboard
  const getStatistics = () => {
    const totalTeachers = teachers.length;
    const subjectCounts = {};
    const cityCounts = {};

    teachers.forEach(teacher => {
      // Count by subject
      subjectCounts[teacher.subject] = (subjectCounts[teacher.subject] || 0) + 1;

      // Count by city
      cityCounts[teacher.city] = (cityCounts[teacher.city] || 0) + 1;
    });

    return {
      totalTeachers,
      subjectCounts,
      cityCounts
    };
  };

  const stats = getStatistics();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white text-indigo-700 p-2 rounded-lg shadow-md">
              <User className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Teachers Management</h1>
          </div>

          {/* Admin profile dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none rounded-full p-1 transition-all hover:bg-indigo-600"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-white text-indigo-700 flex items-center justify-center shadow-md">
                <span className="font-semibold">A</span>
              </div>
              <span className="font-medium">Admin</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-10 border border-gray-200 text-gray-700">
                <button
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition duration-150"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition duration-150"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg border flex items-center space-x-3 transition-all transform translate-y-0 ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="font-medium">{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-auto text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}


      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}


        {activeTab === 'list' && (
          <>
            {/* Search, filter and actions bar */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <div className="relative flex-1">
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search teachers..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    {searchTerm && (
                      <button
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setSearchTerm('')}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Search field filter dropdown */}
                  <div className="ml-2 relative">
                    <button
                      className="px-4 py-3 border border-gray-300 rounded-lg bg-white flex items-center space-x-1 hover:bg-gray-50 transition duration-150 shadow-sm"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      <span className="capitalize">Filter: {searchFilter}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                        {['name', 'id', 'subject', 'email'].map(filter => (
                          <button
                            key={filter}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition duration-150 ${searchFilter === filter ? 'text-indigo-600 font-medium bg-indigo-50' : 'text-gray-700'}`}
                            onClick={() => { setSearchFilter(filter); setIsFilterOpen(false); }}
                          >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional filters */}
                <div className="flex mt-3 space-x-3">
                  


                  <div className="relative">
                    <select
                      className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="id">Sort by ID</option>

                      <option value="joinDate">Sort by Join Date</option>
                    </select>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>

                    <button
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      title={`Currently: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
                  onClick={handleAddNewClick}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Add Teacher</span>
                </button>


              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
              {/* Teachers list */}
              <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h2 className="text-lg font-medium text-gray-900">Teachers List</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} found
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <tr
                            key={teacher.id}
                            className={`hover:bg-gray-50 transition duration-150 cursor-pointer ${selectedTeacher?.id === teacher.id ? 'bg-indigo-50' : ''}`}
                            onClick={() => handleTeacherSelect(teacher)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                  <span className="font-medium text-sm">{teacher.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                                  <p className="text-xs text-gray-500">{teacher.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full">
                                {teacher.joinDate}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <div className="flex justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => handleViewClick(teacher)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEditClick(teacher)}
                                  className="p-1.5 text-indigo-600 hover:text-indigo-800 rounded hover:bg-indigo-50 transition-colors"
                                  title="Edit Teacher"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => navigateToDashboard(teacher.id)}
                                  className="p-1.5 text-green-600 hover:text-green-800 rounded hover:bg-green-50 transition-colors"
                                  title="Go to Dashboard"
                                >
                                  <BarChart className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                              </svg>
                              <p className="text-lg font-medium text-gray-900 mb-1">No teachers found</p>
                              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Teacher details/edit panel */}
              {(selectedTeacher || isAddMode) ? (
                <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-medium text-gray-900">
                      {isAddMode ? "Add New Teacher" : isEditMode ? "Edit Teacher" : "Teacher Details"}
                    </h2>
                    <button
                      className="p-1.5 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors"
                      onClick={handleCloseDetails}
                      title="Close Details"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {isViewMode && !isEditMode && (
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
                          <span className="font-bold text-xl">{selectedTeacher.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{selectedTeacher.name}</h3>
                          <p className="text-indigo-600 font-medium">{selectedTeacher.subject} Teacher</p>
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Basic Information</h4>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 text-gray-600">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <span>{selectedTeacher.email}</span>
                          </div>

                          <div className="flex items-center space-x-3 text-gray-600">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span>{selectedTeacher.phone}</span>
                          </div>

                          <div className="flex items-center space-x-3 text-gray-600">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span>{selectedTeacher.address}</span>
                          </div>

                          <div className="flex items-center space-x-3 text-gray-600">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span>Joined on {formatDate(selectedTeacher.joinDate)}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-gray-600">
                            {/* <Calendar className="h-5 w-5 text-gray-400" /> */}
                            <span><b>Course ID:</b> {selectedTeacher.course_id}</span>
                          </div>
                        </div>
                      </div>



                      <div className="mt-8 flex space-x-3">
                        <button
                          onClick={() => handleEditClick()}
                          className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </button>


                      </div>
                    </div>
                  )}

                  {(isEditMode || isAddMode) && (
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                            value={"Educator"}
                            onChange={(e) => handleFieldChange("role", e.target.value)}
                            disabled={!isAddMode}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teacher ID
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
                            value={editedTeacher.id || ''}
                            onChange={(e) => handleFieldChange('id', e.target.value)}
                            disabled={!isAddMode}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={editedTeacher.name || ''}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            placeholder="Enter full name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={editedTeacher.email || ''}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            placeholder="Enter email address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact
                          </label>
                          <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={editedTeacher.phone || ''}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            placeholder="Enter contact number"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={editedTeacher.address || ''}
                            onChange={(e) => handleFieldChange('address', e.target.value)}
                            placeholder="Enter Address"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date Of Birth
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={editedTeacher.dob || ''}
                            onChange={(e) => handleFieldChange('dob', e.target.value)}

                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Join Date
                          </label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={editedTeacher.joinDate || ''}
                            onChange={(e) => handleFieldChange('joinDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course ID
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={editedTeacher.course_id || ''}
                            onChange={(e) => handleFieldChange('course_id', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex space-x-3">
                        <button
                          onClick={handleSaveChanges}
                          className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Save Changes
                        </button>

                        <button
                          onClick={handleCancel}
                          className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md p-6 border border-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-indigo-100 mx-auto rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Teacher Selected</h3>
                    <p className="text-gray-500 mb-6">Select a teacher from the list to view details or click the Add button to create a new teacher.</p>
                    <button
                      onClick={handleAddNewClick}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Teacher
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Teachers</p>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cities</p>
                    <h3 className="text-2xl font-bold text-gray-900">{Object.keys(stats.cityCounts).length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Subjects</p>
                    <h3 className="text-2xl font-bold text-gray-900">{Object.keys(stats.subjectCounts).length}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Teachers by Subject</h3>
              <div className="space-y-3">
                {Object.entries(stats.subjectCounts).map(([subject, count]) => {
                  const percentage = Math.round((count / stats.totalTeachers) * 100);
                  return (
                    <div key={subject}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{subject}</span>
                        <span className="text-sm text-gray-500">{count} teachers ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* City Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Teachers by City</h3>
              <div className="space-y-3">
                {Object.entries(stats.cityCounts).map(([city, count]) => {
                  const percentage = Math.round((count / stats.totalTeachers) * 100);
                  return (
                    <div key={city}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{city}</span>
                        <span className="text-sm text-gray-500">{count} teachers ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} School Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TeachersListPage;
