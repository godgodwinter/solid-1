// import moment from "moment/min/moment-with-locales";
// import localization from "moment/locale/id";
// moment.updateLocale("id", localization);

export function formatDateToYYYYMMDDHHIIStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatSecondsToMinutesAndSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes}:${String(remainingSeconds).padStart(
    2,
    "0"
  )}`;
  return formattedTime;
}

export function isExamFinished(tgl_mulai, tgl_selesai) {
  const currentDate = new Date();
  const tglMulai = new Date(tgl_mulai);
  const tglSelesai = new Date(tgl_selesai);

  return currentDate > tglSelesai;
}

// export const fn_get_sisa_waktu = (tgl_selesai) => {
//   try {
//     let result = {
//       detik: 0,
//       menit: 0,
//       now: null,
//       selesai: null,
//     };
//     let selesai = moment(tgl_selesai);
//     let now = moment();
//     let duration = moment.duration(selesai.diff(now));
//     result.detik = parseInt(duration.asSeconds().toFixed(0));
//     result.menit = parseFloat(duration.asMinutes().toFixed(2));
//     result.now = now;
//     result.selesai = selesai;
//     // result = parseInt(Date.parse(tgl_selesai)) - parseInt(Date.parse(moment().format("YYYY-MM-DD H:i:s")));
//     // console.log(result);
//     // const response = await Siswa.findOne({ where: { id }, include: kelas });
//     return result;
//   } catch (error) {
//     console.log(error.message);
//   }
// };
export const fn_get_sisa_waktu = (tgl_selesai) => {
  try {
    const result = {
      detik: 0,
      menit: 0,
      now: null,
      selesai: null,
    };

    const selesai = new Date(tgl_selesai);
    const now = new Date();
    const diffMilliseconds = selesai - now;

    if (diffMilliseconds > 0) {
      result.detik = Math.floor(diffMilliseconds / 1000);
      result.menit = parseFloat((diffMilliseconds / (1000 * 60)).toFixed(2));
      result.now = now;
      result.selesai = selesai;
    }

    return result;
  } catch (error) {
    console.log(error.message);
  }
};

export const periksaJawaban = (soal, kode_jawaban) => {
  let result = "-";
  for (const [index, item] of soal.pilihanjawaban.entries()) {
    if (item.kode_jawaban === kode_jawaban) {
      return fnNumberToAlphabet(index + 1);
    }
  }
  return result;
};

export const fnNumberToAlphabet = (num) => {
  if (isNaN(num)) return NaN;
  return (num + 9).toString(36).toUpperCase();
};
