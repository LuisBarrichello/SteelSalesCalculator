import { useState, useMemo, useCallback, useEffect } from 'react';
import type { RouteOrder, VehicleType } from '../utils/parseErpReport';
import type {
    PlannedRoute,
    CityGroup,
    ViewMode,
    RestrictionsMap,
} from '../types';
import { SANDWICH_VOLUMETRIC_FACTOR, cleanCode } from '../utils/formatters';
import { distanceBetweenCities } from '../utils/geo';

export function useRouteManager(
    orders: RouteOrder[],
    fleet: VehicleType[],
    restrictions: RestrictionsMap,
    initialViewMode: ViewMode = 'ready',
) {
    const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
    const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(
        null,
    );
    const [selectedOrders, setSelected] = useState<Set<string>>(new Set());
    const [selectedVehicleId, setVehicleId] = useState<string>(
        fleet.find((v) => v.count > 0)?.id ?? fleet[0].id,
    );
    const [expandedCities, setExpandedCities] = useState<Set<string>>(
        new Set(),
    );

    useEffect(() => {
        setExpandedCities(new Set(orders.map((o) => o.city)));
    }, [orders]);

    const [plannedRoutes, setPlannedRoutes] = useState<PlannedRoute[]>(() => {
        const saved = localStorage.getItem('routing_plannedRoutes');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Re-hidrata as datas dos pedidos salvos nas rotas
                return parsed.map((route: any) => ({
                    ...route,
                    orders: route.orders.map((o: any) => ({
                        ...o,
                        originalDelivery: o.originalDelivery
                            ? new Date(o.originalDelivery)
                            : null,
                        newDelivery: o.newDelivery
                            ? new Date(o.newDelivery)
                            : null,
                    })),
                }));
            } catch (e) {
                console.error(e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(
            'routing_plannedRoutes',
            JSON.stringify(plannedRoutes),
        );
    }, [plannedRoutes]);

    const plannedOrderIds = useMemo(
        () =>
            new Set(plannedRoutes.flatMap((r) => r.orders.map((o) => o.order))),
        [plannedRoutes],
    );
    const selectedVehicle =
        fleet.find((v) => v.id === selectedVehicleId) ?? fleet[0];
    const isCarretaSelected = selectedVehicle.capacityKg >= 25000;

    const availableDates = useMemo(() => {
        const datesMap = new Map<string, Date>();
        orders.forEach((o) => {
            if (o.newDelivery && !plannedOrderIds.has(o.order)) {
                datesMap.set(
                    o.newDelivery.toLocaleDateString('pt-BR'),
                    o.newDelivery,
                );
            }
        });
        return Array.from(datesMap.entries())
            .sort((a, b) => a[1].getTime() - b[1].getTime())
            .map((e) => e[0]);
    }, [orders, plannedOrderIds]);

    const dateFilteredOrders = useMemo(() => {
        let base = orders.filter((o) => !plannedOrderIds.has(o.order));
        if (selectedDateFilter)
            base = base.filter(
                (o) =>
                    o.newDelivery?.toLocaleDateString('pt-BR') ===
                    selectedDateFilter,
            );
        return base;
    }, [orders, plannedOrderIds, selectedDateFilter]);

    const visibleOrders = useMemo(() => {
        if (viewMode === 'ready')
            return dateFilteredOrders.filter(
                (o) => o.erpStatus === 'FN' || o.erpStatus === '',
            );
        if (viewMode === 'wip')
            return dateFilteredOrders.filter(
                (o) => o.erpStatus !== 'FN' && o.erpStatus !== '',
            );
        if (viewMode === 'delayed')
            return dateFilteredOrders.filter((o) => o.delayDays > 0);
        return dateFilteredOrders;
    }, [dateFilteredOrders, viewMode]);

    // Contadores para as abas
    const counts = useMemo(
        () => ({
            ready: dateFilteredOrders.filter(
                (o) => o.erpStatus === 'FN' || o.erpStatus === '',
            ).length,
            wip: dateFilteredOrders.filter(
                (o) => o.erpStatus !== 'FN' && o.erpStatus !== '',
            ).length,
            all: dateFilteredOrders.length,
            delayed: dateFilteredOrders.filter((o) => o.delayDays > 0).length,
        }),
        [dateFilteredOrders],
    );

    const erpWeights = useMemo(() => {
        const weights: Record<string, number> = {
            FN: 0,
            OP: 0,
            AP: 0,
            AC: 0,
            AB: 0,
        };
        visibleOrders.forEach((o) => {
            const st = o.erpStatus || 'AB';
            if (weights[st] !== undefined) weights[st] += o.weight;
        });
        return weights;
    }, [visibleOrders]);

    const anchorCity = useMemo(
        () =>
            selectedOrders.size === 0
                ? null
                : (orders.find((o) => selectedOrders.has(o.order))?.city ??
                  null),
        [selectedOrders, orders],
    );

    const cityGroups = useMemo((): CityGroup[] => {
        const map = new Map<string, RouteOrder[]>();
        for (const o of visibleOrders) {
            if (!map.has(o.city)) map.set(o.city, []);
            map.get(o.city)!.push(o);
        }
        return [...map.entries()]
            .map(([city, cityOrders]) => ({
                city,
                orders: cityOrders,
                totalWeight: cityOrders.reduce((s, o) => s + o.weight, 0),
                maxLength: Math.max(...cityOrders.map((o) => o.length), 0),
                worstDelay: Math.max(...cityOrders.map((o) => o.delayDays), 0),
                allReady: cityOrders.every(
                    (o) => o.erpStatus === 'FN' || o.erpStatus === '',
                ),
                distanceKm:
                    anchorCity && city !== anchorCity
                        ? distanceBetweenCities(anchorCity, city)
                        : null,
            }))
            .sort((a, b) => {
                if (anchorCity) {
                    if (a.city === anchorCity) return -1;
                    if (b.city === anchorCity) return 1;
                    return (
                        (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
                    );
                }
                return (
                    b.worstDelay - a.worstDelay || b.totalWeight - a.totalWeight
                );
            });
    }, [visibleOrders, anchorCity]);

    const allExpanded =
        cityGroups.length > 0 &&
        cityGroups.every((g) => expandedCities.has(g.city));
    const toggleAllCities = () =>
        setExpandedCities(
            allExpanded ? new Set() : new Set(cityGroups.map((g) => g.city)),
        );

    const selectedList = useMemo(
        () => orders.filter((o) => selectedOrders.has(o.order)),
        [orders, selectedOrders],
    );
    const selectedStopsCount = new Set(selectedList.map((o) => o.customer))
        .size;
    const selectedPhysicalWeight = selectedList.reduce(
        (s, o) => s + o.weight,
        0,
    );
    const selectedVolumetricWeight = selectedList.reduce(
        (s, o) =>
            s + (o.sandwich ? o.weight * SANDWICH_VOLUMETRIC_FACTOR : o.weight),
        0,
    );
    const selectedMaxLength = Math.max(...selectedList.map((o) => o.length), 0);
    const totalWeight = visibleOrders.reduce((s, o) => s + o.weight, 0);
    const totalDelayed = visibleOrders.filter((o) => o.delayDays > 0).length;

    const hasCarretaConflict = useMemo(() => {
        if (!isCarretaSelected) return false;
        return selectedList.some(
            (o) => restrictions[cleanCode(o.customerCode)]?.blockCarreta,
        );
    }, [selectedList, isCarretaSelected, restrictions]);

    const conflictClients = useMemo(() => {
        if (!hasCarretaConflict) return [];
        return [
            ...new Set(
                selectedList
                    .filter(
                        (o) =>
                            restrictions[cleanCode(o.customerCode)]
                                ?.blockCarreta,
                    )
                    .map((o) => o.customer),
            ),
        ];
    }, [selectedList, hasCarretaConflict, restrictions]);

    const toggleOrder = useCallback((order: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            next.has(order) ? next.delete(order) : next.add(order);
            return next;
        });
    }, []);

    const toggleCity = useCallback(
        (cityOrders: RouteOrder[]) => {
            const allSel = cityOrders.every((o) => selectedOrders.has(o.order));
            setSelected((prev) => {
                const next = new Set(prev);
                cityOrders.forEach((o) =>
                    allSel ? next.delete(o.order) : next.add(o.order),
                );
                return next;
            });
        },
        [selectedOrders],
    );

    const markAsPlanned = () => {
        if (selectedList.length === 0 || hasCarretaConflict) return;
        setPlannedRoutes((prev) => [
            ...prev,
            {
                id: Date.now(),
                orders: selectedList,
                totalWeight: selectedPhysicalWeight,
                totalVolumetricWeight: selectedVolumetricWeight,
                stops: selectedStopsCount,
                cities: [...new Set(selectedList.map((o) => o.city))],
                createdAt: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
        ]);
        setSelected(new Set());
    };

    const undoPlanned = (id?: number) =>
        setPlannedRoutes((prev) => (id ? prev.filter((r) => r.id !== id) : []));

    return {
        viewMode,
        setViewMode,
        selectedDateFilter,
        setSelectedDateFilter,
        selectedOrders,
        setSelected,
        plannedRoutes,
        setPlannedRoutes,
        selectedVehicleId,
        setVehicleId,
        expandedCities,
        setExpandedCities,
        plannedOrderIds,
        selectedVehicle,
        availableDates,
        dateFilteredOrders,
        visibleOrders,
        anchorCity,
        cityGroups,
        allExpanded,
        toggleAllCities,
        erpWeights,
        selectedList,
        selectedStopsCount,
        selectedPhysicalWeight,
        selectedVolumetricWeight,
        selectedMaxLength,
        totalWeight,
        totalDelayed,
        hasCarretaConflict,
        conflictClients,
        toggleOrder,
        toggleCity,
        markAsPlanned,
        undoPlanned,
        counts,
    };
}
