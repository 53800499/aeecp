/** @format */

// Types de base
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Utilisateurs et rôles
export enum UserRole {
  PRESIDENT = "president",
  TRESORIER = "tresorier",
  TRESORIER_ADJOINT = "tresorier_adjoint",
  MEMBRE = "membre",
  INVITE = "invite",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  Student = "student"
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

// Cotisations
export enum CotisationStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue"
}

export interface Cotisation extends BaseEntity {
  memberId: string;
  memberName: string;
  amount: number;
  period: string;
  status: CotisationStatus;
  paymentMethod?: string;
  paymentDate?: Date;
}

// Dons
export interface Don extends BaseEntity {
  donorName: string;
  amount: number;
  description?: string;
  receiptGenerated: boolean;
  receiptUrl?: string;
}

// Dépenses
export enum DepenseCategory {
  FONCTIONNEMENT = "fonctionnement",
  ACTIVITE = "activite",
  EQUIPEMENT = "equipement",
  AUTRE = "autre"
}

export enum DepenseStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export interface Depense extends BaseEntity {
  title: string;
  description: string;
  amount: number;
  category: DepenseCategory;
  status: DepenseStatus;
  submittedBy: string;
  approvedBy?: string;
  justificatifs: string[];
  rejectionReason?: string;
}

// Statistiques
export interface DashboardStats {
  totalCotisations: number;
  totalDons: number;
  totalDepenses: number;
  solde: number;
  cotisationsPending: number;
  depensesPending: number;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface TimeSeriesData {
  date: string;
  recettes: number;
  depenses: number;
}

// Permissions
export interface Permission {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
}

export interface RolePermissions {
  cotisations: Permission;
  dons: Permission;
  depenses: Permission;
  users: Permission;
  reports: Permission;
}

// Audit Log
export interface AuditLog extends BaseEntity {
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}
export interface StatFinanciere {
  totalCotisations: number;
  totalDons: number;
  totalDepenses: number;
  soldeActuel: number;
  evolutionMensuelle: {
    mois: string;
    cotisations: number;
    dons: number;
    depenses: number;
  }[];
  depensesParCategorie: {
    categorie: string;
    montant: number;
    pourcentage: number;
  }[];
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  UNDISCLOSED = "undisclosed"
}

export enum StudentStatus {
  ACTIVE = "active",
  GRADUATED = "graduated",
  SUSPENDED = "suspended",
  WITHDRAWN = "withdrawn",
  ON_LEAVE = "on_leave"
}

export interface Student extends BaseEntity {
  userId: string; // Référence vers l'utilisateur global
  matricule: string; // Matricule de l'étudiant
  dateOfBirth?: Date; // Date de naissance
  gender?: "M" | "F"; // Sexe
  level?: string; // Niveau (L1, L2, L3, M1, M2...)
  faculty?: string; // Faculté / département
  fieldOfStudy?: string; // Filière
  country?: string; // Pays actuel
  city?: string; // Ville actuelle
  status?: StudentStatus; // Statut de l'étudiant
}

export interface Residence extends BaseEntity {
  studentId: string; // Référence vers Student
  roomNumber: string; // Numéro de chambre
  buildingName: string; // Nom du bâtiment / bloc
  startDate: Date; // Début du séjour
  endDate?: Date; // Fin du séjour (optionnel)
  totalCost: number; // Coût total
  amountPaid: number; // Montant déjà payé
  debt: number; // totalCost - amountPaid
  isDebtor: boolean; // True si debt > 0
}

// Quartier
export interface Quarter extends BaseEntity {
  name: string; // Nom du quartier
  city: string; // Ville
  address?: string; // Adresse complète
  description?: string; // Description du quartier
}

// Bâtiment
export interface Building extends BaseEntity {
  name: string; // Nom du bâtiment
  quarterId: string; // Référence vers Quarter
  address?: string; // Adresse du bâtiment
  totalRooms: number; // Nombre total de chambres
  description?: string; // Description
}

// Chambre
export interface Room extends BaseEntity {
  roomNumber: string; // Numéro de chambre (ex: A-101)
  buildingId: string; // Référence vers Building
  capacity: number; // Capacité maximale (nombre de personnes)
  monthlyRent: number; // Loyer mensuel
  status: RoomStatus; // Statut de la chambre
  description?: string; // Description de la chambre
}

export enum RoomStatus {
  AVAILABLE = "available", // Disponible
  OCCUPIED = "occupied", // Occupée
  MAINTENANCE = "maintenance", // En maintenance
  RESERVED = "reserved" // Réservée
}

// Occupation d'une chambre par un étudiant
export interface RoomOccupation extends BaseEntity {
  roomId: string; // Référence vers Room
  studentId: string; // Référence vers Student
  startDate: Date; // Date d'entrée
  endDate?: Date; // Date de sortie (optionnel)
  monthlyRent: number; // Loyer mensuel pour cet étudiant
  isActive: boolean; // Occupation active ou non
}

// Paiement de loyer
export interface RentPayment extends BaseEntity {
  occupationId: string; // Référence vers RoomOccupation
  studentId: string; // Référence vers Student
  amount: number; // Montant payé
  paymentDate: Date; // Date de paiement
  period: string; // Période (ex: "Janvier 2025")
  paymentMethod?: string; // Méthode de paiement
  receiptUrl?: string; // URL du reçu
}