/** @format */

import type {
  Cotisation,
  Don,
  Depense,
  User,
  AuditLog,
  StatFinanciere,
  Student,
  Residence,
  Quarter,
  Building,
  Room,
  RoomOccupation,
  RentPayment
} from "@/types";
import {
  UserRole,
  CotisationStatus,
  DepenseStatus,
  DepenseCategory,
  StudentStatus,
  RoomStatus
} from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    role: UserRole.PRESIDENT,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2",
    name: "Marie Martin",
    email: "marie.martin@email.com",
    role: UserRole.TRESORIER,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "3",
    name: "Pierre Durand",
    email: "pierre.durand@email.com",
    role: UserRole.MEMBRE,
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  }
];

export const mockCotisations: Cotisation[] = [
  {
    id: "1",
    memberId: "1",
    memberName: "Jean Dupont",
    amount: 50000,
    period: "Janvier 2025",
    status: CotisationStatus.PAID,
    paymentMethod: "Mobile Money",
    paymentDate: new Date("2025-01-05"),
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-05")
  },
  {
    id: "2",
    memberId: "2",
    memberName: "Marie Martin",
    amount: 50000,
    period: "Janvier 2025",
    status: CotisationStatus.PAID,
    paymentMethod: "Espèces",
    paymentDate: new Date("2025-01-03"),
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-03")
  },
  {
    id: "3",
    memberId: "3",
    memberName: "Pierre Durand",
    amount: 50000,
    period: "Janvier 2025",
    status: CotisationStatus.PENDING,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01")
  }
];

export const mockDons: Don[] = [
  {
    id: "1",
    donorName: "Entreprise ABC",
    amount: 500000,
    description: "Don pour activités culturelles",
    receiptGenerated: true,
    receiptUrl: "/receipts/don-001.pdf",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10")
  },
  {
    id: "2",
    donorName: "Anonyme",
    amount: 100000,
    description: "Don général",
    receiptGenerated: false,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15")
  }
];

export const mockDepenses: Depense[] = [
  {
    id: "1",
    title: "Achat matériel bureau",
    description: "Ordinateur portable pour le secrétariat",
    amount: 450000,
    category: DepenseCategory.EQUIPEMENT,
    status: DepenseStatus.APPROVED,
    submittedBy: "Marie Martin",
    approvedBy: "Jean Dupont",
    justificatifs: ["/uploads/facture-001.pdf"],
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-09")
  },
  {
    id: "2",
    title: "Loyer bureau",
    description: "Loyer mensuel janvier 2025",
    amount: 200000,
    category: DepenseCategory.FONCTIONNEMENT,
    status: DepenseStatus.SUBMITTED,
    submittedBy: "Pierre Durand",
    justificatifs: [],
    createdAt: new Date("2025-01-18"),
    updatedAt: new Date("2025-01-18")
  },
  {
    id: "3",
    title: "Organisation événement",
    description: "Soirée de gala annuelle",
    amount: 800000,
    category: DepenseCategory.ACTIVITE,
    status: DepenseStatus.SUBMITTED,
    submittedBy: "Marie Martin",
    justificatifs: ["/uploads/devis-001.pdf", "/uploads/devis-002.pdf"],
    createdAt: new Date("2025-01-19"),
    updatedAt: new Date("2025-01-19")
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    userId: "1",
    userName: "Jean Dupont",
    action: "Validation dépense",
    entity: "depense",
    entityId: "1",
    details: 'Dépense "Achat matériel bureau" approuvée',
    createdAt: new Date("2025-01-09"),
    updatedAt: new Date("2025-01-09")
  },
  {
    id: "2",
    userId: "2",
    userName: "Marie Martin",
    action: "Ajout cotisation",
    entity: "cotisation",
    entityId: "1",
    details: "Cotisation de Jean Dupont - Janvier 2025",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05")
  }
];
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
};

export const mockStats: StatFinanciere = {
  totalCotisations: 150000,
  totalDons: 85000,
  totalDepenses: 95000,
  soldeActuel: 140000,
  evolutionMensuelle: [
    { mois: "Jan", cotisations: 20000, dons: 5000, depenses: 8000 },
    { mois: "Fév", cotisations: 18000, dons: 7000, depenses: 10000 },
    { mois: "Mar", cotisations: 22000, dons: 15000, depenses: 12000 },
    { mois: "Avr", cotisations: 25000, dons: 8000, depenses: 15000 },
    { mois: "Mai", cotisations: 20000, dons: 10000, depenses: 9000 },
    { mois: "Juin", cotisations: 23000, dons: 12000, depenses: 11000 },
    { mois: "Juil", cotisations: 22000, dons: 6000, depenses: 13000 },
    { mois: "Août", cotisations: 0, dons: 8000, depenses: 7000 }
  ],
  depensesParCategorie: [
    { categorie: "Fonctionnement", montant: 45000, pourcentage: 47 },
    { categorie: "Activités", montant: 35000, pourcentage: 37 },
    { categorie: "Investissement", montant: 15000, pourcentage: 16 }
  ]
};

// Données mock pour les étudiants
export const mockStudents: Student[] = [
  {
    id: "1",
    userId: "4",
    matricule: "STU-2024-001",
    dateOfBirth: new Date("2000-05-15"),
    gender: "M",
    level: "L3",
    faculty: "Sciences et Technologies",
    fieldOfStudy: "Informatique",
    country: "Congo",
    city: "Brazzaville",
    status: StudentStatus.ACTIVE,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "2",
    userId: "5",
    matricule: "STU-2024-002",
    dateOfBirth: new Date("2001-08-22"),
    gender: "F",
    level: "M1",
    faculty: "Sciences Économiques",
    fieldOfStudy: "Gestion",
    country: "Gabon",
    city: "Libreville",
    status: StudentStatus.ACTIVE,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "3",
    userId: "6",
    matricule: "STU-2024-003",
    dateOfBirth: new Date("1999-12-10"),
    gender: "M",
    level: "L2",
    faculty: "Droit",
    fieldOfStudy: "Droit Public",
    country: "Congo",
    city: "Pointe-Noire",
    status: StudentStatus.ACTIVE,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "4",
    userId: "7",
    matricule: "STU-2023-045",
    dateOfBirth: new Date("1998-03-18"),
    gender: "F",
    level: "M2",
    faculty: "Sciences et Technologies",
    fieldOfStudy: "Mathématiques",
    country: "Congo",
    city: "Brazzaville",
    status: StudentStatus.GRADUATED,
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: "5",
    userId: "8",
    matricule: "STU-2024-004",
    dateOfBirth: new Date("2002-07-05"),
    gender: "M",
    level: "L1",
    faculty: "Lettres et Sciences Humaines",
    fieldOfStudy: "Philosophie",
    country: "Congo",
    city: "Brazzaville",
    status: StudentStatus.ON_LEAVE,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15")
  }
];

// Données mock pour les résidences
export const mockResidences: Residence[] = [
  {
    id: "1",
    studentId: "1",
    roomNumber: "A-101",
    buildingName: "Bloc A",
    startDate: new Date("2024-09-01"),
    totalCost: 1200000,
    amountPaid: 1200000,
    debt: 0,
    isDebtor: false,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "2",
    studentId: "2",
    roomNumber: "B-205",
    buildingName: "Bloc B",
    startDate: new Date("2024-09-01"),
    totalCost: 1500000,
    amountPaid: 1000000,
    debt: 500000,
    isDebtor: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "3",
    studentId: "3",
    roomNumber: "C-312",
    buildingName: "Bloc C",
    startDate: new Date("2024-09-01"),
    totalCost: 1800000,
    amountPaid: 1800000,
    debt: 0,
    isDebtor: false,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "4",
    studentId: "5",
    roomNumber: "A-108",
    buildingName: "Bloc A",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-11-15"),
    totalCost: 1200000,
    amountPaid: 800000,
    debt: 400000,
    isDebtor: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15")
  }
];

// Utilisateurs supplémentaires pour les étudiants
export const mockStudentUsers: User[] = [
  {
    id: "4",
    name: "Koffi Kouassi",
    email: "koffi.kouassi@univ-congo.cg",
    role: UserRole.MEMBRE,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "5",
    name: "Amina Diallo",
    email: "amina.diallo@univ-congo.cg",
    role: UserRole.MEMBRE,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "6",
    name: "Jean-Baptiste Mboumba",
    email: "jean.mboumba@univ-congo.cg",
    role: UserRole.MEMBRE,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "7",
    name: "Marie-Claire Nzouzi",
    email: "marie.nzouzi@univ-congo.cg",
    role: UserRole.MEMBRE,
    isActive: true,
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: "8",
    name: "David Mvoula",
    email: "david.mvoula@univ-congo.cg",
    role: UserRole.MEMBRE,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15")
  }
];

// Données mock pour les quartiers
export const mockQuarters: Quarter[] = [
  {
    id: "1",
    name: "Quartier Bacongo",
    city: "Brazzaville",
    address: "Avenue de l'Indépendance",
    description: "Quartier résidentiel proche de l'université",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2",
    name: "Quartier Poto-Poto",
    city: "Brazzaville",
    address: "Boulevard Lumumba",
    description: "Quartier central avec bon accès aux transports",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "3",
    name: "Quartier Moungali",
    city: "Brazzaville",
    address: "Rue de la Paix",
    description: "Quartier calme et sécurisé",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

// Données mock pour les bâtiments
export const mockBuildings: Building[] = [
  {
    id: "1",
    name: "Bloc A",
    quarterId: "1",
    address: "Avenue de l'Indépendance, Bacongo",
    totalRooms: 20,
    description: "Bâtiment principal avec 20 chambres",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2",
    name: "Bloc B",
    quarterId: "1",
    address: "Avenue de l'Indépendance, Bacongo",
    totalRooms: 15,
    description: "Bâtiment secondaire avec 15 chambres",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "3",
    name: "Bloc C",
    quarterId: "2",
    address: "Boulevard Lumumba, Poto-Poto",
    totalRooms: 25,
    description: "Grand bâtiment avec 25 chambres",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "4",
    name: "Résidence Moungali",
    quarterId: "3",
    address: "Rue de la Paix, Moungali",
    totalRooms: 30,
    description: "Résidence moderne avec 30 chambres",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

// Données mock pour les chambres
export const mockRooms: Room[] = [
  // Bloc A
  {
    id: "1",
    roomNumber: "A-101",
    buildingId: "1",
    capacity: 2,
    monthlyRent: 150000,
    status: RoomStatus.OCCUPIED,
    description: "Chambre double avec balcon",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2",
    roomNumber: "A-102",
    buildingId: "1",
    capacity: 2,
    monthlyRent: 150000,
    status: RoomStatus.OCCUPIED,
    description: "Chambre double",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "3",
    roomNumber: "A-103",
    buildingId: "1",
    capacity: 1,
    monthlyRent: 100000,
    status: RoomStatus.AVAILABLE,
    description: "Chambre simple",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  // Bloc B
  {
    id: "4",
    roomNumber: "B-201",
    buildingId: "2",
    capacity: 2,
    monthlyRent: 180000,
    status: RoomStatus.OCCUPIED,
    description: "Chambre double avec vue",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "5",
    roomNumber: "B-202",
    buildingId: "2",
    capacity: 3,
    monthlyRent: 200000,
    status: RoomStatus.OCCUPIED,
    description: "Chambre triple",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "6",
    roomNumber: "B-203",
    buildingId: "2",
    capacity: 2,
    monthlyRent: 150000,
    status: RoomStatus.MAINTENANCE,
    description: "Chambre double en rénovation",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  // Bloc C
  {
    id: "7",
    roomNumber: "C-301",
    buildingId: "3",
    capacity: 2,
    monthlyRent: 160000,
    status: RoomStatus.OCCUPIED,
    description: "Chambre double",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "8",
    roomNumber: "C-302",
    buildingId: "3",
    capacity: 1,
    monthlyRent: 120000,
    status: RoomStatus.AVAILABLE,
    description: "Chambre simple",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "9",
    roomNumber: "C-303",
    buildingId: "3",
    capacity: 2,
    monthlyRent: 150000,
    status: RoomStatus.RESERVED,
    description: "Chambre double réservée",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
];

// Données mock pour les occupations
export const mockRoomOccupations: RoomOccupation[] = [
  {
    id: "1",
    roomId: "1",
    studentId: "1",
    startDate: new Date("2024-09-01"),
    monthlyRent: 150000,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "2",
    roomId: "1",
    studentId: "2",
    startDate: new Date("2024-09-01"),
    monthlyRent: 150000,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "3",
    roomId: "4",
    studentId: "3",
    startDate: new Date("2024-09-01"),
    monthlyRent: 180000,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "4",
    roomId: "5",
    studentId: "4",
    startDate: new Date("2024-09-01"),
    monthlyRent: 200000,
    isActive: true,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-09-01")
  },
  {
    id: "5",
    roomId: "7",
    studentId: "5",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-11-15"),
    monthlyRent: 160000,
    isActive: false,
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date("2024-11-15")
  }
];

// Données mock pour les paiements de loyer
export const mockRentPayments: RentPayment[] = [
  {
    id: "1",
    occupationId: "1",
    studentId: "1",
    amount: 150000,
    paymentDate: new Date("2025-01-05"),
    period: "Janvier 2025",
    paymentMethod: "Mobile Money",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05")
  },
  {
    id: "2",
    occupationId: "2",
    studentId: "2",
    amount: 150000,
    paymentDate: new Date("2025-01-03"),
    period: "Janvier 2025",
    paymentMethod: "Espèces",
    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-03")
  },
  {
    id: "3",
    occupationId: "3",
    studentId: "3",
    amount: 180000,
    paymentDate: new Date("2025-01-10"),
    period: "Janvier 2025",
    paymentMethod: "Virement bancaire",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10")
  },
  {
    id: "4",
    occupationId: "4",
    studentId: "4",
    amount: 100000,
    paymentDate: new Date("2025-01-08"),
    period: "Janvier 2025",
    paymentMethod: "Mobile Money",
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-08")
  }
];