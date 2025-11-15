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
import { Plus, Download, FileText, Search } from "lucide-react";
import { mockDons } from "@/lib/mockData";
import { CURRENCY } from "@/lib/constants";

export default function DonsPage() {
  const [dons] = useState(mockDons);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDons = dons.filter((don) =>
    don.donorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDons = filteredDons.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dons</h1>
          <p className="text-muted-foreground mt-1">Gestion des dons reçus</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau don
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enregistrer un don</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-xs md:text-sm font-medium">Nom du donateur</label>
                  <Input type="text" placeholder="Nom ou entreprise" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">Montant</label>
                  <Input type="number" placeholder="100000" />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium">Description</label>
                  <Input type="text" placeholder="Description du don" />
                </div>
                <Button className="w-full">Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Total des dons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {totalDons.toLocaleString()} {CURRENCY}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Nombre de dons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{filteredDons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Reçus générés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              {filteredDons.filter((d) => d.receiptGenerated).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des dons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Liste des dons</CardTitle>
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un donateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donateur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Reçu</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDons.map((don) => (
                <TableRow key={don.id}>
                  <TableCell className="font-medium">{don.donorName}</TableCell>
                  <TableCell>
                    {don.amount.toLocaleString()} {CURRENCY}
                  </TableCell>
                  <TableCell>{don.description || "-"}</TableCell>
                  <TableCell>
                    {new Date(don.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    {don.receiptGenerated ? (
                      <Badge variant="default">Généré</Badge>
                    ) : (
                      <Badge variant="secondary">Non généré</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      {don.receiptGenerated ? "Voir" : "Générer"} reçu
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
