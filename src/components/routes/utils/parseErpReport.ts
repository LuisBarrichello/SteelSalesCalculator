import SP_CITIES_RAW from '../../../data/spCities.json';
import { normalizeCity } from './geo';

export type ReportFormat = 'selecao' | 'alternativa' | 'unknown';

// ── Vehicle types ─────────────────────────────────────────────
export interface VehicleType {
    id: string;
    label: string;
    capacityKg: number;
    maxLengthM: number;
    count: number;
}

export interface RouteOrder {
    order: string;
    customerCode: string;
    customer: string;
    salesperson: string;
    city: string;
    weight: number;
    originalDelivery: Date | null;
    newDelivery: Date | null;
    pickup: boolean;
    length: number;
    sandwich: boolean;
    valueBRL: number;
    erpStatus: string;
    delayDays: number;
    delayStatus: 'ok' | 'leve' | 'moderado' | 'critico';
    routeNumber: string | null;
    routeDescription: string | null;
    lat: number | null;
    lng: number | null;
}

export interface ParseResult {
    orders: RouteOrder[];
    format: ReportFormat;
    reportDate: Date | null;
    totalParsed: number;
    errors: string[];
}

export interface RouteSuggestion {
    region: string;
    cities: string[];
    orders: RouteOrder[];
    totalWeight: number;
    weightReady: number;
    weightWIP: number;
    maxPieceLength: number;
    totalLength: number;
    totalValue: number;
    delayedOrdersCount: number;
    worstDelays: RouteOrder[];
    exceedsWeightLimit: boolean;
    exceedsLengthLimit: boolean;
    hasBlockedSandwich: boolean;
    suggestedVehicle: VehicleType | null;
    valuePerKg: number;
    avgWeightPerDrop: number;
    readyPct: number;
}

// ── Geo helpers ───────────────────────────────────────────────

const CITY_COORDS = new Map<string, { lat: number; lng: number }>(
    (SP_CITIES_RAW as { name: string; lat: number; lng: number }[]).map((c) => [
        normalizeCity(c.name),
        { lat: c.lat, lng: c.lng },
    ]),
);

function getCityCoords(city: string) {
    return CITY_COORDS.get(normalizeCity(city)) ?? null;
}

function haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function clusterCitiesByRadius(
    cities: string[],
    radiusKm = 80,
): Map<string, string> {
    const coords = cities.map((c) => ({ city: c, geo: getCityCoords(c) }));
    const result = new Map<string, string>();
    const visited = new Set<string>();

    for (const { city, geo } of coords) {
        if (visited.has(city)) continue;
        result.set(city, city);
        visited.add(city);
        if (!geo) continue;
        for (const other of coords) {
            if (visited.has(other.city) || !other.geo) continue;
            if (
                haversineKm(geo.lat, geo.lng, other.geo.lat, other.geo.lng) <=
                radiusKm
            ) {
                result.set(other.city, city);
                visited.add(other.city);
            }
        }
    }
    return result;
}

// ── Parse helpers ─────────────────────────────────────────────

function parseDateBR(str: string): Date | null {
    const m = str.match(/^(\d{2})\/(\d{2})\/(\d{2,4})$/);
    if (!m) return null;
    const year = m[3].length === 2 ? 2000 + parseInt(m[3]) : parseInt(m[3]);
    return new Date(year, parseInt(m[2]) - 1, parseInt(m[1]));
}

function parseNumberBR(str: string): number {
    return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
}

function getDaysDiff(a: Date, b: Date): number {
    return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function calculateDelayStatus(days: number): RouteOrder['delayStatus'] {
    if (days <= 0) return 'ok';
    if (days <= 3) return 'leve';
    if (days <= 7) return 'moderado';
    return 'critico';
}

function enrichWithCoords(partial: Partial<RouteOrder>): RouteOrder {
    const geo = getCityCoords(partial.city ?? '');
    return {
        ...partial,
        lat: geo?.lat ?? null,
        lng: geo?.lng ?? null,
    } as RouteOrder;
}

// ── Format detection ──────────────────────────────────────────

export function detectFormat(text: string): ReportFormat {
    if (/Digitado\s+Por/i.test(text) || /ROTA\s+TELHAS/i.test(text))
        return 'selecao';
    if (/Vendedor:/i.test(text) || /ROTA\s+ALTERNATIVA/i.test(text))
        return 'alternativa';
    return 'unknown';
}

// ── Regexes ───────────────────────────────────────────────────

const RE_SELECAO =
    /^(\d{1,3})\s+ROTA\s+\S+(?:\s+\d+)?\s+(\d{5}-\d)\s+(\d{6})\s+(.+?)\s+([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇa-záàâãéêíóôõúç\s-]+?)\s+([A-Z][A-Z.]*)\s+([\d.,]+)\s*$/;

const RE_ALTERNATIVA =
    /^(\d{5}-\d)\s+(.*?)\s+(\d{2}\/\d{2}\/\d{2,4})\s+(\d{2}\/\d{2}\/\d{2,4})\s+(.*?)\s+(Sim|Não|SIM|NÃO)\s+(.*?)\s+([\d.,]+)\s+(.+)$/i;

const RE_SALESPERSON = /Vendedor:\s*([^\s|]+)/;
const RE_HEADER_DATE = /^(\d{2}\/\d{2}\/\d{2,4})$/;
const IGNORED_LINE =
    /^(PEDIDO|Total|RELAC|DATA|Vendedor|AB\s*=|TELHAS|ENTREGA|CIDADE|RETIRA|COMPR|ST\s|Rota\s|Descri|Digit)/i;

// ── Line parsers ──────────────────────────────────────────────

function parseSelecaoLine(line: string): Partial<RouteOrder> | null {
    const m = line.match(RE_SELECAO);
    if (!m) return null;
    return {
        routeNumber: m[1],
        routeDescription:
            `ROTA ${line.match(/ROTA\s+\S+(?:\s+\d+)?/i)?.[0].replace(/^ROTA\s+/i, '') ?? ''}`.trim(),
        order: m[2],
        customerCode: m[3],
        customer: m[4].trim(),
        city: normalizeCity(m[5]),
        salesperson: m[6].trim(),
        weight: parseNumberBR(m[7]),
        originalDelivery: null,
        newDelivery: null,
        pickup: false,
        length: 0,
        sandwich: false,
        valueBRL: 0,
        erpStatus: '',
        delayDays: 0,
        delayStatus: 'ok',
    };
}

function parseAlternativaLine(
    line: string,
    salesperson: string,
): Partial<RouteOrder> | null {
    const sanitized = line.replace(/\bOK\b\s*/g, '').trim();
    const m = sanitized.match(RE_ALTERNATIVA);
    if (!m) return null;

    let customer = m[2].trim();
    let customerCode = '';
    const codeMatch = customer.match(/\b(\d{6})\b/);
    if (codeMatch) {
        customerCode = codeMatch[1];
        customer = customer.replace(codeMatch[1], '').trim();
    }

    const originalDelivery = parseDateBR(m[3]);
    const newDelivery = parseDateBR(m[4]);
    if (!originalDelivery || !newDelivery) return null;

    const delayDays = getDaysDiff(originalDelivery, newDelivery);
    const compStr = m[7].toUpperCase();
    const sandwich = compStr.includes('SIM');
    const length = parseNumberBR(compStr.replace('SIM', '').trim());
    const weight = parseNumberBR(m[8]);
    const valStStr = m[9].toUpperCase();
    const stMatch = valStStr.match(/[A-Z]{2}/);
    const erpStatus = stMatch ? stMatch[0] : '';
    const valueBRL = parseNumberBR(valStStr.replace(/[A-Z]{2}/g, '').trim());

    return {
        order: m[1],
        customerCode,
        customer,
        salesperson,
        city: normalizeCity(m[5]),
        originalDelivery,
        newDelivery,
        pickup: m[6].toUpperCase() === 'SIM',
        length,
        sandwich,
        weight,
        valueBRL,
        erpStatus,
        delayDays,
        delayStatus: calculateDelayStatus(delayDays),
        routeNumber: null,
        routeDescription: null,
    };
}

// ── Main parser ───────────────────────────────────────────────

export function parseERPReport(text: string): ParseResult {
    const format = detectFormat(text);
    const lines = text
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
    const orders: RouteOrder[] = [];
    const errors: string[] = [];
    let currentSalesperson = '';
    let reportDate: Date | null = null;

    for (const line of lines) {
        if (!reportDate) {
            const dm = line.match(RE_HEADER_DATE);
            if (dm) {
                reportDate = parseDateBR(dm[1]);
                continue;
            }
        }
        const sm = line.match(RE_SALESPERSON);
        if (sm) {
            currentSalesperson = sm[1].trim();
            continue;
        }
        if (IGNORED_LINE.test(line) || line.length < 10) continue;

        const parsed =
            format === 'selecao'
                ? parseSelecaoLine(line)
                : parseAlternativaLine(line, currentSalesperson);

        parsed ? orders.push(enrichWithCoords(parsed)) : errors.push(line);
    }

    return { orders, format, reportDate, totalParsed: orders.length, errors };
}

// ── Export CSV ────────────────────────────────────────────────

export function exportCSV(orders: RouteOrder[]): string {
    const fd = (d: Date | null) =>
        d
            ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
            : '';

    const header = [
        'Pedido',
        'Cód. Cliente',
        'Cliente',
        'Vendedor / Digitado Por',
        'Cidade',
        'Rota',
        'Descrição Rota',
        'Entrega Original',
        'Nova Entrega',
        'Retira',
        'Comprimento (m)',
        'Sanduíche',
        'Peso (kg)',
        'Valor (R$)',
        'Status ERP',
        'Dias Atraso',
        'Status Atraso',
    ].join(';');

    const rows = orders.map((o) =>
        [
            o.order,
            o.customerCode,
            `"${o.customer.replace(/"/g, '""')}"`,
            o.salesperson,
            o.city,
            o.routeNumber ?? '',
            o.routeDescription ?? '',
            fd(o.originalDelivery),
            fd(o.newDelivery),
            o.pickup ? 'Sim' : 'Não',
            o.length.toFixed(3).replace('.', ','),
            o.sandwich ? 'Sim' : 'Não',
            o.weight.toFixed(3).replace('.', ','),
            o.valueBRL.toFixed(2).replace('.', ','),
            o.erpStatus,
            o.delayDays,
            o.delayStatus,
        ].join(';'),
    );

    return [header, ...rows].join('\n');
}

// ── Route suggestions ─────────────────────────────────────────

export function suggestRoutes(
    orders: RouteOrder[],
    fleet: VehicleType[],
    geoRadiusKm = 0,
): RouteSuggestion[] {
    const safeFleet =
        fleet && fleet.length > 0
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

    const vehiclePool = safeFleet
        .filter((v) => v.count > 0)
        .sort((a, b) => a.capacityKg - b.capacityKg);
    const biggestVehicle = [...safeFleet].sort(
        (a, b) => b.capacityKg - a.capacityKg,
    )[0];
    const pool = vehiclePool.length > 0 ? vehiclePool : [biggestVehicle];

    // Build groups
    const groupsMap = new Map<string, RouteOrder[]>();
    if (geoRadiusKm > 0) {
        const allCities = [...new Set(orders.map((o) => o.city))];
        const cityCluster = clusterCitiesByRadius(allCities, geoRadiusKm);
        for (const order of orders) {
            const key = cityCluster.get(order.city) ?? order.city;
            if (!groupsMap.has(key)) groupsMap.set(key, []);
            groupsMap.get(key)!.push(order);
        }
    } else {
        for (const order of orders) {
            const key =
                order.routeDescription ?? order.salesperson ?? 'SEM REGIÃO';
            if (!groupsMap.has(key)) groupsMap.set(key, []);
            groupsMap.get(key)!.push(order);
        }
    }

    return Array.from(groupsMap.entries())
        .map(([region, groupOrders]) => {
            const totalWeight = groupOrders.reduce((s, o) => s + o.weight, 0);
            const totalLength = groupOrders.reduce((s, o) => s + o.length, 0);
            const totalValue = groupOrders.reduce((s, o) => s + o.valueBRL, 0);
            const maxPieceLength = Math.max(
                ...groupOrders.map((o) => o.length),
                0,
            );
            const readyOrders = groupOrders.filter((o) => o.erpStatus === 'FN');
            const wipOrders = groupOrders.filter((o) => o.erpStatus !== 'FN');
            const weightReady = readyOrders.reduce((s, o) => s + o.weight, 0);
            const weightWIP = wipOrders.reduce((s, o) => s + o.weight, 0);
            const readyPct =
                totalWeight > 0 ? (weightReady / totalWeight) * 100 : 0;
            const cities = [...new Set(groupOrders.map((o) => o.city))];

            const suggestedVehicle =
                pool.find(
                    (v) =>
                        v.capacityKg >= totalWeight &&
                        v.maxLengthM >= maxPieceLength,
                ) ?? biggestVehicle;

            return {
                region,
                cities,
                orders: groupOrders,
                totalWeight,
                weightReady,
                weightWIP,
                maxPieceLength,
                totalLength,
                totalValue,
                delayedOrdersCount: groupOrders.filter((o) => o.delayDays > 0)
                    .length,
                worstDelays: [...groupOrders]
                    .sort((a, b) => b.delayDays - a.delayDays)
                    .slice(0, 3),
                exceedsWeightLimit: totalWeight > biggestVehicle.capacityKg,
                exceedsLengthLimit: maxPieceLength > biggestVehicle.maxLengthM,
                hasBlockedSandwich: wipOrders.some((o) => o.sandwich),
                suggestedVehicle,
                valuePerKg: totalWeight > 0 ? totalValue / totalWeight : 0,
                avgWeightPerDrop:
                    cities.length > 0 ? totalWeight / cities.length : 0,
                readyPct,
            };
        })
        .sort(
            (a, b) =>
                b.weightReady - a.weightReady ||
                b.delayedOrdersCount - a.delayedOrdersCount,
        );
}
