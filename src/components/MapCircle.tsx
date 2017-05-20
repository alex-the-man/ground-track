import * as ReactDOM from "react-dom";
import * as React from "react";

// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import GMap = google.maps;

interface MapCircleProps {
  center: GMap.LatLngLiteral;
  radius: number;
}

interface MapCircleState {
  circle: GMap.Circle;
}

export default class MapCircle extends React.Component<MapCircleProps, MapCircleState> {
  static contextTypes = {
    map: PropTypes.any
  }

  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      circle: null
    }
  }

  componentDidMount() {
    var circle = new GMap.Circle({
      clickable: false,
      editable: false,
      fillColor: "#000",
      fillOpacity: 0.4,
      map: this.context.map,
      radius: this.props.radius,
      strokeOpacity: 0
    });

    this.setState({
      circle: circle
    });
  }

  componentWillUnmount() {
    this.state.circle.setMap(null);
  }

  render(): any {
    if (this.state.circle) {
      this.state.circle.setOptions({
        center: this.props.center
      });
    }
    return null;
  }
}
