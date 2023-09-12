import { useNavigate, useParams } from "@solidjs/router";

const Users = () => {
  // const navigate = useNavigate();
  const params = useParams();
  // navigate("/", { replace: true });

  const user_id = params.id;
  return <>Ini halaman User {user_id} </>;
};

export default Users;
