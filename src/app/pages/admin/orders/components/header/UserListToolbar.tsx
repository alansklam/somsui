import {KTSVG} from '../../../../../../_metronic/helpers'
import {useOrdersListView} from '../../core/OrdersListViewProvider'
import {useNavigate} from 'react-router-dom'

const UsersListToolbar = () => {
  const navigateTo = useNavigate()
  const {setItemIdForUpdate} = useOrdersListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
    navigateTo('/admin/orders/edit')
  }

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <button
        type='button'
        className='btn btn-primary d-flex justify-content-around align-items-center'
        onClick={openAddUserModal}
      >
        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
        Add
      </button>
    </div>
  )
}

export {UsersListToolbar}
