// layoutStore.js
import { createStore } from "solid-js/store";

const [isSidebarOpen, setIsSidebarOpen] = createStore({
  sidebar: true,
});

const toggleSidebar = () => {
  setIsSidebarOpen("sidebar", !isSidebarOpen.sidebar);
};

export { isSidebarOpen, toggleSidebar };
