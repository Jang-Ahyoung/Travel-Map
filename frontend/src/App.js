import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from '@material-ui/icons';
import './App.css';
import axios from 'axios';
import { format } from 'timeago.js';

function App() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.595195,
    longitude: 127.0524,
    zoom: 8
  });

  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const currentUsername = "ang"

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins") // proxy를 사용하기 때문에 locahost를 길게 작성해주지 않아도 된다
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getPins();
  }, []);

  const handerMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long })
  }

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({ lat, long });

  }

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle="mapbox://styles/angluvpeng/ckrfpsp1f4o3417mxdnu564cw"
        onDblClick={currentUsername && handleAddClick}
        transitionDuration="300"
      >
        {pins.map(pin => (
          <>
            <Marker latitude={pin.lat} longitude={pin.long} offsetLeft={-20} offsetTop={-10}>
              <Room style={{ fontSize: viewport.zoom * 5, color: currentUsername === pin.username ? "tomato" : "slateblue", cursor: "pointer" }} onClick={() => handerMarkerClick(pin._id, pin.lat, pin.long)} />
            </Marker>
            {pin._id === currentPlaceId &&
              <Popup
                latitude={pin.lat}
                longitude={pin.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="top"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Rating</label>
                  <div className="stars">
                    <Star className="star" /><Star className="star" /><Star className="star" /><Star className="star" /><Star className="star" />
                  </div>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Information</label>
                  <span className="username">Created by <b>{pin.username}</b></span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            }
          </>
        ))}
        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setCurrentPlaceId(null)}
            anchor="top"
          >
            <div className="card">
              <form>
                <label>Title</label>
                <input placeholder="enter a title" />
                <label>Review</label>
                <textarea placeholder="Say us something about thie place." />
                <label>Rating</label>
                <select>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitBtn" type="submit">Add pin</button>
              </form>
            </div>
          </Popup>
        )}

      </ReactMapGL>
    </div>
  );
}

export default App;
