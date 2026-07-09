import React, { useState } from 'react';
import AddProblemModal from './AddProblemModal';

// Edit Icon SVG
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// Delete Icon SVG
const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

function PartDetail({ part, checkedMap, customQuestions, onToggle, onAddQuestion, onEditQuestion, onDeleteQuestion, onClose }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Merge built-in + custom questions for this part
  const builtInQuestions = part.questions || [];
  const myCustom = customQuestions[part.id] || [];
  const allQuestions = [...builtInQuestions, ...myCustom];
  const hasQuestions = allQuestions.length > 0;

  // Progress calculation
  const solvedCount = hasQuestions
    ? allQuestions.filter((q) => checkedMap[q.id]).length
    : 0;
  const totalCount = allQuestions.length;
  const pct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const handleAddQuestion = (newQ) => {
    if (newQ.id) {
      // It's an edit
      onEditQuestion(part.id, newQ);
    } else {
      // New question
      const id = `custom_p${part.id}_${Date.now()}`;
      onAddQuestion(part.id, { ...newQ, id });
    }
  };

  const openEdit = (e, q) => {
    e.stopPropagation();
    setEditingQuestion(q);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setEditingQuestion(null);
    setShowAddModal(false);
  };

  return (
    <>
      <div
        className="modal-overlay"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          {/* Header */}
          <div className="modal-header">
            <div className="modal-part-badge">
              <span>Part {part.id}</span>
            </div>
            <h2 id="modal-title" className="modal-title">
              {part.title}
            </h2>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Progress bar — only if has questions */}
          {hasQuestions && (
            <div className="progress-section">
              <div className="progress-label">
                <span>Progress</span>
                <span>
                  <strong>{pct}%</strong>&nbsp;&nbsp;{solvedCount}/{totalCount} solved
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Body */}
          {part.questions.length === 0 && myCustom.length === 0 ? (
            /* No questions at all — only PDF */
            <div className="only-pdf-layout">
              <div className="only-pdf-card">
                <div className="section-label">Read Note</div>
                {part.pdfs ? (
                  part.pdfs.map((pdf, idx) => (
                    <a
                      key={idx}
                      className="pdf-btn"
                      href={pdf.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginBottom: '8px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', flexShrink: 0}}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      {pdf.title}
                    </a>
                  ))
                ) : (
                  <a
                    className="pdf-btn"
                    href={part.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', flexShrink: 0}}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    PDF File
                  </a>
                )}
                <button
                  className="add-problem-btn"
                  style={{ marginTop: '1rem' }}
                  onClick={() => setShowAddModal(true)}
                >
                  Add a problem
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-body">
              {/* Left: Read Note */}
              <div className="read-note-section">
                <div className="section-label">Read Note</div>
                {part.pdfs ? (
                  part.pdfs.map((pdf, idx) => (
                    <a
                      key={idx}
                      className="pdf-btn"
                      href={pdf.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginBottom: '8px' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', flexShrink: 0}}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      {pdf.title}
                    </a>
                  ))
                ) : (
                  <a
                    className="pdf-btn"
                    href={part.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px', flexShrink: 0}}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    PDF File
                  </a>
                )}
              </div>

              {/* Right: Practice Problems */}
              <div className="practice-section">
                <div className="section-label">Practice Problems</div>

                {allQuestions.map((q) => {
                  const solved = !!checkedMap[q.id];
                  const isCustom = q.id.toString().startsWith('custom_');
                  
                  return (
                    <div
                      key={q.id}
                      className={`problem-item${solved ? ' solved' : ''}`}
                      onClick={() => onToggle(q.id)}
                    >
                      <div className={`custom-checkbox${solved ? ' checked' : ''}`} />
                      <a
                        className="problem-link"
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {q.name}
                      </a>
                      
                      {isCustom && (
                        <div className="problem-actions">
                          <button
                            className="action-btn action-edit"
                            onClick={(e) => openEdit(e, q)}
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="action-btn action-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteQuestion(part.id, q.id);
                            }}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  className="add-problem-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  Add a problem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddProblemModal
          partTitle={part.title}
          initialData={editingQuestion}
          onAdd={handleAddQuestion}
          onClose={closeAddModal}
        />
      )}
    </>
  );
}

export default PartDetail;
