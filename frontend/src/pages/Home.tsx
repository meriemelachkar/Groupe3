import NavBar from "../components/Navbar";
import { TrendingUp, Building2, DollarSign, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const onNavigate = (path: string) => {
    navigate(`/${path}`);
  };
  
  return (
    <>
      <NavBar />
      <div className="min-h-[calc(100vh-4rem)]">
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Investissez dans l'immobilier
                <span className="block text-emerald-400 mt-2">de demain</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                BuildWealth combine crowdfunding et vente immobilière pour offrir des opportunités
                d'investissement accessibles et des biens de qualité
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => onNavigate('projects')}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-lg font-medium text-lg transition shadow-lg"
                >
                  Explorer les Projets
                </button>
                <button
                  onClick={() => onNavigate('properties')}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-medium text-lg transition shadow-lg"
                >
                  Voir les Biens
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
              Pourquoi choisir BuildWealth ?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Investissement Accessible</h3>
                <p className="text-slate-600">
                  Investissez dans l'immobilier à partir de petits montants
                </p>
              </div>

              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Projets Vérifiés</h3>
                <p className="text-slate-600">
                  Tous les projets sont soigneusement validés par nos équipes
                </p>
              </div>

              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Rendements Attractifs</h3>
                <p className="text-slate-600">
                  Des rendements calculés de manière transparente
                </p>
              </div>

              <div className="text-center">
                <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Sécurité Maximale</h3>
                <p className="text-slate-600">
                  Vos données et transactions sont protégées
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Pour les Investisseurs
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Participez au financement de projets immobiliers prometteurs et bénéficiez
                  de rendements attractifs. Suivez vos investissements en temps réel et
                  diversifiez votre portefeuille.
                </p>
                <button
                  onClick={() => onNavigate('projects')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Découvrir les Projets
                </button>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded mt-1">
                      <TrendingUp className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Investissement minimum faible</h4>
                      <p className="text-slate-600 text-sm">Commencez à partir de 1000€</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded mt-1">
                      <Building2 className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Diversification</h4>
                      <p className="text-slate-600 text-sm">Investissez dans plusieurs projets</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded mt-1">
                      <DollarSign className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Suivi en temps réel</h4>
                      <p className="text-slate-600 text-sm">Tableau de bord complet</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded mt-1">
                      <Building2 className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Catalogue complet</h4>
                      <p className="text-slate-600 text-sm">Appartements, maisons, villas...</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded mt-1">
                      <Shield className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Achat sécurisé</h4>
                      <p className="text-slate-600 text-sm">Process 100% en ligne</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded mt-1">
                      <DollarSign className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Simulation de prêt</h4>
                      <p className="text-slate-600 text-sm">Calculez vos mensualités</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Pour les Acheteurs
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Découvrez notre catalogue de biens immobiliers de qualité. Réservez en ligne,
                  simulez votre prêt et accédez à la propriété en toute simplicité.
                </p>
                <button
                  onClick={() => onNavigate('properties')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Voir les Biens Disponibles
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl text-emerald-100 mb-8">
              Rejoignez des milliers d'investisseurs et acheteurs qui ont choisi BuildWealth
            </p>
            <button
              onClick={() => onNavigate('SignUp')}
              className="bg-white text-emerald-600 hover:bg-slate-100 px-8 py-4 rounded-lg font-medium text-lg transition shadow-lg"
            >
              Créer un compte gratuit
            </button>
          </div>
        </section>


      </div>
    </>
  );
}
