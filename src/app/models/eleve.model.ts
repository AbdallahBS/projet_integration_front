export interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classeId: string;
  createdAt: string;
  updatedAt: string;
  classe: {
    id: string;
    nomDeClasse: string;
    niveau: string;
    createdAt: string;
    updatedAt: string;
  };
}