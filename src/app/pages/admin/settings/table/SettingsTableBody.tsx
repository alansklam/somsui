import {KTSVG} from '../../../../../_metronic/helpers'
import {useListView} from '../core/SettingsListViewProvider'
import dayjs from 'dayjs'

export const SettingsTableBody = (props: any) => {
  const {listData, setListData} = props
  const {pagination, setItemIdForUpdate, setItemIdForDelete} = useListView()

  const selectHandler = (index: number, state: boolean) => {
    let __data = listData[index]
    __data.checked = state
    setListData([...listData.slice(0, index), __data, ...listData.slice(index + 1)])
  }

  const getOrderNumber = (index: number) => {
    let __page = pagination.page
    let __perPage = pagination.perPage
    let __result = (__page - 1) * __perPage + index + 1
    return __result
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
                <div className='d-flex align-items-center'>
                  <span className='text-dark fw-bold fs-6'>{getOrderNumber(index)}</span>
                </div>
              </td>
              <td className='text-center'>
                <span
                  className='text-blue fw-bold d-block fs-6'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setItemIdForUpdate(index)
                  }}
                >
                  {data.code}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.value}</span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {dayjs(data.updated_at).format('DD-MM-YYYY HH:mm:ss')}
                </span>
              </td>
              <td>
                <div className='d-flex flex-end flex-shrink-0'>
                  <span
                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1'
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
