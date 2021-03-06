import {distanceInKm, tile} from './util';
import {VectorTile} from '@mapbox/vector-tile';
import Pbf from 'pbf';

export async function getImageFor(lng, lat, panoThreshold=0.05) {
    const [x, y, z] = tile(lng, lat, 14);
    const res = await fetch(`https://tiles.mapillary.com/maps/vtp/mly1_public/2/${z}/${x}/${y}?access_token=${process.env.REACT_APP_MAPILLARY_ACCESS_TOKEN}`);
    const buffer = await res.arrayBuffer();
    const vt = new VectorTile(new Pbf(buffer));
    const layer = vt.layers.image;
    if (!layer) return null;

    // TODO: improve performance of this loop
    //console.time('find best');
    let bestDistanceNormal = 9999999;
    let bestFeatureNormal = null;
    let bestDistancePano = 9999999;
    let bestFeaturePano = null;
    for (let i = 0, l = layer._features.length; i < l; ++i) {
        const feature = layer.feature(i);
        const [lon2, lat2] = feature.toGeoJSON(x, y, z).geometry.coordinates
        const d = distanceInKm(lat, lng, lat2, lon2);

        if (feature.properties.is_pano) {
            if (d < bestDistancePano) {
                bestDistancePano = d;
                bestFeaturePano = feature;
            }
        } else {
            if (d < bestDistanceNormal) {
                bestDistanceNormal = d;
                bestFeatureNormal = feature;
            }
        }
    }
    //console.timeEnd('find best');
    let bestFeature;
    if (bestFeatureNormal === null)
        bestFeature = bestFeaturePano;
    else if (bestFeaturePano === null)
        bestFeature = bestFeatureNormal;
    else
        bestFeature = Math.abs(bestDistanceNormal - bestDistancePano) < panoThreshold ? bestFeaturePano : bestFeatureNormal;
    if (!bestFeature)
        return null;
    return bestFeature.properties.id;
}