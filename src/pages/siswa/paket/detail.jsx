import Api from "@/axios/axios";
import ApiNode from "@/axios/axiosNode";
import { useNavigate, useParams } from "@solidjs/router";
import {
  waktuUjian,
  setwaktuUjian,
  get,
  run,
  pause,
  resume,
  stop,
} from "../lintas/waktuUjianStore";
import {
  QueryClient,
  QueryClientProvider,
  createQuery,
} from "@tanstack/solid-query";

import { Match, Show, Switch, createEffect } from "solid-js";

import { formatDateToYYYYMMDDHHIIStr } from "../../../helpers/BabengFungsi";
import { get_PeriksaUjianAktif } from "../layout";
import { loaderStore, loader_run } from "../lintas/loaderStore";
import FakeLoadingComponent from "../lintas/FakeLoadingComponent";
import toast from "solid-toast";
import { setIsSidebarOpen } from "../layoutStore";

const VITE_API_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:11000/";

const queryClient = new QueryClient({
  defaultConfig: {
    cacheTime: 60000, // Cache data selama 60 detik (1 menit)
  },
});

const fn_fetcher = async (key) => {
  try {
    const siswaToken = localStorage.getItem("siswa_token");
    const headers = {};
    if (siswaToken) {
      headers["Authorization"] = `Bearer ${siswaToken}`;
    }
    const response = await fetch(
      `${VITE_API_URL}api/v2/studiv3/siswa/ujianstudi/vless/aspekdetail/${key}/detail`,
      {
        headers,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const PaketsoalDetailData = ({ key, navigateToSoal }) => {
  const handleNavigateToSoal = () => {
    if (typeof navigateToSoal === "function") {
      navigateToSoal();
    } else {
      console.error("navigateToSoal is not a function");
    }
  };
  const query = createQuery(
    () => ["repoDataPaketDetail", key],
    () => fn_fetcher(key)
  );
  // const navigateToSoal = props.navigateToSoal;
  // console.log("repoDataPaketDetail:", query.data);
  return (
    <Switch>
      <Match when={query.isLoading}>
        {" "}
        <div className="space-y-2">
          <LoadingComponent />
        </div>
      </Match>
      <Match when={query.isError}>
        <FailedComponent message={query.error.message} />
      </Match>
      <Match when={query.isSuccess}>
        <PaketDetailCard
          data={query.data?.data}
          navigateToSoal={handleNavigateToSoal}
        />
      </Match>
    </Switch>
  );
};

const PaketsoalDetail = ({ key, navigateToSoal }) => {
  const handleNavigateToSoal = () => {
    if (typeof navigateToSoal === "function") {
      navigateToSoal();
    } else {
      console.error("navigateToSoal is not a function");
    }
  };
  return (
    <QueryClientProvider client={queryClient}>
      <PaketsoalDetailData key={key} navigateToSoal={handleNavigateToSoal} />
    </QueryClientProvider>
  );
};

const PaketDetail = () => {
  loader_run(loaderStore.default);
  const params = useParams();
  const paketdetail_id = params.id;
  const navigate = useNavigate();
  const navigateToSoal = (nomerSoal = 1) => {
    navigate(`/siswa/ujian/lintas/${nomerSoal}`, { replace: true });
  };

  return (
    <>
      {loaderStore.fakeLoading > 0 ? (
        <FakeLoadingComponent />
      ) : (
        <div>
          {" "}
          <PaketsoalDetail
            key={paketdetail_id}
            navigateToSoal={navigateToSoal}
          />
        </div>
      )}

      {/* PaketDetail {paketdetail_id} */}
      {/* <div>
        <PaketsoalDetail key={paketdetail_id} navigateToSoal={navigateToSoal} />
      </div> */}
    </>
  );
};

const PaketDetailCard = ({ data, navigateToSoal }) => {
  const handleNavigateToSoal = () => {
    if (typeof navigateToSoal === "function") {
      navigateToSoal();
    } else {
      console.error("navigateToSoal is not a function");
    }
  };
  // const data = props.data;
  const params = useParams();
  const paketdetail_id = params.id;
  // const navigateToSoal = props.navigateToSoal;

  const do_Daftar = async () => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Gunakan "smooth" untuk animasi pergerakan
      });
    };
    if (confirm("Apakah anda yakin memulai ujian mapel ini?")) {
      const timer = waktuUjian.count;
      if (timer < 1) {
        let tgl_mulai = new Date(); //!unused after 231123 diganti dari servere

        let waktuTambahan = data?.waktu;
        // let waktuTambahan = 15;
        let tgl_selesai = new Date(tgl_mulai.getTime() + waktuTambahan * 60000); // 60000 milidetik dalam satu menit //!unused after 231123 diganti dari servere

        // const tgl_mulaiFormatted = formatDateToYYYYMMDDHHIIStr(tgl_mulai);
        // const tgl_selesaiFormatted = formatDateToYYYYMMDDHHIIStr(tgl_selesai);
        const tgl_mulaiFormatted = tgl_mulai; //!unused after 231123 diganti dari servere
        const tgl_selesaiFormatted = tgl_selesai; //!unused after 231123 diganti dari servere

        // console.log(
        //   `${tgl_mulaiFormatted},${tgl_selesaiFormatted},${tgl_mulai},${waktuTambahan}`
        // );
        // console.log("Tanggal Mulai:", tgl_mulaiFormatted);
        // console.log("Tanggal Selesai:", tgl_selesaiFormatted);
        // console.log("Mulai");
        try {
          let dataFormSend = {
            tgl_mulai: tgl_mulaiFormatted,
            tgl_selesai: tgl_selesaiFormatted,
            aspekdetail_index: paketdetail_id,
          };
          const response = await ApiNode.post(
            `studiv3/siswa/ujianstudi/vless/paketsoal/${paketdetail_id}/do_mulai`,
            dataFormSend
          );
          // console.log(response);
          get_PeriksaUjianAktif();
          handleNavigateToSoal(1);
          // await get_PeriksaUjianAktif();
          // console.log(response);
          // setTimeout(fnPending, 2000, false);
          // await setTimeout(btnLoading.value = false, 2000, 'argumen example');

          scrollToTop();
          toast.success("Ujian berhasil dimulai!", {
            duration: loaderStore.toastDefault,
          });
          setIsSidebarOpen("sidebar", false);
          return true;
        } catch (error) {
          // setTimeout(fnPending, defaultPendingLogin, false);
          console.error(error);
        }
        // setTimeout(fnPending, defaultPendingLogin, false);
      } else {
        toast.error("Ujian gagal dimulai!", {
          duration: loaderStore.toastDefault,
        });
        toast.error("Ujian gagal dimulai!", {
          duration: loaderStore.toastDefault,
        });
        console.log("====================================");
        console.log("Gagal daftar,Selesaikan dahulu paket sebelumnya.");
        console.log("====================================");
      }
    }
  };

  const doRunTimer = (durasi) => {
    run(durasi);
  };
  return (
    <>
      <div>
        {/* {`${waktuUjian.count}`} */}
        {/* <div className="space-x-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => doRunTimer(5)}
          >
            RUN
          </button>
          <button className="btn btn-light btn-sm" onClick={pause}>
            Pause
          </button>
          <button className="btn btn-warning btn-sm" onClick={resume}>
            Resume
          </button>
          <button className="btn btn-error btn-sm" onClick={stop}>
            Stop
          </button>
        </div> */}
      </div>
      <div>
        <div class="p-4">
          <div class="flex m-4 lg:m-6 justify-center">
            <div class="grid-cols-1 w-96">
              <article class="prose md:max-w-screen-xl">
                <h2>{data?.aspek_detail_nama}</h2>
                <h4>Durasi : {data?.waktu} menit</h4>
                <h4>Jumlah Soal : {data?.soal_jml} Soal</h4>
              </article>
            </div>
          </div>

          <div class="divider"></div>
          <Show when={data.instruksi_status === "Aktif"}>
            <div class=" bg-gray-100 m-1 p-3 rounded-md text-justify w-full">
              <article class="prose md:max-w-screen-xl ">
                <h2>INSTRUKSI :</h2>

                <span class="w-full" innerHTML={data?.instruksi}></span>
              </article>
            </div>
            <div class="divider"></div>
          </Show>

          <Show when={data.lembar_prasoal_status === "Aktif"}>
            <div class="bg-gray-100 m-1 p-3 rounded-md text-justify w-full">
              <article class="prose md:max-w-screen-xl">
                <h2>LEMBAR PRASOAL :</h2>
                <span class="w-full" innerHTML={data?.lembar_prasoal}></span>
              </article>
            </div>
            <div class="divider"></div>
          </Show>
          <Show when={data.instruksi_pengerjaan_status === "Aktif"}>
            <div>
              <div class=" bg-gray-100 m-1 p-3 rounded-md text-justify w-full">
                <article class="prose md:max-w-screen-xl">
                  <h2>INSTRUKSI PENGERJAAN :</h2>

                  <span
                    class="w-full"
                    innerHTML={data?.instruksi_pengerjaan}
                  ></span>
                </article>
              </div>
              <div class="divider"></div>
            </div>
          </Show>

          <Show when={waktuUjian.count < 1}>
            <div>
              <div class="w-full flex justify-center px-4">
                {/* <button
                  class="btn btn-lg bg-slate-500"
                  v-if="btnLoading"
                  disabled
                >
                  {" "}
                  <img
                    src="@/assets/img/animate/native-loader-2.svg"
                    class="text-white fill-current px-2"
                    alt=""
                  />
                  Processing ...
                </button> */}
                <span>
                  {" "}
                  <button class="btn btn-lg btn-primary" onClick={do_Daftar}>
                    Daftar
                  </button>
                  {/* <button class="btn btn-lg btn-success">Lihat Soal</button> */}
                </span>
              </div>
            </div>
          </Show>
          <div class="divider"></div>
        </div>
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
export default PaketDetail;
