import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Station from './station';
import L from 'leaflet';
import {Map, TileLayer, Marker, Popup, Tooltip} from 'react-leaflet';

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
        <Station selectedStation={this.props.selectedStation}/>
        <div className="mapContainer">
          <Map className="map" center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {this.props.stations.map(station => (
              <Marker onClick={() => this.props.selectStation(station)} key={station.id} position={[station.lattitude, station.longitude]} icon={myIcon}>
                <Tooltip direction="bottom">
                  {station.name} <br /> {station.streetAddress}, {station.zipCode}, {station.city}.
                </Tooltip>
              </Marker> ))}
          </Map>
        </div>
      </Route>
    )
  }

}
