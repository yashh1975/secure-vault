import { useState, useEffect } from 'react';
import { X, Download, AlertCircle } from 'lucide-react';
import mammoth from 'mammoth';

const FilePreviewModal = ({ file, url, onClose }) => {
  const [docxHtml, setDocxHtml] = useState(null);
  const [loadingDocx, setLoadingDocx] = useState(false);

  const isImage = file.file_type.startsWith('image/');
  const isPdf = file.file_type === 'application/pdf';
  const isText = file.file_type === 'text/plain';
  const isDocx = file.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  
  const canPreview = isImage || isPdf || isText || isDocx;

  useEffect(() => {
    if (isDocx && url) {
      setLoadingDocx(true);
      fetch(url)
        .then(res => res.arrayBuffer())
        .then(arrayBuffer => mammoth.convertToHtml({ arrayBuffer }))
        .then(result => {
          setDocxHtml(result.value);
        })
        .catch(err => {
          console.error('Error rendering docx:', err);
          setDocxHtml('<p class="text-red-500">Failed to render document preview.</p>');
        })
        .finally(() => {
          setLoadingDocx(false);
        });
    }
  }, [isDocx, url]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-semibold text-slate-900">{file.file_name}</h3>
            <p className="text-xs text-slate-500">Secure Inline Preview</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 bg-slate-100 overflow-auto relative flex flex-col items-center p-4">
          {!canPreview ? (
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 max-w-md m-auto">
              <AlertCircle size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Preview Not Available</h3>
              <p className="text-sm text-slate-500 mb-6">
                This file format ({file.file_type}) cannot be previewed directly in the browser safely.
              </p>
              <a 
                href={url}
                download={file.file_name}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Download size={18} /> Download to View
              </a>
            </div>
          ) : isImage ? (
            <img src={url} alt={file.file_name} className="max-w-full max-h-full object-contain rounded shadow-sm m-auto" />
          ) : isDocx ? (
            <div className="w-full max-w-4xl bg-white min-h-full rounded shadow-sm border border-slate-200 p-8 sm:p-12">
              {loadingDocx ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div 
                  className="docx-preview max-w-none text-slate-800"
                  style={{ wordWrap: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: docxHtml }} 
                />
              )}
            </div>
          ) : (
            <iframe 
              src={url} 
              title={file.file_name}
              className="w-full h-full bg-white rounded shadow-sm border border-slate-200"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
