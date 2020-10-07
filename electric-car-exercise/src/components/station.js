import React, { Component } from 'react'

export default class station extends Component {
  render() {

    let output = <>Choose a station from the map </>

    if(this.props.selectedStation.stationid != null) {
     output =
    <div>
      <div>
        Station:  {this.props.selectedStation.name}
      </div>
      <div>
        Address: {this.props.selectedStation.streetAddress}
      </div>
      <div>
        {this.props.selectedStation.zipCode} {this.props.selectedStation.city}
      </div>
      <div>
        SlowChargers: {this.props.selectedStation.qntSlow}, price {this.props.selectedStation.priceSlow} €/min
      </div>
      <div>
        Fastchargers: {this.props.selectedStation.qntFast}, price {this.props.selectedStation.priceFast} €/kwH
      </div>
      <div>
        <img className="stationImage" src={this.props.selectedStation.image}></img>
      </div>
    </div>
    }

    return (
      <div className="stationContainer">
        {output}
      </div>

        
        
        
        
    )
  }
}
