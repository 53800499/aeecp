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
import { Plus, Download, Upload, Search, Filter } from "lucide-react";
import { mockCotisations } from "@/lib/mockData";
import { CotisationStatus } from "@/types";
import { CURRENCY } from "@/lib/constants";

export default function CotisationsPage() {
  const [cotisations] = useState(mockCotisations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusBadge = (status: CotisationStatus) => {
    const variants = {
      [CotisationStatus.PAID]: "default",
      [CotisationStatus.PENDING]: "secondary",
      [CotisationStatus.OVERDUE]: "destructive"
    } as const;

    const labels = {
      [CotisationStatus.PAID]: "Payé",
      [CotisationStatus.PENDING]: "En attente",
      [CotisationStatus.OVERDUE]: "En retard"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const filteredCotisations = cotisations.filter((cotisation) => {
    const matchesSearch = cotisation.memberName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || cotisation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredCotisations.reduce((sum, c) => sum + c.amount, 0);
  const paidAmount = filteredCotisations
    .filter((c) => c.status === CotisationStatus.PAID)
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cotisations</h1>
          <p className="text-muted-foreground mt-1">
            Gestion des cotisations des membres
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle cotisation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une cotisation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-xs md:text-sm font-medium">Membre</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Jean Dupont</SelectItem>
                      <SelectItem value="2">Marie Martin</SelectItem>
                      <SelectItem value="3">Pierre Durand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">Montant</label>
                  <Input type="number" placeholder="50000" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">Période</label>
                  <Input type="text" placeholder="Janvier 2025" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">
                    Mode de paiement
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="bank">Virement bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Enregistrer</Button>
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
              Total cotisations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {totalAmount.toLocaleString()} {CURRENCY}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Montant perçu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {paidAmount.toLocaleString()} {CURRENCY}
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
              {(totalAmount - paidAmount).toLocaleString()} {CURRENCY}
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
                placeholder="Rechercher un membre..."
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
                <SelectItem value={CotisationStatus.PAID}>Payé</SelectItem>
                <SelectItem value={CotisationStatus.PENDING}>
                  En attente
                </SelectItem>
                <SelectItem value={CotisationStatus.OVERDUE}>
                  En retard
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Mode de paiement</TableHead>
                <TableHead>Date de paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCotisations.map((cotisation) => (
                <TableRow key={cotisation.id}>
                  <TableCell className="font-medium">
                    {cotisation.memberName}
                  </TableCell>
                  <TableCell>{cotisation.period}</TableCell>
                  <TableCell>
                    {cotisation.amount.toLocaleString()} {CURRENCY}
                  </TableCell>
                  <TableCell>{cotisation.paymentMethod || "-"}</TableCell>
                  <TableCell>
                    {cotisation.paymentDate
                      ? new Date(cotisation.paymentDate).toLocaleDateString(
                          "fr-FR"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(cotisation.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Détails
                    </Button>
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
