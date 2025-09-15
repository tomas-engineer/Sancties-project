"use client";

import { Sanctie } from '@/types/sanction';

interface Props {
  sancties: Sanctie[];
  onEdit: (sanctie: Sanctie) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: 'actief' | 'voltooid' | 'geannuleerd') => void;
}

export default function SanctiesTable({ sancties, onEdit, onDelete, onStatusChange }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Student</th>
            <th>Klas</th>
            <th>Sanctie Type</th>
            <th>Reden</th>
            <th>Datum</th>
            <th>Docent</th>
            <th>Status</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {sancties.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                Geen sancties gevonden
              </td>
            </tr>
          ) : (
            sancties.map((sanctie) => (
              <tr key={sanctie.id}>
                <td><strong>{sanctie.student.naam}</strong></td>
                <td>{sanctie.student.klas}</td>
                <td>
                  <span className="badge bg-primary">{sanctie.type.naam}</span>
                </td>
                <td>{sanctie.reden}</td>
                <td>{formatDate(sanctie.datum)}</td>
                <td>{sanctie.docent}</td>
                <td>
                  <select 
                    className="form-select form-select-sm"
                    value={sanctie.status}
                    onChange={(e) => onStatusChange(sanctie.id, e.target.value as 'actief' | 'voltooid' | 'geannuleerd')}
                  >
                    <option value="actief">Actief</option>
                    <option value="voltooid">Voltooid</option>
                    <option value="geannuleerd">Geannuleerd</option>
                  </select>
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(sanctie)}
                      title="Bewerken"
                    >
                      <i className="bi bi-pencil"></i>
                      Bewerk
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(sanctie.id)}
                      title="Verwijderen"
                    >
                      <i className="bi bi-trash"></i>
                      Verwijder
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}