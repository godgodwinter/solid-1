import { createSignal } from "solid-js";
import { state as counterState } from "../stores/counterStore";

const Users = () => {
  const [angka] = createSignal(() => counterState.count);
  return (
    <>
      Ini halaman users
      <p>Nilai Counter: {angka()}</p>
    </>
  );
};

export default Users;
