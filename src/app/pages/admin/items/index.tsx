import {PageTitle} from '../../../../_metronic/layout/core'
import {ListViewProvider, useListView} from './core/ItemsListViewProvider'
import {ItemsListHeader} from './components/header/ItemsListHeader'
import {KTCard} from '../../../../_metronic/helpers'
import {ItemsTable} from './table/ItemsTable'
import {ItemsAddModal} from './modals/add-modal/ItemsAddModal'
import {ItemsDeleteModal} from './modals/delete-modal/ItemsDeleteModal'
import {ItemsEditModal} from './modals/edit-modal/ItemsEditModal'
import {LoadingSpinner} from '../components/spinner/LoadingSpinner'

const ItemsListPage = () => {
  const {itemIdForUpdate, itemIdForDelete, itemIdForEdit, isLoading} = useListView()

  return (
    <div style={{marginTop: '-30px'}}>
      <KTCard>
        <ItemsListHeader />
        <ItemsTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <ItemsAddModal />}
      {itemIdForDelete !== undefined && <ItemsDeleteModal />}
      {itemIdForEdit !== undefined && <ItemsEditModal />}
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export const ItemsList = () => {
  return (
    <>
      <PageTitle>{'Item List'}</PageTitle>
      <ListViewProvider>
        <ItemsListPage />
      </ListViewProvider>
    </>
  )
}
