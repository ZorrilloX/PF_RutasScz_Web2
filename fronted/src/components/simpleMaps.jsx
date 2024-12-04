import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100vw",
    height: "500vh",
};

const center = {
    lat: -17.78302580071355,
    lng: -63.180359841218795,
};

const SimpleMap = () => {
    return (
        <LoadScript
            googleMapsApiKey= {import.meta.env.VITE_GOOGLE_MAPS_API_KEYa}
        >
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default SimpleMap;
