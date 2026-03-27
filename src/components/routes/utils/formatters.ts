import type { RouteOrder } from '../utils/parseErpReport';

export const SANDWICH_VOLUMETRIC_FACTOR = 2.5;
export const MAX_RECOMMENDED_STOPS = 8;

export function cleanCode(code: string | undefined): string {
    if (!code) return '';
    return code.trim().replace(/^0+/, '');
}

export const DELAY_ROW_BG: Record<RouteOrder['delayStatus'], string> = {
    ok: '',
    leve: 'bg-yellow-50',
    moderado: 'bg-orange-50',
    critico: 'bg-red-50',
};

export const DELAY_BADGE: Record<RouteOrder['delayStatus'], string> = {
    ok: '',
    leve: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    moderado: 'bg-orange-100 text-orange-800 border-orange-300',
    critico: 'bg-red-100 text-red-800 border-red-300',
};

export const ERP_STATUS_COLORS: Record<string, string> = {
    FN: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    OP: 'bg-blue-100 text-blue-700 border-blue-200',
    AP: 'bg-orange-100 text-orange-700 border-orange-200',
    AC: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    AB: 'bg-steel-100 text-steel-600 border-steel-200',
};
