import * as React from "react";
import * as ReactDOM from "react-dom";

// Can't do import without .d.ts. See https://github.com/Microsoft/TypeScript/issues/15031
const PropTypes = require("prop-types");

import EquatorialCoordinate from "./EquatorialCoordinate"

import GMap = google.maps;

interface MapState {
  map: GMap.Map
}

interface MapContext {
  map: GMap.Map
}

export default class Map extends React.Component<undefined, MapState> {
  constructor(props?: any, context?: any) {
    super(props, context);

    this.state = {
      map: null
    };
  }

  static childContextTypes = {
    map: PropTypes.any
  }

  componentDidMount() {
    var mapOptions = {
      center: new GMap.LatLng(0, 0),
      mapTypeId: GMap.MapTypeId.SATELLITE,
      zoom: 2
    };
    this.setState({
      map: new GMap.Map(ReactDOM.findDOMNode(this.refs.mapContainer), mapOptions)
    });
  }

  componentWillUnmount() {
    console.warn("componentWillUnmount() on <Map> is not supported.");
  }

  getChildContext(): MapContext {
    return {
      map: this.state.map
    }
  }

  render() {
    return (
      <div ref="mapContainer" style={{height: "100%"}}>
        { this.state.map != null ? this.props.children : null }
      </div>
    );
  }
}
