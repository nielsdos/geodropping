const DEG_TO_RAD = Math.PI / 180;

// https://gis.stackexchange.com/questions/25877/generating-random-locations-nearby
// but Julian's answer because the accepted is inaccurate.
export function generateRandomLatLngInRadius(center, radiusInMeters) {
    const EARTH_RADIUS = 6378137;
    const THREE_PI = Math.PI*3;
    const TWO_PI = Math.PI*2;
    const DEG_TO_RAD = Math.PI / 180;

    const centerLat = center.lat * DEG_TO_RAD;
    const centerLng = center.lng * DEG_TO_RAD;

    const sinLat = Math.sin(centerLat);
    const cosLat = Math.cos(centerLat);
    const bearing = Math.random() * TWO_PI;
    const theta = radiusInMeters / EARTH_RADIUS;
    const sinBearing = Math.sin(bearing);
    const cosBearing = Math.cos(bearing);
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    const lat = Math.asin(sinLat * cosTheta + cosLat * sinTheta * cosBearing);
    let lng = centerLng + Math.atan2( sinBearing*sinTheta*cosLat, cosTheta-sinLat*Math.sin(lat));
    lng = ((lng + THREE_PI) % TWO_PI) - Math.PI;

    return [lng / DEG_TO_RAD, lat / DEG_TO_RAD];
}

// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
export function distanceInKm(lat1, lon1, lat2, lon2) {
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * DEG_TO_RAD)/2 +
        c(lat1 * DEG_TO_RAD) * c(lat2 * DEG_TO_RAD) *
        (1 - c((lon2 - lon1) * DEG_TO_RAD))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

// https://github.com/mapbox/mercantile/blob/d62250eb4ca53c5b9c83cb10c30c121c3da25dee/mercantile/__init__.py
// Mercantile license: BSD-3 https://github.com/mapbox/mercantile/blob/main/LICENSE.txt
export function tile(lng, lat, zoom) {
    const x = lng / 360 + 0.5;
    const sinlat = Math.sin(lat * DEG_TO_RAD);
    const y = 0.5 - 0.25 * Math.log((1 + sinlat) / (1 - sinlat)) / Math.PI;
    const Z2 = 2 ** zoom;
    let xtile;
    if (x <= 0) {
        xtile = 0;
    } else if (x >= 1) {
        xtile = (Z2|0) - 1;
    } else {
        xtile = ((x + 1e-14) * Z2) | 0;
    }
    let ytile;
    if (y <= 0) {
        ytile = 0;
    } else if (y >= 1) {
        ytile = (Z2|0) - 1;
    } else {
        ytile = ((y + 1e-14) * Z2) | 0;
    }
    return [xtile, ytile, zoom];
}

export function copyToClipboard(element) {
    element.select();
    document.execCommand('copy');
}

export function debounce(fn, delay) {
    let timer = -1;
    return function(...args) {
        const realDelay = timer === -1 ? 10 : delay;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = -1;
        }, realDelay);
    };
}
