import React from 'react';
import { Upload, FileText } from 'lucide-react';

const FileUploader = ({ label, onFileSelect, file }) => {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="file-uploader">
      <label className="upload-label">
        <Upload size={20} />
        {label}
      </label>
      <input 
        type="file" 
        accept=".csv,.txt" 
        onChange={handleFileChange}
        className="file-input"
      />
      {file && (
        <div className="file-info">
          <FileText size={16} />
          <span>{file.name}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;