import {useListView} from '../../core/ItemsListViewProvider'
import {ItemsListToolbar} from './ItemsListToolbar'
import {ItemsListGrouping} from './ItemsListGrouping'
import {ItemsListFilter} from './ItemsListFilter'

// import {ItemsListSearchComponent} from './ItemsListSearchComponent'

const ItemsListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0'>
      <div className='card-toolbar'>
        <div className='d-flex justify-content-start align-items-center'>
          {selected.length > 0 ? <ItemsListGrouping /> : <></>}
          <ItemsListFilter />
        </div>
      </div>

      <div className='card-toolbar'>
        <ItemsListToolbar />
      </div>
    </div>
  )
}

export {ItemsListHeader}
