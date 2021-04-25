import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';

import mapMarkerImg from '../images/map-marker.svg';
import '../styles/pages/orphanages-map.css';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';

interface IOrphanage {
    id: number,
    name: string,
    latitude: number,
    longitude: number
}

function OrpahanagesMap() {
    const [userLatitude, setUserLatitude] = useState(-29.4506549);
    const [userLongitude, setUserLongitude] = useState(-52.5848386);
    const [orphanages, setOrphanages] = useState<IOrphanage[]>([]);

    useEffect(() => {
        api.get('orphanages').then(res => {
            setOrphanages(res.data);
        }).catch(err => {
            console.error(err);
        });

        navigator.geolocation.getCurrentPosition((location) => {
            setUserLatitude(location.coords.latitude);
            setUserLongitude(location.coords.longitude);
        });
    }, [])

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Lajeado</strong>
                    <span>Rio Grande do Sul</span>
                </footer>
            </aside>

            <Map
                center={[userLatitude, userLongitude]}
                zoom={15}
                setView={true}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

                {orphanages.map(orphanage => {
                    return (
                        <Marker
                            icon={mapIcon}
                            position={[orphanage.latitude, orphanage.longitude]}
                            key={orphanage.id}
                        >
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                                {orphanage.name}
                                <Link to={`/orphanages/${orphanage.id}`} >
                                    <FiArrowRight size={20} color="#fff" />
                                </Link>
                            </Popup>
                        </Marker>
                    )
                })}
            </Map>

            <Link to="/orphanages/create" className="create-orphange">
                <FiPlus size={32} color="#ffffff" />
            </Link>
        </div>
    )
}

export default OrpahanagesMap;