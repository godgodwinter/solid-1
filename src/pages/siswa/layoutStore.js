// layoutStore.js
import { createStore } from "solid-js/store";

const [isSidebarOpen, setIsSidebarOpen] = createStore({
  sidebar: false,
});

const toggleSidebar = () => {
  setIsSidebarOpen("sidebar", !isSidebarOpen.sidebar);
};

export { isSidebarOpen, toggleSidebar, setIsSidebarOpen };
