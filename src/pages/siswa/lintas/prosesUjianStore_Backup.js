// simpan data
// 1. paket ujian aktif
// 2 soal []
import { createStore } from "solid-js/store";

const [stateUjianLintasStore, setstateUjianLintasStore] = createStore({
  semua_mapel: null,
  mapel_aktif: null,
  soal_aktif: null,
});

const fn_getsoal_dari_mapelAktif = (nomerSoal) => {
  const index = nomerSoal - 1;
  if (
    stateUjianLintasStore.mapel_aktif &&
    nomerSoal <= stateUjianLintasStore.mapel_aktif.soal.length + 1
  ) {
    if (index >= 0 && index < stateUjianLintasStore.mapel_aktif.soal.length) {
      const foundSoal = {
        ...stateUjianLintasStore.mapel_aktif.soal[index],
        nomerSoal,
      };
      setstateUjianLintasStore("soal_aktif", foundSoal);
      return foundSoal;
    } else {
      console.log("Data Mapel Kosong");
      setstateUjianLintasStore("soal_aktif", null);
      return null;
    }
  } else {
    setstateUjianLintasStore("soal_aktif", null);
  }
};

export {
  stateUjianLintasStore,
  setstateUjianLintasStore,
  fn_getsoal_dari_mapelAktif,
};
