import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import L from 'leaflet';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

var myIcon=L.icon({
  iconUrl: '/greenmarker.png',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0,-41]
})

export default class map extends Component  {
  
  state = {
    lat: 65.016,
    lng: 25.486,
    zoom: 8,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Route path="/map">
        <div>
          <Map className="map" center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={myIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </Map>
        </div>
      </Route>
    )
  }

}
