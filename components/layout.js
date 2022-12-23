import Header from "./header";
import Footer from "./footer";
import Cart from "./Cart";

export default function Layout(props) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 container px-4 py-6 mx-auto md:px-6 md:py-12">
        {props.children}
      </main>

      <Footer />
      <Cart />
    </div>
  );
}
