import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setError('File is too large or type is not supported.');
      setFile(null);
      return;
    }
    setFile(acceptedFiles[0]);
    setError('');
    setSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 50 * 1024 * 1024, // 50MB
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'application/zip': ['.zip', '.x-zip-compressed']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Upload File</h1>
        <p className="text-slate-500 mt-2">Securely upload and encrypt your files before storing</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
            ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'}
            ${file ? 'border-primary-200 bg-primary-50/30' : ''}`}
        >
          <input {...getInputProps()} />
          
          {file ? (
            <div className="relative">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <File size={32} />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              
              {!uploading && !success && (
                <button 
                  onClick={removeFile}
                  className="absolute -top-4 -right-4 p-2 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm border border-slate-100 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud size={32} />
              </div>
              <p className="text-lg font-medium text-slate-900 mb-1">
                {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
              </p>
              <p className="text-sm text-slate-500 mb-4">or click to browse from your computer</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-400">
                <span className="px-2 py-1 bg-slate-100 rounded">PDF</span>
                <span className="px-2 py-1 bg-slate-100 rounded">JPG</span>
                <span className="px-2 py-1 bg-slate-100 rounded">PNG</span>
                <span className="px-2 py-1 bg-slate-100 rounded">DOCX</span>
                <span className="px-2 py-1 bg-slate-100 rounded">TXT</span>
                <span className="px-2 py-1 bg-slate-100 rounded">ZIP</span>
                <span className="px-2 py-1 bg-slate-100 rounded ml-2">Max 50MB</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">File encrypted and uploaded successfully! Redirecting...</p>
          </div>
        )}

        {uploading && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2 font-medium text-slate-700">
              <span>Encrypting & Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mr-4"
            disabled={uploading || success}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading || success}
            className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {uploading ? 'Processing...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
