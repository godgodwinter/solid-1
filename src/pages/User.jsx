import { useParams } from "@solidjs/router";

const Users = () => {
  const params = useParams();

  const user_id = params.id;
  return <>Ini halaman User {user_id} </>;
};

export default Users;
