import React from "react";
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";

class MapDirectionsRenderer extends React.Component {
    state = {
        directions: null,
        error: null,
        distance: 0,
    };

    render() {
        const { directions } = this.props;
        if (this.state.error) {
            return <h1>{this.state.error}</h1>;
        }
        return directions && <DirectionsRenderer directions={directions} />;
    }
}

const Map = withGoogleMap((props) => (
    <GoogleMap defaultCenter={props.defaultCenter} defaultZoom={props.defaultZoom}>
        {props.markers.map((marker, index) => {
            return <Marker key={index} position={marker} />;
        })}
        <MapDirectionsRenderer places={props.markers} directions={props.directions} />
    </GoogleMap>
));

export default Map;
