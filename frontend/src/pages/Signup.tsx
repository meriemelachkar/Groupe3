import React, { useState, useRef } from "react";
import NavBar from "../components/Navbar";
import { UserPlus, Camera, X } from "lucide-react";
import { registerUser } from "../api/authApi";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "acheteur",
    password: "",
    confirmPassword: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      // Créer un FormData pour envoyer les données du formulaire et la photo
      const submitData = new FormData();
      submitData.append('prenom', formData.firstName);
      submitData.append('nom', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('role', formData.role.toLowerCase());
      submitData.append('motDePasse', formData.password);
      if (profilePicture) {
        submitData.append('photo', profilePicture);
      }

      const res = await registerUser(submitData);
      setSuccess("Compte créé avec succès !");
      console.log("✅ Utilisateur inscrit :", res);
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-emerald-100 p-3 rounded-full">
              <UserPlus className="text-emerald-600" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
            Inscription
          </h2>
          <p className="text-center text-slate-600 mb-6">
            Créez votre compte BuildWealth
          </p>

          

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Jean"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type de compte
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="acheteur">Acheteur</option>
                <option value="investisseur">Investisseur</option>
                <option value="promoteur">Promoteur</option>
              </select>

            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Photo de profil (optionnel)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Photo de profil"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                      <Camera size={24} className="text-slate-400" />
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="text-sm text-slate-600">
                  {previewUrl
                    ? "Cliquez sur la photo pour la modifier"
                    : "Cliquez pour ajouter une photo"}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition disabled:bg-emerald-400"
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded m-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded m-4">
              {success}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Déjà un compte ?{" "}
              <button 
                onClick={() => (window.location.href = '/Login')}
                className="text-emerald-600 hover:text-emerald-700 font-medium">
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
