/* global google */
import React, { useRef, useState } from "react";
import { render } from "react-dom";
import Map from "./Map";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
// import './style.css';

const googleMapsApiKey = "AIzaSyBG_U7llCBV6Q-OdBP5Sa_VhyuGuyL6Fzk";

const App = (props) => {
    const [places, setPlaces] = useState([]);
    const [origin, setOrigin] = useState({ address: "" });
    const [destinatioin, setDestination] = useState({ address: "" });
    const [directions, setDirections] = useState(null);
    const [distance, setDistance] = useState(0);
    // const inputFrom = useRef(null);
    // const inputTo = useRef(null);

    const { loadingElement, containerElement, mapElement, defaultCenter, defaultZoom } = props;

    const handleOriginChange = (address) => {
        let newOrigin = {
            address: address,
        };
        setOrigin(newOrigin);
    };

    const handleOriginSelect = (address) => {
        geocodeByAddress(address)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                let newOrigin = {
                    address: address,
                    coords: latLng,
                };
                setOrigin(newOrigin);
            })
            .catch((error) => console.error("Error", error));
    };

    const handleDestinationChange = (address) => {
        let newDestination = {
            address: address,
        };
        setDestination(newDestination);
    };
    const handleDestinationSelect = (address) => {
        geocodeByAddress(address)
            .then((results) => getLatLng(results[0]))
            .then((latLng) => {
                let newDestination = {
                    address: address,
                    coords: latLng,
                };
                setDestination(newDestination);
            })
            .catch((error) => console.error("Error", error));
    };

    const locatonField = (address, handleChange, handleSelect) => (
        <PlacesAutocomplete value={address} onChange={handleChange} onSelect={handleSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div style={{ marginRight: 20 }}>
                    <input
                        {...getInputProps({
                            placeholder: "Search Places ...",
                        })}
                    />
                    <div style={{ position: "absolute", zIndex: 900, width: 300 }}>
                        {/* {loading && <div>Loading...</div>} */}
                        {suggestions.map((suggestion) => {
                            const style = suggestion.active
                                ? { backgroundColor: "#ddd", cursor: "pointer" }
                                : { backgroundColor: "#ffffff", cursor: "pointer" };
                            return (
                                <div
                                    {...getSuggestionItemProps(suggestion, {
                                        style,
                                    })}
                                >
                                    <span>{suggestion.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );

    const handleClick = async () => {
        let newPlaces = [origin.coords, destinatioin.coords];
        setPlaces(newPlaces);
        console.log(newPlaces);

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origin.coords,
                destination: destinatioin.coords,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    let newDistance =
                        result &&
                        result.routes &&
                        result.routes.length &&
                        result.routes[0].legs &&
                        result.routes[0].legs.length &&
                        result.routes[0].legs[0].distance
                            ? result.routes[0].legs[0].distance.value
                            : 0;

                    setDirections(result);
                    setDistance(newDistance);
                } else {
                    console.log(result);
                }
            }
        );
    };

    return (
        <div>
            <div style={{ marginBottom: 10, display: "flex" }}>
                {locatonField(origin.address, handleOriginChange, handleOriginSelect)}
                {locatonField(destinatioin.address, handleDestinationChange, handleDestinationSelect)}
                {/* <input ref={inputFrom} style={{ marginRight: 20 }} />
                <input ref={inputTo} style={{ marginRight: 20 }} /> */}
                <button onClick={handleClick} style={{ marginRight: 20 }}>
                    Get directions
                </button>
                <span>{(distance / 1000).toFixed(2)}km</span>
            </div>
            {places && (
                <Map
                    googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + googleMapsApiKey + "&libraries=geometry,drawing,places"}
                    markers={places}
                    directions={directions}
                    loadingElement={loadingElement || <div style={{ height: `100%` }} />}
                    containerElement={containerElement || <div style={{ height: "80vh" }} />}
                    mapElement={mapElement || <div style={{ height: `100%` }} />}
                    defaultCenter={defaultCenter || { lat: 25.798939, lng: -80.291409 }}
                    defaultZoom={defaultZoom || 11}
                />
            )}
        </div>
    );
};

// const places = [
//     { latitude: 32.05538, longitude: -81.0816 },
//     { latitude: 32.06419, longitude: -81.09713 },
// ];

render(<App defaultZoom={7} />, document.getElementById("root"));
