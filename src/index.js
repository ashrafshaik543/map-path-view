import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DisplayRoutes from "./components/DisplayRoutes";
import "mapbox-gl/dist/mapbox-gl.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

const router = createBrowserRouter([
  {
    path: "/route",
    element: <DisplayRoutes />,
  },
  // {
  //   path: "/select-tickets",
  //   element: <SelectTickets />,
  // },
  {
    path: "/",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

    {/* <App /> */}
    {/* <DisplayRoutes /> */}
  </React.StrictMode>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <DisplayRoutes />
//   </React.StrictMode>,
//   document.getElementById("root")
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
