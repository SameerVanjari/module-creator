import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import EditModule from "./pages/EditModule";
import Signin from "./pages/Signin";
import { Toaster } from "react-hot-toast";

interface Props {
  component: JSX.Element;
}

const ComponentWithLayout = ({ component }: Props) => (
  <Layout>{component}</Layout>
);

function App() {
  const queryClient = new QueryClient();
  const token = localStorage.getItem("token");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        {token ? (
          <Layout>
            <Routes>
              <Route Component={Home} path="/" />
              <Route Component={Modules} path="/modules/:name" />
              <Route Component={EditModule} path="/modules/edit/:name" />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route Component={Signin} path="/" />
          </Routes>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
