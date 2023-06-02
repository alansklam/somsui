import {Route, Routes, Navigate} from 'react-router-dom'
import {ErrorsPage} from '../../modules/errors/ErrorsPage'
import {MasterLayout} from '../../../_metronic/layout/MasterLayout'
import {DashboardWrapper} from './dashboard/DashboardWrapper'
import {ClientsList} from './customers/ClientsList'
import {StoragePeriodsList} from './periods/StoragePeriod'
import {PromotionsList} from './promotions/PromotionsList'
import {PaymentsList} from './payments/PaymentsList'
import {OrdersList} from './orders/OrdersList'
import {AdminAuth} from './auth/AdminAuth'
import {RetrievalOrdersList} from './retrieval_orders/RetrievalOrdersList'
import {RetrievalDateList} from './retrieval_dates/RetrievalOrderDate'
import {SettingsList} from './settings/SomsSetting'
import AddCustomer from './customers/add-customer'
import EditCustomer from './customers/edit-customer'
import EditOrder from './orders/edit-order'
import EditStoragePeriodItemPrice from './periods/edit-period-item'
import EditPromotion from './promotions/edit-promotion'
import AddPromotion from './promotions/add-promotion'
import EditRetrievalOrder from './retrieval_orders/edit-retrieval-order'
import {ItemsList} from './items'

const useAuth = () => {
  const adminAuth: any = localStorage.getItem('admin-user')
  // const adminAuth :any = localStorage.getItem("admin-user") ? JSON.parse(localStorage.getItem("admin-user")) : undefined;
  if (adminAuth) {
    return true
  } else {
    return false
  }
}

export const AdminPage = () => {
  const currentAdmin = useAuth()

  return (
    <Routes>
      {currentAdmin ? (
        <>
          <Route path='/auth' element={<Navigate to='/admin/dashboard' />} />
          <Route element={<MasterLayout />}>
            <Route path='/dashboard' element={<DashboardWrapper />} />
            <Route path='/clients'>
              <Route index element={<ClientsList />} />
              <Route path='edit' element={<EditCustomer />} />
              <Route path='add' element={<AddCustomer />} />
            </Route>
            <Route path='/storage-periods'>
              <Route index element={<StoragePeriodsList />} />
              <Route path='edit-item' element={<EditStoragePeriodItemPrice />} />
            </Route>
            <Route path='/items'>
              <Route index element={<ItemsList />} />
              {/* <Route path='' element={<EditStoragePeriodItemPrice />} /> */}
            </Route>
            <Route path='/promotions'>
              <Route index element={<PromotionsList />} />
              <Route path='edit' element={<EditPromotion />} />
              <Route path='add' element={<AddPromotion />} />
            </Route>
            <Route path='/payments'>
              <Route index element={<PaymentsList />} />
              <Route path='normal' element={<PaymentsList paymentRemarkId={1} />} />
              <Route path='retrieval' element={<PaymentsList paymentRemarkId={3} />} />
            </Route>
            <Route path='/orders'>
              <Route index element={<OrdersList />} />
              <Route path='edit' element={<EditOrder />} />
            </Route>
            <Route path='/retrieval-order'>
              <Route index element={<RetrievalOrdersList />} />
              <Route path='edit' element={<EditRetrievalOrder />} />
            </Route>
            <Route path='/retrieval-date'>
              <Route index element={<RetrievalDateList />} />
            </Route>
            <Route path='/settings'>
              <Route index element={<SettingsList />} />
            </Route>
          </Route>
          <Route path='/*' element={<ErrorsPage />} />
        </>
      ) : (
        <>
          <Route path='/auth' element={<AdminAuth />} />
          <Route path='/*' element={<Navigate to='/admin/auth' />} />
        </>
      )}
    </Routes>
  )
}
