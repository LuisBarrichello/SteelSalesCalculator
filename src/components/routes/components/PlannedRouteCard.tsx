import { useState } from 'react';
import { Box, Check, Copy, ShieldAlert, X } from 'lucide-react';
import { Button } from '../../common/buttons/Button';
import type { PlannedRoute, RestrictionsMap } from '../types';
import {
    cleanCode,
    ERP_STATUS_COLORS,
    MAX_RECOMMENDED_STOPS,
} from '../utils/formatters';

interface Props {
    route: PlannedRoute;
    idx: number;
    restrictions: RestrictionsMap;
    undoPlanned: (id: number) => void;
}

export function PlannedRouteCard({
    route,
    idx,
    restrictions,
    undoPlanned,
}: Props) {
    const [copiedRouteId, setCopiedRouteId] = useState<number | null>(null);

    const copyRouteOrders = async () => {
        const text = route.orders.map((o) => o.order).join('\n');
        await navigator.clipboard.writeText(text);
        setCopiedRouteId(route.id);
        setTimeout(() => setCopiedRouteId(null), 2500);
    };

    return (
        <div className="bg-white rounded-xl border-2 border-emerald-200 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between gap-3 px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-base font-bold text-emerald-800 shrink-0">
                        Rota {idx + 1}
                    </span>
                    <span className="text-sm text-emerald-600 whitespace-nowrap font-medium flex items-center gap-2">
                        {route.orders.length} pedidos <span>·</span>
                        <span
                            className={
                                route.stops > MAX_RECOMMENDED_STOPS
                                    ? 'text-amber-600 font-bold'
                                    : ''
                            }>
                            {route.stops} parada(s)
                        </span>
                        <span>·</span>{' '}
                        {route.totalWeight.toLocaleString('pt-BR')} kg
                        {route.totalVolumetricWeight > route.totalWeight && (
                            <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs">
                                <Box className="w-3 h-3 inline mr-1" />
                                Vol:{' '}
                                {route.totalVolumetricWeight.toLocaleString(
                                    'pt-BR',
                                )}
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {route.cities.map((c) => (
                        <span
                            key={c}
                            className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-700 rounded-md text-xs font-semibold">
                            {c}
                        </span>
                    ))}
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => undoPlanned(route.id)}
                        className="text-steel-400 hover:text-red-500">
                        <X className="w-4 h-4 mr-1" /> Desfazer
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-steel-500 uppercase tracking-wider">
                        Pedidos nesta rota
                    </span>
                    <Button
                        variant={
                            copiedRouteId === route.id
                                ? 'success'
                                : 'outline-success'
                        }
                        size="sm"
                        onClick={copyRouteOrders}
                        icon={
                            copiedRouteId === route.id ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )
                        }>
                        {copiedRouteId === route.id
                            ? 'Copiado!'
                            : 'Copiar nºs dos pedidos'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                    {route.orders.map((o) => {
                        const restriction =
                            restrictions[cleanCode(o.customerCode)];
                        return (
                            <div
                                key={o.order}
                                className="flex items-center justify-between p-2.5 rounded-lg border border-steel-100 bg-steel-50 hover:bg-steel-100">
                                <div className="flex flex-col min-w-0 pr-2">
                                    <span className="font-mono text-xs font-bold text-steel-800">
                                        {o.order}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-mono text-steel-400">
                                            {cleanCode(o.customerCode)}
                                        </span>
                                        <span className="text-[10px] text-steel-500 truncate">
                                            {o.customer}
                                        </span>
                                        {restriction && (
                                            <div title="Restrição Ativa">
                                                <ShieldAlert
                                                    className="w-3 h-3 text-red-600"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className="text-xs font-semibold text-steel-700 flex items-center gap-1">
                                        {o.sandwich && (
                                            <Box className="w-3 h-3 text-indigo-400" />
                                        )}{' '}
                                        {o.weight.toLocaleString('pt-BR', {
                                            maximumFractionDigits: 1,
                                        })}{' '}
                                        kg
                                    </span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${ERP_STATUS_COLORS[o.erpStatus] ?? 'bg-steel-200 text-steel-600'}`}>
                                        {o.erpStatus || '—'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
