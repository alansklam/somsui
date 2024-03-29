import {PageTitle} from '../../../../_metronic/layout/core'
import {PaymentsListViewProvider, usePaymentsListView} from './core/PaymentsListViewProvider'
import {PaymentsListHeader} from './components/header/PaymentsListHeader'
import {KTCard} from '../../../../_metronic/helpers'
import {PaymentsTable} from './table/PaymentsTable'
import {PaymentsAddModal} from './modals/add-modal/PaymentsAddModal'
import {PaymentsDeleteModal} from './modals/delete-modal/PaymentsDeleteModal'
import {LoadingSpinner} from '../components/spinner/LoadingSpinner'

const PaymentsListPage = (props: any) => {
  const {paymentRemarkId} = props
  const {itemIdForUpdate, itemIdForDelete, isLoading} = usePaymentsListView()

  return (
    <div style={{marginTop: '-30px'}}>
      <KTCard>
        <PaymentsListHeader />
        <PaymentsTable paymentRemarkId={paymentRemarkId} />
      </KTCard>
      {itemIdForUpdate !== undefined && <PaymentsAddModal />}
      {itemIdForDelete !== undefined && <PaymentsDeleteModal />}
      {/* {clientIdForUpdate !== undefined && <PaymentsClientEditModal /> } */}
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export const PaymentsList = (props: any) => {
  const {paymentRemarkId} = props
  return (
    <>
      <PageTitle>Payments List</PageTitle>
      <PaymentsListViewProvider paymentRemarkId={paymentRemarkId}>
        <PaymentsListPage paymentRemarkId={paymentRemarkId} />
      </PaymentsListViewProvider>
    </>
  )
}
