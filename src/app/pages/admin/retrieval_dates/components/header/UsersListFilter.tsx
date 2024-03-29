import {useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {KTSVG} from '../../../../../../_metronic/helpers'
import {useListView} from '../../core/RetrievalDateListViewProvider'
import {updateFilterData} from '../../../../../store/actions/admin'

const UsersListFilter = () => {
  const dispatch = useDispatch()
  const {filterData, setFilterData, fetchRetrievalDatesFunc} = useListView()
  const isLoading = false

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const applyHandler = () => {
    fetchRetrievalDatesFunc()
    dispatch(updateFilterData(filterData))
  }

  const resetHandler = () => {
    setFilterData({
      retrieval_date: '',
      day: '',
      menu: 'retrieval_date',
    })
  }

  return (
    <>
      {/* begin::Filter Button */}
      <button
        disabled={isLoading}
        type='button'
        className='btn btn-light-primary me-3 d-flex justify-content-around align-items-center'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-start'
      >
        <KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2' />
        Filter
      </button>
      {/* end::Filter Button */}
      {/* begin::SubMenu */}
      <div className='menu menu-sub menu-sub-dropdown w-800px w-md-825px' data-kt-menu='true'>
        {/* begin::Header */}
        <div className='px-7 py-5'>
          <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
        </div>
        {/* end::Header */}

        {/* begin::Separator */}
        <div className='separator border-gray-200'></div>
        {/* end::Separator */}

        {/* begin::Content */}
        <div className='px-7 py-5' data-kt-user-table-filter='form'>
          {/* begin::Input group */}
          <div className='row'>
            <div className='col-lg-6'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Retrieval Date</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Retrieval date'
                    value={filterData.retrieval_date}
                    onChange={(e) => {
                      setFilterData({...filterData, retrieval_date: e.target.value})
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='col-lg-6'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Retrieval Day</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Day'
                    value={filterData.day}
                    onChange={(e) => {
                      setFilterData({...filterData, day: e.target.value})
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* end::Input group */}

          {/* begin::Actions */}
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              disabled={isLoading}
              onClick={resetHandler}
              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
            >
              Reset
            </button>
            <button
              disabled={isLoading}
              type='button'
              onClick={applyHandler}
              className='btn btn-primary fw-bold px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='filter'
            >
              Apply
            </button>
          </div>
          {/* end::Actions */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::SubMenu */}
    </>
  )
}

export {UsersListFilter}
