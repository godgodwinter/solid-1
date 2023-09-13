import { render } from "solid-js/web";
import { useField, Form } from "solid-js-form";
import * as Yup from "yup";
import { createEffect, createSignal } from "solid-js";
import { state as counterState, increment } from "../stores/counterStore";
import toast from "solid-toast";
import Api from "@/axios/axios";
import ApiNode from "@/axios/axiosNode";
import { useNavigate } from "@solidjs/router";

const Input = (props) => {
  const { field, form } = useField(props.name);
  const formHandler = form.formHandler;
  const inputType = props.type || "text";

  return (
    <>
      <div class="form-control w-full max-w-xs">
        <label class="label" for={props.name}>
          <span class="label-text">
            {" "}
            {props.label}
            {field.required() ? " *" : ""}
          </span>
        </label>
        <input
          input
          type={inputType} // Menggunakan jenis input yang sudah ditentukan
          name={props.name}
          value={field.value()}
          //@ts-ignore
          use:formHandler
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
        />
        <label class="label">
          <span class="label-text-alt text-red-500 capitalize">
            {field.error()}
          </span>
        </label>
      </div>
    </>
  );
};

const fn_submit = async (values) => {
  try {
    const response = await Api.post("siswa/auth/login", {
      email: values.username,
      password: values.password,
    });
    // // Promise Toast
    if (response.code === 200) {
      const { token } = response;
      localStorage.setItem("siswa_token", token);
      localStorage.setItem("siswa_isLogin", true);
    } else {
      toast.error("Something went wrong!");
    }
    return true;
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  }
};

const FormLogin = ({ navigateToDashboard }) => {
  return (
    <>
      Form Login
      <div className="px-4">
        <Form
          initialValues={{ username: "", password: "" }}
          validation={{
            username: Yup.string().required().min(3),
            password: Yup.string().required().min(3),
          }}
          onSubmit={async (form) => {
            // fn_submit(form.values);
            const isSuccess = await fn_submit(form.values);
            if (isSuccess) {
              toast.success("Login Successfully!");
              navigateToDashboard();
            }
          }}
        >
          <Input name="username" label="Username" />
          <Input name="password" label="Password" type="password" />
          <button type="submit">Submit</button>
        </Form>
      </div>
    </>
  );
};

const [count, setCount] = createSignal(0);
setCount(1);
const currentCount = count();
const doubledCount = () => 2 * count();
const fn_increment_count = () => {
  setCount(2 * count());
};
createEffect(() => console.log("count =", count()));

const Home = () => {
  const notify = () => toast.success("Here is your toast.");
  const [angka] = createSignal(() => counterState.count); //dari store

  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate("/siswa/dashboard", { replace: true });
  };
  return (
    <>
      <button onClick={notify}>Make me a toast</button>
      {/* <Toaster position="top-right" gutter={8} /> */}
      <div>
        <p>Nilai Counter: {angka()}</p>
        <button onClick={increment}>Increment</button>
      </div>
      <div>Ini halaman Home</div>
      <div>
        ---
        {count}|{doubledCount}
        <button className="btn btn-info" onClick={fn_increment_count}>
          Click
        </button>
        ---
      </div>
      <div>
        <FormLogin navigateToDashboard={navigateToDashboard} />
      </div>
    </>
  );
};

export default Home;
