import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Map, useMap } from "@vis.gl/react-google-maps";
import ImgMunicipio from "../assets/icons/municipio-Icon.jpg";

const CompMapMunicipio = ({ municipioData, setMunicipioData }) => {
    const map = useMap();
    const [municipios, setMunicipios] = useState([]); // Estado para los municipios
    const [markerArray, setMarkerArray] = useState([]); // Estado para los marcadores
    const [marker, setMarker] = useState(null); // Estado para el marcador del usuario

    const token = localStorage.getItem('token'); // Cambia esto según cómo manejes el token

    // Cargar municipios desde la API
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

    // Mostrar los municipios en el mapa con marcadores
    useEffect(() => {
        if (!map || !municipios.length) return;

        // Borrar los marcadores existentes
        markerArray.forEach((marker) => marker.setMap(null));
        setMarkerArray([]); // Limpiar el array de marcadores

        // Agregar nuevos marcadores para cada municipio
        const newMarkers = municipios.map((municipio) => {
            const latLng = { lat: parseFloat(municipio.lat), lng: parseFloat(municipio.lng) };

            const googleMarker = new google.maps.Marker({
                position: latLng,
                map,
                title: municipio.nombre,
                icon: {
                    url: ImgMunicipio, // Imagen personalizada para los municipios ya creados
                    scaledSize: new google.maps.Size(24, 24), // Ajustar tamaño de la imagen
                },
            });

            return googleMarker;
        });

        // Actualizar el estado de los marcadores
        setMarkerArray(newMarkers);

    }, [map, municipios]);

    // Manejar el clic del usuario para agregar un nuevo marcador y llenar los inputs
    useEffect(() => {
        if (!map) return;

        const handleMapClick = (e) => {
            const latLng = e.latLng;

            // Actualiza el estado con la nueva posición
            setMunicipioData({
                ...municipioData,
                lat: latLng.lat(),
                lng: latLng.lng(),
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
                    fillColor: "blue", // Color para el marcador del usuario
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "blue",
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
    }, [map, municipioData, marker, setMunicipioData]);

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={12}>
                    <Map
                        style={{ width: "40vw", height: "40vh" }}
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

export default CompMapMunicipio;
