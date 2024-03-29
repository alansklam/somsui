import {useState, useEffect} from 'react'
import {KTSVG} from '../../../../../../_metronic/helpers'
import {useRetrievalOrdersListView} from '../../core/RetrievalOrdersListViewProvider'
import {deleteRetrievalOrderApi} from '../../../../../store/apis/admin'
import {showNotification} from '../../../components/notification'

export const RetrievalOrdersDeleteModal = () => {
  const {itemIdForDelete, setItemIdForDelete, fetchOrdersFunc} = useRetrievalOrdersListView()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  const onDeleteHandler = () => {
    setLoading(true)
    deleteRetrievalOrderApi({id: itemIdForDelete})
      .then((res) => {
        setLoading(false)
        setItemIdForDelete(undefined)
        showNotification('success', 'Success', 'Deleted successfully.')
        fetchOrdersFunc()
      })
      .catch((err) => {
        showNotification('error', 'Error', 'Failed delete.')
      })
  }

  return (
    <>
      <div
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {/* begin::Modal dialog */}
        <div className='modal-dialog modal-dialog-centered mw-450px'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            <div className='modal-header'>
              {/* begin::Modal title */}
              <h2 className='fw-bolder fs-1'>Delete Retrieval Order</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div
                className='btn btn-icon btn-sm btn-active-icon-primary'
                data-kt-users-modal-action='close'
                onClick={() => setItemIdForDelete(undefined)}
                style={{cursor: 'pointer'}}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
              <p className='fw-bolder fs-1 text-center mb-15'>Confirm delete?</p>
              <div className='d-flex justify-content-around'>
                <button className='btn btn-danger' onClick={onDeleteHandler}>
                  {!loading && 'Delete'}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...{' '}
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
                <button className='btn btn-light' onClick={() => setItemIdForDelete(undefined)}>
                  Cancel
                </button>
              </div>
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className='modal-backdrop fade show'></div>
      {/* end::Modal Backdrop */}
    </>
  )
}
