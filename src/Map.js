import mapboxgl from 'mapbox-gl';
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import points from './points.json';
import routes from './routes.json';
import sources from './souces.json';
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

const Map = () => {
    const mapContainerRef = useRef(null);

    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [136.8865, 35.175],
            zoom: 16.5,
        });

        points.qz1.coordinates = sources.qz1.source;
        points.phone.coordinates = sources.phone.source;
        points.fact.coordinates = sources.fact.source;

        routes.qz1.source.data.geometry.coordinates = sources.qz1.source;
        routes.phone.source.data.geometry.coordinates = sources.phone.source;
        routes.fact.source.data.geometry.coordinates = sources.fact.source;


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

        points.fact.coordinates.forEach((point) => {
            const ref = React.createRef();
            ref.current = document.createElement('div');
            createRoot(ref.current).render(
                <MarkerFact feature={point} />
            );
            new mapboxgl.Marker(ref.current)
                .setLngLat(point)
                .addTo(map);
        });

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

        // Clean up on unmount
        return () => map.remove();
    }, []);

    return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
