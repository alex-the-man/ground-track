import * as React from "react";
import * as ReactDOM from "react-dom";

import EquatorialCoordinate from "./EquatorialCoordinate"

interface MapProps {
  lines: Array<Array<google.maps.LatLngLiteral>>;
}

interface MapState {
}

export default class Map extends React.Component<MapProps, MapState> {
  private map: google.maps.Map;

  componentDidMount() {
    var mapOptions = {
      center: new google.maps.LatLng(0, 0),
      zoom: 2
    };
    this.map = new google.maps.Map(ReactDOM.findDOMNode(this.refs.mapContainer), mapOptions);
    var line = new google.maps.Polyline({
      path: this.props.lines[0]
    });

    line.setMap(this.map);
  }

  render() {
    return <div ref="mapContainer" style={{height: "100%"}}></div>;
  }
}
