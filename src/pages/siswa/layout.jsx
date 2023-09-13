import { A, Outlet, useNavigate } from "@solidjs/router";
import toast from "solid-toast";
import { createEffect, onCleanup } from "solid-js";
import { useLayoutStore } from "./layoutStore";

const fn_periksa_Auth = () => {
  const siswa_token = localStorage.getItem("siswa_token");
  if (!siswa_token) {
    toast.error("Login terlebih dahulu!");
    return false;
  }
  return true;
};

const SiswaLayout = () => {
  const navigate = useNavigate();
  const isAuth = fn_periksa_Auth();
  if (!isAuth) {
    navigate("/", { replace: true }); // Redirect hanya jika otentikasi gagal.
  }
  // Bersihkan pesan toast saat komponen di-unmount.
  // onCleanup(() => {
  //   toast.clear();
  // });

  return (
    <>
      <Sidebar />
      <div class="flex overflow-hidden pt-24 px-2 bg-base-100">
        <div class="opacity-50 hidden fixed inset-0 z-10" />
        <div class="w-full relative lg:ml-72">
          <main class="pb-4 min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useLayoutStore();
  let CssAside = `fixed z-20 h-full top-14 left-0 pt-4 flex lg:flex flex-shrink-0 flex-col w-80 lg:w-72 transition-width duration-75 bg-gray-50 shadow`;
  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />{" "}
      <aside
        id="sidebar"
        aria-label="Sidebar"
        class={CssAside}
        classList={{ hidden: isSidebarOpen() !== true }}
      >
        <div class="relative flex-1 flex flex-col min-h-0 ">
          <div class="flex-1 flex flex-col  pb-4 overflow-y-auto">
            <div class="flex-1 px-0 space-y-1">
              <ul class="menu menu-sm lg:menu-md px-4 py-0">
                <li class="menu-title  gap-4 hidden md:flex flex-row ">
                  <span class="text-base-content">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="w-5 h-5 text-fuchsia-600"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.828a.75.75 0 010 1.061L6.11 12.95a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm3.594-3.317a.75.75 0 00-1.37.364l-.492 6.861a.75.75 0 001.204.65l1.043-.799.985 3.678a.75.75 0 001.45-.388l-.978-3.646 1.292.204a.75.75 0 00.74-1.16l-3.874-5.764z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                  <span> MENU </span>
                </li>
                <ul class="menu menu-sm lg:menu-md px-4 py-0">
                  <li>
                    <A href="/siswa/paket">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                          />
                        </svg>
                      </span>
                      <span class="undefined">
                        Paket Ujian
                        {/* {`${isSidebarOpen()}`} */}
                      </span>
                      {/* <span class="badge badge-sm font-mono lowercase">
                        <code class="text-emerald-800">Update</code>
                      </span> */}
                    </A>
                  </li>
                  <li>
                    <A href="/siswa/dashboard">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                          />
                        </svg>
                      </span>
                      <span class="undefined">Profile</span>
                      {/* <span class="badge badge-sm font-mono lowercase">
                        <code class="text-red-800">Belum</code>
                      </span> */}
                    </A>
                  </li>
                </ul>
              </ul>

              <ul class="menu menu-sm lg:menu-md px-4 py-0">
                <li></li>
                <li>
                  <span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <span class="undefined">Logout</span>
                  </span>
                </li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Navbar = (props) => {
  const toggleSidebar = props.toggleSidebar;
  return (
    <>
      <div class="static">
        <div class="fixed z-50 font-serif font-semibold text-sm py-2 text-center px-4 w-full bg-gray-50 ">
          <div class="flex  mx-4 overflow-hidden w-full justify-between">
            <span class="btn btn-ghost normal-case text-lg hidden md:block">
              {" "}
              UJIAN STUDI
            </span>

            <div>
              <button
                id="toggleSidebarMobile"
                onClick={toggleSidebar}
                aria-expanded="true"
                aria-controls="sidebar"
                class="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:border focus:border focus:ring-2 rounded"
              >
                <svg
                  id="toggleSidebarMobileHamburger"
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  id="toggleSidebarMobileClose"
                  class="w-6 h-6 hidden"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              {/* <span class="btn btn-ghost normal-case text-xl">
                UJIAN STUDI{" "}
              </span> */}
            </div>
            <div class="navbar-center hidden lg:flex">
              <div class="text-xl">
                {" "}
                <span class="font-bold text-md underline" v-if="waktu > 0">
                  SOAL
                </span>
                <span class="px-4 font-bold text-slate-600">aa</span>
                <span class="px-4 font-bold text-red-600">11</span>
                <span v-else></span>
              </div>
            </div>
            <div class="navbar-end space-x-2 md:hidden">
              <div class="text-lg">
                {" "}
                <span class="font-bold text-md underline">SOAL</span>
                <span class="px-4 font-bold text-slate-600">aa</span>
                <span class="px-4 font-extrabold text-red-600">11</span>
                <span></span>
              </div>
            </div>
            {/* !batas navbar */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SiswaLayout;
