/** @format */

"use client";

import { StatCard } from "@/components/atoms/StatCard";
import { BarChart } from "@/components/molecules/BarChart";
import { DonutChart } from "@/components/molecules/DonutChart";
import { LineChart } from "@/components/molecules/LineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Heart,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { CURRENCY } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { mockStats } from "@/lib/mockData";
import { CategoryChart } from "@/components/molecules/category-chart";

export default function DashboardPage() {
  // Données mockées pour la démo
  const stats = {
    totalCotisations: 2500000,
    totalDons: 600000,
    totalDepenses: 1650000,
    solde: 1450000
  };

  const revenueData = [
    { label: "01", value: 180000 },
    { label: "02", value: 250000 },
    { label: "03", value: 320000 },
    { label: "04", value: 280000 },
    { label: "05", value: 390000 },
    { label: "06", value: 440000 },
    { label: "07", value: 380000 },
    { label: "08", value: 460000 },
    { label: "09", value: 420000 },
    { label: "10", value: 480000 },
    { label: "11", value: 510000 },
    { label: "12", value: 550000 }
  ];

  const depensesParCategorie = [
    { label: "Fonctionnement", value: 650000, color: "bg-blue-500" },
    { label: "Activités", value: 800000, color: "bg-purple-500" },
    { label: "Équipement", value: 450000, color: "bg-cyan-500" }
  ];

  const repartitionDonut = [
    { label: "Matin", value: 450000, color: "#10B981", percentage: 28 },
    { label: "Après-midi", value: 650000, color: "#6366F1", percentage: 40 },
    { label: "Soir", value: 520000, color: "#F59E0B", percentage: 32 }
  ];

  const ordersData = [
    { label: "01", value: 42 },
    { label: "02", value: 38 },
    { label: "03", value: 45 },
    { label: "04", value: 52 },
    { label: "05", value: 58 },
    { label: "06", value: 65 }
  ];

  const depensesPendantes = [
    {
      id: "1",
      titre: "Loyer bureau - Janvier 2025",
      montant: 200000,
      date: "18/01/2025",
      status: "pending"
    },
    {
      id: "2",
      titre: "Organisation événement gala",
      montant: 800000,
      date: "19/01/2025",
      status: "pending"
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d{"'"}ensemble de votre trésorerie
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Cotisations"
          value={`${formatNumber(stats.totalCotisations)} ${CURRENCY}`}
          change={2.1}
          trend="up"
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          title="Total Dons"
          value={`${formatNumber(stats.totalDons)} ${CURRENCY}`}
          change={12.5}
          trend="up"
          icon={<Heart className="h-5 w-5" />}
        />
        <StatCard
          title="Total Dépenses"
          value={`${formatNumber(stats.totalDepenses)} ${CURRENCY}`}
          change={2.1}
          trend="down"
          icon={<TrendingDown className="h-5 w-5" />}
        />
        <StatCard
          title="Solde Actuel"
          value={`${formatNumber(stats.solde)} ${CURRENCY}`}
          icon={<TrendingUp className="h-5 w-5" />}
          className="border-primary"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Évolution des revenus */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenus</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl md:text-2xl font-bold">
                  {formatNumber(stats.totalCotisations)} {CURRENCY}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  2.1%
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Ventes du 1-12 Déc, 2020
              </p>
            </div>
            <Button variant="ghost" size="sm">
              Voir Rapport
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none">
                {revenueData.map((item, index) => {
                  const maxValue = Math.max(...revenueData.map((d) => d.value));
                  const height = (item.value / maxValue) * 80;
                  const x = (index / revenueData.length) * 100 + 2;
                  const width = 100 / revenueData.length - 2;

                  return (
                    <rect
                      key={index}
                      x={x}
                      y={100 - height}
                      width={width}
                      height={height}
                      fill="#6366F1"
                      rx="1"
                      className="hover:opacity-80 transition-opacity"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">8 derniers jours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-muted-foreground">Semaine dernière</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Répartition par période */}
        <DonutChart
          title="Répartition par période"
          data={repartitionDonut}
          centerText="orders"
          centerValue="1,890"
        />
        <CategoryChart data={mockStats.depensesParCategorie} />{" "}
      </div>

      {/* Deuxième ligne de graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dépenses par catégorie */}
        <BarChart
          title="Dépenses par catégorie"
          data={depensesParCategorie}
          className="lg:col-span-1"
        />

        {/* Alertes - Dépenses en attente */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Dépenses en attente
              </CardTitle>
              <Badge variant="destructive">{depensesPendantes.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {depensesPendantes.map((depense) => (
                <div
                  key={depense.id}
                  className="flex items-start justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <p className="font-medium text-xs md:text-sm">
                      {depense.titre}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {depense.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xs md:text-sm">
                      {formatNumber(depense.montant)} {CURRENCY}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-6 text-xs">
                      Valider
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Évolution commandes */}
        <LineChart
          title="Commandes"
          subtitle={`Ventes du 1-6 Déc, 2020`}
          data={ordersData}
          className="lg:col-span-1"
        />
      </div>
    </div>
  );
}
