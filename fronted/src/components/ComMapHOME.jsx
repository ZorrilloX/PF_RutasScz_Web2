import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";
import { Map, useMap } from "@vis.gl/react-google-maps";
import ImgMunicipio from "../assets/icons/municipio-Icon.jpg";
import ImgIncidente from "../assets/icons/advertencia.png";
import axios from "axios";

const CompMapIncidentes = ({ incidenteData, setIncidenteData, carreteraSeleccionada, setCarreteraSeleccionada, carreterasFiltradas }) => {
    const map = useMap();
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [marker, setMarker] = useState(null);
    const [incidentes, setIncidentes] = useState([]);
    const [infoWindow, setInfoWindow] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [highlightedRoute, setHighlightedRoute] = useState([]);
    const [highlightedPolyline, setHighlightedPolyline] = useState(null);
    const [polylines, setPolylines] = useState([]); // Estado para las polilíneas


    // Obtener carreteras desde la API
    useEffect(() => {

        fetch("http://localhost:3000/carreteras", {
            method: "GET",
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

            axios.get("http://localhost:3000/incidentes") // /admin para traerlos todos
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setIncidentes(response.data);
                } else {
                    console.error("La respuesta no es un arreglo", response.data);
                }
            })
            .catch((error) => console.error("Error al obtener incidentes:", error));
    }, []);

    // Obtener municipios desde la API
    useEffect(() => {

        fetch("http://localhost:3000/municipios", {
            method: "GET",
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
    },[]);

    // DIBUJAR y Redibujar carreteras según el filtro de estado
    useEffect(() => {
        if (!map || !carreterasFiltradas.length) return;

        // Limpiar las polilíneas previas
        polylines.forEach((polyline) => polyline.setMap(null)); // Eliminar las carreteras previas
        
        
        // Redibujar las nuevas carreteras
        const newPolylines = carreterasFiltradas.map((carretera) => {
            if (Array.isArray(carretera.puntos)) {
                const path = carretera.puntos.map((punto) => ({
                    lat: punto.lat,
                    lng: punto.lng,
                }));

                // Crear el objeto Polyline con base en el estado de la carretera
                const routePath = new google.maps.Polyline({
                    path,
                    geodesic: true,
                    strokeColor: carretera.estado === "libre" ? "#1dbe80" : "#FFFF00",
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                });

                // Añadir el Polyline al mapa
                routePath.setMap(map);

                // Configurar evento click para cada carretera
                routePath.addListener("click", () => {
                    // Cerrar el InfoWindow anterior
                    infoWindow.close();

                    // Borrar la línea resaltada anterior, si existe
                    if (highlightedPolyline) {
                        highlightedPolyline.setMap(null);
                    }
                    

                    // Crear una nueva línea resaltada
                    const highlightedPath = new google.maps.Polyline({
                        path,
                        geodesic: true,
                        strokeColor: "#FF0000", // Color de resaltado
                        strokeOpacity: 1.0,
                        strokeWeight: 8,
                        zIndex: 1, // Asegurar que la línea resaltada esté por encima
                    });
                    highlightedPath.setMap(map);
                    setHighlightedPolyline(highlightedPath);

                    // Abrir el nuevo InfoWindow
                    infoWindow.setContent(`
                        <div><h5>${carretera.nombre}</h5></div>
                        <div>
                            <strong>Estado:</strong><h6> ${carretera.estado}</h6>
                        </div>
                    `);
                    infoWindow.setPosition(path[0]);
                    infoWindow.open(map);
                });

                return routePath;
            }
            return null;
        });

        // Guardar las nuevas polilíneas en el estado
        setPolylines(newPolylines);

        // Limpiar las carreteras al desmontar el componente
        return () => {
            newPolylines.forEach((routePath) => {
                if (routePath) routePath.setMap(null);
            });
        };
    }, [map, carreterasFiltradas, infoWindow, highlightedPolyline]);

    
    // Resaltar la carretera seleccionada si existe
    useEffect(() => {
        if (!carreteraSeleccionada) return;

        const selectedCarretera = carreteras.find(carretera => carretera.id === carreteraSeleccionada.id);
        if (selectedCarretera && Array.isArray(selectedCarretera.puntos)) {
            const path = selectedCarretera.puntos.map(punto => ({
                lat: punto.lat,
                lng: punto.lng
            }));

            // Borrar la línea resaltada anterior, si existe
            if (highlightedPolyline) {
                highlightedPolyline.setMap(null);
            }

            // Crear una nueva línea resaltada
            const highlightedPath = new google.maps.Polyline({
                path,
                geodesic: true,
                strokeColor: "#FF0000", // Color de resaltado
                strokeOpacity: 1.0,
                strokeWeight: 8,
                zIndex: 1, // Asegurar que la línea resaltada esté por encima
            });
            highlightedPath.setMap(map);
            setHighlightedPolyline(highlightedPath);

            // Abrir el nuevo InfoWindow
            infoWindow.setContent(`
                <div><h5>${selectedCarretera.nombre}<h5></div>
                <div>
                    <strong>Estado:</strong><h6> ${selectedCarretera.estado}</h6>
                </div>
            `);
            infoWindow.setPosition(path[0]);
            infoWindow.open(map);

            // Resetear carreteraSeleccionada
            setCarreteraSeleccionada(null);
        }
    }, [carreteraSeleccionada, carreteras, map, infoWindow, highlightedPolyline, setCarreteraSeleccionada]);

    // fincion para añadir el nuevo incidente en tiempo real
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
    
    //graficar los incidentes
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
                    <img src="http://localhost:3000/imagenes/incidentes/${incidente.id}.jpg" alt="" style="width:140px;"}} />
                    <div><h5>${incidente.tipo}<h5></div>
                    <div>
                        ${incidente.descripcion || "No disponible"}<br/>
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

    //version de mostrarInfoWindows pero para municipios
    useEffect(() => {
        if (!map || !municipios.length) return;
        const newInfoWindow = new google.maps.InfoWindow();
        setInfoWindow(newInfoWindow);
        municipios.forEach((municipio) =>{
            const latLng = {
                lat: parseFloat(municipio.lat),
                lng: parseFloat(municipio.lng),
            };
            const marker = new google.maps.Marker({
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
            marker.addListener("click", () => {
                newInfoWindow.setContent(`
                    <div><h4>${municipio.nombre}<h4></div>
                    <div>
                        <strong>Municipio:</strong> ${municipio.nombre}<br/>
                    </div>
                `);
                newInfoWindow.setPosition(latLng);
                newInfoWindow.open(map);
            });
        });
        return () => {
            newInfoWindow.close(); // Limpiar el InfoWindow al desmontar
        };
    }, [map, municipios]);

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
            });

            setMarker(newMarker);
        }
    }, [incidenteData, map]);
    
    // Filtrar municipios en función del texto de búsqueda
    useEffect(() => {
        if (!searchQuery) {
            setSearchResults([]);
            return;
        }

        const results = municipios.filter((municipio) =>
            municipio.nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(results.slice(0, 4)); // Mostrar solo las primeras 4 coincidencias
    }, [searchQuery, municipios]);

    // Manejar el cambio en el campo de búsqueda
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Manejar la selección de un municipio
    const handleMunicipioSelect = (municipio) => {
        setSearchQuery(municipio.nombre);
        setSearchResults([]); // Limpiar los resultados después de seleccionar un municipio

        const latLng = { lat: parseFloat(municipio.lat), lng: parseFloat(municipio.lng) };
        map.setCenter(latLng);
        map.setZoom(8);
    };

    // Evitar recarga de la página al enviar el formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            const municipioEncontrado = municipios.find(
                (municipio) => municipio.nombre.toLowerCase() === searchQuery.toLowerCase()
            );
            if (municipioEncontrado) {
                console.log("Municipio encontrado:", municipioEncontrado);
            } else {
                console.log("Municipio no encontrado");
            }
        }
    };
  
    
    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={12}>
                <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="municipioSearch" className="d-flex">
                            <Form.Control
                                type="text"
                                placeholder="Buscar municipio..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSubmit(e);
                                    }
                                }}
                                autoComplete="off"
                            />
                            <Button type="submit">Buscar</Button>
                        </Form.Group>
                    </Form>
                    {/* Mostrar las sugerencias de búsqueda */}
                    {searchResults.length > 0 && (
                        <ListGroup>
                            {searchResults.map((municipio, index) => (
                                <ListGroup.Item
                                    key={index}
                                    onClick={() => handleMunicipioSelect(municipio)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {municipio.nombre}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    <Map
                        style={{  
                            minWidth: "600px", 
                            position: "absolute",
                            left: "0",
                            width: "99vw",
                            height: "700px",
                            //border: "5px solid white",
                            padding: "5px 100px"
                            }}
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
