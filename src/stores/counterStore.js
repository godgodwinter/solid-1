// counterStore.js
import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  count: 0,
});

const increment = () => {
  setState("count", state.count + 1);
};

export { state, increment };
