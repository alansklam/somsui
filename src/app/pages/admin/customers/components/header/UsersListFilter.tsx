import {useEffect} from 'react'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {KTSVG} from '../../../../../../_metronic/helpers'
import {useClientsListView} from '../../core/ClientsListViewProvider'

const UsersListFilter = () => {
  const {filterData, setFilterData, fetchClientsFunc} = useClientsListView()
  const isLoading = false

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const applyHandler = () => {
    fetchClientsFunc()
  }

  const resetHandler = () => {
    setFilterData({
      name: '',
      email: '',
      contact: '',
      wechat: '',
      student_id: '',
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
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Name</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Name'
                    value={filterData.name}
                    onChange={(e) => {
                      setFilterData({...filterData, name: e.target.value})
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Email</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Email'
                    value={filterData.email}
                    onChange={(e) => {
                      setFilterData({...filterData, email: e.target.value})
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='col-lg-6'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Contact</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Contact'
                    value={filterData.contact}
                    onChange={(e) => {
                      setFilterData({...filterData, contact: e.target.value})
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Student ID</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Student ID'
                    value={filterData.student_id}
                    onChange={(e) => {
                      setFilterData({...filterData, student_id: e.target.value})
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>Wechat ID</label>
                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Wechat ID'
                    value={filterData.wechat}
                    onChange={(e) => {
                      setFilterData({...filterData, wechat: e.target.value})
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
