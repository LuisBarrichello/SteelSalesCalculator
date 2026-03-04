export type ProfileType = 'udc' | 'enrijecido' | 'cartola' | 'l';

export interface BendingFormData {
    profileType: ProfileType;
    thickness: number;
    length: number; // metros
    quantity: number;
    B: number; // base (mm)
    A: number; // altura dos lados (mm) — UDC / Enrijecido / Cartola
    a: number; // flange pequeno (mm) — Enrijecido / Cartola
    L1: number; // lado 1 (mm) — L
    L2: number; // lado 2 (mm) — L
}

export interface BendingResult {
    status: boolean;
    profileType: ProfileType;
    thickness: number;
    length: number;
    quantity: number;
    B?: number;
    A?: number;
    a?: number;
    L1?: number;
    L2?: number;
    unitWeight: number;
    totalWeight: number;
    developedWidth: number;
    discount: number;
    weightPerM2: number;
}

export const THICKNESSES = [
    1.5, 2.0, 2.25, 2.65, 3.0, 3.35, 3.75, 4.25, 4.75, 6.3, 8.0, 9.5,
];

export const PROFILE_LABELS: Record<ProfileType, string> = {
    udc: 'UDC (U Dobrado)',
    enrijecido: 'Perfil Enrijecido',
    cartola: 'Cartola',
    l: 'L (Cantoneira)',
};

// Desconto = N × espessura  (de acordo com o manual seção 3.9.1)
const DISCOUNT_FACTOR: Record<ProfileType, number> = {
    udc: 4,
    enrijecido: 8,
    cartola: 6,
    l: 2,
};

export function handleCalculation(form: BendingFormData): BendingResult {
    const { profileType, thickness, length, quantity, B, A, a, L1, L2 } = form;

    // Peso/m² de chapa de aço = espessura(mm) × 7,85 kg/m²
    const weightPerM2 = Math.ceil(thickness * 7.85);
    const discount = DISCOUNT_FACTOR[profileType] * thickness;

    let grossWidth = 0;
    switch (profileType) {
        case 'udc':
            grossWidth = B + A + A;
            break;
        case 'enrijecido':
            grossWidth = B + A + A + a + a;
            break;
        case 'cartola':
            grossWidth = B + A + A + a + a;
            break;
        case 'l':
            grossWidth = L1 + L2;
            break;
    }

    const developedWidth = grossWidth - discount;
    // Fórmula manual: (largura_mm × PESO/m² × length_m) / 1000 = kg/barra
    const unitWeight = (developedWidth * weightPerM2 * length) / 1000;
    const totalWeight = unitWeight * quantity;

    return {
        status: true,
        profileType,
        thickness,
        length,
        quantity,
        B: profileType !== 'l' ? B : undefined,
        A: profileType !== 'l' ? A : undefined,
        a:
            profileType === 'enrijecido' || profileType === 'cartola'
                ? a
                : undefined,
        L1: profileType === 'l' ? L1 : undefined,
        L2: profileType === 'l' ? L2 : undefined,
        unitWeight: parseFloat(unitWeight.toFixed(3)),
        totalWeight: parseFloat(totalWeight.toFixed(2)),
        developedWidth: parseFloat(developedWidth.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        weightPerM2: parseFloat(weightPerM2.toFixed(3)),
    };
}
