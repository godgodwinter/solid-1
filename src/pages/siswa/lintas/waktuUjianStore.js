import { createStore } from "solid-js/store";

const [waktuUjian, setwaktuUjian] = createStore({
  count: -1,
});

let timerId; // Variabel untuk menyimpan ID timer

const get = () => {
  return waktuUjian.count;
};
const run = (durasi) => {
  if (waktuUjian.count > 0) {
    console.log("waktu sudah berjalan, hentikan terlebih dahulu");
  } else {
    if (timerId) {
      clearInterval(timerId);
    }
    setwaktuUjian("count", durasi);
    timerId = setInterval(() => {
      const updatedCount = waktuUjian.count - 1;
      if (updatedCount >= 0) {
        setwaktuUjian("count", updatedCount);
      } else {
        setwaktuUjian("count", 0);
        clearInterval(timerId);
        stop();
      }
    }, 1000); // Interval 1000 ms (1 detik)
  }
};

const pause = () => {
  console.log(waktuUjian.count);
  // Hentikan timer jika sedang berjalan
  if (timerId) {
    clearInterval(timerId);
  }
  timerId = null;
};
const resume = () => {
  console.log("resume clicked:", waktuUjian.count);
  if (timerId) {
    console.log("Waktu sudah berjalan, resume tidak dapat dijalankan.");
  } else if (waktuUjian.count > 0) {
    timerId = 1;
    clearInterval(timerId);
    timerId = setInterval(() => {
      const updatedCount = waktuUjian.count - 1;
      if (updatedCount >= 0) {
        setwaktuUjian("count", updatedCount);
      } else {
        clearInterval(timerId);
      }
    }, 1000);
  }
};

const stop = () => {
  if (timerId) {
    clearInterval(timerId);
  }
  setwaktuUjian("count", 0);
  console.log("stop", waktuUjian.count);
};

export { waktuUjian, setwaktuUjian, get, run, pause, resume, stop };
