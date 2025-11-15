/** @format */

"use client";

import { useState } from "react";
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
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Upload,
  FileText
} from "lucide-react";
import { mockDepenses } from "@/lib/mockData";
import { DepenseStatus, DepenseCategory } from "@/types";
import { CURRENCY } from "@/lib/constants";

export default function DepensesPage() {
  const [depenses] = useState(mockDepenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusBadge = (status: DepenseStatus) => {
    const variants = {
      [DepenseStatus.DRAFT]: "secondary",
      [DepenseStatus.SUBMITTED]: "default",
      [DepenseStatus.APPROVED]: "default",
      [DepenseStatus.REJECTED]: "destructive"
    } as const;

    const labels = {
      [DepenseStatus.DRAFT]: "Brouillon",
      [DepenseStatus.SUBMITTED]: "En attente",
      [DepenseStatus.APPROVED]: "Approuvé",
      [DepenseStatus.REJECTED]: "Rejeté"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getCategoryLabel = (category: DepenseCategory) => {
    const labels = {
      [DepenseCategory.FONCTIONNEMENT]: "Fonctionnement",
      [DepenseCategory.ACTIVITE]: "Activité",
      [DepenseCategory.EQUIPEMENT]: "Équipement",
      [DepenseCategory.AUTRE]: "Autre"
    };
    return labels[category];
  };

  const filteredDepenses = depenses.filter((depense) => {
    const matchesSearch = depense.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || depense.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDepenses = filteredDepenses.reduce((sum, d) => sum + d.amount, 0);
  const pendingDepenses = filteredDepenses.filter(
    (d) => d.status === DepenseStatus.SUBMITTED
  ).length;
  const approvedDepenses = filteredDepenses.filter(
    (d) => d.status === DepenseStatus.APPROVED
  ).length;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dépenses</h1>
          <p className="text-muted-foreground mt-1">
            Gestion et validation des dépenses
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle dépense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Soumettre une dépense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs md:text-sm font-medium">Titre</label>
                <Input type="text" placeholder="Ex: Loyer bureau janvier" />
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium">Description</label>
                <Input type="text" placeholder="Description détaillée" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium">Montant</label>
                  <Input type="number" placeholder="200000" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">Catégorie</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DepenseCategory.FONCTIONNEMENT}>
                        Fonctionnement
                      </SelectItem>
                      <SelectItem value={DepenseCategory.ACTIVITE}>
                        Activité
                      </SelectItem>
                      <SelectItem value={DepenseCategory.EQUIPEMENT}>
                        Équipement
                      </SelectItem>
                      <SelectItem value={DepenseCategory.AUTRE}>
                        Autre
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium">Justificatifs</label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Glissez vos fichiers ici ou cliquez pour parcourir
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Parcourir
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Sauvegarder en brouillon
                </Button>
                <Button className="flex-1">Soumettre pour validation</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {totalDepenses.toLocaleString()} {CURRENCY}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-orange-600">
              {pendingDepenses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Approuvées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {approvedDepenses}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Rejetées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {
                filteredDepenses.filter(
                  (d) => d.status === DepenseStatus.REJECTED
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des dépenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une dépense..."
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
              <SelectContent>+
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value={DepenseStatus.DRAFT}>Brouillon</SelectItem>
                <SelectItem value={DepenseStatus.SUBMITTED}>
                  En attente
                </SelectItem>
                <SelectItem value={DepenseStatus.APPROVED}>Approuvé</SelectItem>
                <SelectItem value={DepenseStatus.REJECTED}>Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Soumis par</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepenses.map((depense) => (
                <TableRow key={depense.id}>
                  <TableCell className="font-medium">{depense.title}</TableCell>
                  <TableCell>{getCategoryLabel(depense.category)}</TableCell>
                  <TableCell>
                    {depense.amount.toLocaleString()} {CURRENCY}
                  </TableCell>
                  <TableCell>{depense.submittedBy}</TableCell>
                  <TableCell>
                    {new Date(depense.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>{getStatusBadge(depense.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {depense.status === DepenseStatus.SUBMITTED && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
