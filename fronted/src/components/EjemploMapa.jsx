import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AdvancedMarker, Map, Pin, useMap } from "@vis.gl/react-google-maps";
import motorcycle from "../assets/icons/rutes.png";

const EjemploMapa = () => {
    const map = useMap();

    const [markerArray, setMarkerArray] = useState([]);
    useEffect(() => {
        if (!map) return;
        if (!markerArray) return;
        if (markerArray.length < 2) return;
        // eslint-disable-next-line no-undef
        const flightPath = new google.maps.Polyline({
            path: markerArray,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });

        flightPath.setMap(map);
    }, [map, markerArray]);

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={12}>
                    <Map
                        onClick={(e) => {
                            console.log(e.detail.latLng);
                            const newArray = [...markerArray];
                            newArray.push(e.detail.latLng);
                            setMarkerArray(newArray);
                        }}
                        mapId={"bf51a910020fa25a"}
                        style={{ width: "30vw", height: "60vh" }}
                        defaultCenter={{
                            lat: -17.78302580071355,
                            lng: -63.180359841218795,
                        }}
                        defaultZoom={15}
                        gestureHandling={"greedy"}
                        disableDefaultUI={true}
                    >
                        {markerArray.map((marker, index) => (
                            <AdvancedMarker
                                key={index}
                                position={marker}
                                title={"AdvancedMarker with custom html content."}
                            >
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        background: "#1dbe80",
                                        border: "2px solid #0e6443",
                                        borderRadius: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}
                                ></div>
                            </AdvancedMarker>
                        ))}
                        <AdvancedMarker
                            position={{ lat: -17.78302580071355, lng: -63.180359841218795 }}
                            clickable={true}
                            onClick={() => alert("marker was clicked!")}
                            title={"clickable google.maps.Marker"}
                        />
                        <AdvancedMarker
                            position={{ lat: -17.768895040004235, lng: -63.182911542255376 }}
                            title={"AdvancedMarker with customized pin."}
                        >
                            <Pin
                                background={"#22ccff"}
                                borderColor={"#1e89a1"}
                                glyphColor={"#0f677a"}
                            ></Pin>
                        </AdvancedMarker>
                        <AdvancedMarker
                            position={{ lat: -17.76014242465274, lng: -63.1784029425748 }}
                            title={"AdvancedMarker with custom html content."}
                        >
                            <div
                                style={{
                                    width: 16,
                                    height: 16,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    background: "#1dbe80",
                                    border: "2px solid #0e6443",
                                    borderRadius: "50%",
                                    transform: "translate(-50%, -50%)",
                                }}
                            ></div>
                        </AdvancedMarker>
                        <AdvancedMarker
                            position={{ lat: -17.758930001314468, lng: -63.17814554135265 }}
                            title={"AdvancedMarker with image."}
                        >
                            <img
                                src={motorcycle}
                                alt="motorcycle"
                                style={{ width: 32, height: 32 }}
                            />
                        </AdvancedMarker>
                    </Map>
                </Col>
            </Row>
        </Container>
    );
};

export default EjemploMapa;
