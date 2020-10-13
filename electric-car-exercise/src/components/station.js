import React, { Component } from 'react'

export default class station extends Component {
  render() {

    const isEnabled = this.props.userLogged

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
        <button disabled={isEnabled} onClick={this.props.startCharge}>Start slowCharge</button>
        <button disabled={!isEnabled}>Start FastCharge</button>
      </div>
      <div>
        Start time here: {this.props.activeCharger.startTime}
      </div>
    </div>
    }

    return (
      <div className="stationContainer">
        <div><input type="text" 
                    name="searchStation" 
                    placeholder="Search a station" 
                    value={this.props.searchStation} 
                    onChange={this.props.stationSearch}></input></div>
        {output}
      </div>        
    )
  }
}
