import { Routes, Route, A, useRoutes } from "@solidjs/router";
import { lazy } from "solid-js";

const routes = [
  {
    path: "/",
    component: lazy(() => import("./pages/Home.jsx")),
  },
  {
    path: "/*all",
    component: lazy(() => import("./pages/[...all].jsx")),
  },
  {
    path: "/users",
    component: lazy(() => import("./pages/Users.jsx")),
  },
  {
    path: "/users/:id",
    component: lazy(() => import("./pages/users/layout.jsx")),
    children: [
      {
        path: "/",
        component: lazy(() => import("./pages/users/[id].jsx")),
      },
      {
        path: "/settings",
        component: lazy(() => import("./pages/users/settings.jsx")),
      },
      {
        path: "/*all",
        component: lazy(() => import("./pages/users/404.jsx")),
      },
    ],
  },
];

export default function App() {
  const Routes = useRoutes(routes);
  return (
    <>
      <nav>
        <A href="/">Home</A>
        <A href="/about">About</A>
        <A href="/users">Users</A>
        <A href="/users/22">User id</A>
      </nav>
      <div>
        <h1>My Site with Lots of Pages</h1>
        <Routes />
      </div>
    </>
  );
}
