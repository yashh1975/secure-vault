import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Download, Trash2, Share2, File as FileIcon, Clock, HardDrive, Eye, Search, Filter, RefreshCw, AlertTriangle, LayoutGrid, Trash } from 'lucide-react';
import { format } from 'date-fns';
import ShareModal from '../components/ShareModal';
import FilePreviewModal from '../components/FilePreviewModal';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('files'); // 'files' or 'trash'
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals
  const [shareFileId, setShareFileId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Search, Filter & Bulk Actions
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'trash' ? '/files/trash' : '/files';
      const res = await api.get(endpoint);
      setFiles(res.data.data);
      setSelectedFiles(new Set());
    } catch (err) {
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [activeTab]);

  const handleDownload = async (id, filename) => {
    try {
      const res = await api.get(`/files/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to download file');
    }
  };

  const handleView = async (file) => {
    try {
      const res = await api.get(`/files/${file._id}/download?view=true`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: file.file_type }));
      setPreviewUrl(url);
      setPreviewFile(file);
    } catch (err) {
      alert('Failed to prepare preview');
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreviewFile(null);
  };

  const handleDelete = async (id) => {
    const isTrash = activeTab === 'trash';
    if (!window.confirm(isTrash ? 'Permanently delete this file? This cannot be undone.' : 'Move this file to trash?')) return;
    
    try {
      if (isTrash) {
        await api.delete(`/files/${id}/permanent`);
      } else {
        await api.delete(`/files/${id}`);
      }
      
      setFiles(files.filter(f => f._id !== id));
      if (selectedFiles.has(id)) {
        const newSelected = new Set(selectedFiles);
        newSelected.delete(id);
        setSelectedFiles(newSelected);
      }
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  const handleRestore = async (id) => {
    try {
      await api.put(`/files/${id}/restore`);
      setFiles(files.filter(f => f._id !== id));
      if (selectedFiles.has(id)) {
        const newSelected = new Set(selectedFiles);
        newSelected.delete(id);
        setSelectedFiles(newSelected);
      }
    } catch (err) {
      alert('Failed to restore file');
    }
  };

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFiles(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length && filteredFiles.length > 0) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f._id)));
    }
  };

  const handleBulkDelete = async () => {
    const isTrash = activeTab === 'trash';
    if (!window.confirm(isTrash ? `Permanently delete ${selectedFiles.size} files?` : `Move ${selectedFiles.size} files to trash?`)) return;
    
    try {
      if (isTrash) {
        await Promise.all(Array.from(selectedFiles).map(id => api.delete(`/files/${id}/permanent`)));
      } else {
        await Promise.all(Array.from(selectedFiles).map(id => api.delete(`/files/${id}`)));
      }
      setFiles(files.filter(f => !selectedFiles.has(f._id)));
      setSelectedFiles(new Set());
    } catch (err) {
      alert('Failed to delete some files');
    }
  };

  const handleBulkRestore = async () => {
    try {
      await Promise.all(Array.from(selectedFiles).map(id => api.put(`/files/${id}/restore`)));
      setFiles(files.filter(f => !selectedFiles.has(f._id)));
      setSelectedFiles(new Set());
    } catch (err) {
      alert('Failed to restore some files');
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'image') return matchesSearch && file.file_type.startsWith('image/');
    if (filterType === 'pdf') return matchesSearch && file.file_type === 'application/pdf';
    if (filterType === 'document') return matchesSearch && (file.file_type.includes('document') || file.file_type.includes('text'));
    return matchesSearch;
  });

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50/50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block px-4 py-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">Storage</h2>
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('files')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'files' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <LayoutGrid size={18} className={activeTab === 'files' ? 'text-primary-600' : 'text-slate-400'} />
            My Files
          </button>
          
          <button 
            onClick={() => setActiveTab('trash')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'trash' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <Trash size={18} className={activeTab === 'trash' ? 'text-primary-600' : 'text-slate-400'} />
            Trash Bin
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header & Mobile Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {activeTab === 'files' ? 'My Secure Files' : 'Trash Bin'}
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                {activeTab === 'files' ? 'Manage, share, and encrypt your digital assets.' : 'Deleted files are kept here for 30 days.'}
              </p>
            </div>
            
            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden bg-slate-200/50 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('files')}
                className={`flex-1 text-sm font-medium py-1.5 rounded-md ${activeTab === 'files' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-600'}`}
              >
                Files
              </button>
              <button 
                onClick={() => setActiveTab('trash')}
                className={`flex-1 text-sm font-medium py-1.5 rounded-md ${activeTab === 'trash' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-600'}`}
              >
                Trash
              </button>
            </div>
            
            {/* Search & Filter */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow shadow-sm"
                />
              </div>
              <div className="relative">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm text-slate-700 cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="pdf">PDFs</option>
                  <option value="document">Documents</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
              <AlertTriangle size={18} /> {error}
            </div>
          )}

          {/* Bulk Actions Toolbar */}
          {selectedFiles.size > 0 && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-primary-700 bg-white px-2 py-1 rounded-md text-sm border border-primary-100">{selectedFiles.size} selected</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedFiles(new Set())}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                {activeTab === 'trash' && (
                  <button 
                    onClick={handleBulkRestore}
                    className="px-4 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw size={16} /> Restore
                  </button>
                )}
                <button 
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} /> {activeTab === 'trash' ? 'Permanent Delete' : 'Move to Trash'}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4 px-2">
            <input 
              type="checkbox" 
              checked={filteredFiles.length > 0 && selectedFiles.size === filteredFiles.length}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-500">Select All</span>
          </div>

          {loading ? (
            <div className="min-h-[40vh] flex justify-center items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm border-dashed">
              <FileIcon size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">
                {activeTab === 'trash' ? 'Trash is empty' : 'No files found'}
              </h3>
              <p className="text-slate-500">
                {activeTab === 'trash' ? 'Deleted items will appear here.' : 'Upload a new file or adjust your search filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <div key={file._id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                  
                  {/* Selection Checkbox */}
                  <div className={`absolute top-4 left-4 z-10 ${selectedFiles.has(file._id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                    <input 
                      type="checkbox" 
                      checked={selectedFiles.has(file._id)}
                      onChange={() => toggleSelection(file._id)}
                      className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500 cursor-pointer shadow-sm"
                    />
                  </div>

                  <div className={`p-6 ${selectedFiles.has(file._id) ? 'bg-primary-50/40' : ''}`}>
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-5 ml-auto mr-auto shadow-sm group-hover:scale-110 transition-transform">
                      <FileIcon size={26} />
                    </div>
                    <h3 className="font-semibold text-slate-900 truncate mb-2 text-center" title={file.file_name}>
                      {file.file_name}
                    </h3>
                    
                    <div className="space-y-2 mt-5 text-xs font-medium text-slate-500">
                      <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-md">
                        <span className="flex items-center gap-1.5"><HardDrive size={14} className="text-slate-400" /> Size</span>
                        <span className="text-slate-700">
                          {(file.file_size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-md">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {activeTab === 'trash' ? 'Deleted' : 'Uploaded'}</span>
                        <span className="text-slate-700">
                          {format(new Date(activeTab === 'trash' && file.deleted_at ? file.deleted_at : file.upload_date || file.createdAt || Date.now()), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {activeTab === 'trash' ? (
                      <button 
                        onClick={() => handleRestore(file._id)}
                        className="flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                      >
                        <RefreshCw size={16} /> Restore
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleDownload(file._id, file.file_name)}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors"
                      >
                        <Download size={16} /> Download
                      </button>
                    )}
                    
                    <div className="flex gap-3">
                      {activeTab !== 'trash' && (
                        <>
                          <button 
                            onClick={() => handleView(file)}
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                            title="View Inline"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => setShareFileId(file._id)}
                            className="text-slate-400 hover:text-green-600 transition-colors"
                            title="Create Share Link"
                          >
                            <Share2 size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(file._id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title={activeTab === 'trash' ? 'Permanent Delete' : 'Move to Trash'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {shareFileId && <ShareModal fileId={shareFileId} onClose={() => setShareFileId(null)} />}
      {previewFile && <FilePreviewModal file={previewFile} url={previewUrl} onClose={closePreview} />}
    </div>
  );
};

export default Dashboard;
