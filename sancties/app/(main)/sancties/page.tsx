"use client";

import { useState } from 'react';
import { Sanctie, sanctieTypes, sampleStudents } from '@/types/sanction';
import SanctiesTable from '@/components/sancties/SanctiesTable';
import SanctieForm from '@/components/sancties/SanctieForm';

// Sample data for demonstration
const sampleSancties: Sanctie[] = [
  {
    id: '1',
    student: sampleStudents[0],
    type: sanctieTypes[0],
    reden: 'Te laat gekomen bij de les',
    datum: '2024-12-15T09:30:00.000Z',
    docent: 'Dhr. van der Berg',
    status: 'actief',
    opmerkingen: 'Eerste waarschuwing'
  },
  {
    id: '2',
    student: sampleStudents[1],
    type: sanctieTypes[1],
    reden: 'Vergeten huiswerk',
    datum: '2024-12-14T14:15:00.000Z',
    docent: 'Mevr. Jansen',
    status: 'voltooid'
  },
  {
    id: '3',
    student: sampleStudents[2],
    type: sanctieTypes[2],
    reden: 'Verstoring van de les',
    datum: '2024-12-13T11:00:00.000Z',
    docent: 'Dhr. Bakker',
    status: 'actief',
    opmerkingen: 'Extra opdracht wiskunde'
  }
];

export default function SanctiesPage() {
  const [sancties, setSancties] = useState<Sanctie[]>(sampleSancties);
  const [showForm, setShowForm] = useState(false);
  const [editingSanctie, setEditingSanctie] = useState<Sanctie | undefined>();
  const [docentNaam, setDocentNaam] = useState('Dhr. Docent'); // In real app, this would come from authentication
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('alle');

  // Filter sanctions based on search and status
  const filteredSancties = sancties.filter(sanctie => {
    const matchesSearch = 
      sanctie.student.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sanctie.student.klas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sanctie.type.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sanctie.reden.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'alle' || sanctie.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSave = (sanctieData: Omit<Sanctie, 'id'> | Sanctie) => {
    if ('id' in sanctieData) {
      // Update existing sanction
      setSancties(prev => prev.map(s => s.id === sanctieData.id ? sanctieData : s));
    } else {
      // Add new sanction
      const newSanctie: Sanctie = {
        ...sanctieData,
        id: Date.now().toString(),
      };
      setSancties(prev => [newSanctie, ...prev]);
    }
    
    setShowForm(false);
    setEditingSanctie(undefined);
  };

  const handleEdit = (sanctie: Sanctie) => {
    setEditingSanctie(sanctie);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Weet je zeker dat je deze sanctie wilt verwijderen?')) {
      setSancties(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: 'actief' | 'voltooid' | 'geannuleerd') => {
    setSancties(prev => prev.map(s => 
      s.id === id ? { ...s, status } : s
    ));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSanctie(undefined);
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2">Sancties Beheer</h1>
              <p className="text-muted">Beheer sancties voor studenten</p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowForm(true)}
            >
              <i className="bi bi-plus-circle"></i>
              Nieuwe Sanctie
            </button>
          </div>

          {/* Teacher info */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="card-title mb-1">Welkom, {docentNaam}</h5>
                  <p className="card-text text-muted">
                    Je hebt {sancties.filter(s => s.status === 'actief').length} actieve sanctie(s)
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">Docent:</span>
                    <input
                      type="text"
                      className="form-control"
                      value={docentNaam}
                      onChange={(e) => setDocentNaam(e.target.value)}
                      placeholder="Naam docent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and filter */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Zoek op student naam, klas, sanctie type of reden..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="alle">Alle statussen</option>
                    <option value="actief">Actief</option>
                    <option value="voltooid">Voltooid</option>
                    <option value="geannuleerd">Geannuleerd</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-primary">{sancties.length}</h5>
                  <p className="card-text">Totaal sancties</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-warning">{sancties.filter(s => s.status === 'actief').length}</h5>
                  <p className="card-text">Actief</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-success">{sancties.filter(s => s.status === 'voltooid').length}</h5>
                  <p className="card-text">Voltooid</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-secondary">{sancties.filter(s => s.status === 'geannuleerd').length}</h5>
                  <p className="card-text">Geannuleerd</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sanctions table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                Sancties Overzicht 
                {filteredSancties.length !== sancties.length && (
                  <span className="text-muted"> ({filteredSancties.length} van {sancties.length})</span>
                )}
              </h5>
            </div>
            <div className="card-body">
              <SanctiesTable
                sancties={filteredSancties}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <SanctieForm
          sanctie={editingSanctie}
          onSave={handleSave}
          onCancel={handleCancel}
          docentNaam={docentNaam}
        />
      )}
    </div>
  );
}