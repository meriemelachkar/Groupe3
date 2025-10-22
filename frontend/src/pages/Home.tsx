import NavBar from "../components/Navbar";

export default function Home() {
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
                  // onClick={() => onNavigate('projects')}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-lg font-medium text-lg transition shadow-lg"
                >
                  Explorer les Projets
                </button>
                <button
                  // onClick={() => onNavigate('properties')}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-medium text-lg transition shadow-lg"
                >
                  Voir les Biens
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
