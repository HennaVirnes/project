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
        SlowChargers: {this.props.selectedStation.qntSlow}, price 0.20€ /min
      </div>
      <div>
        Fastchargers: {this.props.selectedStation.qntFast}, price 0.18 €/kwH
      </div>
      <div>
        
      </div>
      {this.props.userLogged === false ? (
        <span></span>
      ):(
      <div>
      {this.props.chargeOngoing === false ? (
        <span>
          <input type="text" name="startingCode" placeholder="Enter code here" value={this.props.startingCode} onChange={this.props.updateSearch}/>
          <button disabled={!isEnabled} onClick={this.props.isChargerCodeValid}>Start Charge</button>
        </span>
        ) : (
        <span> 
          Charge Ongoing
          <button onClick={() => this.props.stopCharge(this.props.userInfo.userId)}>Stop Charge</button>
        </span>
        )
      }
      </div>
      )}
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
