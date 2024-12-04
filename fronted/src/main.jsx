import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GestionUsuarios from './components/PanelUsuarios.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Header from './components/Header.jsx';
import HomeHeader from './components/HomeHeader.jsx';
import AdminPanel from './components/DashAdmin.jsx';
import GeneralPanel from './components/DashGeneral.jsx';
import GestionMunicipios from './components/PanelMunicipios.jsx';
import EjemploMapa from './components/EjemploMapa.jsx';
import { APIProvider } from '@vis.gl/react-google-maps';
import SimpleMap from './components/simpleMaps.jsx';
import GestionCarreteras from './components/PanelCarreteras.jsx';
import GestionIncidentes from './components/PanelIncidentes.jsx';
import GestionLogs from './components/PanelLogs.jsx';
import PublicView from './components/HOME-RutesScz.jsx';

// Layout para rutas públicas (HomeHeader)
const PublicLayout = () => (
  <>
    <HomeHeader />
    <Outlet />
  </>
);

// Layout para rutas privadas (Header)
const PrivateLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

// Definición de rutas
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/RutesScz",
    element: <PublicLayout />, // Header normal
    children: [
      { path: "", element: <PublicView /> },
      { path: "login", element: <Login /> },
    ],
  },
  {
    path: "/panel",
    element: <PrivateLayout />, // Header de control
    children: [
      { path: "", element: <Dashboard /> },
      { path: "admin", element: <AdminPanel /> },
      { path: "admin/usuarios", element: <GestionUsuarios /> },
      { path: "admin/logs", element: <GestionLogs /> },
      { path: "general", element: <GeneralPanel /> },
      { path: "general/municipios", element: <GestionMunicipios /> },
      { path: "general/carreteras", element: <GestionCarreteras /> },
      { path: "general/incidentes", element: <GestionIncidentes /> },
    ],
  },
  { path: "/mapa", element: <SimpleMap /> }, // de Prueba
  { path: "/mapa2", element: <EjemploMapa /> }, // de Prueba
  { path: "*", element: <h1>??? no hay nada 0.0!!! ir a /panel</h1> },
]);

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <APIProvider apiKey={API_KEY}>
      <RouterProvider router={router} />
    </APIProvider>
  </StrictMode>
);
