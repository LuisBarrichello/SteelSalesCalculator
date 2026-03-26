import { ChevronDown, ChevronUp, Clock, MapPin, ShieldAlert } from "lucide-react";
import { CityGroup, RestrictionsMap } from "../types";
import { RouteOrder } from "../utils/parseErpReport";
import { cleanCode, DELAY_BADGE, DELAY_ROW_BG, ERP_STATUS_COLORS } from "../utils/formatters";

export function CityGroupRow({
    group,
    selectedOrders,
    isExpanded,
    onToggleExpand,
    onToggleOrder,
    onToggleCity,
    restrictions,
}: {
    group: CityGroup;
    selectedOrders: Set<string>;
    isExpanded: boolean;
    onToggleExpand: () => void;
    onToggleOrder: (order: string) => void;
    onToggleCity: (orders: RouteOrder[]) => void;
    restrictions: RestrictionsMap;
}) {
    const selectedCount = group.orders.filter((o) =>
        selectedOrders.has(o.order),
    ).length;
    const allSelected = selectedCount === group.orders.length;
    const partialSelected = selectedCount > 0 && !allSelected;

    const delayStatus: RouteOrder['delayStatus'] =
        group.worstDelay > 7
            ? 'critico'
            : group.worstDelay > 3
              ? 'moderado'
              : group.worstDelay > 0
                ? 'leve'
                : 'ok';
    const cityBg =
        group.worstDelay > 7
            ? 'bg-red-50 border-red-200'
            : group.worstDelay > 3
              ? 'bg-orange-50 border-orange-200'
              : group.worstDelay > 0
                ? 'bg-yellow-50 border-yellow-200'
                : allSelected
                  ? 'bg-sky-50 border-sky-300'
                  : 'bg-white border-steel-200';
    const selectedWeight = group.orders
        .filter((o) => selectedOrders.has(o.order))
        .reduce((s, o) => s + o.weight, 0);

    return (
        <div
            className={`rounded-xl border-2 overflow-hidden transition-all ${cityBg}`}>
            <div className="flex items-center gap-3 px-4 py-3">
                <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                        if (el) el.indeterminate = partialSelected;
                    }}
                    onChange={() => onToggleCity(group.orders)}
                    className="w-4 h-4 rounded border-steel-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <button
                    className="flex-1 flex items-center gap-2 text-left min-w-0 flex-wrap"
                    onClick={onToggleExpand}>
                    <span className="font-semibold text-steel-900">
                        {group.city}
                    </span>
                    <span className="text-xs text-steel-400">
                        {group.orders.length}×
                    </span>
                    {group.distanceKm !== null && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-sky-100 text-sky-700 border border-sky-200 rounded-full text-xs font-semibold shrink-0">
                            <MapPin className="w-2.5 h-2.5" />
                            {Math.round(group.distanceKm)} km
                        </span>
                    )}
                    {group.worstDelay > 0 && (
                        <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${DELAY_BADGE[delayStatus]}`}>
                            <Clock className="w-3 h-3" />+{group.worstDelay}d
                        </span>
                    )}
                    {!group.allReady && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs shrink-0">
                            Em prod.
                        </span>
                    )}
                </button>

                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className={`text-sm font-bold tabular-nums ${selectedCount > 0 ? 'text-sky-700' : 'text-steel-600'}`}>
                        {(selectedCount > 0
                            ? selectedWeight
                            : group.totalWeight
                        ).toLocaleString('pt-BR', {
                            maximumFractionDigits: 0,
                        })}{' '}
                        kg
                    </span>
                    {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-steel-400" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-steel-400" />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-steel-100 overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="bg-steel-50 border-b border-steel-100">
                                <th className="w-8 py-2 px-1" />
                                {[
                                    'Pedido',
                                    'Cód. Cliente',
                                    'Cliente',
                                    'Peso (kg)',
                                    'Compr.',
                                    'Retira',
                                    'Sand.',
                                    'ST',
                                    'Entrega',
                                    'Atraso',
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left py-2 px-2 font-semibold text-steel-500 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-steel-50">
                            {group.orders.map((o) => {
                                const isSel = selectedOrders.has(o.order);
                                const restriction =
                                    restrictions[cleanCode(o.customerCode)];

                                return (
                                    <tr
                                        key={o.order}
                                        onClick={() => onToggleOrder(o.order)}
                                        className={`cursor-pointer transition-colors ${isSel ? 'bg-sky-50' : DELAY_ROW_BG[o.delayStatus] || 'hover:bg-steel-50'}`}>
                                        <td className="py-2 px-3">
                                            <input
                                                type="checkbox"
                                                checked={isSel}
                                                readOnly
                                                className="w-3.5 h-3.5 rounded border-steel-300 text-sky-600 pointer-events-none"
                                            />
                                        </td>
                                        <td className="py-1 px-1 font-mono text-steel-600 whitespace-nowrap">
                                            {o.order}
                                        </td>
                                        <td className="py-1 px-1 font-mono text-steel-600 whitespace-nowrap">
                                            {o.customerCode}
                                        </td>
                                        <td className="py-1 px-1 text-steel-900 max-w-50 truncate">
                                            <div className="flex items-center gap-1.5">
                                                <span className="truncate">
                                                    {o.customer}
                                                </span>
                                                {restriction && (
                                                    <span
                                                        title={`Regras: ${restriction.timeWindow ? `[${restriction.timeWindow}] ` : ''}${restriction.blockCarreta ? '[Proibido Carreta] ' : ''}${restriction.needsMunck ? '[Requer Munck] ' : ''}${restriction.notes}`}
                                                        className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded flex items-center gap-0.5 shrink-0 border border-red-200 cursor-help">
                                                        <ShieldAlert className="w-2.5 h-2.5" />{' '}
                                                        RESTRIÇÃO
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-1 px-1 text-right font-medium tabular-nums whitespace-nowrap">
                                            {o.weight.toLocaleString('pt-BR', {
                                                maximumFractionDigits: 3,
                                            })}
                                        </td>
                                        <td className="py-1 px-1 text-right whitespace-nowrap">
                                            {o.length > 0
                                                ? `${o.length.toFixed(2)}m`
                                                : '—'}
                                        </td>
                                        <td className="py-1 px-1 text-center">
                                            {o.pickup ? (
                                                <span className="text-amber-600 font-medium">
                                                    Sim
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="py-1 px-1 text-center">
                                            {o.sandwich ? (
                                                <span className="text-indigo-600 font-medium">
                                                    Sim
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="py-1 px-1">
                                            <span
                                                className={`px-1.5 py-0.5 rounded text-xs font-mono border ${ERP_STATUS_COLORS[o.erpStatus] ?? 'bg-steel-100 text-steel-600 border-steel-200'}`}>
                                                {o.erpStatus || '—'}
                                            </span>
                                        </td>
                                        <td className="py-1 px-1 whitespace-nowrap text-steel-500">
                                            {o.newDelivery?.toLocaleDateString(
                                                'pt-BR',
                                            ) ?? '—'}
                                        </td>
                                        <td className="py-1 px-1 whitespace-nowrap">
                                            {o.delayDays > 0 ? (
                                                <span
                                                    className={`px-2 py-0.5 rounded-full border font-semibold ${DELAY_BADGE[o.delayStatus]}`}>
                                                    +{o.delayDays}d
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}