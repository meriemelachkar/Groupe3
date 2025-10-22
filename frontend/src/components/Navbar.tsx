import React from 'react';
import { useNavigate } from "react-router-dom";

type OnNavigate = (path: string) => void;

export default function Navbar() {

    const navigate = useNavigate();

    const onNavigate: OnNavigate = (path) => {
        navigate(`/${path}`);
    };

    return (
        <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => onNavigate("")}
                            className="flex items-center gap-2 font-bold text-xl hover:text-emerald-400 transition"
                        >
                            BuildWealth
                        </button>

                    </div>

                    <div className="flex items-center gap-4">

                        <>
                            <button
                                onClick={() => onNavigate("Login")}
                                className="px-4 py-2 hover:bg-slate-800 rounded transition"
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => onNavigate("SignUp")}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded transition"
                            >
                                Inscription
                            </button>
                        </>

                    </div>
                </div>
            </div>
        </nav>
    );
};
