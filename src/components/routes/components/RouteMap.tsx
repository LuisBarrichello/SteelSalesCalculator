import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, Truck, AlertTriangle } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import type { CityGroup, PlannedRoute } from '../types';
import { CITY_COORDS } from '../utils/geo';

interface Props {
    unassignedCities: CityGroup[];
    plannedRoutes: PlannedRoute[];
}

// Paleta de cores para destacar rotas diferentes
const ROUTE_COLORS = [
    'bg-emerald-500',
    'bg-indigo-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-fuchsia-500',
];

// Gerador de ícones HTML (Para podermos usar o Tailwind no Leaflet)
const createIcon = (
    colorClass: string,
    iconType: 'truck' | 'package',
    label: string,
) => {
    const IconComponent =
        iconType === 'truck' ? (
            <Truck className="w-3 h-3 text-white" />
        ) : (
            <Package className="w-3 h-3 text-white" />
        );

    const html = renderToString(
        <div
            className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-md ${colorClass}`}>
            {IconComponent}
            {label && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                    {label}
                </span>
            )}
        </div>,
    );

    return L.divIcon({
        html,
        className: 'custom-leaflet-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
    });
};

export function RouteMap({ unassignedCities, plannedRoutes }: Props) {
    // Coordenadas base (Laranjal Paulista / Centro de SP)
    const centerLatLng: [number, number] = [-22.84, -47.83];

    return (
        <div className="bg-white rounded-2xl border-2 border-steel-200 overflow-hidden shadow-sm h-[600px] relative z-0">
            <MapContainer
                center={centerLatLng}
                zoom={8}
                className="w-full h-full">
                {/* Mapa base do OpenStreetMap (Gratuito) */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                />

                {/* 1. Renderiza os Pedidos Soltos (Não Planejados) */}
                {unassignedCities.map((group) => {
                    const coords = CITY_COORDS.get(
                        group.city.toUpperCase().trim(),
                    );
                    if (!coords) return null;

                    const hasDelayed = group.worstDelay > 0;
                    const icon = createIcon(
                        'bg-steel-500',
                        'package',
                        hasDelayed ? '!' : '',
                    );

                    return (
                        <Marker
                            key={`unassigned-${group.city}`}
                            position={[coords.lat, coords.lng]}
                            icon={icon}>
                            <Tooltip
                                direction="top"
                                offset={[0, -10]}
                                opacity={1}
                                className="font-bold">
                                {group.city}
                            </Tooltip>
                            <Popup className="rounded-xl">
                                <div className="p-1">
                                    <h3 className="font-bold text-steel-800 text-sm mb-1">
                                        {group.city}
                                    </h3>
                                    <p className="text-xs text-steel-600 font-medium">
                                        {group.orders.length} pedidos aguardando
                                    </p>
                                    <p className="text-xs text-steel-500">
                                        {group.totalWeight.toLocaleString(
                                            'pt-BR',
                                        )}{' '}
                                        kg
                                    </p>
                                    {hasDelayed && (
                                        <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />{' '}
                                            Contém atrasos!
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* 2. Renderiza as Rotas já Planejadas */}
                {plannedRoutes.map((route, idx) => {
                    const colorClass = ROUTE_COLORS[idx % ROUTE_COLORS.length];
                    const icon = createIcon(colorClass, 'truck', `${idx + 1}`);

                    return route.cities.map((city) => {
                        const coords = CITY_COORDS.get(
                            city.toUpperCase().trim(),
                        );
                        if (!coords) return null;

                        // Adicionamos um micro-offset nas rotas pra os marcadores não ficarem 100% sobrepostos se cruzarem cidades
                        const offsetLat =
                            coords.lat + (Math.random() * 0.01 - 0.005);
                        const offsetLng =
                            coords.lng + (Math.random() * 0.01 - 0.005);

                        return (
                            <Marker
                                key={`route-${route.id}-${city}`}
                                position={[offsetLat, offsetLng]}
                                icon={icon}
                                zIndexOffset={100}>
                                <Tooltip
                                    direction="top"
                                    offset={[0, -10]}
                                    opacity={1}
                                    className="font-bold text-emerald-800">
                                    Rota {idx + 1} - {city}
                                </Tooltip>
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold text-steel-800 text-sm mb-1">
                                            Rota {idx + 1}
                                        </h3>
                                        <p className="text-xs text-steel-600">
                                            Parada: <strong>{city}</strong>
                                        </p>
                                        <p className="text-xs text-steel-500 mt-1">
                                            Carga total:{' '}
                                            {route.totalWeight.toLocaleString(
                                                'pt-BR',
                                            )}{' '}
                                            kg
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    });
                })}
            </MapContainer>

            {/* Legenda Flutuante */}
            <div
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-steel-200 shadow-lg"
                style={{ zIndex: 400 }}>
                <h4 className="text-xs font-bold text-steel-800 mb-2 uppercase tracking-wider">
                    Legenda do Mapa
                </h4>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-steel-500 flex items-center justify-center border border-white">
                            <Package className="w-2 h-2 text-white" />
                        </div>
                        <span className="text-xs font-medium text-steel-600">
                            Aguardando Carga
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border border-white">
                            <Truck className="w-2 h-2 text-white" />
                        </div>
                        <span className="text-xs font-medium text-steel-600">
                            Rotas Planejadas
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
