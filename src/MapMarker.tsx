import * as _ from "underscore";
import * as ReactDOM from "react-dom";
import * as React from "react";

// Can"t do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import GMap = google.maps;

interface MapMarkerProps {
  pos: GMap.LatLngLiteral;
  title: string;
}

export default class MapMarker extends React.Component<MapMarkerProps, undefined> {
  static contextTypes = {
    map: PropTypes.any
  }

  private marker: GMap.Marker;

  componentDidMount() {
    this.marker = new GMap.Marker({
      map: this.context.map,
      position: this.props.pos,
      title: this.props.title
    });
  }

  componentWillUnmount() {
    this.marker.setMap(null);
  }

  render(): any {
    return null;
  }
}
