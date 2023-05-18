import {KTSVG} from '../../../../../_metronic/helpers'
import {useListView} from '../core/RetrievalDateListViewProvider'
// import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import dayjs from 'dayjs'
import {RootState} from '../../../../store/reducers'

export const RetrievalDateTableBody = (props: any) => {
  const {listData, setListData} = props
  // const navigateTo = useNavigate()
  const {setItemIdForUpdate, setItemIdForDelete} = useListView()

  const selectHandler = (index: number, state: boolean) => {
    let __data = listData[index]
    __data.checked = state
    setListData([...listData.slice(0, index), __data, ...listData.slice(index + 1)])
  }

  const universities = useSelector((state: RootState) => state.admin.universities)

  const getUniversityTitle = (id: number) => {
    let __university = universities.filter((university: any) => university.id === id)
    return __university[0]?.label
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
                  className='text-blue fw-bold fs-6'
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setItemIdForUpdate(index)
                  }}
                >
                  {data.name}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>
                  {getUniversityTitle(data.university_id)}
                </span>
              </td>
              <td className='text-center'>
                <span className='text-dark fw-bold d-block fs-6'>{data.date}</span>
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
