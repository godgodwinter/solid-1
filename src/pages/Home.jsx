import { render } from "solid-js/web";
import { useField, Form } from "solid-js-form";
import * as Yup from "yup";
import { createEffect, createSignal } from "solid-js";
import { state as counterState, increment } from "../stores/counterStore";
import toast from "solid-toast";
import Api from "@/axios/axios";
import ApiNode from "@/axios/axiosNode";
import { useNavigate } from "@solidjs/router";
import logo from "../assets/solid.svg";

const Input = (props) => {
  const { field, form } = useField(props.name);
  const formHandler = form.formHandler;
  const inputType = props.type || "text";

  return (
    <>
      <div class="form-control w-full ">
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
          class="input input-bordered w-full "
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
          {/* <button type="submit">Submit</button> */}

          <div class="form-control mt-6">
            <button class="btn btn-primary w-full" type="submit">
              Login
            </button>
          </div>
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
// createEffect(() => console.log("count =", count()));

const Home = () => {
  const notify = () => toast.success("Here is your toast.");
  const [angka] = createSignal(() => counterState.count); //dari store

  const navigate = useNavigate();
  const navigateToDashboard = () => {
    navigate("/siswa/dashboard", { replace: true });
  };
  return (
    <>
      <div class="relative py-16 bg-gradient-to-br  bg-primary text-primary-content min-h-screen">
        <div class="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-40">
          <div class="m-auto md:w-8/12 lg:w-6/12 xl:w-6/12">
            <div class="rounded-xl bg-white shadow-xl">
              <div class="p-6 sm:p-16">
                <div class="space-y-4">
                  <img
                    src={logo}
                    loading="lazy"
                    class="w-10"
                    alt="tailus logo"
                  />
                  <h2 class="mb-8 text-2xl text-cyan-900 font-bold">
                    Sistem Ujian <br /> Lintas Bidang Studi
                  </h2>
                </div>
                <div class="mt-16 grid space-y-4">
                  <FormLogin navigateToDashboard={navigateToDashboard} />
                </div>

                <div class="mt-32 space-y-4 text-gray-600 text-center sm:-mb-8">
                  <p class="text-xs">
                    Copyright © 2023 - <strong>v.s-0</strong>.23.09.13
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
