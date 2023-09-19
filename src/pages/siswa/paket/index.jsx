import { A, useNavigate } from "@solidjs/router";
import ApiNode from "@/axios/axiosNode";
import {
  fn_get_sisa_waktu,
  isExamFinished,
} from "../../../helpers/BabengFungsi";
import {
  Match,
  Switch,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import { loaderStore, loader_run } from "../lintas/loaderStore";
import { FakeLoadingComponent } from "../lintas/FakeLoadingComponent";
import { setIsSidebarOpen } from "../layoutStore";

const VITE_API_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:11000/";

export const get_Mapel = async () => {
  // console.log("load getMapel Async");
  try {
    const response = await ApiNode.get(
      `studiv3/siswa/ujianstudi/vless/get_aspekdetail_tersedia`
    );
    if (response.hasOwnProperty("data")) {
      if (response.data) {
        // console.log(response);
        return response.data;
      }
    } else {
      return null;
    }
  } catch (error) {
    // Toast.danger("Error", `Gagal menghubungkan ke Server!`);
    console.error(error);
    return false;
  }
};

const PaketsoalData = () => {
  const [dataRes, setDataRes] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(false);

  const getData = async () => {
    // console.log("load getData");
    try {
      const res = await get_Mapel();
      if (res) {
        setDataRes(res);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };
  // Panggil getData saat komponen ini dipasang.
  getData();

  // Membersihkan sinyal saat komponen di-unmount (opsional).
  onCleanup(() => {
    setDataRes(null);
    setLoading(false);
    setError(false);
  });
  return (
    <>
      {() => (
        <Switch>
          <Match when={loading()}>
            <div className="space-y-2">
              {/* Tampilkan komponen loading */}
              <LoadingComponent />
              <SkeletonPaket />
            </div>
          </Match>
          <Match when={error()}>
            {/* Tampilkan pesan error jika terjadi kesalahan */}
            <FailedComponent message="Gagal mendapatkan data!" />
          </Match>
          <Match when={dataRes() && dataRes().length > 0}>
            {/* Tampilkan komponen PaketCard1 jika dataRes ada dan memiliki data */}
            <PaketCard1 data={dataRes()} />
          </Match>
          <Match>
            {/* Tampilkan pesan error jika dataRes tidak ada atau kosong */}
            <FailedComponent message={`Paket Tidak Tersedia`} />
          </Match>
        </Switch>
      )}
    </>
  );
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth", // Gunakan "smooth" untuk animasi pergerakan
  });
};
const Paketsoal = () => {
  // console.log("aa");
  return <PaketsoalData />;
};

export const MyContextPaketIndex = createContext();
const PaketIndex = () => {
  const navigate = useNavigate();
  const contextValue = {
    navigateToSoal: (nomerSoal = 1) => {
      scrollToTop();
      setIsSidebarOpen("sidebar", false);
      navigate(`/siswa/ujian/lintas/${nomerSoal}`, { replace: true });
    },
  };
  loader_run(loaderStore.default);
  // createEffect(() => {
  //   // Jalankan loader_run sekali
  //   loader_run(loaderStore.default); // Ganti dengan durasi yang sesuai
  //   // onCleanup(() => {
  //   //   // Hapus efek ini pada unmount komponen
  //   // });
  // });
  return (
    <>
      <MyContextPaketIndex.Provider value={contextValue}>
        {loaderStore.fakeLoading > 0 ? (
          <FakeLoadingComponent />
        ) : (
          // Jika fakeLoading = 0, tampilkan konten
          <div>
            <Paketsoal />
          </div>
        )}
      </MyContextPaketIndex.Provider>
    </>
  );
};

const PaketCard1 = (props) => {
  const data = props.data;
  return (
    <>
      <div class="w-full mx-2 max-w-sm md:max-w-md lg:max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 ">
        <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl  uppercase">
          Jumlah Paket : {data.length} SOAL
        </h5>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
          Pilih paket yang tersedia / belum dikerjakan.
        </p>
        <ul class="my-4 space-y-3">
          <For each={data} fallback={<div>Loading...</div>}>
            {(item, index) => {
              let ComponentToLoad;

              if (
                item.tgl_selesai !== null &&
                fn_get_sisa_waktu(item.tgl_selesai).detik > 0
              ) {
                ComponentToLoad = (
                  // <PaketItemComponent_Belum data={item} no={index() + 1} />
                  <PaketItemComponent_Proses data={item} no={index() + 1} />
                );
              } else if (
                item.tgl_selesai !== null &&
                fn_get_sisa_waktu(item.tgl_selesai).detik < 1
              ) {
                ComponentToLoad = (
                  <>
                    {/* {isExamFinished(item?.tgl_selesai)} */}
                    {/* <PaketItemComponent_Proses data={item} no={index() + 1} /> */}
                    <PaketItemComponent_Selesai data={item} no={index() + 1} />
                  </>
                );
              } else {
                ComponentToLoad = (
                  <>
                    {/* {`${isExamFinished(item?.tgl_selesai)}`} */}
                    <PaketItemComponent_Belum data={item} no={index() + 1} />
                    {/* <PaketItemComponent_Selesai data={item} no={index() + 1} /> */}
                  </>
                );
              }

              return ComponentToLoad;
            }}
          </For>
        </ul>
      </div>
    </>
  );
};

const PaketItemComponent_Selesai = (props) => {
  const item = props.data;
  const no = props.no;
  return (
    <li>
      <span class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-400  group hover:shadow ">
        <svg
          aria-hidden="true"
          class="h-5"
          viewBox="0 0 292 292"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z"
            fill="#3259A5"
          />
          <path
            d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z"
            fill="white"
          />
        </svg>
        <span class="flex-1 ml-3 whitespace-nowrap">
          {no}. {item?.aspek_detail_nama}
        </span>
        <span class="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
          Status : Selesai
        </span>
      </span>
    </li>
  );
};
const PaketItemComponent_Proses = (props) => {
  const context = useContext(MyContextPaketIndex);
  const item = props.data;
  const no = props.no;
  const handleNavigateToSoal = () => {
    context.navigateToSoal();
  };
  return (
    <li>
      <a
        href="#"
        class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow "
        onClick={handleNavigateToSoal}
      >
        <svg
          aria-hidden="true"
          svg
          class="h-5"
          viewBox="0 0 75.591 75.591"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <linearGradient
            id="a"
            gradientTransform="matrix(0 -54.944 -54.944 0 23.62 79.474)"
            gradientUnits="userSpaceOnUse"
            x2="1"
          >
            <stop offset="0" stop-color="#ff1b2d" />
            <stop offset=".3" stop-color="#ff1b2d" />
            <stop offset=".614" stop-color="#ff1b2d" />
            <stop offset="1" stop-color="#a70014" />
          </linearGradient>
          <linearGradient
            id="b"
            gradientTransform="matrix(0 -48.595 -48.595 0 37.854 76.235)"
            gradientUnits="userSpaceOnUse"
            x2="1"
          >
            <stop offset="0" stop-color="#9c0000" />
            <stop offset=".7" stop-color="#ff4b4b" />
            <stop offset="1" stop-color="#ff4b4b" />
          </linearGradient>
          <g transform="matrix(1.3333 0 0 -1.3333 0 107.2)">
            <path
              d="m28.346 80.398c-15.655 0-28.346-12.691-28.346-28.346 0-15.202 11.968-27.609 26.996-28.313.44848-.02115.89766-.03314 1.3504-.03314 7.2574 0 13.876 2.7289 18.891 7.2137-3.3227-2.2036-7.2074-3.4715-11.359-3.4715-6.7504 0-12.796 3.3488-16.862 8.6297-3.1344 3.6999-5.1645 9.1691-5.3028 15.307v1.3349c.13821 6.1377 2.1683 11.608 5.302 15.307 4.0666 5.2809 10.112 8.6297 16.862 8.6297 4.1526 0 8.038-1.2679 11.361-3.4729-4.9904 4.4643-11.569 7.1876-18.786 7.2144-.03596 0-.07122.0014-.10718.0014z"
              fill="url(#a)"
            />
            <path
              d="m19.016 68.025c2.6013 3.0709 5.9607 4.9227 9.631 4.9227 8.2524 0 14.941-9.356 14.941-20.897s-6.6891-20.897-14.941-20.897c-3.6703 0-7.0297 1.851-9.6303 4.922 4.0659-5.2809 10.111-8.6297 16.862-8.6297 4.1519 0 8.0366 1.2679 11.359 3.4715 5.802 5.1906 9.4554 12.735 9.4554 21.133 0 8.397-3.6527 15.941-9.4533 21.131-3.3234 2.205-7.2088 3.4729-11.361 3.4729-6.7504 0-12.796-3.3488-16.862-8.6297"
              fill="url(#b)"
            />
          </g>
        </svg>
        <span class="flex-1 ml-3 whitespace-nowrap">
          {no}. {item.aspek_detail_nama}
        </span>
        <span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
          Status : Proses
        </span>
      </a>
    </li>
  );
};
const PaketItemComponent_Belum = (props) => {
  const item = props.data;
  const no = props.no;
  return (
    <li>
      <A href={`/siswa/paket/detail/${item.id}`}>
        <div class="border-2 border-slate-200 rounded-sm bg-gray-50 hover:bg-gray-100 group hover:shadow">
          <div class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg  ">
            <svg
              aria-hidden="true"
              class="h-5"
              viewBox="0 0 292 292"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M145.7 291.66C226.146 291.66 291.36 226.446 291.36 146C291.36 65.5541 226.146 0.339844 145.7 0.339844C65.2542 0.339844 0.0400391 65.5541 0.0400391 146C0.0400391 226.446 65.2542 291.66 145.7 291.66Z"
                fill="#3259A5"
              />
              <path
                d="M195.94 155.5C191.49 179.08 170.8 196.91 145.93 196.91C117.81 196.91 95.0204 174.12 95.0204 146C95.0204 117.88 117.81 95.0897 145.93 95.0897C170.8 95.0897 191.49 112.93 195.94 136.5H247.31C242.52 84.7197 198.96 44.1797 145.93 44.1797C89.6904 44.1797 44.1104 89.7697 44.1104 146C44.1104 202.24 89.7004 247.82 145.93 247.82C198.96 247.82 242.52 207.28 247.31 155.5H195.94Z"
                fill="white"
              />
            </svg>
            <span class="flex-1 ml-3 whitespace-nowrap">
              {no}. {item.aspek_detail_nama}
            </span>{" "}
            <button className="btn btn-sm btn-primary">Pilih</button>
          </div>
          <div class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg  ">
            <div>
              {" "}
              <span class="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ">
                Status : Belum Dikerjakan
              </span>
              <span class="flex-1 ml-3 whitespace-nowrap text-slate-600">
                {item.waktu} Menit
              </span>{" "}
            </div>
            {/* <button className="btn btn-sm btn-primary">Pilih</button> */}
          </div>
        </div>
      </A>
    </li>
  );
};

const SkeletonPaket = () => {
  return (
    <>
      <div
        role="status"
        class="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <span class="sr-only">Loading...</span>
      </div>
    </>
  );
};

const LoadingComponent = () => {
  return (
    <>
      <button
        disabled
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
      >
        <svg
          aria-hidden="true"
          role="status"
          class="inline w-4 h-4 mr-3 text-white animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
        Loading...
      </button>
    </>
  );
};

const FailedComponent = (props) => {
  const message = props.message;
  return (
    <>
      <div
        class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 "
        role="alert"
      >
        <svg
          class="flex-shrink-0 inline w-4 h-4 mr-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
        </svg>
        <span class="sr-only">Info</span>
        <div>
          <span class="font-medium">Error!</span> {message}
        </div>
      </div>
    </>
  );
};
export default PaketIndex;
