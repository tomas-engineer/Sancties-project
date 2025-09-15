"use client";

import { useState } from 'react';
import { Sanctie, Student, SanctieType, sanctieTypes, sampleStudents } from '@/types/sanction';

interface Props {
  sanctie?: Sanctie;
  onSave: (sanctie: Omit<Sanctie, 'id'> | Sanctie) => void;
  onCancel: () => void;
  docentNaam: string;
}

export default function SanctieForm({ sanctie, onSave, onCancel, docentNaam }: Props) {
  const [formData, setFormData] = useState({
    studentId: sanctie?.student.id || '',
    sanctieTypeId: sanctie?.type.id || '',
    reden: sanctie?.reden || '',
    opmerkingen: sanctie?.opmerkingen || '',
    status: sanctie?.status || 'actief' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Selecteer een student';
    }
    if (!formData.sanctieTypeId) {
      newErrors.sanctieTypeId = 'Selecteer een sanctie type';
    }
    if (!formData.reden.trim()) {
      newErrors.reden = 'Reden is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const selectedStudent = sampleStudents.find(s => s.id === formData.studentId)!;
    const selectedType = sanctieTypes.find(t => t.id === formData.sanctieTypeId)!;

    const sanctieData = {
      ...(sanctie && { id: sanctie.id }),
      student: selectedStudent,
      type: selectedType,
      reden: formData.reden.trim(),
      datum: sanctie?.datum || new Date().toISOString(),
      docent: docentNaam,
      status: formData.status,
      opmerkingen: formData.opmerkingen.trim() || undefined,
    };

    onSave(sanctieData);
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {sanctie ? 'Sanctie Bewerken' : 'Nieuwe Sanctie Opleggen'}
            </h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="student" className="form-label">Student *</label>
                  <select
                    id="student"
                    className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  >
                    <option value="">Selecteer een student...</option>
                    {sampleStudents.map((student: Student) => (
                      <option key={student.id} value={student.id}>
                        {student.naam} ({student.klas})
                      </option>
                    ))}
                  </select>
                  {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="sanctieType" className="form-label">Sanctie Type *</label>
                  <select
                    id="sanctieType"
                    className={`form-select ${errors.sanctieTypeId ? 'is-invalid' : ''}`}
                    value={formData.sanctieTypeId}
                    onChange={(e) => setFormData({ ...formData, sanctieTypeId: e.target.value })}
                  >
                    <option value="">Selecteer een sanctie type...</option>
                    {sanctieTypes.map((type: SanctieType) => (
                      <option key={type.id} value={type.id}>
                        {type.naam}
                      </option>
                    ))}
                  </select>
                  {errors.sanctieTypeId && <div className="invalid-feedback">{errors.sanctieTypeId}</div>}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="reden" className="form-label">Reden *</label>
                <textarea
                  id="reden"
                  className={`form-control ${errors.reden ? 'is-invalid' : ''}`}
                  rows={3}
                  value={formData.reden}
                  onChange={(e) => setFormData({ ...formData, reden: e.target.value })}
                  placeholder="Beschrijf de reden voor deze sanctie..."
                />
                {errors.reden && <div className="invalid-feedback">{errors.reden}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="opmerkingen" className="form-label">Opmerkingen</label>
                <textarea
                  id="opmerkingen"
                  className="form-control"
                  rows={2}
                  value={formData.opmerkingen}
                  onChange={(e) => setFormData({ ...formData, opmerkingen: e.target.value })}
                  placeholder="Extra opmerkingen (optioneel)..."
                />
              </div>

              {sanctie && (
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select
                    id="status"
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'actief' | 'voltooid' | 'geannuleerd' })}
                  >
                    <option value="actief">Actief</option>
                    <option value="voltooid">Voltooid</option>
                    <option value="geannuleerd">Geannuleerd</option>
                  </select>
                </div>
              )}

              <div className="alert alert-info">
                <strong>Docent:</strong> {docentNaam}<br/>
                <strong>Datum:</strong> {sanctie ? new Date(sanctie.datum).toLocaleString('nl-NL') : new Date().toLocaleString('nl-NL')}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Annuleren
              </button>
              <button type="submit" className="btn btn-primary">
                {sanctie ? 'Opslaan' : 'Sanctie Opleggen'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}