import "../styles/globals.css";
import "../styles/Calendar.scss";
import Head from "next/head";
import Layout from "../components/layout";
import { QueryClientProvider, QueryClient, useMutation } from "react-query";
import { useEffect } from "react";
import useUserStore from "../stores/useUserStore";
import axios from "axios";
import { API_BASE } from "../constants";
import { api } from "../api";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const setToken = useUserStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const getUser = async (token) => {
      try {
        const response = await api().get(API_BASE + "/api/user/");
        setUser(response.data);
      } catch (error) {
        setToken(undefined);
        window.localStorage.removeItem("token");
      }
    };

    const userToken = window.localStorage.getItem("token");

    if (userToken) {
      setToken(userToken);
      getUser(userToken);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;
