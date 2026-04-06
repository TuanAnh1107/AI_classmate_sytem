import './App.css'
import { useAppController } from './controllers/useAppController'
import { getHomePageViewModel } from './controllers/homePageController'
import { HomePage } from './views/HomePage'
import { StudentPortalApp } from './views/pages/student/StudentPortalApp'

function App() {
  const route = useAppController()

  if (route.view === 'student') {
    return <StudentPortalApp route={route} />
  }

  const viewModel = getHomePageViewModel()
  return <HomePage model={viewModel} />
}

export default App

