import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Map, useMap } from "@vis.gl/react-google-maps";
import ImgMunicipio from "../assets/icons/municipio-Icon.jpg";
import ImgIncidente from "../assets/icons/incidente-Icon.jpg";

const CompMapIncidentes = ({ incidenteData, setIncidenteData }) => {
    const map = useMap();
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [marker, setMarker] = useState(null);
    const [incidentes, setIncidentes] = useState([]);
    const [infoWindow, setInfoWindow] = useState(null);
    const [highlightedRoute, setHighlightedRoute] = useState(null);

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

    // Mostrar carreteras en el mapa con líneas y resaltar ruta al hacer clic
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
                    content: `<div><strong>Carretera:</strong> ${carretera.nombre}</div>
                              <div><strong>Estado:</strong> ${carretera.estado}</div>`,
                });

                routePath.addListener("click", () => {
                    if (highlightedRoute) {
                        highlightedRoute.setOptions({
                            strokeColor: highlightedRoute.get("defaultColor"),
                            strokeWeight: 5,
                        });
                    }
                    routePath.setOptions({
                        strokeColor: "#FF0000", // Color de resaltado
                        strokeWeight: 8,
                    });
                    routePath.set("defaultColor", carretera.estado === "libre" ? "#1dbe80" : "#FFFF00");
                    setHighlightedRoute(routePath);
                    
                    infoWindow.setPosition(path[0]);
                    infoWindow.open(map);
                });
            }
        });
    }, [map, carreteras, highlightedRoute]);

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
                newInfoWindow.setContent(
                    `<div>
                        <strong>Tipo:</strong> ${incidente.tipo}<br/>
                        <strong>Descripción:</strong> ${incidente.descripcion || "No disponible"}<br/>
                        <strong>Fecha:</strong> ${incidente.updatedAt || "No especificada"}
                    </div>`
                );
                newInfoWindow.setPosition(latLng);
                new[_{{{CITATION{{{_1{](https://github.com/Rabeetah/home_assignment/tree/d3097e5d2887ab949100e78decf6ff5644cf7e8b/src%2FApp.js)