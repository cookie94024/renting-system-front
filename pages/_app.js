import "../styles/globals.css";
import "../styles/Calendar.scss";
import Head from "next/head";
import Layout from "../components/layout";
import { QueryClientProvider, QueryClient } from "react-query";
import { useEffect } from "react";
import useUserStore from "../stores/useUserStore";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const setToken = useUserStore((state) => state.setToken);

  useEffect(() => {
    const userToken = window.localStorage.getItem("token");

    if (userToken) {
      setToken(userToken);
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
