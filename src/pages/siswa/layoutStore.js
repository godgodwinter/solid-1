// layoutStore.js
import { createSignal } from "solid-js";

export const useLayoutStore = () => {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);

  const toggleSidebar = () => {
    // console.log(isSidebarOpen());
    setIsSidebarOpen(!isSidebarOpen());
  };
  const getSidebar = () => {
    return `${isSidebarOpen()} `;
  };

  return {
    isSidebarOpen,
    toggleSidebar,
    getSidebar,
  };
};
