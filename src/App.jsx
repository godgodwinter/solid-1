import { Routes, Route, A, useRoutes } from "@solidjs/router";
import { lazy } from "solid-js";
import { Toaster } from "solid-toast";

const routes = [
  {
    path: "/",
    component: lazy(() => import("./pages/Home.jsx")),
  },
  // !siswa
  {
    path: "/siswa",
    component: lazy(() => import("./pages/siswa/layout.jsx")),
    children: [
      {
        path: "/dashboard",
        component: lazy(() => import("./pages/siswa/dashboard.jsx")),
      },
      {
        path: "/paket",
        component: lazy(() => import("./pages/siswa/paket/index.jsx")),
      },
      {
        path: "/paket/detail/:id",
        component: lazy(() => import("./pages/siswa/paket/detail.jsx")),
      },
      // !ujian lintas
      {
        path: "/ujian/lintas/:nomer_soal", //dimulai dari 1
        component: lazy(() => import("./pages/siswa/lintas/index.jsx")),
      },
    ],
  },
  //!example
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
  // !404

  {
    path: "/*all",
    component: lazy(() => import("./pages/[...all].jsx")),
  },
];

export default function App() {
  const Routes = useRoutes(routes);
  return (
    <>
      <Toaster position="top-right" gutter={8} />
      {/* <nav>
        <A href="/">Home</A>
        <A href="/about">About</A>
        <A href="/users">Users</A>
        <A href="/users/22">User id</A>
      </nav> */}
      <div>
        {/* <h1>My Site with Lots of Pages</h1> */}
        <Routes />
      </div>
    </>
  );
}
