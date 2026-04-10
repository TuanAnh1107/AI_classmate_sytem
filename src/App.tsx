import './App.css'
import { useAppController } from './controllers/useAppController'
import { getHomePageViewModel } from './controllers/homePageController'
import { HomePage } from './views/HomePage'
import { AdminPortalApp } from './views/pages/admin/AdminPortalApp'
import { LecturerPortalApp } from './views/pages/lecturer/LecturerPortalApp'
import { StudentPortalApp } from './views/pages/student/StudentPortalApp'

function App() {
  const route = useAppController()

  if (route.view === 'student') {
    return <StudentPortalApp route={route} />
  }

  if (route.view === 'lecturer') {
    return <LecturerPortalApp route={route} />
  }

  if (route.view === 'admin') {
    return <AdminPortalApp route={route} />
  }

  const viewModel = getHomePageViewModel()
  return <HomePage model={viewModel} />
}

export default App
