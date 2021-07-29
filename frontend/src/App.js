import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room, Star, FormatQuote, Fastfood, ControlCamera } from '@material-ui/icons';
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
  const currentUsername = "june";
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long
    }
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
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
              {/* <Fastfood style={{ fontSize: viewport.zoom * 5, color: "slateblue", cursor: "pointer" }} /> */}
              <Room className="Marker" style={{ fontSize: viewport.zoom * 5, color: currentUsername === pin.username ? "tomato" : "slateblue", cursor: "pointer" }} onClick={() => handerMarkerClick(pin._id, pin.lat, pin.long)} />
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
                  <h3 className="place">{pin.title}</h3>
                  <div className="author">
                    <span className="username">Created by <b>{pin.username}</b></span>
                    <span className="date">{format(pin.createdAt)}</span>
                  </div>
                  <div className="stars">
                    <Star className="star" /><Star className="star" /><Star className="star" /><Star className="star" /><Star className="star" />
                  </div>
                  <div>
                    <div className="quoteContainer" ><FormatQuote className="quote" /><FormatQuote /></div>
                    <p className="desc">{pin.desc}</p>
                  </div>
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
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="enter a title" onChange={(e) => setTitle(e.target.vaule)} />
                <label>Review</label>
                <textarea placeholder="Say us something about thie place." onChange={(e) => setDesc(e.target.vaule)} />
                <label>Rating</label>
                <select onChange={(e) => setStar(e.target.vaule)}>
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
