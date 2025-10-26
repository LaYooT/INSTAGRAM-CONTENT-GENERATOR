
"use client";

import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Clock,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminPanelProps {
  session: Session;
}

interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  role: string;
  isApproved: boolean;
  approvedAt?: Date | null;
  createdAt: Date;
  _count: {
    contentJobs: number;
  };
}

export function AdminPanel({ session }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve: true }),
      });

      if (response.ok) {
        toast({
          title: "Utilisateur approuvé",
          description: "L'utilisateur peut maintenant se connecter",
        });
        fetchUsers();
      } else {
        throw new Error('Approval failed');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve: false }),
      });

      if (response.ok) {
        toast({
          title: "Utilisateur rejeté",
          description: "L'accès a été révoqué",
        });
        fetchUsers();
      } else {
        throw new Error('Rejection failed');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setActionLoading(userToDelete.id);
    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}/delete`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès",
        });
        fetchUsers();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Delete failed');
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const pendingUsers = users.filter(u => !u.isApproved);
  const approvedUsers = users.filter(u => u.isApproved);

  if (session.user.role !== "ADMIN") {
    return (
      <Alert className="border-destructive/50 bg-destructive/10">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="text-destructive">
          Accès refusé. Vous devez être administrateur pour accéder à cette page.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Administration</h2>
          <p className="text-sm text-muted-foreground">
            Gérer les utilisateurs et les permissions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold">{pendingUsers.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approuvés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold">{approvedUsers.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Users */}
      {pendingUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              Utilisateurs en Attente d'Approbation
            </CardTitle>
            <CardDescription>
              Ces utilisateurs attendent votre approbation pour accéder à l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sans nom'}
                    </p>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      En attente
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleApprove(user.id)}
                    disabled={actionLoading === user.id}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {actionLoading === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => confirmDelete(user)}
                    disabled={actionLoading === user.id}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Approved Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Utilisateurs Approuvés
          </CardTitle>
          <CardDescription>
            Utilisateurs ayant accès à l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {approvedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun utilisateur approuvé
            </p>
          ) : (
            approvedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">
                      {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Sans nom'}
                    </p>
                    {user.role === "ADMIN" && (
                      <Badge className="bg-primary">Admin</Badge>
                    )}
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Approuvé
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user._count.contentJobs} vidéo(s) générée(s)
                  </p>
                </div>
                {user.role !== "ADMIN" && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleReject(user.id)}
                      disabled={actionLoading === user.id}
                      size="sm"
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    >
                      {actionLoading === user.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-1" />
                          Révoquer
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => confirmDelete(user)}
                      disabled={actionLoading === user.id}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
              <strong>{userToDelete?.email}</strong> ? Cette action est irréversible
              et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
