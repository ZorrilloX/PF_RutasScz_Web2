import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Map, useMap } from "@vis.gl/react-google-maps";
import ImgMunicipio from "../assets/icons/municipio-Icon.jpg";
import ImgIncidente from "../assets/icons/incidente-Icon.jpg";

const CompMapIncidentes = ({ incidenteData, setIncidenteData, carreteraSeleccionada, setCarreteraSeleccionada }) => {
    const map = useMap();
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [marker, setMarker] = useState(null);
    const [incidentes, setIncidentes] = useState([]);
    const [highlightedPolyline, setHighlightedPolyline] = useState(null);
    const [infoWindow, setInfoWindow] = useState(new google.maps.InfoWindow());
    const [polylines, setPolylines] = useState([]);

    // Obtener carreteras desde la API
    useEffect(() => {
        fetch("http://localhost:3000/carreteras", {
            method: "GET",
            headers: {
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

        fetch("http://localhost:3000/incidentes/admin", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setIncidentes(data);
                } else {
                    console.error("La respuesta no es un arreglo", data);
                }
            })
            .catch((error) => console.error("Error al obtener incidentes:", error));
    }, []);

    // Obtener municipios desde la API
    useEffect(() => {
        fetch("http://localhost:3000/municipios", {
            method: "GET",
            headers: {
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
    }, []);

    // DIBUJAR y Redibujar carreteras según el filtro de estado
    useEffect(() => {
        if (!map || !carreteras.length) return;

        // Función para crear y resaltar una carretera
        const createAndHighlightRoute = (carretera, path) => {
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
        };

        // Limpiar las polilíneas previas
        polylines.forEach((polyline) => polyline.setMap(null)); // Eliminar las carreteras previas

        // Redibujar las nuevas carreteras
        const newPolylines = carreteras.map((carretera) => {
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
                    createAndHighlightRoute(carretera, path);
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
    }, [map, carreteras, infoWindow, highlightedPolyline]);

    // Resaltar la carretera seleccionada si existe
    useEffect(() => {
        if (!carreteraSeleccionada) return;

        const selectedCarretera = carreteras.find(carretera => carretera.id === carreteraSeleccionada.id);
        if (selectedCarretera && Array.isArray(selectedCarretera.puntos)) {
            const path = selectedCarretera.puntos.map(punto => ({
                lat: punto.lat,
                lng: punto.lng
            }));

            // Resaltar la carretera seleccionada
            createAndHighlightRoute(selectedCarretera, path);

            // Resetear carreteraSeleccionada
            setCarreteraSeleccionada(null);
        }
    }, [carreteraSeleccionada, carreteras, map, infoWindow, highlightedPolyline, setCarreteraSeleccionada]);

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

    // Añadir buscador con autocompletar
    useEffect(() => {
        if (!map) return;

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Buscar Municipio';
        input.classList.add('form-control');
        input.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            width: 300px;
            z-index: 5;
        `;
        
        document.getElementById(map.getDiv().id).appendChild(input);

        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.setFields(['geometry', 'name']);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            map.setCenter({ lat, lng });
            map.setZoom(12);

            // Crear un nuevo marcador en la ubicación del municipio
            if (marker) {
                marker.setMap(null); // Eliminar el marcador anterior si existe
            }

            const newMarker = new google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: place.name,
                icon: {
                    url: ImgMunicipio,
                    scaledSize: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15),
                },
            });

            setMarker(newMarker);
        });

        return () => {
            input.remove();
        };
    }, [map, marker]);

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
           [_{{{CITATION{{{_1{](https://github.com/Rabeetah/home_assignment/tree/d3097e5d2887ab949100e78decf6ff5644cf7e8b/src%2FApp.js)