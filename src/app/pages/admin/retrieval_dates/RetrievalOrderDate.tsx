import {PageTitle} from '../../../../_metronic/layout/core'
import {ListViewProvider, useListView} from './core/RetrievalDateListViewProvider'
import {RetrievalDateListHeader} from './components/header/RetrievalDateListHeader'
import {KTCard} from '../../../../_metronic/helpers'
import {RetrievalDateTable} from './table/RetrievalDateTable'
import {RetrievalDateAddModal} from './modals/add-modal/RetrievalDateAddModal'
import {RetrievalDateDeleteModal} from './modals/delete-modal/RetrievalDateDeleteModal'
import {LoadingSpinner} from '../components/spinner/LoadingSpinner'

const RetrievalDate = () => {
  const {itemIdForUpdate, itemIdForDelete, isLoading} = useListView()

  return (
    <div style={{marginTop: '-30px'}}>
      <KTCard>
        <RetrievalDateListHeader />
        <RetrievalDateTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <RetrievalDateAddModal />}
      {itemIdForDelete !== undefined && <RetrievalDateDeleteModal />}
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export const RetrievalDateList = () => {
  return (
    <>
      <PageTitle>{'Retrieval Order Date List'}</PageTitle>
      <ListViewProvider>
        <RetrievalDate />
      </ListViewProvider>
    </>
  )
}
