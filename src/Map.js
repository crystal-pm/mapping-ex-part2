import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import points from './points.json';
import routes from './routes.json';
import sources from './sources_part2.json';
// import sources from './ride_history1.json';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidG9iaTAxMTgiLCJhIjoiY2x0MmJ1YzZoMWp2YjJpbzFjamRzazF1MiJ9.Tb_QQbdTH_9KxeDaZ33F1w';

const MarkerQZ1 = ({ children }) => {
    return (
        <div className="marker-qz1">
            {children}
        </div>
    );
};

const MarkerPhone = ({ children }) => {
    return (
        <div className="marker-phone">
            {children}
        </div>
    );
};

const MarkerFact = ({ children }) => {
    return (
        <div className="marker-fact">
            {children}
        </div>
    );
};

const swapElements = (array) => {
    for (let i=0; i<array.length; i++) {
        let temp = array[i][0];
        array[i][0] = array[i][1];
        array[i][1] = temp;
    }
};

const Map = () => {
    const mapContainerRef = useRef(null);

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [136.897505, 35.173245],
            zoom: 16,
        });

        let qz1Source;
        let phoneSource;
        let factSource;
        if (sources.qz1.lat_lan_type === 1) {
            let array = [];
            for (let i=0; i<sources.qz1.source.length; i++) {
                array[i] = [...sources.qz1.source[i]].reverse();
            }
            qz1Source = array;
        } else {
            qz1Source = sources.qz1.source;
        }
        if (sources.phone.lat_lan_type === 1) {
            let array = [];
            for (let i=0; i<sources.phone.source.length; i++) {
                array[i] = [...sources.phone.source[i]].reverse();
            }
            phoneSource = array;
        } else {
            phoneSource = sources.phone.source;
        }
        if (sources.fact.lat_lan_type === 1) {
            let array = [];
            for (let i=0; i<sources.fact.source.length; i++) {
                array[i] = [...sources.fact.source[i]].reverse();
            }
            factSource = array;
        } else {
            factSource = sources.fact.source;
        }


        points.qz1.coordinates = qz1Source;
        points.phone.coordinates = phoneSource;
        points.fact.coordinates = factSource;

        routes.qz1.source.data.geometry.coordinates = qz1Source;
        routes.phone.source.data.geometry.coordinates = phoneSource;
        routes.fact.source.data.geometry.coordinates = factSource;


        points.qz1.coordinates.forEach((point) => {
            const ref = React.createRef();
            ref.current = document.createElement('div');
            createRoot(ref.current).render(
                <MarkerQZ1 feature={point} />
            );
            new mapboxgl.Marker(ref.current)
                .setLngLat(point)
                .addTo(map);
        });

        points.phone.coordinates.forEach((point) => {
            const ref = React.createRef();
            ref.current = document.createElement('div');
            createRoot(ref.current).render(
                <MarkerPhone feature={point} />
            );
            new mapboxgl.Marker(ref.current)
                .setLngLat(point)
                .addTo(map);
        });

        // points.fact.coordinates.forEach((point) => {
        //     const ref = React.createRef();
        //     ref.current = document.createElement('div');
        //     createRoot(ref.current).render(
        //         <MarkerFact feature={point} />
        //     );
        //     new mapboxgl.Marker(ref.current)
        //         .setLngLat(point)
        //         .addTo(map);
        // });

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('load', () => {
            map.addSource('route-qz1', routes.qz1.source);
            map.addLayer(routes.qz1.layer);
            map.addSource('route-phone', routes.phone.source);
            map.addLayer(routes.phone.layer);
            map.addSource('route-fact', routes.fact.source);
            map.addLayer(routes.fact.layer);
        });

        return () => map.remove();
    }, []);

    return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
