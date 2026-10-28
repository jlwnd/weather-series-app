import { CloudSun } from 'lucide-react'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <CloudSun size={16} strokeWidth={2.2} />
          </span>
          <span className="brand-name">WeatherSeries</span>
        </div>
        <button type="button" className="btn btn-primary">
          Zaloguj
        </button>
      </header>

      <main className="main">
        <div className="page-head">
          <h1>Temperatura w miastach</h1>
        </div>

        <section className="panel placeholder" aria-label="Zawartość w budowie">
          <p>Wykres i tabela pojawią się tutaj.</p>
        </section>
      </main>
    </div>
  )
}

export default App
