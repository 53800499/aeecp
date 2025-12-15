/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Mail, Lock, User, Loader2, UserPlus, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Effacer les erreurs quand l'utilisateur commence à taper
  useEffect(() => {
    if (name || email || password || confirmPassword) {
      clearError();
      setLocalError(null);
    }
  }, [name, email, password, confirmPassword, clearError]);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];
    if (pwd.length < 8) {
      errors.push("Au moins 8 caractères");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("Une majuscule");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("Une minuscule");
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("Un chiffre");
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      errors.push("Un caractère spécial");
    }
    return errors;
  };

  const passwordErrors = password ? validatePassword(password) : [];
  const isPasswordValid = passwordErrors.length === 0;
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Veuillez remplir tous les champs");
      return;
    }

    if (!email.includes("@")) {
      setLocalError("Veuillez entrer une adresse email valide");
      return;
    }

    if (!isPasswordValid) {
      setLocalError("Le mot de passe ne respecte pas les critères requis");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await signup(name, email, password);
      router.push("/");
    } catch (err) {
      // L'erreur est déjà gérée par le store
      console.error("Erreur d'inscription:", err);
    }
  };

  const displayError = localError || error;

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Créer un compte
          </CardTitle>
          <CardDescription className="text-gray-600">
            Inscrivez-vous pour commencer à utiliser la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {displayError && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                {displayError}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs space-y-1">
                  <p className="font-medium text-gray-700 mb-1">
                    Le mot de passe doit contenir :
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      "Au moins 8 caractères",
                      "Une majuscule",
                      "Une minuscule",
                      "Un chiffre",
                      "Un caractère spécial"
                    ].map((requirement) => {
                      const isValid = !passwordErrors.some((err) =>
                        err.includes(requirement.split(" ")[0])
                      );
                      return (
                        <div
                          key={requirement}
                          className={`flex items-center gap-1 ${
                            isValid ? "text-green-600" : "text-gray-500"
                          }`}>
                          <CheckCircle2
                            className={`h-3 w-3 ${
                              isValid ? "text-green-600" : "text-gray-400"
                            }`}
                          />
                          <span>{requirement}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}>
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {confirmPassword && (
                <div
                  className={`text-xs flex items-center gap-1 ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                  }`}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Les mots de passe correspondent</span>
                    </>
                  ) : (
                    <span>Les mots de passe ne correspondent pas</span>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition-all"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Inscription en cours...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

