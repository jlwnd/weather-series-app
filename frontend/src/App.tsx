import { useHashRoute } from "./hooks/useHashRoute";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { AdminPage } from "./pages/AdminPage";
import "./App.css";

function App() {
  const { route } = useHashRoute();

  return (
    <div className="app">
      <TopBar />
      {route === "/konfiguracja" ? <AdminPage /> : <Dashboard />}
    </div>
  );
}

export default App;
