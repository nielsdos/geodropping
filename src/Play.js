import React, {useState, useEffect, useRef} from 'react';
import Error from './Error';
import {createViewer} from './viewer';
import {distanceInKm} from './util';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const chartOptions = {
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                color: '#ddd',
            },
        },
        x: {
            ticks: {
                color: '#ddd',
            },
        }
    },
    plugins: {
        legend: {
            labels: {
                color: 'white',
            },
        },
    }
}

function Play(props) {
    const {destinationLng, destinationLat, startImage, winRadius, revealDistance} = props;
    const [totalTime, setTotalTime] = useState('00:00');
    const viewerContainer = useRef();
    const [graphLabels] = useState([]);
    const [graphYAxis] = useState([]);
    const [didWin, setDidWin] = useState(false);
    const [revealedDistance, setRevealedDistance] = useState(null);

    useEffect(() => {
        let interval = -1;

        const viewer = createViewer(viewerContainer);
        viewer.moveTo(startImage).then(() => {
            const startTime = performance.now();
            interval = setInterval(() => {
                // Time management.
                const timeDiff = Math.floor((performance.now() - startTime) / 1000);
                const seconds = timeDiff % 60;
                const minutes = Math.floor(timeDiff / 60);
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                setTotalTime(timeString);

                // Track for the fancy graph.
                viewer.getPosition().then(currentLatLng => {
                    const distance = (distanceInKm(destinationLat, destinationLng, currentLatLng.lat, currentLatLng.lng) * 1000) | 0;
                    graphLabels.push(timeString);
                    graphYAxis.push(distance);
                    if (revealDistance) setRevealedDistance(distance);
                    if (distance < winRadius) {
                        clearInterval(interval);
                        setDidWin(true);
                    }
                });
            }, 500);
        });

        return () => {
            clearInterval(interval);
            viewer.remove();
        };
    }, [startImage, graphLabels, graphYAxis, destinationLat, destinationLng, winRadius]);

    return (
        <>
            <div className="popup" id="timer">{totalTime}</div>
            {revealedDistance && (<div className="popup" id="distance">{revealedDistance}m</div>)}
            <div className="viewer fill" ref={viewerContainer}/>
            {didWin && (
                <div className="popup" id="win">
                    <span className="title inline-block">
                        Won in {totalTime}!
                    </span>
                    <Line data={{
                        labels: graphLabels,
                        datasets: [
                            {
                                label: 'Distance from destination in meters',
                                data: graphYAxis,
                                lineTension: 0,
                                backgroundColor: 'rgb(255, 99, 132)',
                                borderColor: 'rgba(255, 99, 132, 0.2)',
                            },
                        ],
                    }}
                          options={chartOptions}
                    />
                </div>
            )}
        </>
    );
}

export default function PlayDecodeWrapper(props) {
    let config;
    try {
        const {configString} = props.match.params;
        config = JSON.parse(atob(configString));
        const {d1, d2, wr, s, r} = config;
        if (typeof d1 !== 'number' || typeof d2 !== 'number' || typeof wr !== 'number' || typeof s !== 'number' || typeof r !== 'boolean')
            throw new Error('Invalid types');
    } catch (_e) {
        return <Error>Invalid challenge.</Error>;
    }
    if (config.v !== 1) {
        return <Error>Invalid challenge version.</Error>;
    } else {
        return <Play
            config={config}
            destinationLng={config.d1}
            destinationLat={config.d2}
            winRadius={config.wr}
            startImage={config.s}
            revealDistance={config.r}
        />;
    }
}
