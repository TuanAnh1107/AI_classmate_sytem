import './App.css'
import { getHomePageViewModel } from './controllers/homePageController'
import { HomePage } from './views/HomePage'

function App() {
  const viewModel = getHomePageViewModel()
  return <HomePage model={viewModel} />
}

export default App
