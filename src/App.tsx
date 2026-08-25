import { Route, Routes } from 'react-router-dom'
import HomeScan from '@/screens/HomeScan'
import Scanning from '@/screens/Scanning'
import Result from '@/screens/Result'
import PackageMessaging from '@/screens/PackageMessaging'
import IngredientDetail from '@/screens/IngredientDetail'
import ComplianceDetail from '@/screens/ComplianceDetail'
import Alternatives from '@/screens/Alternatives'
import History from '@/screens/History'
import RatingRequested from '@/screens/RatingRequested'
import NotFoundRoute from '@/screens/NotFoundRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScan />} />
      <Route path="/scanning/:barcode" element={<Scanning />} />
      <Route path="/product/:barcode" element={<Result />} />
      <Route path="/product/:barcode/messaging" element={<PackageMessaging />} />
      <Route path="/product/:barcode/ingredients" element={<IngredientDetail />} />
      <Route path="/product/:barcode/compliance" element={<ComplianceDetail />} />
      <Route path="/product/:barcode/alternatives" element={<Alternatives />} />
      <Route path="/not-found/:barcode" element={<RatingRequested />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<NotFoundRoute />} />
    </Routes>
  )
}
