import * as ReactDOM from "react-dom";
import * as React from "react";

// Can"t do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import GMap = google.maps;

interface MapPolylineProps {
  color?: string;
  latLngs: Array<GMap.LatLngLiteral>;
  opacity?: number;
}

interface MapPolylineState {
  polyline: GMap.Polyline;
}

export default class MapPolyline extends React.Component<MapPolylineProps, MapPolylineState> {
  static contextTypes = {
    map: PropTypes.any
  }

  static defaultProps = {
    color: "#FFF",
    opacity: 1
  }

  static propTypes = {
    color: PropTypes.string,
    latLngs: PropTypes.any.isRequired,
    opacity: PropTypes.number,
  }

  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      polyline: null
    }
  }

  componentDidMount() {
    this.setState({ 
      polyline: new GMap.Polyline({
        map: this.context.map,
        strokeColor: "#FFF"
      })
    });
  }

  componentWillUnmount() {
    this.state.polyline.setMap(null);
  }

  render(): any {
    if (this.state.polyline) {
      var polylineOptions: GMap.PolylineOptions = {
        path: this.props.latLngs,
        strokeColor: this.props.color,        
        strokeOpacity: this.props.opacity
      };
      this.state.polyline.setOptions(polylineOptions);
    }
    return null;
  }
}
