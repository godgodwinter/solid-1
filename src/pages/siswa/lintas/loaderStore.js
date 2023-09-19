import { createStore } from "solid-js/store";

const [loaderStore, setLoaderStore] = createStore({
  fakeLoading: 0,
  default: 2,
  toastDefault: 1000, //durasti toast / notif untk simpan dll
});

let timerId; // Variabel untuk menyimpan ID timer

const loader_get = () => {
  return loaderStore.fakeLoading;
};

const loader_run = (durasi) => {
  // durasi harus di atas 0
  if (durasi <= 0) {
    return;
  }

  setLoaderStore("fakeLoading", durasi); // Set fakeLoading ke durasi awal

  timerId = setInterval(() => {
    if (loaderStore.fakeLoading === 0) {
      clearInterval(timerId);
    } else {
      setLoaderStore("fakeLoading", loaderStore.fakeLoading - 1);
      console.log(loaderStore.fakeLoading); // Mengecek fakeLoading tiap detiknya
    }
  }, 1000);
};

const loader_stop = () => {
  clearInterval(timerId); // Hapus timer yang ada/telah dijalankan
  setLoaderStore("fakeLoading", 0); // Set fakeLoading kembali ke 0
};

export { loaderStore, setLoaderStore, loader_get, loader_run, loader_stop };
