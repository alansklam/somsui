import {useRetrievalOrdersListView} from '../../core/RetrievalOrdersListViewProvider'
import {UsersListToolbar} from './UserListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {UsersListFilter} from './UsersListFilter'

// import {UsersListSearchComponent} from './UsersListSearchComponent'

const RetrievalOrdersListHeader = () => {
  const {selected} = useRetrievalOrdersListView()
  return (
    <div className='card-header border-0'>

      <div className='card-toolbar'>
          <div className='d-flex justify-content-start align-items-center'>
            {selected.length > 0 ? <UsersListGrouping /> : <></>}
            <UsersListFilter />
          </div>
      </div>

      <div className='card-toolbar'>
        <UsersListToolbar />
      </div>

      
    </div>
  )
}

export {RetrievalOrdersListHeader}