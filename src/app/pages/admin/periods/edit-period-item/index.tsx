import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useFormik} from 'formik'
import {RootState} from '../../../../store/reducers'
import {useNavigate} from 'react-router-dom'
import {useSearchParams} from 'react-router-dom'
import {getPeriodItemApi} from '../../../../store/apis/admin'
import {editPeriodItemApi} from '../../../../store/apis/admin'
import {showNotification} from '../../components/notification'

const EditStoragePeriodItemPrice = () => {
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const periodId = searchParams.get('period_id')
  const products = useSelector((state: RootState) => state.admin.products)
  const [periodItems, setPeriodItems] = useState<any[]>([])

  const initialValues = {}

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      setLoading(true)
      editPeriodItemApi({
        data: {
          ...periodItems,
        },
        id: periodId,
      })
        .then((res) => {
          setLoading(false)
          navigateTo('/admin/storage-periods')
          showNotification('success', 'Success', 'Update successfully.')
        })
        .catch((err) => {
          setLoading(false)
          showNotification('error', 'Error', err.data.message)
        })
    },
  })

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  useEffect(() => {
    if (products && products?.length > 0) {
      getPeriodItemApi({
        id: periodId,
      })
        .then((res) => {
          let __periodItems = res.data.result
          setPeriodItems([...__periodItems])
          let __newPeriodItems: any[] = []
          products.forEach((item) => {
            let __state = false
            __periodItems.forEach((element: any) => {
              if (item.id === element.item_id) {
                __state = true
                __newPeriodItems.push({
                  ...element,
                  name: item.display_name,
                  default_price: item.price,
                })
              }
            })
            if (!__state) {
              __newPeriodItems.push({
                id: null,
                item_id: item.id,
                price: null,
                storage_period_id: periodId,
                name: item.display_name,
                default_price: item.price,
              })
            }
          })
          setPeriodItems([...__newPeriodItems])
        })
        .catch((err) => {
          console.log('err')
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  return (
    <>
      <div className='mx-auto mw-800px'>
        <div className=''>
          <div className='mx-5 mx-xl-15'>
            <h2 className='fw-bolder fs-1 px-7'>Storage Period</h2>
          </div>
          <div className='mx-5 mx-xl-15 my-7'>
            <div className='card mb-5 mb-xl-10'>
              <div id='kt_account_profile_details' className='collapse show'>
                <form onSubmit={formik.handleSubmit} noValidate className='form'>
                  <div className='card-body border-top p-9'>
                    {periodItems &&
                      periodItems.length > 0 &&
                      periodItems.map((item, index) => (
                        <div className='row py-4 flex items-center' key={index}>
                          <label className='col-lg-4 col-12 col-form-label required fw-bold fs-6'>
                            {item?.name} original price HKD {item?.default_price}
                          </label>

                          <div className='col-lg-8 col-12 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Enter price'
                              value={item.price ? item.price : ''}
                              onChange={(e) => {
                                let __price = e.target.value
                                if (__price === '') {
                                  item.price = null
                                } else {
                                  item.price = __price
                                }
                                setPeriodItems([...periodItems])
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className='card-footer d-flex justify-content-end py-6 px-9'>
                    <div
                      className='btn btn-secondary mx-6'
                      onClick={() => {
                        navigateTo('/admin/storage-periods')
                      }}
                    >
                      <span className='text-white' style={{display: 'block'}}>
                        Cancel
                      </span>
                    </div>

                    <button type='submit' className='btn btn-primary' disabled={loading}>
                      {!loading && 'Save Changes'}
                      {loading && (
                        <span className='indicator-progress' style={{display: 'block'}}>
                          Please wait...{' '}
                          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditStoragePeriodItemPrice
