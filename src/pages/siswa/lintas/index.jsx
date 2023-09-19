import { A, useNavigate, useParams } from "@solidjs/router";
import {
  waktuUjian,
  setwaktuUjian,
  get,
  run,
  pause,
  resume,
  stop,
} from "./waktuUjianStore";
import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import {
  fn_getsoal_dari_mapelAktif,
  setstateUjianLintasStore,
  stateUjianLintasStore,
} from "./prosesUjianStore";
import Api from "@/axios/axios";
import ApiNode from "@/axios/axiosNode";
import {
  fnNumberToAlphabet,
  periksaJawaban,
} from "../../../helpers/BabengFungsi";
import { loaderStore, loader_run } from "./loaderStore";
import FakeLoadingComponent from "./FakeLoadingComponent";
import toast from "solid-toast";

// const do_run_timer = (durasi) => {
//   console.log("cliked btn");
//   setwaktuUjian(durasi);
//   run();
// };

const UjianIndex = () => {
  loader_run(loaderStore.default);
  const navigate = useNavigate();
  const navigateToSoal = (nomerSoal = 1) => {
    navigate(`/siswa/ujian/lintas/${nomerSoal}`, { replace: true });
  };
  const navigateToPaket = (nomerSoal = 1) => {
    navigate(`/siswa/paket`, { replace: true });
  };
  const doRunTimer = (durasi) => {
    run(durasi);
  };
  return (
    <>
      {/* <div>
        {`${waktuUjian.count}`}
        <div className="space-x-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => doRunTimer(60)}
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
        </div>
      </div> */}

      {loaderStore.fakeLoading > 0 ? (
        <FakeLoadingComponent />
      ) : (
        <section className="">
          <div className=" space-y-2">
            <SoalContainer
              navigateToSoal={navigateToSoal}
              navigateToPaket={navigateToPaket}
            />
          </div>
        </section>
      )}
    </>
  );
};

export default UjianIndex;

const SoalContainer = ({ navigateToSoal, navigateToPaket }) => {
  const handleNavigateToSoal = (nomerSoal) => {
    if (typeof navigateToSoal === "function") {
      navigateToSoal(nomerSoal);
    } else {
      console.error("navigateToSoal is not a function");
    }
  };
  const handleNavigateToPaket = () => {
    console.log("clicked");
    if (typeof navigateToPaket === "function") {
      navigateToPaket();
    } else {
      console.error("navigateToPaket is not a function");
    }
  };
  const params = useParams();
  const nomerSoal = params.nomer_soal;
  // const nomerSoalStore = () => stateUjianLintasStore.soal_aktif?.nomerSoal;
  // console.log();

  createEffect(() => {
    if (stateUjianLintasStore.mapel_aktif) {
      fn_getsoal_dari_mapelAktif(nomerSoal);
    }
  });

  return (
    <>
      {stateUjianLintasStore.soal_aktif && waktuUjian.count > 0 ? (
        <SoalUjianComponent
          data={stateUjianLintasStore.soal_aktif}
          navigateToSoal={handleNavigateToSoal}
        />
      ) : (
        <>
          <div>
            <p>"Soal Tidak ditemukan ! atau Mapel Ini telah diselesaikan! "</p>
            <button class="btn btn-secondary" onClick={handleNavigateToPaket}>
              Kembali ke paket
            </button>
          </div>
        </>
      )}
    </>
  );
};

const SoalUjianComponent = ({ data, navigateToSoal }) => {
  const handleNavigateToSoal = (nomerSoal) => {
    scrollToTop();
    if (typeof navigateToSoal === "function") {
      fn_getsoal_dari_mapelAktif(nomerSoal);
      navigateToSoal(nomerSoal);
    } else {
      console.error("navigateToSoal is not a function");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Gunakan "smooth" untuk animasi pergerakan
    });
  };
  // const data = props.data;
  const do_save_jawaban = async (
    itemSoal,
    kode_jawaban,
    soal_id,
    nomerSoal
  ) => {
    scrollToTop();
    loader_run(loaderStore.default);
    // console.log(itemSoal, nomerSoal);
    // itemSoal.kode_jawaban = kode_jawaban;

    // console.log(kode_jawaban);
    try {
      let dataFormSend = {
        kode_jawaban,
        aspekdetail_index: "fn_check_index_mapel_aktif", //!tidak digunakan
        soal_index: nomerSoal - 1, //!tidak digunakan
      };
      // console.log("====================================");
      // console.log(
      //   dataFormSend,
      //   soal_id,
      //   stateUjianLintasStore.mapel_aktif.id,
      //   "tes"
      // );
      // console.log("====================================");
      const response = await ApiNode.post(
        `studiv3/siswa/ujianstudi/vless/paketsoal/${stateUjianLintasStore.mapel_aktif.id}/getsoal/${soal_id}`,
        dataFormSend
      );

      const updatedItemSoal = {
        ...itemSoal,
        kode_jawaban: kode_jawaban,
      };

      setstateUjianLintasStore((prevState) => ({
        ...prevState,
        mapel_aktif: {
          ...prevState.mapel_aktif,
          soal: prevState.mapel_aktif.soal.map((soal) => {
            if (soal.id === soal_id) {
              return updatedItemSoal;
            }
            return soal;
          }),
        },
      }));
      fn_getsoal_dari_mapelAktif(nomerSoal);
      // console.log("====================================");
      // console.log(response);
      // console.log("====================================");
      // console.log("====================================");
      // console.log("berhasil menyimpan jawaban!");
      // console.log("====================================");

      toast.success("Berhasil disimpan!", {
        duration: loaderStore.toastDefault,
      });
    } catch (error) {
      toast.error("Gagal menyimpan!", {
        duration: loaderStore.toastDefault,
      });
      // setTimeout(fnPending, defaultPendingLogin, false);
      console.error(error);
    }
  };
  // console.log(data);

  return (
    <>
      <div>
        <div>
          <div>
            <div class="px-2 pt-2 w-full lg:flex justify-between gap-2 space-y-2">
              <div class="prose space-x-2 px-2">
                <button class="btn btn-outline gap-2">
                  NO SOAL
                  <span class="font-bold text-lg">
                    {data ? data.nomerSoal : "-"}
                  </span>
                </button>
              </div>
              <div class="w-96 pb-0 ">
                <div class=" lg:flex justify-end px-2 space-x-2 ">
                  <button
                    onClick={() =>
                      handleNavigateToSoal(
                        parseInt(
                          stateUjianLintasStore.soal_aktif
                            ? stateUjianLintasStore.soal_aktif.nomerSoal
                            : 1
                        ) - 1
                      )
                    }
                    disabled={
                      parseInt(
                        stateUjianLintasStore.soal_aktif
                          ? stateUjianLintasStore.soal_aktif.nomerSoal
                          : 1
                      ) <= 0
                    }
                    class="btn btn-sm btn-accent"
                  >
                    Sebelumnya
                    {/* {stateUjianLintasStore.soal_aktif.nomerSoal} */}
                    {/* {data ? data.nomerSoal : 1} */}
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateToSoal(
                        parseInt(
                          stateUjianLintasStore.soal_aktif
                            ? stateUjianLintasStore.soal_aktif.nomerSoal
                            : 1
                        ) + 1
                      )
                    }
                    disabled={
                      parseInt(
                        stateUjianLintasStore.soal_aktif
                          ? stateUjianLintasStore.soal_aktif.nomerSoal
                          : 1
                      ) >=
                      stateUjianLintasStore.mapel_aktif.soal.length - 1
                    }
                    class="btn btn-sm btn-info"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>

            <div class="m-4 pb-4 rounded shadow">
              <div class="p-0">
                <div class="card w-full bg-info/10 shadow-xl text-justify">
                  <div class="card-body">
                    <span class=" font-bold ">Pertanyaan : </span>
                    <span
                      class="text-base"
                      innerHTML={data?.soal_pertanyaan}
                    ></span>
                    <div class="divider"></div>
                    <span class="font-extralight text-xs">
                      <span class="font-bold">
                        Jawaban Tersimpan :
                        {/* <span
                          class="text-error font-bold"
                          v-if="buttonSaveDisabled > 0"
                        >
                          Mohon Tunggu !{" "}
                        </span>
                        <span class="text-success font-bold" v-else>
                          Bisa menyimpan!
                        </span> */}
                      </span>
                      <span
                        className="text-sky-500 font-bold
                      "
                      >
                        {" "}
                        {/* Jawaban */}
                        {periksaJawaban(data, data.kode_jawaban)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>{" "}
              <div class="px-4 lg:px-10">
                <For each={data?.pilihanjawaban}>
                  {(item, index) => (
                    <div class="p-4" key={index}>
                      {/* <Show when={buttonSaveDisabled > 0}> */}
                      {/* <div
                        class={`card w-full ${
                          data?.kode_jawaban === item.kode_jawaban
                            ? "bg-slate-500"
                            : "bg-slate-500"
                        } shadow-md hover:shadow-lg text-justify`}
                      >
                        <div class="card-body">
                          <span class=" font-bold ">A . </span>
                          <p class="text-base" innerHTML={item.jawaban}></p>
                        </div>
                      </div> */}
                      {/* </Show> */}
                      {/* <Show when={!buttonSaveDisabled}> */}
                      <div
                        class={`card w-full ${
                          data?.kode_jawaban === item.kode_jawaban
                            ? "bg-info"
                            : "bg-base-200"
                        } shadow-md hover:shadow-lg text-justify`}
                        onClick={() =>
                          do_save_jawaban(
                            data,
                            item.kode_jawaban,
                            data.id,
                            parseInt(data.nomerSoal)
                          )
                        }
                      >
                        <div class="card-body">
                          <span class=" font-bold ">
                            {/* {fnNumberToAlphabet(index)} */}
                            {/* {item.id} */}
                            {item?.kode_abc}.{" "}
                          </span>
                          <p class="text-base" innerHTML={item.jawaban}></p>
                        </div>
                      </div>
                      {/* </Show> */}
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="pb-5">
              <div class="w-full flex justify-end px-4 space-x-2">
                <div class=" lg:flex justify-end px-2 space-x-2 ">
                  <button
                    onClick={() =>
                      handleNavigateToSoal(
                        parseInt(
                          stateUjianLintasStore.soal_aktif
                            ? stateUjianLintasStore.soal_aktif.nomerSoal
                            : 1
                        ) - 1
                      )
                    }
                    disabled={
                      parseInt(
                        stateUjianLintasStore.soal_aktif
                          ? stateUjianLintasStore.soal_aktif.nomerSoal
                          : 1
                      ) <= 0
                    }
                    class="btn btn-sm btn-accent"
                  >
                    Sebelumnya
                    {/* {data ? data.nomerSoal : 1} */}
                  </button>
                  <button
                    onClick={() =>
                      handleNavigateToSoal(
                        parseInt(
                          stateUjianLintasStore.soal_aktif
                            ? stateUjianLintasStore.soal_aktif.nomerSoal
                            : 1
                        ) + 1
                      )
                    }
                    disabled={
                      parseInt(
                        stateUjianLintasStore.soal_aktif
                          ? stateUjianLintasStore.soal_aktif.nomerSoal
                          : 1
                      ) >=
                      stateUjianLintasStore.mapel_aktif.soal.length - 1
                    }
                    class="btn btn-sm btn-info"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div>
          <div class="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="stroke-info flex-shrink-0 w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Error! Task failed : </span>
              <span> Waktu telah habis!</span>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};
