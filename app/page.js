"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./home/page";
export default function Home() {
  return (
    <div>
      <ToastContainer theme="dark" position="bottom-right" autoClose={5000} />
      <HomePage />
      {/* <BlogList /> */}
      {/* <Footer /> */}
    </div>
  );
}
