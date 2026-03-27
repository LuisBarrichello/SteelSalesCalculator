import type { RouteOrder } from '../utils/parseErpReport';

export interface CityGroup {
    city: string;
    orders: RouteOrder[];
    totalWeight: number;
    maxLength: number;
    worstDelay: number;
    allReady: boolean;
    distanceKm: number | null;
}

export interface PlannedRoute {
    id: number;
    orders: RouteOrder[];
    totalWeight: number;
    totalVolumetricWeight: number;
    stops: number;
    cities: string[];
    createdAt: string;
}

export interface CustomerRestriction {
    code: string;
    name: string;
    blockCarreta: boolean;
    timeWindow: string;
    needsMunck: boolean;
    notes: string;
}

export type RestrictionsMap = Record<string, CustomerRestriction>;

export type ViewMode = 'ready' | 'wip' | 'all' | 'delayed' | 'routes';