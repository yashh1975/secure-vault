import { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Copy, CheckCircle, Link as LinkIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ShareModal = ({ fileId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateLink = async () => {
      try {
        const res = await api.post(`/files/${fileId}/share`);
        setShareData(res.data.data);
      } catch (err) {
        setError('Failed to generate share link');
      } finally {
        setLoading(false);
      }
    };
    generateLink();
  }, [fileId]);

  const handleCopy = () => {
    if (shareData) {
      navigator.clipboard.writeText(shareData.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 text-green-600 p-2 rounded-lg">
              <LinkIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Share File</h3>
              <p className="text-sm text-slate-500">Secure link generated successfully</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
          ) : shareData ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Anyone with this link can download the file</label>
                <div className="flex rounded-lg overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
                  <input 
                    type="text" 
                    readOnly 
                    value={shareData.link}
                    className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-600 text-sm outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                  >
                    {copied ? <><CheckCircle size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <Clock size={16} className="shrink-0" />
                <p>Link expires in <span className="font-semibold">{formatDistanceToNow(new Date(shareData.expiry_time))}</span></p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
