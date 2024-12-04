import React, { useEffect, useState } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import ImgMunicipio from "../assets/icons/municipio-Icon.jpg";

const MapaCarreteras = () => {
    const map = useMap();
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    
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

    // Dibujar carreteras en el mapa y agregar InfoWindows
    useEffect(() => {
        if (!map || !carreteras.length) return;

        // Asegurarse de que carreteras sea un arreglo
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

                // Crear InfoWindow para cada carretera
                const infoWindow = new google.maps.InfoWindow({
                    content: `<div><strong>Nombre:</strong> ${carretera.nombre}</div>
                              <div><strong>Estado:</strong> ${carretera.estado}</div>`,
                });

                // Mostrar InfoWindow cuando el usuario hace clic en la carretera
                routePath.addListener("click", () => {
                    infoWindow.setPosition(path[0]);  // Mostrar InfoWindow cerca del inicio de la carretera
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

            const googleMarker = new google.maps.Marker({
                position: latLng,
                map,
                title: municipio.nombre,
                icon: {
                    url: ImgMunicipio, // Cambia esta URL a la de tu ícono
                    scaledSize: new google.maps.Size(30, 30), // Tamaño del ícono
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(15, 15), // Ajusta para que el marcador esté centrado
                },
            });
        });
    }, [map, municipios]);

    return (
        <Map
            mapId={"bf51a910020fa25a"}
            style={{ width: "40vw", height: "40vh" }}
            defaultCenter={{
                lat: -17.78302580071355,
                lng: -63.180359841218795,
            }}
            defaultZoom={6}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
        >
            {/* Puedes agregar aquí más componentes de marcador o ruta */}
        </Map>
    );
};

export default MapaCarreteras;
