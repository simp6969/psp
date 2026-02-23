"use client";

import { Header } from "./components/Header";
import { ImageHandler } from "./components/ImageHandler";
export default function Login() {
  return (
    <div
      style={{ height: "100vh", width: "100vw" }}
      className=" overflow-x-hidden"
    >
      <Header />
      <ImageHandler />
    </div>
  );
}
