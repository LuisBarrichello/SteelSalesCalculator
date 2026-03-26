import { Box, Navigation, Truck, Ruler } from "lucide-react";
import { MAX_RECOMMENDED_STOPS } from "../utils/formatters";

export function WeightGauge({
    selectedPhysical,
    selectedVolumetric,
    selectedStops,
    capacity,
    maxLength,
    vehicleMaxLength,
}: {
    selectedPhysical: number;
    selectedVolumetric: number;
    selectedStops: number;
    capacity: number;
    maxLength: number;
    vehicleMaxLength: number;
}) {
    const pctPhysical = Math.min((selectedPhysical / capacity) * 100, 100);
    const pctVolumetric = Math.min((selectedVolumetric / capacity) * 100, 100);

    const overWeight = selectedPhysical > capacity;
    const overVolume = selectedVolumetric > capacity;
    const overLength = maxLength > vehicleMaxLength;
    const overStops = selectedStops > MAX_RECOMMENDED_STOPS;

    const physicalColor = overWeight
        ? 'bg-red-500'
        : pctPhysical > 90
          ? 'bg-amber-500'
          : 'bg-emerald-500';
    const volumetricColor = overVolume
        ? 'bg-red-500'
        : pctVolumetric > 90
          ? 'bg-orange-500'
          : 'bg-indigo-500';

    return (
        <div className="space-y-4">
            {/* BARRA 1: Peso Físico (Balança) */}
            <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-steel-700 flex items-center gap-1.5">
                        <Truck className="w-4 h-4" /> Peso (Balança)
                    </span>
                    <span
                        className={`text-sm font-bold tabular-nums ${overWeight ? 'text-red-600' : 'text-steel-900'}`}>
                        {selectedPhysical.toLocaleString('pt-BR', {
                            maximumFractionDigits: 0,
                        })}
                        <span className="text-xs font-normal text-steel-500 ml-1">
                            / {capacity.toLocaleString('pt-BR')} kg
                        </span>
                    </span>
                </div>
                <div className="h-2.5 bg-steel-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${physicalColor}`}
                        style={{ width: `${pctPhysical}%` }}
                    />
                </div>
            </div>

            {/* BARRA 2: Volume (Cubagem Sanduíche) */}
            <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-indigo-700 flex items-center gap-1.5">
                        <Box className="w-4 h-4" /> Ocupação (Volume)
                    </span>
                    <span
                        className={`text-sm font-bold tabular-nums ${overVolume ? 'text-red-600' : 'text-indigo-900'}`}>
                        {pctVolumetric.toFixed(0)}% da caçamba
                    </span>
                </div>
                <div className="h-2.5 bg-indigo-50 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${volumetricColor}`}
                        style={{ width: `${pctVolumetric}%` }}
                    />
                </div>
                {overVolume && !overWeight && (
                    <p className="text-xs font-medium text-red-600 mt-1 leading-tight">
                        ⚠️ O peso está OK, mas devido às telhas sanduíche, o
                        volume excedeu a caçamba.
                    </p>
                )}
            </div>

            <div className="pt-2 border-t border-steel-100">
                <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold text-steel-700 flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-sky-600" /> Paradas (Drop Size)
                    </span>
                    <span className={`text-sm font-bold tabular-nums ${overStops ? 'text-amber-600' : 'text-steel-900'}`}>
                        {selectedStops} <span className="text-xs font-normal text-steel-500 ml-0.5">clientes</span>
                    </span>
                </div>
                {overStops && (
                    <p className="text-xs font-medium text-amber-600 mt-1 leading-tight">
                        ⚠️ Rota com muitas paradas {'>'} ({MAX_RECOMMENDED_STOPS}). Pode faltar tempo hábil para descarregar.
                    </p>
                )}
            </div>

            {/* ALERTA: Comprimento */}
            {overLength && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                    <Ruler className="w-3.5 h-3.5 shrink-0" />
                    Peça de {maxLength.toFixed(2)} m excede caçamba (
                    {vehicleMaxLength} m)
                </div>
            )}
        </div>
    );
}