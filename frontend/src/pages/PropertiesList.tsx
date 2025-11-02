import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Trash2 } from 'lucide-react';
import NavBar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { fetchBiens, createBien, deleteBien } from "../api/propertiesApi";

interface Proprietaire {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
}

export interface Bien {
  _id: string;
  titre: string;
  description: string;
  prix: number;
  typeBien: string;
  adresse: string;
  statut: string;
  projetAssocieId?: string;
  proprietaireId?: Proprietaire | string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const PropertiesList: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
  });
  const { user, profile } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBien, setNewBien] = useState<Partial<Bien>>({
    titre: '',
    description: '',
    prix: 0,
    adresse: '',
    typeBien: '',
    statut: 'disponible',
    projetAssocieId: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  // Fonction qui charge les biens depuis l'API locale
  const loadProperties = async () => {
    try {
      // Exiger la présence d'un token avant d'appeler l'API
      if (!user || !user.token) {
        console.warn('Aucun token trouvé : vous devez vous connecter pour voir les biens.');
        setProperties([]);
        return;
      }

      const data = await fetchBiens();
      setProperties(data as any);
    } catch (error) {
      console.error('Erreur lors du chargement des biens:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtres de recherche
  const filteredProperties = properties.filter((property) => {
    if (filters.city && !property.adresse.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.propertyType && property.typeBien !== filters.propertyType) {
      return false;
    }
    if (filters.minPrice && property.prix < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && property.prix > Number(filters.maxPrice)) {
      return false;
    }
    return true;
  });

  // Traduction du type
  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      appartement: 'Appartement',
      maison: 'Maison',
      bureau: 'Bureau',
    };
    return labels[type] || type;
  };

  // Badge du statut
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; class: string }> = {
      disponible: { label: 'Disponible', class: 'bg-emerald-100 text-emerald-800' },
      réservé: { label: 'Réservé', class: 'bg-yellow-100 text-yellow-800' },
      vendu: { label: 'Vendu', class: 'bg-red-100 text-red-800' },
    };
    return badges[status] || badges.disponible;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, on demande de se connecter avant de charger les biens
  if (!user) {
    return (
      <>
        <NavBar />
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Connectez-vous pour voir les biens</h3>
              <p className="text-slate-600">L'accès aux biens nécessite une authentification.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Biens Immobiliers à Vendre</h1>
              <p className="text-slate-600">
                Découvrez notre sélection de biens de qualité
              </p>
            </div>
            {profile?.role === 'promoteur' && (
              <div className="mt-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Ajouter un bien
                </button>
              </div>
            )}
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtres</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  placeholder="Rechercher par adresse..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Tous</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="bureau">Bureau</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prix min</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prix max</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  placeholder="1000000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Liste des biens */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Home className="mx-auto text-slate-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun bien trouvé</h3>
              <p className="text-slate-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const statusBadge = getStatusBadge(property.statut);
                return (
                  <div
                    key={property._id}
                    onClick={() => navigate(`/properties/${property._id}`)}
                    className="bg-white rounded-lg shadow hover:shadow-xl transition cursor-pointer overflow-hidden"
                  >
                    <div className="h-48 relative">
                      {property.imageUrl ? (
                        <img 
                          src={property.imageUrl} 
                          alt={property.titre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                          <Home className="text-white" size={64} />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.class}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{property.titre}</h3>
                      <div className="flex items-center text-slate-600 mb-3">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{property.adresse}</span>
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 mb-3">
                        {property.prix.toLocaleString('fr-FR')} €
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        {getPropertyTypeLabel(property.typeBien)}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition">
                          Voir les détails
                        </button>

                        {profile?.role === 'admin' && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm('Voulez-vous supprimer ce bien ? Cette action est irréversible.')) return;
                              try {
                                await deleteBien(property._id);
                                // retirer localement sans recharger toute la page
                                setProperties((prev) => prev.filter((p) => p._id !== property._id));
                              } catch (err: any) {
                                console.error('Erreur suppression bien:', err);
                                alert(err?.response?.data?.message || err?.message || 'Erreur lors de la suppression');
                              }
                            }}
                            className="p-2 bg-red-100 hover:bg-red-200 rounded text-red-700 transition"
                            title="Supprimer le bien"
                          >
                            <Trash2 />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Modal ajout bien (promoteur) */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
                <h3 className="text-xl font-semibold mb-4">Ajouter un bien</h3>
                <div className="grid grid-cols-1 gap-3">
                  <input className="border p-2 rounded" placeholder="Titre" value={newBien.titre || ''} onChange={(e) => setNewBien({ ...newBien, titre: e.target.value })} />
                  <input className="border p-2 rounded" placeholder="Adresse" value={newBien.adresse || ''} onChange={(e) => setNewBien({ ...newBien, adresse: e.target.value })} />
                  <select className="border p-2 rounded" value={newBien.typeBien || ''} onChange={(e) => setNewBien({ ...newBien, typeBien: e.target.value })}>
                    <option value="">Type de bien</option>
                    <option value="appartement">Appartement</option>
                    <option value="maison">Maison</option>
                    <option value="bureau">Bureau</option>
                  </select>
                  <input type="number" className="border p-2 rounded" placeholder="Prix" value={newBien.prix ?? 0} onChange={(e) => setNewBien({ ...newBien, prix: Number(e.target.value) })} />
                  <select className="border p-2 rounded" value={newBien.statut || 'disponible'} onChange={(e) => setNewBien({ ...newBien, statut: e.target.value })}>
                    <option value="disponible">Disponible</option>
                    <option value="vendu">Vendu</option>
                  </select>
                  <textarea className="border p-2 rounded" placeholder="Description" value={newBien.description || ''} onChange={(e) => setNewBien({ ...newBien, description: e.target.value })} />
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Image du bien</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                          // Créer une URL pour la prévisualisation
                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                        }
                      }}
                      className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-emerald-50 file:text-emerald-700
                        hover:file:bg-emerald-100"
                    />
                    {previewUrl && (
                      <div className="mt-2">
                        <img
                          src={previewUrl}
                          alt="Prévisualisation"
                          className="h-32 w-auto object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button className="px-4 py-2" onClick={() => setShowAddModal(false)}>Annuler</button>
                  <button
                    className="px-4 py-2 bg-emerald-600 text-white rounded"
                    onClick={async () => {
                      // Validation client minimale
                      if (!newBien.titre || !newBien.adresse || !newBien.typeBien || !newBien.prix) {
                        alert('Veuillez remplir les champs obligatoires : titre, adresse, type et prix.');
                        return;
                      }

                      try {
                        setSubmitting(true);

                        // Construire payload minimal et omettre champs vides
                        const rawPayload: any = {
                          titre: (newBien.titre || '').toString(),
                          description: newBien.description ? (newBien.description as string) : undefined,
                          prix: Number(newBien.prix),
                          typeBien: (newBien.typeBien || '').toString(),
                          adresse: (newBien.adresse || '').toString(),
                          projetAssocieId: newBien.projetAssocieId ? (newBien.projetAssocieId as string) : undefined,
                        };

                        // Remove undefined keys so ValidationPipe with forbidNonWhitelisted won't complain
                        const payload: Record<string, any> = {};
                        Object.entries(rawPayload).forEach(([k, v]) => {
                          if (v !== undefined && v !== '') payload[k] = v;
                        });

                        await createBien(payload, selectedImage || undefined);
                        setShowAddModal(false);
                        setNewBien({ titre: '', description: '', prix: 0, adresse: '', typeBien: '', statut: 'disponible', projetAssocieId: '' });
                        setSelectedImage(null);
                        setPreviewUrl(null);
                        loadProperties();
                      } catch (err: any) {
                        console.error('Erreur création bien:', err);
                        // Afficher message d'erreur provenant du serveur si disponible
                        const serverMsg = err?.response?.data || err?.message || 'Erreur lors de la création du bien';
                        alert(JSON.stringify(serverMsg));
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                  >
                    {submitting ? 'Enregistrement...' : 'Créer'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PropertiesList;