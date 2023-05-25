import {PageTitle} from '../../../../_metronic/layout/core'
import {
  RetrievalOrdersListViewProvider,
  useRetrievalOrdersListView,
} from './core/RetrievalOrdersListViewProvider'
import {RetrievalOrdersListHeader} from './components/header/RetrievalOrdersListHeader'
import {KTCard} from '../../../../_metronic/helpers'
import {RetrievalOrdersTable} from './table/RetrievalOrdersTable'
import {RetrievalOrdersDeleteModal} from './modals/delete-modal/RetrievalOrdersDeleteModal'
import {LoadingSpinner} from '../components/spinner/LoadingSpinner'

const RetrievalOrdersListPage = () => {
  const {itemIdForDelete, isLoading} = useRetrievalOrdersListView()

  return (
    <div style={{marginTop: '-30px'}}>
      <KTCard>
        <RetrievalOrdersListHeader />
        <RetrievalOrdersTable />
      </KTCard>

      {/* {clientIdForUpdate !== undefined && <RetrievalOrdersClientEditModal /> } */}
      {/* {retrievalOrderIdForUpdate !== undefined && <RetrievalOrdersAddModal /> } */}
      {itemIdForDelete !== undefined && <RetrievalOrdersDeleteModal />}
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export const RetrievalOrdersList = () => {
  return (
    <>
      <PageTitle>Retrieval Orders List</PageTitle>
      <RetrievalOrdersListViewProvider>
        <RetrievalOrdersListPage />
      </RetrievalOrdersListViewProvider>
    </>
  )
}
