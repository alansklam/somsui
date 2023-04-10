import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {useSearchParams} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import {editPromotionApi} from '../../../../../store/apis/admin'
import {editPromotionItemApi} from '../../../../../store/apis/admin'
import {RootState} from '../../../../../store/reducers'
import {showNotification} from '../../../components/notification'
import dayjs from 'dayjs'

type propState = {
  promotionInfo: {
    code: string
    name: string
    effective_from: string
    effective_to: string
    items: any[]
  }
}

const ContentPromotion = (props: propState) => {
  const {promotionInfo} = props
  const [searchParams] = useSearchParams()
  const navigateTo = useNavigate()
  const promotionId = searchParams.get('promotionId')
  const [promotionItems, setPromotionItems] = useState<any[]>([])
  const products = useSelector((state: RootState) => state.admin.products)

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  useEffect(() => {
    if (products && products?.length > 0) {
      let __newPromotionItems: any[] = []
      let __promotionItems = promotionInfo.items
      products.forEach((item) => {
        let __state = false
        __promotionItems.forEach((element: any) => {
          if (item.id === element.item_id) {
            __state = true
            __newPromotionItems.push({
              ...element,
              name: item.display_name,
              default_price: item.price,
            })
          }
        })
        if (!__state) {
          __newPromotionItems.push({
            id: null,
            item_id: item.id,
            price: null,
            promotion_id: promotionId,
            name: item.display_name,
            default_price: item.price,
          })
        }
      })
      setPromotionItems([...__newPromotionItems])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const [loading, setLoading] = useState(false)

  const submitPromotionItem = (e: any) => {
    e.preventDefault()
    setLoading(true)
    editPromotionItemApi({
      data: [...promotionItems],
      id: promotionId,
    })
      .then((res) => {
        setLoading(false)
        navigateTo('/admin/promotions')
      })
      .catch((err) => {
        setLoading(false)
        console.log('err')
      })
  }

  const profileDetailsSchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
    effective_from: Yup.string().required('The minmum storage is required'),
    effective_to: Yup.string().required('The maximum storage is required'),
  })

  const initialValues = promotionInfo

  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      if (dayjs(formik.values.effective_from) > dayjs(formik.values.effective_to)) {
        showNotification('error', 'Error', 'Please fix the dates')
        return
      }
      setLoading(true)
      editPromotionApi({data: values, id: promotionId})
        .then((res) => {
          setLoading(false)
          navigateTo('/admin/promotions')
          showNotification('success', 'Success', 'Update successfully.')
        })
        .catch((err) => {
          setLoading(false)
          showNotification('error', 'Error', err.data.message)
        })
    },
  })

  return (
    <>
      <div className='mx-auto mw-800px'>
        <div className=''>
          <div className='mx-5 mx-xl-15'>
            <h2 className='fw-bolder fs-1 px-7'>Promotion</h2>
          </div>
          <div className='mx-5 mx-xl-15 my-7'>
            <>
              {promotionId && (
                <div className='card-toolbar'>
                  <ul className='nav'>
                    <li className='nav-item'>
                      <a
                        className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                        data-bs-toggle='tab'
                        href='#kt_tab_1'
                      >
                        Basic
                      </a>
                    </li>
                    <li className='nav-item'>
                      <a
                        className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                        data-bs-toggle='tab'
                        href='#kt_tab_2'
                      >
                        Item
                      </a>
                    </li>
                  </ul>
                </div>
              )}

              <div className='card-body py-3'>
                <div className='tab-content'>
                  <div className='tab-pane fade show active' id='kt_tab_1'>
                    <div className='card mb-5 mb-xl-10'>
                      <div id='kt_account_profile_details' className='collapse show'>
                        <form onSubmit={formik.handleSubmit} noValidate className='form'>
                          <div className='card-body border-top p-9'>
                            <div className='row mb-6'>
                              <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                                Code
                              </label>

                              <div className='col-lg-8 fv-row'>
                                <input
                                  type='text'
                                  className='form-control form-control-lg form-control-solid'
                                  placeholder='Code'
                                  {...formik.getFieldProps('code')}
                                />
                                {formik.touched.code && formik.errors.code && (
                                  <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>{formik.errors.code}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='row mb-6'>
                              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                <span className='required'>Name</span>
                              </label>

                              <div className='col-lg-8 fv-row'>
                                <input
                                  type='text'
                                  className='form-control form-control-lg form-control-solid'
                                  placeholder='Name'
                                  {...formik.getFieldProps('name')}
                                />
                                {formik.touched.name && formik.errors.name && (
                                  <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>{formik.errors.name}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='row mb-6'>
                              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                <span className='required'>Expiry date(by)</span>
                              </label>

                              <div className='col-lg-8 fv-row'>
                                <input
                                  type='date'
                                  onKeyDown={(e) => e.preventDefault()}
                                  className='form-control form-control-lg form-control-solid'
                                  placeholder='From'
                                  {...formik.getFieldProps('effective_from')}
                                />
                                {formik.touched.effective_from && formik.errors.effective_from && (
                                  <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                      {formik.errors.effective_from}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className='row mb-6'>
                              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                <span className='required'>Valid(until)</span>
                              </label>

                              <div className='col-lg-8 fv-row'>
                                <input
                                  type='date'
                                  onKeyDown={(e) => e.preventDefault()}
                                  className='form-control form-control-lg form-control-solid'
                                  placeholder='To'
                                  {...formik.getFieldProps('effective_to')}
                                />
                                {formik.touched.effective_to && formik.errors.effective_to && (
                                  <div className='fv-plugins-message-container'>
                                    <div className='fv-help-block'>
                                      {formik.errors.effective_to}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className='card-footer d-flex justify-content-end py-6 px-9'>
                            <span
                              onClick={() => {
                                navigateTo(-1)
                              }}
                              className='btn btn-secondary mx-6'
                            >
                              Cancel
                            </span>
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

                  <div className='tab-pane fade' id='kt_tab_2'>
                    <div className='card mb-5 mb-xl-10'>
                      <div id='kt_promotion_items_details' className='collapse show'>
                        <form noValidate className='form'>
                          <div className='card-body border-top p-9'>
                            {promotionItems &&
                              promotionItems.length > 0 &&
                              promotionItems.map((item, index) => (
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
                                        setPromotionItems([...promotionItems])
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                          </div>

                          <div className='card-footer d-flex justify-content-end py-6 px-9'>
                            <span
                              onClick={() => {
                                navigateTo(-1)
                              }}
                              className='btn btn-secondary mx-6'
                            >
                              Cancel
                            </span>

                            <button
                              type='submit'
                              onClick={submitPromotionItem}
                              className='btn btn-primary'
                              disabled={loading}
                            >
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
          </div>
        </div>
      </div>
    </>
  )
}

export default ContentPromotion
