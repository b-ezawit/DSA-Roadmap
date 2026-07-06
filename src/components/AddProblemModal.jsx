import React, { useState, useEffect } from 'react';

function AddProblemModal({ partTitle, onAdd, onClose, initialData = null }) {
  const [name, setName] = useState(initialData ? initialData.name : '');
  const [url, setUrl] = useState(initialData ? initialData.url : '');

  const isEdit = !!initialData;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    
    if (isEdit) {
      onAdd({ ...initialData, name: name.trim(), url: finalUrl });
    } else {
      onAdd({ name: name.trim(), url: finalUrl });
    }
    onClose();
  };

  return (
    <div
      className="add-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="add-modal-panel">
        <h3 className="add-modal-title">{isEdit ? 'Edit Problem' : 'Add a Problem'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="problem-name">Problem Name</label>
            <input
              id="problem-name"
              className="form-input"
              type="text"
              placeholder="e.g. Two Sum"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="problem-url">Problem URL</label>
            <input
              id="problem-url"
              className="form-input"
              type="url"
              placeholder="https://leetcode.com/problems/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={!name.trim() || !url.trim()}
            >
              {isEdit ? 'Save Changes' : 'Add Problem'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProblemModal;
