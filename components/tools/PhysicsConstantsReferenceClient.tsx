'use client';

import { useMemo, useState } from 'react';

interface Constant {
  symbol: string;
  name: string;
  value: string;
  unit: string;
  category: string;
}

const CONSTANTS: Constant[] = [
  { symbol: 'c', name: 'Speed of light in vacuum', value: '299792458', unit: 'm/s', category: 'Universal' },
  { symbol: 'h', name: 'Planck constant', value: '6.62607015e-34', unit: 'J·s', category: 'Universal' },
  { symbol: 'ħ', name: 'Reduced Planck constant', value: '1.054571817e-34', unit: 'J·s', category: 'Universal' },
  { symbol: 'G', name: 'Newtonian gravitational constant', value: '6.67430e-11', unit: 'm³/(kg·s²)', category: 'Universal' },
  { symbol: 'μ0', name: 'Vacuum permeability', value: '1.25663706212e-6', unit: 'N/A²', category: 'Universal' },
  { symbol: 'ε0', name: 'Vacuum permittivity', value: '8.8541878128e-12', unit: 'F/m', category: 'Universal' },
  { symbol: 'Z0', name: 'Characteristic impedance of vacuum', value: '376.730313668', unit: 'Ω', category: 'Universal' },
  { symbol: 'e', name: 'Elementary charge', value: '1.602176634e-19', unit: 'C', category: 'Electromagnetic' },
  { symbol: 'Φ0', name: 'Magnetic flux quantum', value: '2.067833848e-15', unit: 'Wb', category: 'Electromagnetic' },
  { symbol: 'G0', name: 'Conductance quantum', value: '7.748091729e-5', unit: 'S', category: 'Electromagnetic' },
  { symbol: 'KJ', name: 'Josephson constant', value: '483597.8484e9', unit: 'Hz/V', category: 'Electromagnetic' },
  { symbol: 'RK', name: 'Von Klitzing constant', value: '25812.80745', unit: 'Ω', category: 'Electromagnetic' },
  { symbol: 'μB', name: 'Bohr magneton', value: '9.2740100783e-24', unit: 'J/T', category: 'Electromagnetic' },
  { symbol: 'μN', name: 'Nuclear magneton', value: '5.0507837461e-27', unit: 'J/T', category: 'Electromagnetic' },
  { symbol: 'me', name: 'Electron mass', value: '9.1093837015e-31', unit: 'kg', category: 'Atomic' },
  { symbol: 'mp', name: 'Proton mass', value: '1.67262192369e-27', unit: 'kg', category: 'Atomic' },
  { symbol: 'mn', name: 'Neutron mass', value: '1.67492749804e-27', unit: 'kg', category: 'Atomic' },
  { symbol: 'mμ', name: 'Muon mass', value: '1.883531627e-28', unit: 'kg', category: 'Atomic' },
  { symbol: 'u', name: 'Atomic mass unit', value: '1.66053906660e-27', unit: 'kg', category: 'Atomic' },
  { symbol: 'a0', name: 'Bohr radius', value: '5.29177210903e-11', unit: 'm', category: 'Atomic' },
  { symbol: 'Eh', name: 'Hartree energy', value: '4.3597447222071e-18', unit: 'J', category: 'Atomic' },
  { symbol: 'Ry', name: 'Rydberg energy', value: '2.1798723611035e-18', unit: 'J', category: 'Atomic' },
  { symbol: 'R∞', name: 'Rydberg constant', value: '10973731.568160', unit: '1/m', category: 'Atomic' },
  { symbol: 're', name: 'Classical electron radius', value: '2.8179403262e-15', unit: 'm', category: 'Atomic' },
  { symbol: 'α', name: 'Fine-structure constant', value: '7.2973525693e-3', unit: 'dimensionless', category: 'Atomic' },
  { symbol: 'eV', name: 'Electron volt', value: '1.602176634e-19', unit: 'J', category: 'Atomic' },
  { symbol: 'NA', name: 'Avogadro constant', value: '6.02214076e23', unit: '1/mol', category: 'Physicochemical' },
  { symbol: 'k', name: 'Boltzmann constant', value: '1.380649e-23', unit: 'J/K', category: 'Physicochemical' },
  { symbol: 'R', name: 'Molar gas constant', value: '8.314462618', unit: 'J/(mol·K)', category: 'Physicochemical' },
  { symbol: 'F', name: 'Faraday constant', value: '96485.33212', unit: 'C/mol', category: 'Physicochemical' },
  { symbol: 'σ', name: 'Stefan–Boltzmann constant', value: '5.670374419e-8', unit: 'W/(m²·K⁴)', category: 'Physicochemical' },
  { symbol: 'c1', name: 'First radiation constant', value: '3.741771852e-16', unit: 'W·m²', category: 'Physicochemical' },
  { symbol: 'c2', name: 'Second radiation constant', value: '1.438776877e-2', unit: 'm·K', category: 'Physicochemical' },
  { symbol: 'b', name: "Wien wavelength displacement law constant", value: '2.897771955e-3', unit: 'm·K', category: 'Physicochemical' },
  { symbol: 'Vm', name: 'Molar volume of ideal gas (273.15 K, 100 kPa)', value: '22.71095464e-3', unit: 'm³/mol', category: 'Physicochemical' },
  { symbol: 'g', name: 'Standard acceleration of gravity', value: '9.80665', unit: 'm/s²', category: 'Mechanical' },
  { symbol: 'atm', name: 'Standard atmosphere', value: '101325', unit: 'Pa', category: 'Mechanical' },
  { symbol: 'G-force', name: 'Standard gravity (alternate use)', value: '9.80665', unit: 'm/s²', category: 'Mechanical' },
  { symbol: 'g_n', name: 'Gravitational acceleration constant', value: '9.80665', unit: 'm/s²', category: 'Mechanical' },
  { symbol: 'σSB×4', name: 'Radiation constant (4σ/c)', value: '7.5657e-16', unit: 'J/(m³·K⁴)', category: 'Physicochemical' },
  { symbol: 'lP', name: 'Planck length', value: '1.616255e-35', unit: 'm', category: 'Planck Units' },
  { symbol: 'mP', name: 'Planck mass', value: '2.176434e-8', unit: 'kg', category: 'Planck Units' },
  { symbol: 'tP', name: 'Planck time', value: '5.391247e-44', unit: 's', category: 'Planck Units' },
  { symbol: 'TP', name: 'Planck temperature', value: '1.416784e32', unit: 'K', category: 'Planck Units' },
];

const CATEGORIES = ['All', ...Array.from(new Set(CONSTANTS.map((c) => c.category)))];

export default function PhysicsConstantsReferenceClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CONSTANTS.filter((c) => {
      const matchesCategory = category === 'All' || c.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q) ||
        c.unit.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  const copy = (c: Constant) => {
    navigator.clipboard.writeText(c.value).catch(() => {});
    setCopied(c.symbol + c.name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Search Constants</span>
        <span className="tb-v2-tool-label" style={{ fontWeight: 400 }}>{filtered.length} of {CONSTANTS.length}</span>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, symbol, or unit…"
        className="tb-v2-input"
      />

      <div className="tb-v2-mode-tabs" role="group" aria-label="Category" style={{ padding: '12px 20px 0' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`tb-v2-mode-tab ${category === cat ? 'on' : ''}`}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="tb-v2-tool-output-body">
        {filtered.length === 0 ? (
          <p className="tb-v2-empty">No constants match your search.</p>
        ) : (
          <div className="tb-v2-result-grid" style={{ padding: 0 }}>
            {filtered.map((c) => {
              const key = c.symbol + c.name;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => copy(c)}
                  className="tb-v2-result-card"
                  style={{ textAlign: 'left', cursor: 'pointer' }}
                  title="Click to copy value"
                >
                  <span className="tb-v2-result-card-label">{c.name} · {c.category}</span>
                  <span className="tb-v2-result-card-value" style={{ fontSize: 15, fontWeight: 700 }}>{c.symbol}</span>
                  <span className="tb-v2-result-card-value">
                    {copied === key ? 'Copied!' : `${c.value} ${c.unit}`}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
