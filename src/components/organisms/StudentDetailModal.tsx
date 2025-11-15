/** @format */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Student, StudentStatus, Residence, User } from "@/types";
import { CURRENCY } from "@/lib/constants";
import { Edit2, Save, X } from "lucide-react";

interface StudentDetailModalProps {
  student: Student | null;
  user: User | null;
  residence: Residence | null;
  open: boolean;
  onClose: () => void;
  onSave: (studentId: string, section: string, data: Record<string, unknown>) => void;
}

export function StudentDetailModal({
  student,
  user,
  residence,
  open,
  onClose,
  onSave
}: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // États pour les informations personnelles
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dateOfBirth: student?.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().split("T")[0]
      : "",
    gender: student?.gender || "",
    phone: "" // À ajouter dans les types si nécessaire
  });

  // États pour les informations académiques
  const [academicInfo, setAcademicInfo] = useState({
    matricule: student?.matricule || "",
    level: student?.level || "",
    faculty: student?.faculty || "",
    fieldOfStudy: student?.fieldOfStudy || "",
    status: student?.status || StudentStatus.ACTIVE
  });

  // États pour les informations de localisation
  const [locationInfo, setLocationInfo] = useState({
    country: student?.country || "",
    city: student?.city || ""
  });

  // États pour les informations de résidence
  const [residenceInfo, setResidenceInfo] = useState({
    roomNumber: residence?.roomNumber || "",
    buildingName: residence?.buildingName || "",
    startDate: residence?.startDate
      ? new Date(residence.startDate).toISOString().split("T")[0]
      : "",
    endDate: residence?.endDate
      ? new Date(residence.endDate).toISOString().split("T")[0]
      : "",
    totalCost: residence?.totalCost || 0,
    amountPaid: residence?.amountPaid || 0
  });

  useEffect(() => {
    if (student && user) {
      setPersonalInfo({
        name: user.name || "",
        email: user.email || "",
        dateOfBirth: student.dateOfBirth
          ? new Date(student.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: student.gender || "",
        phone: ""
      });
      setAcademicInfo({
        matricule: student.matricule || "",
        level: student.level || "",
        faculty: student.faculty || "",
        fieldOfStudy: student.fieldOfStudy || "",
        status: student.status || StudentStatus.ACTIVE
      });
      setLocationInfo({
        country: student.country || "",
        city: student.city || ""
      });
    }
    if (residence) {
      setResidenceInfo({
        roomNumber: residence.roomNumber || "",
        buildingName: residence.buildingName || "",
        startDate: residence.startDate
          ? new Date(residence.startDate).toISOString().split("T")[0]
          : "",
        endDate: residence.endDate
          ? new Date(residence.endDate).toISOString().split("T")[0]
          : "",
        totalCost: residence.totalCost || 0,
        amountPaid: residence.amountPaid || 0
      });
    }
  }, [student, user, residence]);

  const handleSave = (section: string) => {
    if (!student) return;

    let dataToSave: Record<string, unknown> = {};
    switch (section) {
      case "personal":
        dataToSave = {
          ...personalInfo,
          dateOfBirth: personalInfo.dateOfBirth
            ? new Date(personalInfo.dateOfBirth)
            : undefined,
          gender: personalInfo.gender as "M" | "F" | undefined
        };
        break;
      case "academic":
        dataToSave = {
          ...academicInfo,
          status: academicInfo.status as StudentStatus
        };
        break;
      case "location":
        dataToSave = locationInfo;
        break;
      case "residence":
        dataToSave = {
          ...residenceInfo,
          startDate: residenceInfo.startDate
            ? new Date(residenceInfo.startDate)
            : undefined,
          endDate: residenceInfo.endDate
            ? new Date(residenceInfo.endDate)
            : undefined
        };
        break;
    }

    onSave(student.id, section, dataToSave);
    setEditingSection(null);
  };

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

  if (!student || !user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Détails de l'étudiant - {user.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Informations</TabsTrigger>
            <TabsTrigger value="academic">Académique</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
            <TabsTrigger value="residence">Résidence</TabsTrigger>
          </TabsList>

          {/* Onglet Informations Personnelles */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Informations Personnelles</CardTitle>
                {editingSection !== "personal" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection("personal")}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSection(null);
                        // Réinitialiser les valeurs
                        if (student && user) {
                          setPersonalInfo({
                            name: user.name || "",
                            email: user.email || "",
                            dateOfBirth: student.dateOfBirth
                              ? new Date(student.dateOfBirth)
                                  .toISOString()
                                  .split("T")[0]
                              : "",
                            gender: student.gender || "",
                            phone: ""
                          });
                        }
                      }}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave("personal")}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nom complet</label>
                    {editingSection === "personal" ? (
                      <Input
                        value={personalInfo.name}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            name: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    {editingSection === "personal" ? (
                      <Input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            email: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Date de naissance
                    </label>
                    {editingSection === "personal" ? (
                      <Input
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            dateOfBirth: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.dateOfBirth
                          ? new Date(student.dateOfBirth).toLocaleDateString(
                              "fr-FR"
                            )
                          : "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sexe</label>
                    {editingSection === "personal" ? (
                      <Select
                        value={personalInfo.gender}
                        onValueChange={(value) =>
                          setPersonalInfo({
                            ...personalInfo,
                            gender: value
                          })
                        }>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Masculin</SelectItem>
                          <SelectItem value="F">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.gender === "M" ? "Masculin" : "Féminin"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Informations Académiques */}
          <TabsContent value="academic" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Informations Académiques</CardTitle>
                {editingSection !== "academic" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection("academic")}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSection(null);
                        if (student) {
                          setAcademicInfo({
                            matricule: student.matricule || "",
                            level: student.level || "",
                            faculty: student.faculty || "",
                            fieldOfStudy: student.fieldOfStudy || "",
                            status: student.status || StudentStatus.ACTIVE
                          });
                        }
                      }}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave("academic")}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Matricule</label>
                    {editingSection === "academic" ? (
                      <Input
                        value={academicInfo.matricule}
                        onChange={(e) =>
                          setAcademicInfo({
                            ...academicInfo,
                            matricule: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.matricule}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Niveau</label>
                    {editingSection === "academic" ? (
                      <Input
                        value={academicInfo.level}
                        onChange={(e) =>
                          setAcademicInfo({
                            ...academicInfo,
                            level: e.target.value
                          })
                        }
                        placeholder="L1, L2, L3, M1, M2..."
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.level || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Faculté</label>
                    {editingSection === "academic" ? (
                      <Input
                        value={academicInfo.faculty}
                        onChange={(e) =>
                          setAcademicInfo({
                            ...academicInfo,
                            faculty: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.faculty || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Filière</label>
                    {editingSection === "academic" ? (
                      <Input
                        value={academicInfo.fieldOfStudy}
                        onChange={(e) =>
                          setAcademicInfo({
                            ...academicInfo,
                            fieldOfStudy: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.fieldOfStudy || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Statut</label>
                    {editingSection === "academic" ? (
                      <Select
                        value={academicInfo.status}
                        onValueChange={(value) =>
                          setAcademicInfo({
                            ...academicInfo,
                            status: value as StudentStatus
                          })
                        }>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={StudentStatus.ACTIVE}>
                            Actif
                          </SelectItem>
                          <SelectItem value={StudentStatus.GRADUATED}>
                            Diplômé
                          </SelectItem>
                          <SelectItem value={StudentStatus.SUSPENDED}>
                            Suspendu
                          </SelectItem>
                          <SelectItem value={StudentStatus.WITHDRAWN}>
                            Retiré
                          </SelectItem>
                          <SelectItem value={StudentStatus.ON_LEAVE}>
                            En congé
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        {getStatusBadge(student.status || StudentStatus.ACTIVE)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Localisation */}
          <TabsContent value="location" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Localisation</CardTitle>
                {editingSection !== "location" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection("location")}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSection(null);
                        if (student) {
                          setLocationInfo({
                            country: student.country || "",
                            city: student.city || ""
                          });
                        }
                      }}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave("location")}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Pays</label>
                    {editingSection === "location" ? (
                      <Input
                        value={locationInfo.country}
                        onChange={(e) =>
                          setLocationInfo({
                            ...locationInfo,
                            country: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.country || "-"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ville</label>
                    {editingSection === "location" ? (
                      <Input
                        value={locationInfo.city}
                        onChange={(e) =>
                          setLocationInfo({
                            ...locationInfo,
                            city: e.target.value
                          })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {student.city || "-"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Résidence */}
          <TabsContent value="residence" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Informations de Résidence</CardTitle>
                {editingSection !== "residence" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection("residence")}
                    disabled={!residence}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSection(null);
                        if (residence) {
                          setResidenceInfo({
                            roomNumber: residence.roomNumber || "",
                            buildingName: residence.buildingName || "",
                            startDate: residence.startDate
                              ? new Date(residence.startDate)
                                  .toISOString()
                                  .split("T")[0]
                              : "",
                            endDate: residence.endDate
                              ? new Date(residence.endDate)
                                  .toISOString()
                                  .split("T")[0]
                              : "",
                            totalCost: residence.totalCost || 0,
                            amountPaid: residence.amountPaid || 0
                          });
                        }
                      }}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave("residence")}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {residence ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">
                          Numéro de chambre
                        </label>
                        {editingSection === "residence" ? (
                          <Input
                            value={residenceInfo.roomNumber}
                            onChange={(e) =>
                              setResidenceInfo({
                                ...residenceInfo,
                                roomNumber: e.target.value
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {residence.roomNumber}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">Bâtiment</label>
                        {editingSection === "residence" ? (
                          <Input
                            value={residenceInfo.buildingName}
                            onChange={(e) =>
                              setResidenceInfo({
                                ...residenceInfo,
                                buildingName: e.target.value
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {residence.buildingName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Date de début
                        </label>
                        {editingSection === "residence" ? (
                          <Input
                            type="date"
                            value={residenceInfo.startDate}
                            onChange={(e) =>
                              setResidenceInfo({
                                ...residenceInfo,
                                startDate: e.target.value
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {new Date(
                              residence.startDate
                            ).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Date de fin
                        </label>
                        {editingSection === "residence" ? (
                          <Input
                            type="date"
                            value={residenceInfo.endDate}
                            onChange={(e) =>
                              setResidenceInfo({
                                ...residenceInfo,
                                endDate: e.target.value
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {residence.endDate
                              ? new Date(
                                  residence.endDate
                                ).toLocaleDateString("fr-FR")
                              : "-"}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Coût total
                        </label>
                        {editingSection === "residence" ? (
                          <Input
                            type="number"
                            value={residenceInfo.totalCost}
                            onChange={(e) =>
                              setResidenceInfo({
                                ...residenceInfo,
                                totalCost: Number(e.target.value)
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {residence.totalCost.toLocaleString()} {CURRENCY}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          Montant payé
                        </label>
                        {editingSection === "residence" ? (
                          <Input
                            type="number"
                            value={residenceInfo.amountPaid}
                            onChange={(e) =>
                              setResidenceInfo({
                                ...residenceInfo,
                                amountPaid: Number(e.target.value)
                              })
                            }
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {residence.amountPaid.toLocaleString()} {CURRENCY}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Solde restant</span>
                        <span
                          className={`text-lg font-bold ${
                            residence.debt > 0 ? "text-red-600" : "text-green-600"
                          }`}>
                          {residence.debt.toLocaleString()} {CURRENCY}
                        </span>
                      </div>
                      {residence.isDebtor && (
                        <Badge variant="destructive" className="mt-2">
                          Débiteur
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune information de résidence disponible
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

