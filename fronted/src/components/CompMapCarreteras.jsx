import React, { useEffect, useState, useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import motorcycle from "../assets/icons/municipio-Icon.jpg";

const CompMapCarretera = ({ carreteraData, setCarreteraData }) => {
    const map = useMap();
    const [municipios, setMunicipios] = useState([]);
    const [markerArray, setMarkerArray] = useState([]);
    const [rutaActiva, setRutaActiva] = useState(false);
    const [puntosRuta, setPuntosRuta] = useState([]);
    
    const token = localStorage.getItem('token');

    // Obtener municipios desde la API
    useEffect(() => {
        if (!token) {
            console.error("No se encontró el token");
            return;
        }

        fetch("http://localhost:3000/municipios", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setMunicipios(data);
                } else {
                    console.error("La respuesta no es un arreglo", data);
                }
            })
            .catch((error) => console.error("Error al obtener municipios:", error));
    }, [token]);

    // Crear marcadores para cada municipio
    useEffect(() => {
        if (!map || !municipios.length) return;

        markerArray.forEach((marker) => marker.setMap(null));
        setMarkerArray([]);

        const newMarkers = municipios.map((municipio) => {
            const latLng = { lat: parseFloat(municipio.lat), lng: parseFloat(municipio.lng) };

            const googleMarker = new google.maps.Marker({
                position: latLng,
                map,
                title: municipio.nombre,
                icon: {
                    url: motorcycle,
                    scaledSize: new google.maps.Size(24, 24),
                },
            });

            googleMarker.addListener('click', () => {
                const newPunto = { lat: latLng.lat, lng: latLng.lng };

                if (rutaActiva) {
                    // Solo agregar el punto si no está duplicado
                    if (!puntosRuta.some(punto => punto.lat === newPunto.lat && punto.lng === newPunto.lng)) {
                        setPuntosRuta(prevPuntos => [...prevPuntos, newPunto]);
                        setCarreteraData(prevCarreteraData => ({
                            ...prevCarreteraData,
                            puntos: [...prevCarreteraData.puntos, newPunto],
                        }));
                    }
                } else {
                    // Activar la ruta y agregar el primer punto
                    setRutaActiva(true);
                    setPuntosRuta([newPunto]);
                    setCarreteraData({
                        ...carreteraData,
                        puntos: [newPunto],
                    });
                }

                // Actualizar los nombres de los municipios seleccionados
                if (!carreteraData.nombre1) {
                    // Asignar el nombre del primer municipio
                    setCarreteraData(prevCarreteraData => ({
                        ...prevCarreteraData,
                        nombre1: municipio.nombre
                    }));
                } else if (!carreteraData.nombre2) {
                    // Asignar el nombre del segundo municipio
                    setCarreteraData(prevCarreteraData => ({
                        ...prevCarreteraData,
                        nombre2: municipio.nombre
                    }));
                }
            });

            return googleMarker;
        });

        setMarkerArray(newMarkers);

    }, [map, municipios, puntosRuta, carreteraData, rutaActiva]);

    // Manejo de clics en el mapa para agregar puntos
    const handleMapClick = useCallback((e) => {
        if (!rutaActiva) return;
    
        const latLng = e.latLng;
        if (!latLng) {
            console.error("No se pudo obtener la latitud y longitud del clic.");
            return;
        }
    
        const newPunto = { lat: latLng.lat(), lng: latLng.lng() };
    
        // Verificar que el punto no esté duplicado
        const isDuplicated = puntosRuta.some(punto =>
            punto.lat === newPunto.lat && punto.lng === newPunto.lng
        );
    
        if (!isDuplicated) {
            setPuntosRuta(prevPuntos => [...prevPuntos, newPunto]);
            setCarreteraData(prevCarreteraData => ({
                ...prevCarreteraData,
                puntos: [...prevCarreteraData.puntos, newPunto],
            }));
        }
    }, [rutaActiva, puntosRuta, setPuntosRuta, setCarreteraData]);

    // Dibujar la ruta en el mapa
    useEffect(() => {
        if (!map || carreteraData.puntos.length < 2) return;

        const strokeColor = carreteraData.estado === "libre" ? "#1dbe80" : "#FFFF00";

        const routePath = new google.maps.Polyline({
            path: carreteraData.puntos,
            geodesic: true,
            strokeColor: strokeColor,
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });

        routePath.setMap(map);
    }, [map, carreteraData.puntos, carreteraData.estado]);

    // Agregar el listener para clic en el mapa
    useEffect(() => {
        if (!map) return;
    
        const listener = map.addListener("click", handleMapClick);
    
        return () => {
            if (listener) {
                google.maps.event.removeListener(listener);
            }
        };
    }, [map, handleMapClick]);

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={12}>
                    <Map
                        mapId={"bf51a910020fa25a"}
                        style={{ width: "40vw", height: "60vh" }}
                        defaultCenter={{
                            lat: -17.78302580071355,
                            lng: -63.180359841218795,
                        }}
                        defaultZoom={6}
                        gestureHandling={"greedy"}
                        disableDefaultUI={true}
                    >
                        {carreteraData.puntos.map((marker, index) => (
                            <AdvancedMarker
                                key={index}
                                position={marker}
                                title={`Punto ${index + 1}`}
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
                    </Map>
                </Col>
            </Row>
        </Container>
    );
};

export default CompMapCarretera;
