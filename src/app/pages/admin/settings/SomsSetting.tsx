import {PageTitle} from '../../../../_metronic/layout/core'
import {ListViewProvider, useListView} from './core/SettingsListViewProvider'
import {SettingsListHeader} from './components/header/SettingsListHeader'
import {KTCard} from '../../../../_metronic/helpers'
import {SettingsTable} from './table/SettingsTable'
import {SettingsAddModal} from './modals/add-modal/SettingsAddModal'
import {SettingsDeleteModal} from './modals/delete-modal/SettingsDeleteModal'
import {LoadingSpinner} from '../components/spinner/LoadingSpinner'

const SomsSetting = () => {
  const {itemIdForUpdate, itemIdForDelete, isLoading} = useListView()

  return (
    <div style={{marginTop: '-30px'}}>
      <KTCard>
        <SettingsListHeader />
        <SettingsTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <SettingsAddModal />}
      {itemIdForDelete !== undefined && <SettingsDeleteModal />}
      {isLoading && <LoadingSpinner />}
    </div>
  )
}

export const SettingsList = () => {
  return (
    <>
      <PageTitle>Soms Settings List</PageTitle>
      <ListViewProvider>
        <SomsSetting />
      </ListViewProvider>
    </>
  )
}
