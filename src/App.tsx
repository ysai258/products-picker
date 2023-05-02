import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ProductsList from "./Screens/Home";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#008060",
          borderRadius: 4,
          boxShadow: "none",
          colorBgTextHover: "",
        },
      }}
    >
      <ProductsList />
    </ConfigProvider>
  );
}

export default App;
