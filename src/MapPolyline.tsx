import * as _ from "underscore";
import * as ReactDOM from "react-dom";
import * as React from "react";

// Can"t do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import GMap = google.maps;

interface MapPolylineProps {
  color?: string;
  dashedLine?: boolean;
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

  static defaultProps: MapPolylineProps = {
    color: "#FFF",
    dashedLine: false,
    latLngs: null,
    opacity: 1
  }

  static propTypes = {
    color: PropTypes.string,
    dashedLine: PropTypes.bool,
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

      if (this.props.dashedLine) {
        const lineSymbol = {
          strokeWeight: 3,
          strokeOpacity: this.props.opacity,
          path: "M 0,-5 0,5"
        };

        _.extend(polylineOptions, {
          icons: [{
            icon: lineSymbol,
            offset: "0",
            repeat: "20px"
          }],
          strokeOpacity: 0,
          strokeWeight: 1
        });
      }
      this.state.polyline.setOptions(polylineOptions);
    }
    return null;
  }
}
