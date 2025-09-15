export interface Student {
  id: string;
  naam: string;
  klas: string;
}

export interface SanctieType {
  id: string;
  naam: string;
  beschrijving: string;
}

export interface Sanctie {
  id: string;
  student: Student;
  type: SanctieType;
  reden: string;
  datum: string;
  docent: string;
  status: 'actief' | 'voltooid' | 'geannuleerd';
  opmerkingen?: string;
}

export const sanctieTypes: SanctieType[] = [
  { id: '1', naam: 'Waarschuwing', beschrijving: 'Mondelinge of schriftelijke waarschuwing' },
  { id: '2', naam: 'Nablijven', beschrijving: 'Student blijft na schooltijd nablijven' },
  { id: '3', naam: 'Strafwerk', beschrijving: 'Extra opdrachten maken' },
  { id: '4', naam: 'Schorsing', beschrijving: 'Tijdelijke uitsluiting van lessen' },
  { id: '5', naam: 'Oudergesprek', beschrijving: 'Gesprek met ouders/verzorgers' },
];

export const sampleStudents: Student[] = [
  { id: '1', naam: 'Jan Janssen', klas: '1A' },
  { id: '2', naam: 'Marie Peters', klas: '1A' },
  { id: '3', naam: 'Tom Bakker', klas: '1B' },
  { id: '4', naam: 'Lisa van der Berg', klas: '2A' },
  { id: '5', naam: 'David Smith', klas: '2B' },
];