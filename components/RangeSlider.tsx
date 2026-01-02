import React from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  description?: string;
  minLabel?: string;
  maxLabel?: string;
  colorClass?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ 
  label, 
  value, 
  onChange, 
  description,
  minLabel = "Baixo",
  maxLabel = "Alto",
  colorClass = "accent-sky-600"
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        <span className="text-sm font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{value}%</span>
      </div>
      {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${colorClass}`}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

export default RangeSlider;