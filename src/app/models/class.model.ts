export interface Enseignant {
  id: string;
  nom: string;
  prenom: string;
  matiere: string;
}

export interface Student {
  id: string;
  nom: string;
  prenom: string;

}

export interface Class {
  id: string;
  nomDeClasse: string;
  niveau: string;
  studentCount: number;
  enseignants: Enseignant[];
  students : Student[];
  createdAt?: string;
  updatedAt?: string;
}
