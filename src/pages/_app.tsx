import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layout/layout";
import SmoothScroll from "@/components/ui/smooth-scroll";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SmoothScroll>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SmoothScroll>
  );
}
