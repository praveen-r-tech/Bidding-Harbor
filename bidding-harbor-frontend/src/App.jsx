import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { Navbar } from "./components/layout/Navbar";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;