import * as ReactDOM from "react-dom";
import * as React from "react";

// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import GMap = google.maps;

interface MapMarkerProps {
  pos: GMap.LatLngLiteral;
  title?: string;
  iconUrl?: string;
  iconSize?: number;
}

interface MapMarkerState {
  marker: GMap.Marker;
}

export default class MapMarker extends React.Component<MapMarkerProps, MapMarkerState> {
  static contextTypes = {
    map: PropTypes.any
  }

  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      marker: null
    }
  }

  componentDidMount() {
    var marker = new GMap.Marker();
    marker.setMap(this.context.map);

    this.setState({
      marker: marker
    });
  }

  componentWillUnmount() {
    this.state.marker.setMap(null);
  }

  render(): any {
    if (this.state.marker) {
      const iconSize = this.props.iconSize;
      this.state.marker.setOptions({
        position: this.props.pos,
        title: this.props.title,
        icon: {
          anchor: iconSize ? new GMap.Point(0, iconSize / 2) : null,
          scaledSize: iconSize ? new GMap.Size(iconSize, iconSize) : null,
          url: this.props.iconUrl
        }
      });
    }
    return null;
  }
}
