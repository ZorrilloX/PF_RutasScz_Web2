import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Map, useMap } from "@vis.gl/react-google-maps";
import ImgMunicipio from "../assets/icons/municipio-Icon.jpg";
import ImgIncidente from "../assets/icons/advertencia.png";
import axios from "axios";

const CompMapIncidentes = ({ incidenteData, setIncidenteData }) => {
    const map = useMap();
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [marker, setMarker] = useState(null);
    const [incidentes, setIncidentes] = useState([]);
    const [infoWindow, setInfoWindow] = useState(null);

    const token = localStorage.getItem('token');

    // Obtener carreteras desde la API
    useEffect(() => {
        if (!token) {
            console.error("No se encontró el token");
            return;
        }

        fetch("http://localhost:3000/carreteras", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCarreteras(data);
                } else {
                    console.error("La respuesta no es un arreglo", data);
                }
            })
            .catch((error) => console.error("Error al obtener carreteras:", error));

            axios.get("http://localhost:3000/incidentes/admin", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setIncidentes(response.data);
                } else {
                    console.error("La respuesta no es un arreglo", response.data);
                }
            })
            .catch((error) => console.error("Error al obtener incidentes:", error));
    }, [token]);

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
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setMunicipios(data);
                } else {
                    console.error("La respuesta no es un arreglo", data);
                }
            })
            .catch((error) => console.error("Error al obtener municipios:", error));
    }, [token]);

    // Mostrar carreteras en el mapa con líneas
    useEffect(() => {
        if (!map || !carreteras.length) return;

        carreteras.forEach((carretera) => {
            if (Array.isArray(carretera.puntos)) {
                const path = carretera.puntos.map(punto => ({
                    lat: punto.lat,
                    lng: punto.lng
                }));
                const routePath = new google.maps.Polyline({
                    path,
                    geodesic: true,
                    strokeColor: carretera.estado === "libre" ? "#1dbe80" : "#FFFF00",
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                });
                routePath.setMap(map);

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div><strong>Nombre:</strong> ${carretera.nombre}</div>
                              <div><strong>Estado:</strong> ${carretera.estado}</div>`,
                });

                routePath.addListener("click", () => {
                    infoWindow.setPosition(path[0]);
                    infoWindow.open(map);
                });
            }
        });
    }, [map, carreteras]);

    // Mostrar marcadores para los municipios con íconos
    useEffect(() => {
        if (!map || !municipios.length) return;

        municipios.forEach((municipio) => {
            const latLng = { lat: parseFloat(municipio.lat), lng: parseFloat(municipio.lng) };

            new google.maps.Marker({
                position: latLng,
                map,
                title: municipio.nombre,
                icon: {
                    url: ImgMunicipio,
                    scaledSize: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                },
            });
        });
    }, [map, municipios]);

    // Manejar el clic del usuario para agregar un nuevo marcador y llenar los inputs
    useEffect(() => {
        if (!map) return;

        const handleMapClick = (e) => {
            const latLng = e.latLng;

            // Actualiza el estado con la nueva posición
            setIncidenteData({
                ...incidenteData,
                ubicacion: { lat: latLng.lat(), lng: latLng.lng() },
            });

            // Crear un nuevo marcador en la ubicación donde se hizo clic
            if (marker) {
                marker.setMap(null); // Eliminar el marcador anterior si existe
            }

            const newMarker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: "Nuevo Marcador",
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "yellow", // Color para el marcador del usuario
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "yellow",
                },
            });

            setMarker(newMarker); // Guardar el nuevo marcador
        };

        // Añadir listener de clic al mapa
        const listener = map.addListener("click", handleMapClick);

        // Limpiar el listener cuando el componente se desmonta
        return () => {
            if (listener) {
                google.maps.event.removeListener(listener);
            }
            if (marker) {
                marker.setMap(null); // Eliminar el marcador si se encuentra
            }
        };
    }, [map, incidenteData, marker, setIncidenteData]);

    useEffect(() => {
        if (!map || !incidentes.length) return;

        const newInfoWindow = new google.maps.InfoWindow();
        setInfoWindow(newInfoWindow);

        incidentes.forEach((incidente) => {
            const latLng = {
                lat: parseFloat(incidente.ubicacion.lat),
                lng: parseFloat(incidente.ubicacion.lng),
            };

            const marker = new google.maps.Marker({
                position: latLng,
                map,
                title: incidente.tipo, // Tipo del incidente
                icon: {
                    url: ImgIncidente, // Imagen personalizada
                    scaledSize: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                },
            });

            // Mostrar InfoWindow al hacer clic
            marker.addListener("click", () => {
                newInfoWindow.setContent(`
                    <div>
                        <strong>Tipo:</strong> ${incidente.tipo}<br/>
                        <strong>Descripción:</strong> ${incidente.descripcion || "No disponible"}<br/>
                        <strong>Fecha:</strong> ${incidente.updatedAt || "No especificada"}
                    </div>
                `);
                newInfoWindow.setPosition(latLng);
                newInfoWindow.open(map);
            });
        });

        return () => {
            newInfoWindow.close(); // Limpiar el InfoWindow al desmontar
        };
    }, [map, incidentes]);

    // Graficar la ubicación existente si está disponible
    useEffect(() => {
        if (incidenteData.ubicacion && incidenteData.ubicacion.lat && incidenteData.ubicacion.lng && map) {
            // Eliminar el marcador anterior si existe
            if (marker) {
                marker.setMap(null);
            }

            const newMarker = new google.maps.Marker({
                position: incidenteData.ubicacion,
                map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "yellow",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "yellow",
                },
            });

            setMarker(newMarker);
        }
    }, [incidenteData, map]);

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={12}>
                    <Map
                        style={{ width: "100%", height: "50vh" }}
                        defaultCenter={{
                            lat: -17.78302580071355,
                            lng: -63.180359841218795,
                        }}
                        defaultZoom={6}
                        gestureHandling="greedy"
                        disableDefaultUI={true}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default CompMapIncidentes;
