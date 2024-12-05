import Feature from "../components/Feature";
import Hero from "../components/Hero";
import Layout from "../components/Layout/Layout";
import SeoHead from "../components/SeoHead";

export default function Home() {
  return (
    <>
      <SeoHead title='Anti-Corr' />
      <Layout>
        <Hero />
        <Feature />
      </Layout>
    </>
  );
}
