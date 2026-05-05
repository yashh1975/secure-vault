import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { ShieldCheck, Download, AlertTriangle, Eye } from 'lucide-react';
import FilePreviewModal from '../components/FilePreviewModal';

const ShareView = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewData, setPreviewData] = useState(null);

  const fetchFileBlob = async (isView) => {
    const res = await api.get(`/share/${token}${isView ? '?view=true' : ''}`, { responseType: 'blob' });
    return res;
  };

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchFileBlob(false);
      
      let filename = 'downloaded-file';
      const disposition = res.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchFileBlob(true);
      const mimetype = res.headers['content-type'] || 'application/octet-stream';
      
      let filename = 'secure-file';
      const disposition = res.headers['content-disposition'];
      if (disposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(new Blob([res.data], { type: mimetype }));
      setPreviewData({ url, file: { file_name: filename, file_type: mimetype } });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const closePreview = () => {
    if (previewData) URL.revokeObjectURL(previewData.url);
    setPreviewData(null);
  };

  const handleError = (err) => {
    if (err.response?.status === 410) {
      setError('This link has expired.');
    } else if (err.response?.status === 404) {
      setError('Invalid link or file not found.');
    } else {
      setError('Failed to process the file. It may be encrypted or corrupted.');
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 text-center">
        <div className="p-10">
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure File Transfer</h2>
          <p className="text-slate-500 mb-8">Someone has shared a secure, encrypted file with you.</p>
          
          {error && (
            <div className="mb-8 flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-lg text-left">
              <AlertTriangle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={handleDownload}
              disabled={loading || error}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary-600 text-white rounded-xl font-medium shadow-md hover:bg-primary-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <Download size={20} />
                  <span>Download Secure File</span>
                </>
              )}
            </button>
            
            <button 
              onClick={handleView}
              disabled={loading || error}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-white text-primary-600 border border-primary-200 rounded-xl font-medium hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye size={20} />
              <span>View Online</span>
            </button>
          </div>
        </div>
        <div className="bg-slate-50 py-4 text-xs font-medium text-slate-500 border-t border-slate-100">
          Powered by SecureVault Encryption
        </div>
      </div>
      
      {previewData && <FilePreviewModal file={previewData.file} url={previewData.url} onClose={closePreview} />}
    </div>
  );
};

export default ShareView;
