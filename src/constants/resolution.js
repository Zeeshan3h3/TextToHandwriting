export const RESOLUTIONS = [
    { id: 'very-low', label: 'Very Low', scale: 0.5, dpiNote: '~48 DPI' },
    { id: 'low', label: 'Low', scale: 1.0, dpiNote: '~96 DPI' },
    { id: 'normal', label: 'Normal', scale: 1.5, dpiNote: '~144 DPI' },
    { id: 'high', label: 'High', scale: 2.0, dpiNote: '~192 DPI' },
    { id: 'very-high', label: 'Very High', scale: 3.0, dpiNote: '~288 DPI' },
];

export const DEFAULT_RESOLUTION = 'normal';

export function getScale(resolutionId) {
    return RESOLUTIONS.find(r => r.id === resolutionId)?.scale ?? 1.5;
}
