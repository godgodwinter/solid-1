import { Outlet } from "@solidjs/router";

const Users = () => {
  return (
    <>
      Ini halaman Layout User
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default Users;
