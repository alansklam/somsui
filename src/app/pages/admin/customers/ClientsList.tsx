import {PageTitle} from '../../../../_metronic/layout/core'
import {ClientsListViewProvider, useClientsListView} from './core/ClientsListViewProvider'
import {ClientsListHeader} from './components/header/ClientsListHeader'
import {KTCard} from '../../../../_metronic/helpers'
import {ClientsTable} from './table/ClientsTable'
import {ClientsDeleteModal} from './modals/delete-modal/ClientsDeleteModal'
import {LoadingSpinner} from '../components/spinner/LoadingSpinner'

const ClientsListPage = () => {
  const {itemIdForDelete, isLoading} = useClientsListView()

  return (
    <div style={{marginTop: '-30px'}}>
      <KTCard>
        <ClientsListHeader />
        <ClientsTable />
      </KTCard>
      {itemIdForDelete !== undefined && <ClientsDeleteModal />}
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export const ClientsList = () => {
  return (
    <>
      <PageTitle>Customer List</PageTitle>
      <ClientsListViewProvider>
        <ClientsListPage />
      </ClientsListViewProvider>
    </>
  )
}
