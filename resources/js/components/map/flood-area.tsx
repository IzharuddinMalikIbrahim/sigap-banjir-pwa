import { Polygon } from 'react-leaflet';

import type { FloodArea } from '@/types/flood';

interface FloodAreaProps {
    area: FloodArea;
}

export default function FloodAreaLayer({
    area,
}: FloodAreaProps) {
    if (area.geometry.type !== 'Polygon') {
        return null;
    }

    const coordinates = area.geometry.coordinates[0].map(
        ([lng, lat]) => [lat, lng] as [number, number],
    );

    const getSeverityColor = (
        severity: string,
    ) => {
        switch (severity) {
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

    const color = getSeverityColor(
        area.severity,
    );

    return (
        <Polygon
            positions={coordinates}
            pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.3,
                weight: 2,
            }}
        />
    );
}
