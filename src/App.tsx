import './App.css'
import CatalogPage from './features/catalog/pages/CatalogPage'
import MovieDetailPage from './features/details/pages/MovieDetailPage'

function App() {

  return (
      <section id="center">
      <div>
        <CatalogPage />
      </div>
       <div>
        <MovieDetailPage />
      </div>
        
      </section>
     
      
  )
}

export default App

 

