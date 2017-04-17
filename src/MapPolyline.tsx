import * as _ from "underscore";
import * as ReactDOM from "react-dom";
import * as React from "react";

// Can"t do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import GMap = google.maps;

interface MapPolylineProps {
  dashedLine?: boolean;
  latLngs: Array<GMap.LatLngLiteral>;
}

export default class MapPolyline extends React.Component<MapPolylineProps, undefined> {
  static contextTypes = {
    map: PropTypes.any
  }

  static defaultProps: MapPolylineProps = {
    dashedLine: false,
    latLngs: null
  }

  static propTypes = {
    dashedLine: PropTypes.bool,
    latLngs: PropTypes.any.isRequired
  }

  private polyline: GMap.Polyline;

  componentDidMount() {
    var ploylineOptions: GMap.PolylineOptions = {
      map: this.context.map,
      path: this.props.latLngs,
      strokeColor: "#FFFFFF"
    };

    if (this.props.dashedLine) {
      var lineSymbol = {
        strokeWeight: 3,
        strokeOpacity: 1,
        path: "M 0,-5 0,1"
      };

       _.extend(ploylineOptions, {
        icons: [{
          icon: lineSymbol,
          offset: "0",
          repeat: "20px"
        }],
        strokeOpacity: 0,
        strokeWeight: 1
      });
    }

    this.polyline = new GMap.Polyline(ploylineOptions);
  }

  componentWillUnmount() {
    this.polyline.setMap(null);
  }

  render(): any {
    return null;
  }
}
