/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, UserCog, Shield, History } from "lucide-react";
import { mockUsers, mockAuditLogs } from "@/lib/mockData";
import { UserRole } from "@/types";

export default function ParametresPage() {
  const [users] = useState(mockUsers);
  const [auditLogs] = useState(mockAuditLogs);

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      [UserRole.PRESIDENT]: "default",
      [UserRole.TRESORIER]: "default",
      [UserRole.TRESORIER_ADJOINT]: "secondary",
      [UserRole.MEMBRE]: "outline"
    } as const;

    const labels = {
      [UserRole.PRESIDENT]: "Président",
      [UserRole.TRESORIER]: "Trésorier",
      [UserRole.TRESORIER_ADJOINT]: "Trésorier Adjoint",
      [UserRole.MEMBRE]: "Membre"
    };

    return <Badge variant={variants[role]}>{labels[role]}</Badge>;
  };

  const permissions = [
    {
      module: "Cotisations",
      president: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        approve: true
      },
      tresorier: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: true
      },
      tresorierAdjoint: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: false
      },
      membre: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false
      }
    },
    {
      module: "Dons",
      president: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        approve: true
      },
      tresorier: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: true
      },
      tresorierAdjoint: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: false
      },
      membre: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false
      }
    },
    {
      module: "Dépenses",
      president: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        approve: true
      },
      tresorier: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: true
      },
      tresorierAdjoint: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: true
      },
      membre: {
        view: true,
        create: true,
        edit: false,
        delete: false,
        approve: false
      }
    },
    {
      module: "Rapports",
      president: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        approve: true
      },
      tresorier: {
        view: true,
        create: true,
        edit: true,
        delete: false,
        approve: false
      },
      tresorierAdjoint: {
        view: true,
        create: false,
        edit: false,
        delete: false,
        approve: false
      },
      membre: {
        view: false,
        create: false,
        edit: false,
        delete: false,
        approve: false
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-muted-foreground mt-1">
          Configuration et gestion des utilisateurs
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        {/* Onglet Utilisateurs */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Comptes utilisateurs</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvel utilisateur
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un utilisateur</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-xs md:text-sm font-medium">
                          Nom complet
                        </label>
                        <Input type="text" placeholder="Jean Dupont" />
                      </div>
                      <div>
                        <label className="text-xs md:text-sm font-medium">Email</label>
                        <Input
                          type="email"
                          placeholder="jean.dupont@email.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs md:text-sm font-medium">Rôle</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un rôle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserRole.PRESIDENT}>
                              Président
                            </SelectItem>
                            <SelectItem value={UserRole.TRESORIER}>
                              Trésorier
                            </SelectItem>
                            <SelectItem value={UserRole.TRESORIER_ADJOINT}>
                              Trésorier Adjoint
                            </SelectItem>
                            <SelectItem value={UserRole.MEMBRE}>
                              Membre
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full">
                        Créer l{"'"}utilisateur
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="default" className="bg-green-500">
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactif</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            Modifier
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600">
                            Désactiver
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Permissions */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Matrice des permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Module</th>
                      <th className="text-center p-3 font-medium">Président</th>
                      <th className="text-center p-3 font-medium">Trésorier</th>
                      <th className="text-center p-3 font-medium">
                        Trésorier Adj.
                      </th>
                      <th className="text-center p-3 font-medium">Membre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((perm, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{perm.module}</td>
                        <td className="p-3">
                          <PermissionCell perms={perm.president} />
                        </td>
                        <td className="p-3">
                          <PermissionCell perms={perm.tresorier} />
                        </td>
                        <td className="p-3">
                          <PermissionCell perms={perm.tresorierAdjoint} />
                        </td>
                        <td className="p-3">
                          <PermissionCell perms={perm.membre} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Légende</h4>
                <div className="flex flex-wrap gap-4 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Création</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Modification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Suppression</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>Validation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique d{"'"}activité (Audit Log)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Détails</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        {new Date(log.createdAt).toLocaleString("fr-FR")}
                      </TableCell>
                      <TableCell className="font-medium">
                        {log.userName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.action}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Permissions Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Permissions par rôle</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-purple-500" />
              </div>
              <h4 className="font-semibold">Président</h4>
            </div>
            <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
              <li>✓ Accès complet</li>
              <li>✓ Validation des dépenses</li>
              <li>✓ Gestion des utilisateurs</li>
              <li>✓ Génération de rapports</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-500" />
              </div>
              <h4 className="font-semibold">Trésorier</h4>
            </div>
            <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
              <li>✓ Gestion financière</li>
              <li>✓ Validation des dépenses</li>
              <li>✓ Génération de rapports</li>
              <li>✗ Gestion des utilisateurs</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <UserCog className="h-4 w-4 text-green-500" />
              </div>
              <h4 className="font-semibold">Membre</h4>
            </div>
            <ul className="space-y-1 text-xs md:text-sm text-muted-foreground">
              <li>✓ Consultation</li>
              <li>✓ Paiement cotisations</li>
              <li>✗ Validation des dépenses</li>
              <li>✗ Gestion des utilisateurs</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PermissionCell({
  perms
}: {
  perms: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  };
}) {
  const colors = {
    view: "bg-green-500",
    create: "bg-blue-500",
    edit: "bg-orange-500",
    delete: "bg-red-500",
    approve: "bg-purple-500"
  };

  return (
    <div className="flex gap-1 justify-center flex-wrap">
      {perms.view && (
        <div
          className={`w-3 h-3 rounded-full ${colors.view}`}
          title="Consultation"
        />
      )}
      {perms.create && (
        <div
          className={`w-3 h-3 rounded-full ${colors.create}`}
          title="Création"
        />
      )}
      {perms.edit && (
        <div
          className={`w-3 h-3 rounded-full ${colors.edit}`}
          title="Modification"
        />
      )}
      {perms.delete && (
        <div
          className={`w-3 h-3 rounded-full ${colors.delete}`}
          title="Suppression"
        />
      )}
      {perms.approve && (
        <div
          className={`w-3 h-3 rounded-full ${colors.approve}`}
          title="Validation"
        />
      )}
      {!perms.view &&
        !perms.create &&
        !perms.edit &&
        !perms.delete &&
        !perms.approve && <span className="text-gray-400 text-xs">Aucun</span>}
    </div>
  );
}
