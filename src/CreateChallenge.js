import React, {useRef, useEffect, useState} from 'react';
import env from 'react-dotenv';
import {debounce, generateRandomLatLngInRadius} from './util';
import {createViewer} from './viewer';
import {
    getBestRenderFeature,
    makeMapBoxMarker,
    MAPILLARY_VECTOR_SOURCE, OSM_MAP_STYLE,
    queryMapAround,
    setMarkerVisibility
} from './map';
import maplibregl from 'maplibre-gl';
import {getImageFor} from './api';
import CopyButton from './CopyButton';

function hasLocationSet(location) {
    return location.lng !== 0 || location.lat !== 0;
}

function encodeConfig(destinationLngLat, winRadius, startImage) {
    return btoa(JSON.stringify({
        v: 1,
        d1: destinationLngLat.lng,
        d2: destinationLngLat.lat,
        wr: winRadius,
        s: startImage,
    }));
}

function generateStartLocation(destinationLngLat, droppingRadius, successCallback, errorCallback) {
    (async () => {
        for (let i = 0; i < 10; ++i) { // 10 attempts
            const [lng, lat] = generateRandomLatLngInRadius(destinationLngLat, droppingRadius);
            const img = await getImageFor(lng, lat, Math.min(droppingRadius / 5000, 0.75));
            if (img)
                return img;
        }
        throw new Error();
    })().then(successCallback).catch(errorCallback);
}

const generateStartLocationDebounced = debounce(generateStartLocation, 100);

export default function CreateChallenge() {
    const viewerContainer = useRef();
    const mapContainer = useRef();
    const [destinationLngLat, setDestinationLngLat] = useState({lng: 0, lat: 0});
    const [marker, setMarker] = useState(null);
    const [hack, setHack] = useState(0);
    const [droppingRadius, setDroppingRadius] = useState(500);
    const [winRadius, setWinRadius] = useState(20);
    const [configString, setConfigString] = useState(null);
    const [urlGenerationStatus, setUrlGenerationStatus] = useState(0);

    const resetMarkerToPreviousPosition = () => {
        // HACK, but I can't be bothered
        setHack(h => h + 1);
    };

    useEffect(() => {
        if (hasLocationSet(destinationLngLat)) {
            setUrlGenerationStatus(0);
            generateStartLocationDebounced(destinationLngLat, droppingRadius, startImage => {
                setConfigString(encodeConfig(destinationLngLat, winRadius, startImage));
                setUrlGenerationStatus(1);
            }, () => setUrlGenerationStatus(2));
        }
    }, [destinationLngLat, droppingRadius, winRadius]);

    useEffect(() => {
        marker?.setLngLat(destinationLngLat);
    }, [marker, destinationLngLat, hack]);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainer.current,
            zoom: 3,
            style: OSM_MAP_STYLE,
            center: [0, 0],
            maxzoom: 16
        });

        const setLocationCallback = latLng => {
            if (latLng) {
                setDestinationLngLat(latLng);
                setMarkerVisibility(marker, true);
            } else {
                resetMarkerToPreviousPosition(marker);
            }
        };

        const viewer = createViewer(viewerContainer, setLocationCallback);

        const marker = makeMapBoxMarker({color: 'red', draggable: true, radius: 5});
        setMarker(marker);
        marker.setLngLat([0, 0]);
        setMarkerVisibility(marker, false);

        const setViewerPosition = point => {
            const features = queryMapAround(map, point);
            const bestFeature = getBestRenderFeature(features);
            if (bestFeature) {
                viewer.moveTo(bestFeature.properties.id).then(() => {
                    setLocationCallback(map.unproject(point));
                }).catch(console.error);
            } else {
                setLocationCallback(null);
            }
        };

        marker.on('dragend', _e => {
            setViewerPosition(map.project(marker.getLngLat()));
        });

        map.on('click', e => {
            setViewerPosition(e.point);
        });

        map.on('load', function () {
            map.addSource('mapillary', MAPILLARY_VECTOR_SOURCE);
            map.addLayer(
                {
                    'id': 'mapillary',
                    'type': 'circle',
                    'source': 'mapillary',
                    'source-layer': 'image',//'sequence',
                    //filter: ["==", "is_pano", !0],
                    'paint': {
                        'circle-opacity': 0.2,
                        'circle-color': 'rgb(53, 175, 109)',
                        'circle-radius': 3
                    }
                }
            );
            marker.addTo(map);
        });

        viewer.on('position', async (_e) => {
            const lngLat = await viewer.getPosition();
            setDestinationLngLat(lngLat);
        });

        return () => {
            viewer.remove();
            map.remove();
        };
    }, [viewerContainer, mapContainer]);

    return (
        <div className="create-container container">
            <div>
                <h1 className="title">Create challenge</h1>
                <h2>1. Select a destination location</h2>
            </div>
            <div className="sideBySide middle">
                <div className="map" ref={mapContainer}/>
                <div className="viewer" ref={viewerContainer}>
                    <div className="popup preview">Preview</div>
                    {!hasLocationSet(destinationLngLat) && (
                        <div className="viewer-notification">Choose a destination location on the map.</div>
                    )}
                </div>
            </div>
            <div>
                <h2>2. Choose parameters</h2>
                <label htmlFor="dropping-radius">Dropping radius in meters</label>
                <input style={{width: '80px'}} id="dropping-radius" type="number" onChange={e => setDroppingRadius(e.currentTarget.valueAsNumber)} min={50} value={droppingRadius} max={20_000} step={10}/>
                <br/>
                <label htmlFor="win-radius">Win radius in meters</label>
                <input style={{width: '80px'}} id="win-radius" type="number" onChange={e => setWinRadius(e.currentTarget.valueAsNumber)} min={10} value={winRadius} max={100} step={10}/>
                <h2>3. Copy URL & share with friends!</h2>
                <div style={{height: '40px'}}>
                    {
                        configString ? (
                            urlGenerationStatus === 0 ? (
                                <span>Searching for a start location and preparing challenge URL...</span>
                            ) : urlGenerationStatus === 2 ? (
                                <span>Could not find a suitable start location, please modify your destination or parameters and try again</span>
                            ) : (
                                <>
                                    <input id="location-bar" value={`${window.location.protocol}//${window.location.host}${env.REACT_APP_BASE_NAME}#/drop/${configString}`} readOnly/> <CopyButton sourceId="location-bar" />
                                </>
                            )
                        ) : (
                            <span>Choose a location and parameters first and a challenge URL will be generated!</span>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
