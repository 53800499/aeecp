/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Download, FileText, TrendingUp, TrendingDown, Eye, Receipt, Badge } from "lucide-react";
import { CURRENCY } from "@/lib/constants";
import { LineChart } from "@/components/molecules/LineChart";
import { BarChart } from "@/components/molecules/BarChart";
import { mockDepenses } from "@/lib/mockData";

export default function RapportsPage() {
  const [period, setPeriod] = useState("month");
  const [year, setYear] = useState("2025");

  const monthlyData = [
    { label: "Jan", value: 2500000 },
    { label: "Fév", value: 2200000 },
    { label: "Mar", value: 2800000 },
    { label: "Avr", value: 2600000 },
    { label: "Mai", value: 3000000 },
    { label: "Juin", value: 2900000 }
  ];

  const depensesByCategory = [
    { label: "Fonctionnement", value: 4500000, color: "bg-blue-500" },
    { label: "Activités", value: 6200000, color: "bg-purple-500" },
    { label: "Équipement", value: 3100000, color: "bg-cyan-500" },
    { label: "Autre", value: 1200000, color: "bg-orange-500" }
  ];

  const recettesData = [
    { label: "Cotisations", value: 12500000, color: "bg-green-500" },
    { label: "Dons", value: 3600000, color: "bg-emerald-500" }
  ];

  const totalRecettes = recettesData.reduce((sum, r) => sum + r.value, 0);
  const totalDepenses = depensesByCategory.reduce((sum, d) => sum + d.value, 0);
  const solde = totalRecettes - totalDepenses;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rapports Financiers
          </h1>
          <p className="text-muted-foreground mt-1">
            Bilans et analyses financières
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Générer PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs md:text-sm font-medium">Période</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mensuel</SelectItem>
                  <SelectItem value="quarter">Trimestriel</SelectItem>
                  <SelectItem value="year">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs md:text-sm font-medium">Année</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-xs md:text-sm font-medium">Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="cotisations">Cotisations</SelectItem>
                  <SelectItem value="dons">Dons</SelectItem>
                  <SelectItem value="depenses">Dépenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Recettes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {totalRecettes.toLocaleString()} {CURRENCY}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cotisations + Dons
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Total Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {totalDepenses.toLocaleString()} {CURRENCY}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Toutes catégories confondues
            </p>
          </CardContent>
        </Card>

        <Card className={solde >= 0 ? "border-green-500" : "border-red-500"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              Solde Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                solde >= 0 ? "text-green-600" : "text-red-600"
              }`}>
              {solde >= 0 ? "+" : ""}
              {solde.toLocaleString()} {CURRENCY}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Recettes - Dépenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Évolution des recettes"
          subtitle="Par mois - 2025"
          data={monthlyData}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Répartition recettes vs dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs md:text-sm mb-2">
                  <span className="font-medium">Recettes</span>
                  <span className="text-green-600">
                    {totalRecettes.toLocaleString()} {CURRENCY}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${
                        (totalRecettes / (totalRecettes + totalDepenses)) * 100
                      }%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs md:text-sm mb-2">
                  <span className="font-medium">Dépenses</span>
                  <span className="text-red-600">
                    {totalDepenses.toLocaleString()} {CURRENCY}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${
                        (totalDepenses / (totalRecettes + totalDepenses)) * 100
                      }%`
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart title="Dépenses par catégorie" data={depensesByCategory} />
        <BarChart title="Recettes par type" data={recettesData} />
      </div>

      {/* Tableau détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Bilan détaillé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Recettes */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-green-600">
                Recettes
              </h3>
              <div className="space-y-3">
                {recettesData.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-3 border-b">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">
                      {item.value.toLocaleString()} {CURRENCY}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total Recettes</span>
                  <span className="font-bold text-green-600 text-lg">
                    {totalRecettes.toLocaleString()} {CURRENCY}
                  </span>
                </div>
              </div>
            </div>

            {/* Dépenses */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-red-600">
                Dépenses
              </h3>
              <div className="space-y-3">
                {depensesByCategory.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-3 border-b">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold">
                      {item.value.toLocaleString()} {CURRENCY}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total Dépenses</span>
                  <span className="font-bold text-red-600 text-lg">
                    {totalDepenses.toLocaleString()} {CURRENCY}
                  </span>
                </div>
              </div>
            </div>

            {/* Solde */}
            <div className="pt-4 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xl">Solde Net</span>
                <span
                  className={`font-bold text-xl md:text-2xl ${
                    solde >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                  {solde >= 0 ? "+" : ""}
                  {solde.toLocaleString()} {CURRENCY}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Recent Activity */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Dépenses récentes</h3>
            <p className="text-sm text-muted-foreground">
              Les dernières transactions
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Voir tout
          </Button>
        </div>
        <div className="space-y-4">
          {mockDepenses.map((depense) => (
            <div
              key={depense.id}
              className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{depense.title}</p>
                <p className="text-sm text-muted-foreground">
                  {depense.submittedBy} 
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold">{depense.amount}</p>
                {/* <Badge
                  variant={
                    depense.status === "validee"
                      ? "default"
                      : depense.status === "en_attente"
                      ? "outline"
                      : "destructive"
                  }
                  className="mt-1">
                  {depense.status === "validee"
                    ? "Validée"
                    : depense.status === "en_attente"
                    ? "En attente"
                    : "Rejetée"}
                </Badge> */}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
