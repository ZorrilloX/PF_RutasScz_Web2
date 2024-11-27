import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ListaTipos from './components/ListaTipos.jsx'; // Lista para mostrar los tipos
import FormTipos from './components/FormTipos.jsx';     // Formulario para crear/editar tipos
import ListaHabilidades from './components/ListaHabilidades.jsx'; // Lista para mostrar las habilidades
import FormHabilidades from './components/FormHabilidades.jsx'; // Formulario para crear/editar habilidades
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaPokemon from './components/ListaPokemon.jsx';
import FormPokemon from './components/FormPokemon.jsx';
import FormImagenPokemon from './components/FormImagePokemon.jsx';
import CatalogoPokemones from './components/CatalogoPokemon.jsx';
import CatPokemonDetalle from './components/CatPokemonDetalle.jsx';

// Definición de rutas
const router = createBrowserRouter([
  { path: "/", element: <App /> },   // Página principal

  {
    path: "/tipos",      // Ruta para listar tipos
    element: <ListaTipos />
  },
  {
    path: "/tipos/create", // Ruta para crear un nuevo tipo
    element: <FormTipos />
  },
  {
    path: "/tipos/:id",    // Ruta para editar un tipo existente
    element: <FormTipos />
  },


  {
    path: "/habilidades",
    element: <ListaHabilidades />
  },
  { 
    path: "/habilidades/create", 
    element: <FormHabilidades /> 
  },
  { 
    path: "/habilidades/:id",
    element: <FormHabilidades /> 
  },

  {
    path: "/pokemones",
    element: <ListaPokemon/>
  },
  { path: "/pokemones/create",
    element: <FormPokemon/>
  },
  {
    path: "/pokemones/:id",
    element: <FormPokemon/>
  },
  {
    path: "/pokemones/:id/photo",
    element: <FormImagenPokemon/>
  },

  {
    path: "/pokeApi",
    element: <CatalogoPokemones/>  
  },
  {
    path: "/pokeApi/:pokemonId",
    element: <CatPokemonDetalle/>
  }

]);

// Renderización del router
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
