import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet'
import { FiPlus } from "react-icons/fi";
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";


export default function CreateOrphanage() {
  const history = useHistory();

  const [userLatitude, setUserLatitude] = useState(-29.4506549);
  const [userLongitude, setUserLongitude] = useState(-52.5848386);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpneningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((location) => {
      setUserLatitude(location.coords.latitude);
      setUserLongitude(location.coords.longitude);
    });
  }, [])

  function handleMapClick(e: LeafletMouseEvent) {
    const { lat, lng } = e.latlng;

    setPosition({ latitude: lat, longitude: lng })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image)
    });

    api.post('orphanages', data).then(res => {
      alert("Cadastro realizado com sucesso.");
      history.push('/app')
    }).catch(err => {
      alert(err);
    });
  }

  function handleSelectImages(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const selectedImages = Array.from(e.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });

    setPreviewImages(selectedImagesPreview);
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[userLatitude, userLongitude]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]} />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>M??ximo de 300 caracteres</span></label>
              <textarea id="about" maxLength={300} value={about} onChange={e => setAbout(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={name} />
                  )
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>
              <input type="file" multiple onChange={handleSelectImages} id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visita????o</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instru????es</label>
              <textarea id="instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Hor??rio de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={e => setOpneningHours(e.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? "active" : ""} onClick={() => setOpenOnWeekends(true)}>Sim</button>
                <button type="button" className={open_on_weekends ? "" : "active"} onClick={() => setOpenOnWeekends(false)}>N??o</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
