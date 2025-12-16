/** @format */

"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Users,
  Home,
  MapPin,
  Loader2
} from "lucide-react";
import { ResidenceApiService } from "@/services/residenceApi";
import { StudentApiService } from "@/services/studentApi";
import {
  RoomStatus,
  type Room,
  type Quarter,
  type Building,
  type RoomOccupation,
  type RentPayment,
  type Student,
  type User
} from "@/types";
import { CURRENCY } from "@/lib/constants";

// Composant pour ajouter un étudiant à une chambre
function AddStudentToRoomModal({
  room,
  open,
  onClose,
  onAdd,
  occupations,
  students,
  users
}: {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onAdd: (studentId: string, monthlyRent: number, startDate: Date) => void;
  occupations: RoomOccupation[];
  students: Student[];
  users: User[];
}) {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [monthlyRent, setMonthlyRent] = useState<number>(
    room?.monthlyRent || 0
  );
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const availableStudents = useMemo(() => {
    // Étudiants qui n&apos;ont pas déjà une occupation active
    const occupiedStudentIds = occupations
      .filter((occ: RoomOccupation) => occ.isActive)
      .map((occ: RoomOccupation) => occ.studentId);
    return students.filter(
      (student: Student) => !occupiedStudentIds.includes(student.id)
    );
  }, [occupations, students]);

  const handleSubmit = () => {
    if (selectedStudent && monthlyRent > 0 && startDate) {
      onAdd(selectedStudent, monthlyRent, new Date(startDate));
      setSelectedStudent("");
      setMonthlyRent(room?.monthlyRent || 0);
      setStartDate(new Date().toISOString().split("T")[0]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Ajouter un étudiant à la chambre {room?.roomNumber || ""}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Étudiant</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((student: Student) => {
                  const user = users.find((u: User) => u.id === student.userId);
                  return (
                    <SelectItem key={student.id} value={student.id}>
                      {user?.name} - {student.matricule}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Loyer mensuel (FCFA)</label>
            <Input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Date d&apos;entrée</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ResidencePage() {
  // États pour les données
  const [quarters, setQuarters] = useState<Quarter[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [occupations, setOccupations] = useState<RoomOccupation[]>([]);
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // États pour le chargement et les erreurs
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres et l'interface
  const [searchQuery, setSearchQuery] = useState("");
  const [quarterFilter, setQuarterFilter] = useState<string>("all");
  const [buildingFilter, setBuildingFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms");

  // Charger les données depuis l'API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Charger toutes les données en parallèle
        const [
          quartersData,
          buildingsData,
          roomsData,
          occupationsData,
          paymentsData,
          studentsData,
          usersData
        ] = await Promise.all([
          ResidenceApiService.getQuarters(),
          ResidenceApiService.getBuildings(),
          ResidenceApiService.getRooms(),
          ResidenceApiService.getOccupations(),
          ResidenceApiService.getRentPayments(),
          StudentApiService.getStudents(),
          StudentApiService.getUsers()
        ]);

        setQuarters(quartersData);
        setBuildings(buildingsData);
        setRooms(roomsData);
        setOccupations(occupationsData);
        setPayments(paymentsData);
        setStudents(studentsData);
        setUsers(usersData);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue lors du chargement des données"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculer le nombre d'occupants par chambre
  const roomOccupancy = useMemo(() => {
    const occupancy: Record<string, number> = {};
    occupations
      .filter((occ) => occ.isActive)
      .forEach((occ) => {
        occupancy[occ.roomId] = (occupancy[occ.roomId] || 0) + 1;
      });
    return occupancy;
  }, [occupations]);

  // Combiner les données des chambres avec leurs informations
  const roomsWithDetails = useMemo(() => {
    return rooms.map((room) => {
      const building = buildings.find((b) => b.id === room.buildingId);
      const quarter = building
        ? quarters.find((q) => q.id === building.quarterId)
        : null;
      const occupants = occupations.filter(
        (occ) => occ.roomId === room.id && occ.isActive
      );
      const occupantsDetails = occupants.map((occ) => {
        const student = students.find((s) => s.id === occ.studentId);
        const user = student
          ? users.find((u) => u.id === student.userId)
          : null;
        return { occupation: occ, student, user };
      });

      return {
        room,
        building,
        quarter,
        occupantsCount: occupants.length,
        occupantsDetails
      };
    });
  }, [rooms, buildings, quarters, occupations, students, users]);

  // Filtrer les chambres
  const filteredRooms = roomsWithDetails.filter((item) => {
    const matchesSearch =
      item.room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.building?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quarter?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    const matchesQuarter =
      quarterFilter === "all" || item.quarter?.id === quarterFilter;
    const matchesBuilding =
      buildingFilter === "all" || item.building?.id === buildingFilter;
    const matchesStatus =
      statusFilter === "all" || item.room.status === statusFilter;
    return matchesSearch && matchesQuarter && matchesBuilding && matchesStatus;
  });

  // Statistiques
  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(
      (r) => r.status === RoomStatus.OCCUPIED
    ).length;
    const availableRooms = rooms.filter(
      (r) => r.status === RoomStatus.AVAILABLE
    ).length;
    const totalOccupants = Object.values(roomOccupancy).reduce(
      (sum, count) => sum + count,
      0
    );
    const totalMonthlyRevenue = roomsWithDetails
      .filter((item) => item.room.status === RoomStatus.OCCUPIED)
      .reduce((sum, item) => {
        return (
          sum +
          item.occupantsDetails.reduce(
            (roomSum, occ) => roomSum + occ.occupation.monthlyRent,
            0
          )
        );
      }, 0);

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalOccupants,
      totalMonthlyRevenue
    };
  }, [rooms, roomOccupancy, roomsWithDetails]);

  const getStatusBadge = (status: RoomStatus) => {
    const variants = {
      [RoomStatus.AVAILABLE]: "default",
      [RoomStatus.OCCUPIED]: "secondary",
      [RoomStatus.MAINTENANCE]: "destructive",
      [RoomStatus.RESERVED]: "secondary"
    } as const;

    const labels = {
      [RoomStatus.AVAILABLE]: "Disponible",
      [RoomStatus.OCCUPIED]: "Occupée",
      [RoomStatus.MAINTENANCE]: "Maintenance",
      [RoomStatus.RESERVED]: "Réservée"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleAddStudent = async (
    studentId: string,
    monthlyRent: number,
    startDate: Date
  ) => {
    if (!selectedRoom) return;

    try {
      // Créer l'occupation via l'API
      const newOccupation = await ResidenceApiService.createOccupation({
        roomId: selectedRoom.id,
        studentId,
        startDate,
        monthlyRent,
        isActive: true
      });

      // Mettre à jour la liste des occupations
      setOccupations((prev) => [...prev, newOccupation]);

      // Mettre à jour le statut de la chambre si nécessaire
      if (selectedRoom.status === RoomStatus.AVAILABLE) {
        await ResidenceApiService.updateRoom(selectedRoom.id, {
          status: RoomStatus.OCCUPIED
        });
        setRooms((prev) =>
          prev.map((r) =>
            r.id === selectedRoom.id ? { ...r, status: RoomStatus.OCCUPIED } : r
          )
        );
      }

      alert(
        `Étudiant ajouté à la chambre ${
          selectedRoom.roomNumber
        } avec un loyer de ${monthlyRent.toLocaleString()} ${CURRENCY}`
      );
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'étudiant:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'ajout de l'étudiant"
      );
    }
  };

  // Afficher un état de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Résidences</h1>
          <p className="text-muted-foreground mt-1">
            Gestion complète des résidences étudiantes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total chambres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {stats.totalRooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Occupées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {stats.occupiedRooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {stats.availableRooms}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total occupants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-purple-600">
              {stats.totalOccupants}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Revenus mensuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {stats.totalMonthlyRevenue.toLocaleString()} {CURRENCY}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets et contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rooms">Chambres</TabsTrigger>
          <TabsTrigger value="buildings">Bâtiments</TabsTrigger>
          <TabsTrigger value="quarters">Quartiers</TabsTrigger>
          <TabsTrigger value="rents">Loyers</TabsTrigger>
        </TabsList>

        {/* Onglet Chambres */}
        <TabsContent value="rooms" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher une chambre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={quarterFilter} onValueChange={setQuarterFilter}>
                  <SelectTrigger className="w-48">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Quartier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les quartiers</SelectItem>
                    {quarters.map((quarter) => (
                      <SelectItem key={quarter.id} value={quarter.id}>
                        {quarter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={buildingFilter}
                  onValueChange={setBuildingFilter}>
                  <SelectTrigger className="w-48">
                    <Home className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Bâtiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les bâtiments</SelectItem>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value={RoomStatus.AVAILABLE}>
                      Disponible
                    </SelectItem>
                    <SelectItem value={RoomStatus.OCCUPIED}>Occupée</SelectItem>
                    <SelectItem value={RoomStatus.MAINTENANCE}>
                      Maintenance
                    </SelectItem>
                    <SelectItem value={RoomStatus.RESERVED}>
                      Réservée
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chambre</TableHead>
                    <TableHead>Bâtiment</TableHead>
                    <TableHead>Quartier</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Occupants</TableHead>
                    <TableHead>Loyer mensuel</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground">
                        Aucune chambre trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRooms.map((item) => (
                      <TableRow key={item.room.id}>
                        <TableCell className="font-medium">
                          {item.room.roomNumber}
                        </TableCell>
                        <TableCell>{item.building?.name || "-"}</TableCell>
                        <TableCell>{item.quarter?.name || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {item.room.capacity}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.occupantsCount}/{item.room.capacity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.room.monthlyRent.toLocaleString()} {CURRENCY}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.room.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {item.room.status === RoomStatus.AVAILABLE &&
                              item.occupantsCount < item.room.capacity && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRoom(item.room);
                                    setIsAddStudentModalOpen(true);
                                  }}>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Ajouter
                                </Button>
                              )}
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Détails
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Bâtiments */}
        <TabsContent value="buildings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des bâtiments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Quartier</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Nombre de chambres</TableHead>
                    <TableHead>Chambres occupées</TableHead>
                    <TableHead>Chambres disponibles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {buildings.map((building) => {
                    const buildingRooms = rooms.filter(
                      (r) => r.buildingId === building.id
                    );
                    const occupiedCount = buildingRooms.filter(
                      (r) => r.status === RoomStatus.OCCUPIED
                    ).length;
                    const availableCount = buildingRooms.filter(
                      (r) => r.status === RoomStatus.AVAILABLE
                    ).length;
                    const quarter = quarters.find(
                      (q) => q.id === building.quarterId
                    );
                    return (
                      <TableRow key={building.id}>
                        <TableCell className="font-medium">
                          {building.name}
                        </TableCell>
                        <TableCell>{quarter?.name || "-"}</TableCell>
                        <TableCell>{building.address || "-"}</TableCell>
                        <TableCell>{building.totalRooms}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{occupiedCount}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{availableCount}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Quartiers */}
        <TabsContent value="quarters" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Liste des quartiers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Ville</TableHead>
                    <TableHead>Adresse</TableHead>
                    <TableHead>Nombre de bâtiments</TableHead>
                    <TableHead>Total chambres</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarters.map((quarter) => {
                    const quarterBuildings = buildings.filter(
                      (b) => b.quarterId === quarter.id
                    );
                    const totalRooms = quarterBuildings.reduce(
                      (sum, b) => sum + b.totalRooms,
                      0
                    );
                    return (
                      <TableRow key={quarter.id}>
                        <TableCell className="font-medium">
                          {quarter.name}
                        </TableCell>
                        <TableCell>{quarter.city}</TableCell>
                        <TableCell>{quarter.address || "-"}</TableCell>
                        <TableCell>{quarterBuildings.length}</TableCell>
                        <TableCell>{totalRooms}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Loyers */}
        <TabsContent value="rents" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des loyers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Chambre</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Date de paiement</TableHead>
                    <TableHead>Méthode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const occupation = occupations.find(
                      (occ) => occ.id === payment.occupationId
                    );
                    const room = occupation
                      ? rooms.find((r) => r.id === occupation.roomId)
                      : null;
                    const student = students.find(
                      (s) => s.id === payment.studentId
                    );
                    const user = student
                      ? users.find((u) => u.id === student.userId)
                      : null;
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {user?.name || "-"}
                        </TableCell>
                        <TableCell>{room?.roomNumber || "-"}</TableCell>
                        <TableCell>{payment.period}</TableCell>
                        <TableCell>
                          {payment.amount.toLocaleString()} {CURRENCY}
                        </TableCell>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString(
                            "fr-FR"
                          )}
                        </TableCell>
                        <TableCell>{payment.paymentMethod || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal pour ajouter un étudiant */}
      <AddStudentToRoomModal
        room={selectedRoom}
        open={isAddStudentModalOpen}
        onClose={() => {
          setIsAddStudentModalOpen(false);
          setSelectedRoom(null);
        }}
        onAdd={handleAddStudent}
        occupations={occupations}
        students={students}
        users={users}
      />
    </div>
  );
}
