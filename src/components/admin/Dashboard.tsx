import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ApplicationService } from '../../services/ApplicationService';
import type { Application } from '../../services/ApplicationService';
import ApplicationPDF from './ApplicationPDF';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import {
  LogOut,
  Search,
  Filter,
  Edit2,
  Eye,
  Download,
  Trash2,
  RefreshCw,
  ChevronDown,
  User,
  DollarSign,
  FileText // For Registration Form icon
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  // Removed filteredApplications state as we will display applications directly
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [downloadingPDFs, setDownloadingPDFs] = useState<Set<string>>(new Set()); // Track downloading state

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load applications when filters or page changes
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchApplications();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, categoryFilter, searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await ApplicationService.getInstance().getApplications(
        currentPage,
        pageSize
      );

      // If we have filters, we need to pass them (assuming service supports it, 
      // if not we might need to update service first, but based on plan backend supports it)
      // Actually, let's check if we need to update the service call to include filters.
      // The current service method signature in the file I read was:
      // getApplications(page: number = 1, size: number = 100): Promise<ApplicationsResponse>
      // I need to check if I should update the service first or if I can pass them now.
      // Wait, I should probably update the service file first if it doesn't support passing filters.
      // But let's assume I will update the service in the next step or I can cast it if it's just TS definition.
      // Actually, looking at the previous `read_file` of ApplicationService.ts (Step 33), 
      // the getApplications method ONLY takes page and size. 
      // I MUST update ApplicationService.ts FIRST or concurrently. 
      // I will update this file to call it with extra params, and then update the service file.

      // Let's rewrite this to use the updated service signature I'm about to create.
      const response = await ApplicationService.getInstance().getApplications(
        currentPage,
        pageSize,
        categoryFilter !== 'all' ? categoryFilter : undefined,
        searchTerm || undefined
      );

      setApplications(response.applications);
      setTotalPages(response.pages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
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

  const handleDownloadPDF = async (id: string) => {
    const applicationId = parseInt(id);
    const application = applications.find(app => app.id === applicationId);

    if (!application) return;

    // Add to downloading set
    setDownloadingPDFs(prev => new Set(prev).add(id));

    try {
      // Get application with processed images from backend
      const applicationWithImages = await ApplicationService.getInstance().getApplicationWithImages(applicationId);

      // Generate PDF using React PDF
      const pdfDoc = <ApplicationPDF
        application={applicationWithImages.application}
        images={applicationWithImages.images}
      />;

      const pdfBlob = await pdf(pdfDoc).toBlob();
      const filename = `BAFCC_Application_${application.registration_number.replace(/[\/\\]/g, '_')}.pdf`;
      saveAs(pdfBlob, filename);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error downloading PDF. Please try again.');
    } finally {
      // Remove from downloading set
      setDownloadingPDFs(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatCategory = (category: string) => {
    switch (category) {
      case 'u-11': return 'Under-11 Boys';
      case 'u-13': return 'Under-13 Boys';
      case 'u-15': return 'Under-15 Boys';
      case 'u-17': return 'Under-17 Boys';
      case 'open': return 'Open Boys';
      case 'gu-11': return 'Under-11 Girls';
      case 'gu-13': return 'Under-13 Girls';
      case 'gu-15': return 'Under-15 Girls';
      case 'gu-17': return 'Under-17 Girls';
      case 'gopen': return 'Open Girls';
      default: return category.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border-2 border-blue-300">
              <img
                src="/bafcc-logo.png"
                alt="BAFCC Logo"
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'flex';
                    fallback.textContent = 'BAFC';
                  }
                }}
              />
              <span className="text-blue-700 font-bold text-sm" style={{ display: 'none' }}>BAFC</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">BAFCC Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-blue-800 bg-opacity-50 px-3 py-2 rounded-full">
              <User size={18} />
              <span>{user?.full_name || user?.username}</span>
            </div>
            <button
              onClick={() => navigate('/registration')}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition duration-150 text-white py-2 px-3 rounded-lg shadow-sm"
            >
              <FileText size={16} />
              <span className="hidden md:inline">Registration Form</span>
            </button>
            <button
              onClick={() => navigate('/admin/financial')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition duration-150 text-white py-2 px-3 rounded-lg shadow-sm"
            >
              <DollarSign size={16} />
              <span className="hidden md:inline">Financials</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 transition duration-150 text-white py-2 px-3 rounded-lg shadow-sm"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <Filter size={20} className="text-blue-700" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Applications Manager</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by registration no."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
              </div>

              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 w-full md:w-48 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  <optgroup label="Boys Categories">
                    <option value="u-11">Under-11 Boys</option>
                    <option value="u-13">Under-13 Boys</option>
                    <option value="u-15">Under-15 Boys</option>
                    <option value="u-17">Under-17 Boys</option>
                    <option value="open">Open Boys</option>
                  </optgroup>
                  <optgroup label="Girls Categories">
                    <option value="gu-11">Under-11 Girls</option>
                    <option value="gu-13">Under-13 Girls</option>
                    <option value="gu-15">Under-15 Girls</option>
                    <option value="gu-17">Under-17 Girls</option>
                    <option value="gopen">Open Girls</option>
                  </optgroup>
                </select>
              </div>

              <button
                onClick={fetchApplications}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-150"
              >
                <RefreshCw size={16} className="text-white" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading applications...</p>
            </div>
          ) : (
            <>
              {applications.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <div className="flex justify-center mb-4">
                    <Search size={48} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No applications found</p>
                  <p className="text-gray-400 text-sm mt-1">Try changing your search criteria</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registration No.
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicant
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date of Birth
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Village
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-mono text-sm text-gray-700">{app.registration_number}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  {app.image_url ? (
                                    <img
                                      className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                      src={app.image_url}
                                      alt={app.name}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/40?text=N/A';
                                      }}
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <span className="text-blue-600 font-semibold text-xs">{app.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{app.name}</div>
                                  <div className="text-xs text-gray-500">{app.age} years</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.dob}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {formatCategory(app.category)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.address?.village || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {app.mobile_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewDetails(app.id?.toString() || '')}
                                  className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition duration-150"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleEdit(app.id?.toString() || '')}
                                  className="flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg transition duration-150"
                                  title="Edit"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDownloadPDF(app.id?.toString() || '')}
                                  disabled={downloadingPDFs.has(app.id?.toString() || '')}
                                  className={`flex items-center justify-center p-2 rounded-lg transition duration-150 ${downloadingPDFs.has(app.id?.toString() || '')
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-50 hover:bg-green-100 text-green-600'
                                    }`}
                                  title={downloadingPDFs.has(app.id?.toString() || '') ? "Generating PDF..." : "Download PDF"}
                                >
                                  {downloadingPDFs.has(app.id?.toString() || '') ? (
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  ) : (
                                    <Download size={16} />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleDelete(app.id?.toString() || '')}
                                  className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition duration-150"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronDown className="h-5 w-5 rotate-90" aria-hidden="true" />
                          </button>

                          {/* Page Numbers */}
                          {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            // Show first, last, current, and surrounding pages
                            if (
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  aria-current={currentPage === pageNum ? 'page' : undefined}
                                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNum
                                    ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            } else if (
                              pageNum === currentPage - 2 ||
                              pageNum === currentPage + 2
                            ) {
                              return (
                                <span key={pageNum} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                  ...
                                </span>
                              );
                            }
                            return null;
                          })}

                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className="sr-only">Next</span>
                            <ChevronDown className="h-5 w-5 -rotate-90" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;