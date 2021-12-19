import {CameraControls, CircleMarker, RenderMode, Viewer} from 'mapillary-js';
import {getImageFor} from './api';

export function createViewer(viewerContainer, setLocationCallback = undefined) {
    const viewer = new Viewer({
        cameraControls: CameraControls.Street,
        container: viewerContainer.current,
        renderMode: RenderMode.Fill,
        component: {
            slider: false,
            spatial: false,
            cover: false,
            sequence: false,
            marker: true,
        },
        accessToken: process.env.REACT_APP_MAPILLARY_ACCESS_TOKEN,
    });

    let hoverMarker = null;
    const markerComponent = viewer.getComponent('marker');
    viewer.on('mousemove', e => {
        if (hoverMarker)
            markerComponent.remove([hoverMarker]);
        if (e.lngLat) {
            /*if (!map || queryRenderedFeatures(map, map.project(e.lngLat)).length > 0)*/ {
                hoverMarker = new CircleMarker('hover', e.lngLat);
                markerComponent.add([hoverMarker]);
            }
        }
    });

    viewer.on('click', async e => {
        const image = await getImageFor(e.lngLat.lng, e.lngLat.lat);
        if (image)
            await viewer.moveTo(image);
    });

    if (setLocationCallback) {
        viewer.on('position', async (_e) => {
            const lngLat = await viewer.getPosition();
            setLocationCallback([lngLat.lng, lngLat.lat]);
        });
    }

    return viewer;
}