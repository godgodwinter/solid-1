import { useNavigate } from "@solidjs/router";

const Users = () => {
  const navigate = useNavigate();
  const goto = () => {
    navigate("/", { replace: true });
  };
  return (
    <>
      Ini halaman 404 User <button onClick={goto}>Back to Home</button>
    </>
  );
};

export default Users;
