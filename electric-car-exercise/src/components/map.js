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
      <>
        <Station selectedStation={this.props.selectedStation}
                 userLogged={this.props.userLogged}
                 startCharge={this.props.startCharge}
                 searchStation={this.props.searchStation}
                 stationSearch={this.props.stationSearch}
                 startingCode={this.props.startingCode}
                 updateSearch={this.props.updateSearch}
                 isChargerCodeValid ={this.props.isChargerCodeValid}
                 chargeOngoing={this.props.chargeOngoing}
                 stopCharge={this.props.stopCharge}
                 userInfo={this.props.userInfo}
                 userLogged={this.props.userLogged}/>
        <div className="mapContainer">
          <Map className="map" center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {this.props.stations.map(station => (
              <Marker onClick={() => this.props.selectStation(station)} key={station.id} position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]} icon={myIcon}>
                <Tooltip direction="bottom">
                  {station.AddressInfo.Title} <br /> {station.AddressInfo.AddressLine1}, {station.AddressInfo.Postcode}, {station.AddressInfo.Town}.
                </Tooltip>
              </Marker> ))}
          </Map>
        </div>
      </>
    )
  }

}
