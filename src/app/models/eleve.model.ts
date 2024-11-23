/**export interface Eleve {
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
}**/

import { Class } from 'src/app/models/class.model';


export interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  
  sexe: string;
  classe: { 'id': string, 'nomDeClasse': string, 'niveau': string, 'createdAt': string, 'updatedAt': string };
}
