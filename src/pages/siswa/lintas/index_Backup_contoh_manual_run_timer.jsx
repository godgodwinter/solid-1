import { A, useParams } from "@solidjs/router";
import {
  waktuUjian,
  setwaktuUjian,
  get,
  run,
  pause,
  resume,
  stop,
} from "./waktuUjianStore";
import { createEffect, createSignal, onCleanup } from "solid-js";
import {
  fn_getsoal_dari_mapelAktif,
  stateUjianLintasStore,
} from "./prosesUjianStore";

// const do_run_timer = (durasi) => {
//   console.log("cliked btn");
//   setwaktuUjian(durasi);
//   run();
// };

const UjianIndex = () => {
  const doRunTimer = (durasi) => {
    run(durasi);
  };
  return (
    <>
      <div>
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
      </div>
      <section className="">
        <div className=" space-y-2">
          <SoalContainer />
        </div>
      </section>
    </>
  );
};

export default UjianIndex;

const SoalContainer = () => {
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
      {stateUjianLintasStore.soal_aktif ? (
        <SoalUjianComponent data={stateUjianLintasStore.soal_aktif} />
      ) : (
        ""
      )}
    </>
  );
};

const SoalUjianComponent = (props) => {
  const data = props.data;
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
                <div class="lg:flex justify-end px-2 space-x-2">
                  {/* <button
                  class="btn btn-sm btn-accent"
                  onClick={handleSebelumnyaClick}
                  disabled={nomerSoal() === 1} // Disable jika nomer soal sudah 1
                >
                  Sebelumnya
                </button>
                <button
                  class="btn btn-sm btn-info"
                  onClick={handleSelanjutnyaClick}
                  disabled={
                    nomerSoal() === stateUjianLintasStore.mapel_aktif?.soal
                      ? stateUjianLintasStore.mapel_aktif?.soal?.length + 1
                      : 1
                  } // Disable jika nomer soal sudah maksimum (contoh: 10)
                >
                  Selanjutnya
                </button> */}
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
                        Status tombol simpan :
                        <span
                          class="text-error font-bold"
                          v-if="buttonSaveDisabled > 0"
                        >
                          Mohon Tunggu !{" "}
                          {/* <img
                          src="@/assets/img/animate/native-loader-2.svg"
                          class="text-white fill-current px-2"
                          alt=""
                        /> */}
                        </span>
                        <span class="text-success font-bold" v-else>
                          Bisa menyimpan!
                        </span>
                      </span>
                      <span>Jawaban</span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="px-4 lg:px-10" v-if="data?.pilihanjawaban">
                <div class="p-4" v-for="item, index in data.pilihanjawaban">
                  <span v-if="buttonSaveDisabled > 0">
                    <div
                      class="card w-full bg-slate-500 shadow-md hover:shadow-lg text-justify"
                      v-if="data?.kode_jawaban == item.kode_jawaban"
                    >
                      <div class="card-body">
                        <span class=" font-bold ">A . </span>
                        <p class="text-base" v-html="item.jawaban"></p>
                      </div>
                    </div>
                    <div
                      class="card w-full bg-slate-500 shadow-md hover:shadow-lg text-justify "
                      v-else
                    >
                      <div class="card-body">
                        <span class=" font-bold ">AAA . </span>

                        <p class="text-base" v-html="item.jawaban"></p>
                      </div>
                    </div>
                  </span>
                  <span>
                    <div
                      class="card w-full bg-info shadow-md hover:shadow-lg text-justify"
                      v-if="data?.kode_jawaban == item.kode_jawaban"
                    >
                      <div class="card-body">
                        <span class=" font-bold ">AA. </span>
                        <p class="text-base"></p>
                      </div>
                    </div>
                    <div
                      class="card w-full bg-base-200 shadow-md hover:shadow-lg text-justify "
                      v-else
                    >
                      <div class="card-body">
                        <span class=" font-bold ">1. </span>
                        <p class="text-base">jawaban</p>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            <div class="pb-5">
              <div class="w-full flex justify-end px-4 space-x-2">
                <button class="btn btn-sm btn-accent">Sebelumnya</button>
                <button class="btn btn-sm btn-info">Selanjutnya </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
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
        </div>
      </div>
    </>
  );
};
