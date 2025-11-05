import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';

interface LoanState {
  loanAmount: number;
  interestRate: number;
  duration: number;
}

interface LoanSimulatorProps {
  propertyPrice: number;
  initialState?: LoanState;
  onChange?: (state: LoanState) => void;
}

const LoanSimulator: React.FC<LoanSimulatorProps> = ({ propertyPrice, initialState, onChange }) => {
  const [loanAmount, setLoanAmount] = useState(initialState?.loanAmount ?? propertyPrice * 0.8);
  const [interestRate, setInterestRate] = useState(initialState?.interestRate ?? 3.5);
  const [duration, setDuration] = useState(initialState?.duration ?? 20);

  useEffect(() => {
    onChange?.({ loanAmount, interestRate, duration });
  }, [loanAmount, interestRate, duration]);

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = duration * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return Number.isFinite(monthlyPayment) ? monthlyPayment : 0;
  };

  const calculateTotalCost = () => {
    return calculateMonthlyPayment() * duration * 12;
  };

  const calculateTotalInterest = () => {
    return calculateTotalCost() - loanAmount;
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Calculator className="text-emerald-600" size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Simulateur de Prêt</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Montant du prêt</label>
            <div className="relative">
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                max={propertyPrice}
                min={0}
                step={1000}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2 text-slate-600">€</span>
            </div>
            <input
              type="range"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              max={propertyPrice}
              min={0}
              step={1000}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Taux d'intérêt annuel</label>
            <div className="relative">
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min={0.1}
                max={10}
                step={0.1}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2 text-slate-600">%</span>
            </div>
            <input
              type="range"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              min={0.1}
              max={10}
              step={0.1}
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Durée du prêt</label>
            <div className="relative">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={30}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-2 text-slate-600">ans</span>
            </div>
            <input
              type="range"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
              max={30}
              className="w-full mt-2"
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">Mensualité</div>
              <div className="text-2xl font-bold text-emerald-700">{calculateMonthlyPayment().toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</div>
              <div className="text-xs text-slate-600 mt-1">par mois</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">Coût total du crédit</div>
              <div className="text-lg font-bold text-slate-900">{calculateTotalCost().toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</div>
              <div className="text-xs text-slate-600 mt-1">sur {duration} ans</div>
            </div>

            <div className="text-center">
              <div className="text-sm text-slate-600 mb-1">Total des intérêts</div>
              <div className="text-lg font-bold text-slate-900">{calculateTotalInterest().toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €</div>
              <div className="text-xs text-slate-600 mt-1">hors assurance</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Apport personnel</span>
              <span className="font-semibold text-slate-900">{(propertyPrice - loanAmount).toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-slate-600">Prix du bien</span>
              <span className="font-semibold text-slate-900">{propertyPrice.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-900">
          <strong>Info:</strong> Cette simulation est indicative et ne constitue pas une offre de prêt.
        </div>
      </div>
    </div>
  );
};

export default LoanSimulator;
