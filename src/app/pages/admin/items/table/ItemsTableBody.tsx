import {KTSVG} from '../../../../../_metronic/helpers'
import {useListView} from '../core/ItemsListViewProvider'

export const ItemsTableBody = (props: any) => {
  const {listData, setListData} = props
  const {setItemIdForUpdate, setItemIdForDelete} = useListView()

  const selectHandler = (index: number, state: boolean) => {
    let __data = listData[index]
    __data.checked = state
    setListData([...listData.slice(0, index), __data, ...listData.slice(index + 1)])
  }

  return (
    <>
      {listData.length > 0 ? (
        listData.map((data: any, index: number) => {
          return (
            <tr key={index}>
              <td>
                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                  <input
                    className='form-check-input widget-9-check'
                    type='checkbox'
                    checked={data.checked ? data.checked : false}
                    onChange={(e) => {
                      selectHandler(index, e.target.checked)
                    }}
                  />
                </div>
              </td>
              <td>
                <span
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setItemIdForUpdate(index)
                  }}
                >
                  {data.name}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.category}</span>
              </td>
              <td className='text-left'>
                <span className='text-dark fw-bold d-block fs-6'>{data.description}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.price}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.delivery_fee}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.qr_code}</span>
              </td>
              <td className='text-center'>
                <div className='form-check form-check-custom form-check-danger form-check-solid flex justify-center'>
                  <input
                    className='form-check-input form-check-danger'
                    type='checkbox'
                    checked={data.top_state ? data.top_state : false}
                    readOnly
                  />
                </div>
              </td>
              <td>
                <div className='d-flex justify-content-end flex-shrink-0'>
                  {/* <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                    onClick={(e) => {
                      // navigateTo('edit-item?period_id=' + data.id)
                      setItemIdForUpdate(index)
                    }}
                  >
                    <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-3' />
                  </span> */}
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                    onClick={(e) => {
                      setItemIdForDelete([data.id])
                    }}
                  >
                    <KTSVG path='/media/icons/duotune/general/gen027.svg' className='svg-icon-3' />
                  </span>
                </div>
              </td>
            </tr>
          )
        })
      ) : (
        <tr>
          <></>
        </tr>
      )}
    </>
  )
}
