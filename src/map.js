import maplibregl from 'maplibre-gl';

// https://github.com/mapillary/mapillary-js/blob/6b9bc08769fcea6cf9d5125c7daab6c9daf711cc/doc/src/js/examples/component-marker-map.js#L43
export function makeMapBoxMarker(options) {
    const size = `${2 * options.radius}px`;
    const circle = document.createElement('div');
    circle.style.border = `3px solid ${options.color}`;
    circle.style.backgroundColor = 'white';
    circle.style.borderRadius = '50%';
    circle.style.width = `${size}`;
    circle.style.height = `${size}`;
    return new maplibregl.Marker({
        draggable: options.draggable,
        element: circle,
        rotationAlignment: 'map',
    });
}

const queryOptions = {
    layers: ['mapillary'],
};

export function queryRenderedFeatures(map, bounds) {
    return map.queryRenderedFeatures(bounds, queryOptions);
}

export function queryMapAround(map, point) {
    // Around the point with a small margin
    const {x, y} = point;
    const MARGIN = 10;
    const bounds = [
        [x - MARGIN, y - MARGIN],
        [x + MARGIN, y + MARGIN],
    ];
    return queryRenderedFeatures(map, bounds);
}

export function setMarkerVisibility(marker, visibility) {
    marker.getElement().style.visibility = visibility ? 'visible' : 'hidden';
}

export function getBestRenderFeature(features) {
    if (features.length > 0) {
        let first = features[0];
        if (first.properties.is_pano)
            return first;
        for (let i = 1; i < features.length; ++i) {
            //console.log(features[i].properties);
            const feature = features[i];
            if (feature.properties.is_pano) {
                return feature;
            }
        }
        return first;
    }
    return null;
}


export const MAPILLARY_VECTOR_SOURCE = Object.freeze({
    type: 'vector',
    tiles: [
        'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=' + process.env.REACT_APP_MAPILLARY_ACCESS_TOKEN
    ],
    minzoom: 6,
    maxzoom: 14
});

export const OSM_MAP_STYLE = Object.freeze({
    "version": 8,
    "sources": {
        "osm": {
            "type": "raster",
            "tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            "tileSize": 256,
            "attribution": "&copy; OpenStreetMap Contributors",
            "maxzoom": 19
        }
    },
    "layers": [
        {
            "id": "osm",
            "type": "raster",
            "source": "osm" // This must match the source key above
        }
    ]
});
