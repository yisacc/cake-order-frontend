import React from 'react';
import type { PathRouteProps } from 'react-router-dom';

const Home = React.lazy(() => import('~/pages/home'));
const Signin = React.lazy(() => import('~/pages/signin'));
const Signup = React.lazy(() => import('~/pages/signup'));
const Dashboard = React.lazy(() => import('~/pages/dashboard'));

export const routes: Array<PathRouteProps> = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [
  {
    path: '/dashboard',
    element: <Dashboard />,
  }
];