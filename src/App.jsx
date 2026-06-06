import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import Favorites from './pages/Favorites';


// Define Application Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'library',
        element: <Library />,
      },
      {
        path: 'playlist/:id',
        element: <PlaylistDetail />,
      },
      {
        path: 'favorites',
        element: <Favorites />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
