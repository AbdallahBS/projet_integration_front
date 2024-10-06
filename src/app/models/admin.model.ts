export interface Admin {
    id: string;      // Assuming UUID format
    username: string;
    mdp: string;     // Password (it will be encrypted in the backend)
    role: string;    // 'superadmin' or 'admin'
  }
  