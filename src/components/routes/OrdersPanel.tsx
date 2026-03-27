import { useState } from 'react';
import {
    Truck,
    ShieldAlert,
    Check,
    Copy,
    Archive,
    Calendar,
    ChevronDown,
    Settings,
    List,
    Clock,
    CheckCheck,
    ChevronUp,
    AlertTriangle,
    MapPin,
    Map
} from 'lucide-react';
import type { RouteOrder } from './utils/parseErpReport';
import { Button } from '../common/buttons/Button';

// Hooks
import { useRestrictions } from './hooks/useRestrictions';
import { useRouteManager } from './hooks/useRouteManager';

// Utilities and Types
import { cleanCode, ERP_STATUS_COLORS } from './utils/formatters';

// UI Components
import { WeightGauge } from './components/WeightGauge';
import { CityGroupRow } from './components/CityGroupRow';
import { PlannedRouteCard } from './components/PlannedRouteCard';
import { RestrictionModal } from './components/RestrictionModal';
import { RouteMap } from './components/RouteMap';

import { useFleet } from './hooks/useFleet';
import { FleetModal } from './components/FleetModal';

export default function OrdersPanel({ orders }: { orders: RouteOrder[] }) {
    const [isMapView, setIsMapView] = useState(false);
    const [copied, setCopied] = useState(false);

    const {
        fleet,
        isFleetModalOpen,
        setIsFleetModalOpen,
        saveFleet,
        clearFleet,
    } = useFleet();
    const {
        restrictions,
        isRestrictionsModalOpen,
        setIsRestrictionsModalOpen,
        saveRestriction,
        deleteRestriction,
    } = useRestrictions();
    const safeFleet =
        fleet.length > 0
            ? fleet
            : [
                  {
                      id: 'none',
                      label: 'SEM FROTA CONFIGURADA',
                      capacityKg: 999999,
                      maxLengthM: 99,
                      count: 1,
                  },
              ];

    const manager = useRouteManager(orders, safeFleet, restrictions);

    const copyForERP = async () => {
        const text = manager.selectedList.map((o) => o.order).join('\n');
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const copyCodesForERP = async () => {
        const uniqueCodes = [
            ...new Set(
                manager.selectedList
                    .map((o) => cleanCode(o.customerCode))
                    .filter(Boolean),
            ),
        ];
        await navigator.clipboard.writeText(uniqueCodes.join('\n'));
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 items-start relative">
            <RestrictionModal
                isOpen={isRestrictionsModalOpen}
                onClose={() => setIsRestrictionsModalOpen(false)}
                restrictions={restrictions}
                onSave={saveRestriction}
                onDelete={deleteRestriction}
            />

            <FleetModal
                isOpen={isFleetModalOpen}
                onClose={() => setIsFleetModalOpen(false)}
                fleet={fleet}
                onSave={saveFleet}
                onClear={clearFleet}
            />

            {/* Left Side - Decision Panel */}
            <div className="flex-1 min-w-0 space-y-4">
                {/* Filter Header */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="relative">
                            <Calendar className="w-4 h-4 text-steel-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <select
                                value={manager.selectedDateFilter || ''}
                                onChange={(e) =>
                                    manager.setSelectedDateFilter(
                                        e.target.value || null,
                                    )
                                }
                                className="pl-9 pr-8 py-2.5 bg-white border-2 border-steel-200 rounded-xl text-sm text-steel-700 font-bold focus:ring-2 focus:ring-sky-500 outline-none appearance-none cursor-pointer hover:border-sky-300">
                                <option value="">
                                    Todas as datas de entrega
                                </option>
                                {manager.availableDates.map((d) => (
                                    <option key={d} value={d}>
                                        Entrega: {d}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-steel-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={isMapView ? 'primary' : 'outline'}
                                onClick={() => setIsMapView(!isMapView)}
                                icon={
                                    <Map
                                        className={`w-4 h-4 ${isMapView ? 'text-white' : 'text-sky-600'}`}
                                    />
                                }
                                className={isMapView ? '' : 'bg-white'}>
                                {isMapView ? 'Ocultar Mapa' : 'Ver no Mapa'}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setIsRestrictionsModalOpen(true)}
                                icon={
                                    <ShieldAlert className="w-4 h-4 text-red-500" />
                                }
                                className="bg-white">
                                Regras de Clientes
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setIsFleetModalOpen(true)}
                                icon={
                                    <Truck className="w-4 h-4 text-sky-500" />
                                }
                                className="bg-white">
                                Frota ({fleet.length})
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="bg-white rounded-xl border-2 border-steel-200 p-1 flex gap-1 flex-wrap">
                            <Button
                                variant="none"
                                size="none"
                                onClick={() => manager.setViewMode('ready')}
                                icon={<Truck className="w-4 h-4" />}
                                className={`px-4 py-2 rounded-lg transition-all ${manager.viewMode === 'ready' ? 'bg-sky-600 text-white shadow-sm' : 'text-steel-600 hover:bg-steel-50'}`}>
                                Prontos (FN){' '}
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${manager.viewMode === 'ready' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                                    {manager.counts.ready}
                                </span>
                            </Button>
                            <Button
                                variant="none"
                                size="none"
                                onClick={() => manager.setViewMode('wip')}
                                icon={<Settings className="w-4 h-4" />}
                                className={`px-4 py-2 rounded-lg transition-all ${manager.viewMode === 'wip' ? 'bg-amber-500 text-white shadow-sm' : 'text-steel-600 hover:bg-steel-50'}`}>
                                Em Produção{' '}
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${manager.viewMode === 'wip' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700'}`}>
                                    {manager.counts.wip}
                                </span>
                            </Button>
                            <Button
                                variant="none"
                                size="none"
                                onClick={() => manager.setViewMode('all')}
                                icon={<List className="w-4 h-4" />}
                                className={`px-4 py-2 rounded-lg transition-all ${manager.viewMode === 'all' ? 'bg-steel-600 text-white shadow-sm' : 'text-steel-600 hover:bg-steel-50'}`}>
                                Todos{' '}
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${manager.viewMode === 'all' ? 'bg-white/20 text-white' : 'bg-steel-100 text-steel-600'}`}>
                                    {manager.counts.all}
                                </span>
                            </Button>
                            <Button
                                variant="none"
                                size="none"
                                onClick={() => manager.setViewMode('delayed')}
                                icon={<Clock className="w-4 h-4" />}
                                className={`px-4 py-2 rounded-lg transition-all ${manager.viewMode === 'delayed' ? 'bg-red-600 text-white shadow-sm' : 'text-steel-600 hover:bg-steel-50'}`}>
                                Atrasados{' '}
                                {manager.counts.delayed > 0 && (
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${manager.viewMode === 'delayed' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'}`}>
                                        {manager.counts.delayed}
                                    </span>
                                )}
                            </Button>
                            <Button
                                variant="none"
                                size="none"
                                onClick={() => manager.setViewMode('routes')}
                                icon={<CheckCheck className="w-4 h-4" />}
                                className={`px-4 py-2 rounded-lg transition-all ${manager.viewMode === 'routes' ? 'bg-emerald-600 text-white shadow-sm' : 'text-steel-600 hover:bg-steel-50'}`}>
                                Rotas planejadas{' '}
                                {manager.plannedRoutes.length > 0 && (
                                    <span
                                        className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${manager.viewMode === 'routes' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {manager.plannedRoutes.length}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap items-center">
                        {manager.viewMode !== 'routes' &&
                            manager.cityGroups.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={manager.toggleAllCities}
                                    icon={
                                        manager.allExpanded ? (
                                            <ChevronUp className="w-3.5 h-3.5" />
                                        ) : (
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        )
                                    }>
                                    {manager.allExpanded
                                        ? 'Recolher cidades'
                                        : 'Expandir cidades'}
                                </Button>
                            )}
                        {manager.viewMode !== 'routes' && (
                            <span className="px-3 py-1.5 bg-white border-2 border-steel-200 rounded-lg text-xs text-steel-600 whitespace-nowrap">
                                <span className="font-semibold text-steel-900">
                                    {manager.visibleOrders.length}
                                </span>{' '}
                                pedidos ·{' '}
                                <span className="font-semibold text-steel-900">
                                    {manager.totalWeight.toLocaleString(
                                        'pt-BR',
                                    )}{' '}
                                    kg
                                </span>
                            </span>
                        )}
                        {manager.viewMode !== 'routes' &&
                            manager.totalDelayed > 0 && (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border-2 border-red-200 rounded-lg text-xs text-red-700 font-medium whitespace-nowrap">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {manager.totalDelayed} atrasado(s)
                                </span>
                            )}
                        {manager.anchorCity &&
                            manager.viewMode !== 'routes' && (
                                <span className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 border-2 border-sky-200 rounded-lg text-xs text-sky-700 font-medium whitespace-nowrap">
                                    <MapPin className="w-3.5 h-3.5" />
                                    Radar: {manager.anchorCity}
                                </span>
                            )}
                        {manager.plannedOrderIds.size > 0 && (
                            <Button
                                variant="none"
                                size="none"
                                onClick={() => manager.undoPlanned()}
                                className="px-3 py-1.5 bg-emerald-50 border-2 border-emerald-200 rounded-lg text-xs text-emerald-700 hover:bg-emerald-100 flex items-center gap-1">
                                <CheckCheck className="w-3.5 h-3.5" />{' '}
                                {manager.plannedOrderIds.size} planejado(s){' '}
                                <span className="opacity-50 ml-0.5">
                                    · desfazer
                                </span>
                            </Button>
                        )}
                    </div>
                </div>

                {fleet.length === 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <p className="text-sm text-red-800 font-medium">
                                Nenhuma frota configurada! Clique no botão{' '}
                                <strong>"Frota (0)"</strong> acima e faça o
                                upload da planilha CSV de caminhões.
                            </p>
                        </div>
                    </div>
                )}

                {/* Dynamic Content */}
                {isMapView ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <RouteMap
                            unassignedCities={manager.cityGroups}
                            plannedRoutes={manager.plannedRoutes}
                        />
                    </div>
                ) : (
                    <>
                        {manager.viewMode === 'routes' ? (
                            /* Aba de Rotas Planeadas */
                            <div className="space-y-4 pt-2">
                                {manager.plannedRoutes.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border-2 border-steel-200 border-dashed text-steel-400">
                                        <Archive className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-sm font-medium">
                                            Nenhuma rota planeada ainda
                                        </p>
                                    </div>
                                ) : (
                                    manager.plannedRoutes.map((route, idx) => (
                                        <PlannedRouteCard
                                            key={route.id}
                                            route={route}
                                            idx={idx}
                                            restrictions={restrictions}
                                            undoPlanned={manager.undoPlanned}
                                        />
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {manager.cityGroups.length === 0 ? (
                                    <div className="text-center py-16 text-steel-400">
                                        <CheckCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="text-sm font-medium">
                                            {manager.plannedOrderIds.size > 0
                                                ? 'Todos os pedidos foram planeados!'
                                                : 'Nenhum pedido disponível'}
                                        </p>
                                    </div>
                                ) : (
                                    manager.cityGroups.map((group) => (
                                        <CityGroupRow
                                            key={group.city}
                                            group={group}
                                            selectedOrders={
                                                manager.selectedOrders
                                            }
                                            isExpanded={manager.expandedCities.has(
                                                group.city,
                                            )}
                                            onToggleExpand={() =>
                                                manager.setExpandedCities(
                                                    (prev) => {
                                                        const next = new Set(
                                                            prev,
                                                        );
                                                        next.has(group.city)
                                                            ? next.delete(
                                                                  group.city,
                                                              )
                                                            : next.add(
                                                                  group.city,
                                                              );
                                                        return next;
                                                    },
                                                )
                                            }
                                            onToggleOrder={manager.toggleOrder}
                                            onToggleCity={manager.toggleCity}
                                            restrictions={restrictions}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Right Side - Vehicle Dashboard and Summary */}
            <div className="w-full lg:w-72 lg:sticky lg:top-6 space-y-4 shrink-0">
                <div className="bg-white rounded-2xl border-2 border-steel-200 p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-steel-700 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-steel-400" /> Veículo de
                        referência
                    </h3>
                    <div className="relative">
                        <select
                            value={manager.selectedVehicleId}
                            onChange={(e) =>
                                manager.setVehicleId(e.target.value)
                            }
                            className="w-full pl-3 pr-8 py-2.5 bg-steel-50 border border-steel-200 rounded-xl text-sm text-steel-800 font-bold focus:ring-2 focus:ring-sky-500 outline-none appearance-none cursor-pointer hover:border-sky-300">
                            {fleet.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.label} —{' '}
                                    {(v.capacityKg / 1000).toFixed(1)}t —{' '}
                                    {v.maxLengthM.toFixed(2)}m
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-steel-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="flex gap-2 text-xs text-steel-500 bg-steel-50 p-3 rounded-lg border border-steel-100">
                        <div className="flex-1">
                            <span className="block font-medium text-steel-700">
                                Capacidade
                            </span>
                            {manager.selectedVehicle.capacityKg.toLocaleString(
                                'pt-BR',
                            )}{' '}
                            kg
                        </div>
                        <div className="w-px bg-steel-200 mx-1"></div>
                        <div className="flex-1">
                            <span className="block font-medium text-steel-700">
                                Caçamba
                            </span>
                            {manager.selectedVehicle.maxLengthM.toFixed(2)} m
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border-2 border-steel-200 p-5 space-y-4">
                    <WeightGauge
                        selectedPhysical={manager.selectedPhysicalWeight}
                        selectedVolumetric={manager.selectedVolumetricWeight}
                        selectedStops={manager.selectedStopsCount}
                        capacity={manager.selectedVehicle.capacityKg}
                        maxLength={manager.selectedMaxLength}
                        vehicleMaxLength={manager.selectedVehicle.maxLengthM}
                    />

                    {manager.hasCarretaConflict && (
                        <div className="p-3 bg-red-100 border-2 border-red-500 rounded-lg text-red-800 flex items-start gap-2 shadow-sm animate-pulse">
                            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                            <div className="text-xs font-medium">
                                <span className="block text-sm font-bold text-red-900 mb-1">
                                    CONFLITO DE VEÍCULO!
                                </span>
                                Incompatível com clientes:
                                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                    {manager.conflictClients.map((c) => (
                                        <li key={c} className="font-bold">
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {manager.selectedList.length > 0 && (
                        <div className="space-y-2 pt-4 border-t border-steel-100">
                            <Button
                                fullWidth
                                variant={copied ? 'success' : 'primary'}
                                onClick={copyForERP}
                                icon={
                                    copied ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )
                                }>
                                {copied
                                    ? 'Copiado!'
                                    : `Copiar Núm. ${manager.selectedList.length} pedidos`}
                            </Button>
                            <Button
                                fullWidth
                                variant="outline"
                                onClick={copyCodesForERP}
                                icon={<Copy className="w-4 h-4" />}>
                                Copiar Cód. Clientes
                            </Button>
                            <Button
                                fullWidth
                                variant="outline-success"
                                onClick={manager.markAsPlanned}
                                disabled={manager.hasCarretaConflict}
                                icon={<Archive className="w-4 h-4" />}>
                                Marcar como planejado
                            </Button>
                            <Button
                                fullWidth
                                variant="ghost"
                                size="sm"
                                onClick={() => manager.setSelected(new Set())}
                                className="text-steel-400 border-none hover:text-steel-600">
                                Limpar seleção
                            </Button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl border-2 border-steel-200 p-5 space-y-3">
                    <p className="text-sm font-semibold text-steel-700">
                        Resumo de Pesos (Visão Atual)
                    </p>
                    <div className="space-y-2">
                        {[
                            { st: 'FN', label: 'Finalizado — pronto' },
                            { st: 'OP', label: 'OP gerada no PCP' },
                            { st: 'AP', label: 'Aguardando pintura' },
                            { st: 'AC', label: 'Aguardando colagem' },
                            { st: 'AB', label: 'Aberto no PCP' },
                        ].map(({ st, label }) => {
                            const isZero = manager.erpWeights[st] === 0;
                            return (
                                <div
                                    key={st}
                                    className={`flex items-center justify-between text-xs ${isZero ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-1.5 py-0.5 rounded border font-mono font-medium shrink-0 ${ERP_STATUS_COLORS[st] ?? ''}`}>
                                            {st}
                                        </span>
                                        <span className="text-steel-600">
                                            {label}
                                        </span>
                                    </div>
                                    <span
                                        className={`font-semibold tabular-nums ${isZero ? 'text-steel-400' : 'text-steel-800'}`}>
                                        {manager.erpWeights[st].toLocaleString(
                                            'pt-BR',
                                            { maximumFractionDigits: 0 },
                                        )}{' '}
                                        kg
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
