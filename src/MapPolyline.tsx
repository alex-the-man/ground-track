import * as _ from "underscore";
import * as ReactDOM from "react-dom";
import * as React from "react";

// Can"t do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import GMap = google.maps;

interface MapPolylineProps {
  latLngs: Array<GMap.LatLngLiteral>;
  dashedLine?: boolean;
}

interface MapPolylineState {
}

export default class MapPolyline extends React.Component<MapPolylineProps, MapPolylineState> {
  static contextTypes = {
    map: PropTypes.any
  }

  static defaultProps: MapPolylineProps = {
    latLngs: null,
    dashedLine: false
  }

  static propTypes = {
    latLngs: PropTypes.any.isRequired,
    dashedLine: PropTypes.bool
  }

  private polyline: GMap.Polyline;

  componentDidMount() {
    var ploylineOptions: GMap.PolylineOptions = {
      strokeColor: "#FFFFFF",
      path: this.props.latLngs
    };

    if (this.props.dashedLine) {
      var lineSymbol = {
        path: "M 0,-5 0,1",
        strokeOpacity: 1,
        strokeWeight: 3
      };

       _.extend(ploylineOptions, {
        strokeOpacity: 0,
        strokeWeight: 1,
        icons: [{
          icon: lineSymbol,
          offset: "0",
          repeat: "20px"
        }],
      });
    }

    this.polyline = new GMap.Polyline(ploylineOptions);
    this.polyline.setMap(this.context.map);
  }

  componentWillUnmount() {
    this.polyline.setMap(null);
  }

  render(): any {
    return null;
  }
}
