import { RouterProvider } from 'react-router'

import { AppProviders } from './AppProviders'
import { router } from './routes'

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
