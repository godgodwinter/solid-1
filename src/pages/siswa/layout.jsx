import { Outlet, useNavigate } from "@solidjs/router";
import toast from "solid-toast";
import { onCleanup } from "solid-js";

const fn_periksa_Auth = () => {
  const siswa_token = localStorage.getItem("siswa_token");
  if (!siswa_token) {
    toast.error("Login terlebih dahulu!");
    return false;
  }
  return true;
};

const SiswaLayout = () => {
  const navigate = useNavigate();
  const isAuth = fn_periksa_Auth();
  if (!isAuth) {
    navigate("/", { replace: true }); // Redirect hanya jika otentikasi gagal.
  }
  // Bersihkan pesan toast saat komponen di-unmount.
  // onCleanup(() => {
  //   toast.clear();
  // });

  return (
    <>
      Ini halaman Layout Siswa
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default SiswaLayout;
