import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
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

        map.flyTo(
            [userLocation.lat, userLocation.lng],
            14,
            {
                duration: 1.2,
            },
        );
    }, [userLocation, map]);

    return null;
}

export default function FloodMap({
    reports,
    userLocation,
    height = '500px',
    zoom = 13,
}: FloodMapProps) {
    const defaultCenter: [number, number] = [
        -6.200000,
        106.816666,
    ];

    const mapCenter: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : defaultCenter;

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'safe':
                return '#22c55e';

            case 'warning':
                return '#eab308';

            case 'alert':
                return '#f97316';

            case 'high_alert':
                return '#ef4444';

            case 'danger':
                return '#7f1d1d';

            default:
                return '#3b82f6';
        }
    };

    const severityLabel = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'safe':
                return 'Aman';

            case 'warning':
                return 'Waspada';

            case 'alert':
                return 'Siaga';

            case 'high_alert':
                return 'Siaga Tinggi';

            case 'danger':
                return 'Darurat';

            default:
                return 'Tidak Diketahui';
        }
    };

    return (
        <div
            className="relative w-full overflow-hidden rounded-xl border border-gray-200 shadow-lg"
            style={{ height }}
        >
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                className="h-full w-full"
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapAutoCenter
                    userLocation={userLocation}
                />

                {/* Flood Reports */}
                {reports.map((report) => {
                    const color = getSeverityColor(
                        report.severity,
                    );

                    return (
                        <React.Fragment key={report.id}>
                            <Circle
                                center={[
                                    report.latitude,
                                    report.longitude,
                                ]}
                                radius={200}
                                pathOptions={{
                                    color,
                                    fillColor: color,
                                    fillOpacity: 0.25,
                                    weight: 2,
                                }}
                            />

                            <Marker
                                position={[
                                    report.latitude,
                                    report.longitude,
                                ]}
                            >
                                <Popup>
                                    <div className="min-w-[220px] p-1">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <h3 className="font-semibold text-gray-900">
                                                Laporan Banjir
                                            </h3>

                                            <span
                                                className="rounded-full px-2 py-1 text-xs font-medium text-white"
                                                style={{
                                                    backgroundColor:
                                                        color,
                                                }}
                                            >
                                                {severityLabel(
                                                    report.severity,
                                                )}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-700">
                                                <strong>
                                                    Tinggi Air:
                                                </strong>{' '}
                                                {report.water_level} cm
                                            </p>

                                            <p className="text-sm text-gray-700">
                                                <strong>
                                                    Lokasi:
                                                </strong>{' '}
                                                {report.address}
                                            </p>

                                            {report.description && (
                                                <p className="mt-2 text-xs text-gray-500">
                                                    {report.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    );
                })}

                {/* User Location */}
                {userLocation && (
                    <>
                        <Circle
                            center={[
                                userLocation.lat,
                                userLocation.lng,
                            ]}
                            radius={50}
                            pathOptions={{
                                color: '#2563eb',
                                fillColor: '#3b82f6',
                                fillOpacity: 0.2,
                                weight: 2,
                            }}
                        />

                        <CircleMarker
                            center={[
                                userLocation.lat,
                                userLocation.lng,
                            ]}
                            radius={8}
                            pathOptions={{
                                color: '#ffffff',
                                fillColor: '#2563eb',
                                fillOpacity: 1,
                                weight: 3,
                            }}
                        >
                            <Popup>
                                <div className="text-sm font-medium">
                                    Lokasi Anda
                                </div>
                            </Popup>
                        </CircleMarker>
                    </>
                )}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-white/95 p-3 shadow-md backdrop-blur">
                <p className="mb-2 text-xs font-semibold text-gray-700">
                    Status Banjir
                </p>

                <div className="space-y-1.5 text-xs">
                    <LegendItem
                        color="#22c55e"
                        label="Aman"
                    />

                    <LegendItem
                        color="#eab308"
                        label="Waspada"
                    />

                    <LegendItem
                        color="#f97316"
                        label="Siaga"
                    />

                    <LegendItem
                        color="#ef4444"
                        label="Siaga Tinggi"
                    />

                    <LegendItem
                        color="#7f1d1d"
                        label="Darurat"
                    />
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
                className="h-3 w-3 rounded-full"
                style={{
                    backgroundColor: color,
                }}
            />

            <span className="text-gray-600">
                {label}
            </span>
        </div>
    );
}