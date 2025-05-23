import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationService, type Application } from '../../services/ApplicationService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load applications
    fetchApplications();
  }, []);

  useEffect(() => {
    // Apply filters when applications, searchTerm or categoryFilter changes
    filterApplications();
  }, [applications, searchTerm, categoryFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await ApplicationService.getInstance().getApplications();
      setApplications(data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let result = [...applications];

    // Filter by category
    if (categoryFilter !== 'all') {
      result = result.filter(app => app.category === categoryFilter);
    }

    // Filter by search term (registration number)
    if (searchTerm.trim()) {
      result = result.filter(app => 
        app.registration_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(result);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate anyway in case of error
      navigate('/admin/login');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await ApplicationService.getInstance().deleteApplication(parseInt(id));
        // Refresh the list
        fetchApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/view/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">BAFCC Admin Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user?.full_name || user?.username}</span>
            <button 
              onClick={handleLogout} 
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-semibold mb-4 md:mb-0">Applications</h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Search by registration number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="w-full md:w-auto">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="u-11">Under-11</option>
                  <option value="u-13">Under-13</option>
                  <option value="u-15">Under-15</option>
                  <option value="u-17">Under-17</option>
                  <option value="open">Open</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center p-6">
              <p>Loading applications...</p>
            </div>
          ) : (
            <>
              {filteredApplications.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">No applications found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration No.
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {app.registration_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {app.image_url ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={app.image_url}
                                    alt={app.name}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://via.placeholder.com/40?text=N/A';
                                    }}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">{app.name.charAt(0)}</span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{app.name}</div>
                                <div className="text-sm text-gray-500">{app.age} years</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {app.category.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.mobile_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewDetails(app.id?.toString() || '')}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEdit(app.id?.toString() || '')}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(app.id?.toString() || '')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 