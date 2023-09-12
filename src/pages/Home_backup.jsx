import { render } from "solid-js/web";
import { useField, Form } from "solid-js-form";
import * as Yup from "yup";
import { createEffect, createSignal } from "solid-js";
import { state as counterState, increment } from "../stores/counterStore";
import toast, { Toaster } from "solid-toast";

const Input = (props) => {
  const { field, form } = useField(props.name);
  const formHandler = form.formHandler;

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
          name={props.name}
          value={field.value()}
          //@ts-ignore
          use:formHandler
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
        />
        <label class="label">
          <span class="label-text-alt text-red-500">{field.error()}</span>
        </label>
      </div>
    </>
  );
};

const FormLogin = () => {
  const fn_submit = (values) => {
    console.log(values.username, values.password, "aaa");
  };
  return (
    <>
      Form Login
      <div className="px-4">
        <Form
          initialValues={{ username: "", password: "" }}
          validation={{
            username: Yup.string().required(),
            password: Yup.string().required(),
          }}
          onSubmit={async (form) => {
            fn_submit(form.values);
          }}
        >
          <Input name="username" label="Username" />
          <Input name="password" label="Password" />
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
  return (
    <>
      <button onClick={notify}>Make me a toast</button>
      <Toaster position="top-right" gutter={8} />
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
        <FormLogin />
      </div>
    </>
  );
};

export default Home;
