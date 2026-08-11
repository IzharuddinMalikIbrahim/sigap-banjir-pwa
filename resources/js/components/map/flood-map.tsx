import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { AlertTriangle, Droplets, Navigation } from 'lucide-react';
import React from 'react';
import {
    Circle,
    CircleMarker,
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
} from 'react-leaflet';

import type { FloodReport } from '@/types/flood';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
});

interface UserLocation {
    lat: number;
    lng: number;
}

interface FloodMapProps {
    reports: FloodReport[];
    userLocation?: UserLocation;
    height?: string;
    zoom?: number;
}

function MapAutoCenter({
    userLocation,
}: {
    userLocation?: UserLocation;
}) {
    const map = useMap();

    React.useEffect(() => {
        if (!userLocation) {
            return;
        }

        map.flyTo([userLocation.lat, userLocation.lng], 14, {
            duration: 1.2,
        });
    }, [userLocation, map]);

    return null;
}

export default function FloodMap({
    reports,
    userLocation,
    height = '500px',
    zoom = 13,
}: FloodMapProps) {
    const defaultCenter: [number, number] = [-6.200000, 106.816666];

    const mapCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : defaultCenter;

    const getSeverityConfig = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'safe':
                return {
                    color: '#10b981',
                    label: 'Aman',
                    badge: 'bg-emerald-500 text-white',
                };
            case 'warning':
                return {
                    color: '#eab308',
                    label: 'Waspada',
                    badge: 'bg-amber-500 text-white',
                };
            case 'alert':
                return {
                    color: '#f97316',
                    label: 'Siaga',
                    badge: 'bg-orange-500 text-white',
                };
            case 'high_alert':
            case 'high alert':
                return {
                    color: '#ef4444',
                    label: 'Siaga Tinggi',
                    badge: 'bg-rose-500 text-white',
                };
            case 'danger':
                return {
                    color: '#991b1b',
                    label: 'Darurat',
                    badge: 'bg-red-800 text-white animate-pulse',
                };
            default:
                return {
                    color: '#0f766e',
                    label: 'Terpantau',
                    badge: 'bg-teal-700 text-white',
                };
        }
    };

    return (
        /* 
          Container luar dibuat stacking context mandiri (z-0 isolate) 
          agar layer Leaflet (z-400..1000) tidak menembus navbar/modal/form luar.
        */
        <div
            className="relative z-0 isolate w-full overflow-hidden rounded-2xl border border-slate-200 shadow-sm"
            style={{ height }}
        >
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                className="h-full w-full z-0"
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapAutoCenter userLocation={userLocation} />

                {/* Flood Reports */}
                {reports.map((report) => {
                    const config = getSeverityConfig(report.severity);

                    return (
                        <React.Fragment key={report.id}>
                            <Circle
                                center={[Number(report.latitude), Number(report.longitude)]}
                                radius={220}
                                pathOptions={{
                                    color: config.color,
                                    fillColor: config.color,
                                    fillOpacity: 0.28,
                                    weight: 2,
                                }}
                            />

                            <Marker position={[Number(report.latitude), Number(report.longitude)]}>
                                <Popup className="sigap-popup">
                                    <div className="min-w-[210px] p-0.5 font-sans">
                                        <div className="mb-2 flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                                            <div className="flex items-center gap-1 text-slate-800">
                                                <Droplets className="h-4 w-4 text-teal-700" />
                                                <span className="text-xs font-bold uppercase tracking-wider">
                                                    Laporan Genangan
                                                </span>
                                            </div>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${config.badge}`}
                                            >
                                                {config.label}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 text-xs text-slate-600">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-slate-400">Ketinggian:</span>
                                                <span className="text-sm font-black text-slate-900">
                                                    {report.water_level} cm
                                                </span>
                                            </div>

                                            <div>
                                                <span className="text-slate-400">Lokasi:</span>
                                                <p className="mt-0.5 font-semibold leading-tight text-slate-800">
                                                    {report.address}
                                                </p>
                                            </div>

                                            {report.description && (
                                                <div className="rounded-lg bg-slate-50 p-2 text-[11px] leading-relaxed text-slate-600">
                                                    {report.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}

                {/* User Location Marker */}
                {userLocation && (
                    <>
                        <Circle
                            center={[userLocation.lat, userLocation.lng]}
                            radius={60}
                            pathOptions={{
                                color: '#0f766e',
                                fillColor: '#14b8a6',
                                fillOpacity: 0.2,
                                weight: 2,
                            }}
                        />

                        <CircleMarker
                            center={[userLocation.lat, userLocation.lng]}
                            radius={8}
                            pathOptions={{
                                color: '#ffffff',
                                fillColor: '#0f766e',
                                fillOpacity: 1,
                                weight: 3,
                            }}
                        >
                            <Popup>
                                <div className="flex items-center gap-1.5 p-1 text-xs font-bold text-teal-900">
                                    <Navigation className="h-3.5 w-3.5 text-teal-700" />
                                    <span>Posisi Anda Saat Ini</span>
                                </div>
                            </Popup>
                        </CircleMarker>
                    </>
                )}
            </MapContainer>

            {/* Legend / Petunjuk Status (diberi z-[1001] agar selalu di atas pane leaflet dan kontrol zoom) */}
            <div className="pointer-events-auto absolute bottom-4 left-4 z-[1001] rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
                <div className="mb-2 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-teal-800" />
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Status Ketinggian Air
                    </p>
                </div>

                <div className="space-y-1.5 text-xs">
                    <LegendItem color="#10b981" label="Aman (<10 cm)" />
                    <LegendItem color="#eab308" label="Waspada (10-30 cm)" />
                    <LegendItem color="#f97316" label="Siaga (30-50 cm)" />
                    <LegendItem color="#ef4444" label="Siaga Tinggi (50-100 cm)" />
                    <LegendItem color="#991b1b" label="Darurat (>100 cm)" />
                </div>
            </div>
        </div>
    );
}

function LegendItem({
    color,
    label,
}: {
    color: string;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span
                className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
                style={{
                    backgroundColor: color,
                }}
            />
            <span className="text-[11px] font-medium text-slate-600">{label}</span>
        </div>
    );
}