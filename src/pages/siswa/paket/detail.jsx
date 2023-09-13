import { useParams } from "@solidjs/router";
const PaketDetail = () => {
  const params = useParams();
  const paketdetail_id = params.id;
  return (
    <>
      {/* PaketDetail {paketdetail_id} */}
      <div>
        <PaketDetailCard />
      </div>
    </>
  );
};

const PaketDetailCard = () => {
  return (
    <>
      <div v-if="data">
        <div class="p-4">
          <div class="flex m-4 lg:m-6 justify-center">
            <div class="grid-cols-1 w-96">
              <article class="prose">
                <h2>11</h2>
                <h4>Durasi : 11 menit</h4>
                <h4>Jumlah Soal : 11Soal</h4>
              </article>
            </div>
          </div>

          <div class="divider"></div>
          <div
            class=" bg-gray-100 m-1 p-3 rounded-md text-justify w-full"
            v-if="data.instruksi_status == 'Aktif'"
          >
            <article class="prose ">
              <h2>INSTRUKSI :</h2>

              <span class="w-full" v-html="data.instruksi"></span>
            </article>
          </div>
          <div class="divider"></div>
          <div v-if="data.lembar_prasoal_status == 'Aktif'">
            <div class=" bg-gray-100 m-1 p-3 rounded-md text-justify w-full">
              <article class="prose ">
                <h2>LEMBAR PRASOAL :</h2>

                <span class="w-full" v-html="data.lembar_prasoal"></span>
              </article>
            </div>
            <div class="divider"></div>
          </div>
          <div v-if="data.instruksi_pengerjaan_status == 'Aktif'">
            <div class=" bg-gray-100 m-1 p-3 rounded-md text-justify w-full">
              <article class="prose">
                <h2>INSTRUKSI PENGERJAAN :</h2>

                <span class="w-full" v-html="data.instruksi_pengerjaan"></span>
              </article>
            </div>
            <div class="divider"></div>
          </div>
          <div>
            <div class="w-full flex justify-center px-4">
              <button
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
              </button>
              <span>
                {" "}
                <button class="btn btn-lg btn-primary">Daftar</button>
                <button class="btn btn-lg btn-success">Lihat Soal</button>
              </span>
            </div>
          </div>
          <div class="divider"></div>
        </div>
      </div>
    </>
  );
};
export default PaketDetail;
