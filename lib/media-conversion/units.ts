export type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';
export const units: Record<Category, { value: string; label: string; factor: number }[]> = {
  length: [
    { value: 'm', label: 'Meters (m)', factor: 1 },
    { value: 'km', label: 'Kilometers (km)', factor: 1000 },
    { value: 'cm', label: 'Centimeters (cm)', factor: 0.01 },
    { value: 'mm', label: 'Millimeters (mm)', factor: 0.001 },
    { value: 'mi', label: 'Miles (mi)', factor: 1609.344 },
    { value: 'yd', label: 'Yards (yd)', factor: 0.9144 },
    { value: 'ft', label: 'Feet (ft)', factor: 0.3048 },
    { value: 'in', label: 'Inches (in)', factor: 0.0254 },
  ],
  weight: [
    { value: 'kg', label: 'Kilograms (kg)', factor: 1 },
    { value: 'g', label: 'Grams (g)', factor: 0.001 },
    { value: 'mg', label: 'Milligrams (mg)', factor: 0.000001 },
    { value: 'lb', label: 'Pounds (lb)', factor: 0.45359237 },
    { value: 'oz', label: 'Ounces (oz)', factor: 0.028349523125 },
    { value: 't', label: 'Metric Tons (t)', factor: 1000 },
  ],
  temperature: [
    { value: 'c', label: 'Celsius (°C)', factor: 1 },
    { value: 'f', label: 'Fahrenheit (°F)', factor: 1 },
    { value: 'k', label: 'Kelvin (K)', factor: 1 },
  ],
  area: [
    { value: 'm2', label: 'Square Meters (m²)', factor: 1 },
    { value: 'km2', label: 'Square Kilometers (km²)', factor: 1000000 },
    { value: 'cm2', label: 'Square Centimeters (cm²)', factor: 0.0001 },
    { value: 'ha', label: 'Hectares (ha)', factor: 10000 },
    { value: 'ac', label: 'Acres (ac)', factor: 4046.8564224 },
    { value: 'ft2', label: 'Square Feet (ft²)', factor: 0.09290304 },
    { value: 'mi2', label: 'Square Miles (mi²)', factor: 2589988.110336 },
  ],
  volume: [
    { value: 'l', label: 'Liters (L)', factor: 1 },
    { value: 'ml', label: 'Milliliters (mL)', factor: 0.001 },
    { value: 'm3', label: 'Cubic Meters (m³)', factor: 1000 },
    { value: 'gal', label: 'Gallons (US)', factor: 3.785411784 },
    { value: 'qt', label: 'Quarts (US)', factor: 0.946352946 },
    { value: 'pt', label: 'Pints (US)', factor: 0.473176473 },
    { value: 'cup', label: 'Cups (US)', factor: 0.2365882365 },
    { value: 'floz', label: 'Fluid Ounces (US)', factor: 0.0295735295625 },
  ],
  speed: [
    { value: 'ms', label: 'Meters/second (m/s)', factor: 1 },
    { value: 'kmh', label: 'Kilometers/hour (km/h)', factor: 1 / 3.6 },
    { value: 'mph', label: 'Miles/hour (mph)', factor: 0.44704 },
    { value: 'kn', label: 'Knots (kn)', factor: 1852 / 3600 },
    { value: 'fts', label: 'Feet/second (ft/s)', factor: 0.3048 },
  ],
};

