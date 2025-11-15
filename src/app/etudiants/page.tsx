/** @format */

"use client";

import { useState, useMemo } from "react";
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
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Download, Upload, Search, Filter, Eye } from "lucide-react";
import { mockStudents, mockStudentUsers, mockResidences } from "@/lib/mockData";
import { StudentStatus, Student } from "@/types";
import { StudentDetailModal } from "@/components/organisms/StudentDetailModal";

export default function EtudiantsPage() {
  const [students] = useState(mockStudents);
  const [users] = useState(mockStudentUsers);
  const [residences] = useState(mockResidences);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combiner les données des étudiants avec leurs utilisateurs et résidences
  const studentsWithDetails = useMemo(() => {
    return students.map((student) => {
      const user = users.find((u) => u.id === student.userId);
      const residence = residences.find((r) => r.studentId === student.id);
      return {
        student,
        user: user || null,
        residence: residence || null
      };
    });
  }, [students, users, residences]);

  const getStatusBadge = (status: StudentStatus) => {
    const variants = {
      [StudentStatus.ACTIVE]: "default",
      [StudentStatus.GRADUATED]: "secondary",
      [StudentStatus.SUSPENDED]: "destructive",
      [StudentStatus.WITHDRAWN]: "destructive",
      [StudentStatus.ON_LEAVE]: "secondary"
    } as const;

    const labels = {
      [StudentStatus.ACTIVE]: "Actif",
      [StudentStatus.GRADUATED]: "Diplômé",
      [StudentStatus.SUSPENDED]: "Suspendu",
      [StudentStatus.WITHDRAWN]: "Retiré",
      [StudentStatus.ON_LEAVE]: "En congé"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const filteredStudents = studentsWithDetails.filter((item) => {
    const matchesSearch =
      item.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.student.matricule
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.student.fieldOfStudy
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      false;
    const matchesStatus =
      statusFilter === "all" || item.student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStudents = filteredStudents.length;
  const activeStudents = filteredStudents.filter(
    (item) => item.student.status === StudentStatus.ACTIVE
  ).length;
  const graduatedStudents = filteredStudents.filter(
    (item) => item.student.status === StudentStatus.GRADUATED
  ).length;

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSave = (
    studentId: string,
    section: string,
    data: Record<string, unknown>
  ) => {
    // Ici, vous pouvez implémenter la logique de sauvegarde
    // Pour l'instant, on simule juste la sauvegarde
    console.log("Sauvegarde:", { studentId, section, data });
    // Dans une vraie application, vous feriez un appel API ici
    alert(`Section "${section}" sauvegardée pour l'étudiant ${studentId}`);
  };

  const selectedStudentDetails = useMemo(() => {
    if (!selectedStudent) return { student: null, user: null, residence: null };
    const user = users.find((u) => u.id === selectedStudent.userId);
    const residence = residences.find(
      (r) => r.studentId === selectedStudent.id
    );
    return {
      student: selectedStudent,
      user: user || null,
      residence: residence || null
    };
  }, [selectedStudent, users, residences]);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Etudiants</h1>
          <p className="text-muted-foreground mt-1">Gestion des étudiants</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau étudiant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un étudiant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-xs md:text-sm font-medium">
                    Nom et prénom
                  </label>
                  <Input type="text" placeholder="Nom complet" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">
                    Email
                  </label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">
                    Matricule
                  </label>
                  <Input type="text" placeholder="STU-2024-XXX" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">
                    Niveau
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L1">L1</SelectItem>
                      <SelectItem value="L2">L2</SelectItem>
                      <SelectItem value="L3">L3</SelectItem>
                      <SelectItem value="M1">M1</SelectItem>
                      <SelectItem value="M2">M2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Ajouter</Button>
              </div>
            </DialogContent>
          </Dialog>
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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total étudiants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Étudiants actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {activeStudents}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Diplômés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {graduatedStudents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un étudiant (nom, matricule, filière)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value={StudentStatus.ACTIVE}>Actif</SelectItem>
                <SelectItem value={StudentStatus.GRADUATED}>Diplômé</SelectItem>
                <SelectItem value={StudentStatus.SUSPENDED}>
                  Suspendu
                </SelectItem>
                <SelectItem value={StudentStatus.WITHDRAWN}>Retiré</SelectItem>
                <SelectItem value={StudentStatus.ON_LEAVE}>En congé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom et prénom</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Filière</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground">
                    Aucun étudiant trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((item) => (
                  <TableRow key={item.student.id}>
                    <TableCell className="font-medium">
                      {item.user?.name || "-"}
                    </TableCell>
                    <TableCell>{item.student.matricule}</TableCell>
                    <TableCell>{item.student.fieldOfStudy || "-"}</TableCell>
                    <TableCell>{item.student.level || "-"}</TableCell>
                    <TableCell>{item.student.city || "-"}</TableCell>
                    <TableCell>
                      {getStatusBadge(
                        item.student.status || StudentStatus.ACTIVE
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(item.student)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de détails */}
      <StudentDetailModal
        student={selectedStudentDetails.student}
        user={selectedStudentDetails.user}
        residence={selectedStudentDetails.residence}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
