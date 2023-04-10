import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {MinusOutlined, PlusOutlined} from '@ant-design/icons'
import {RootState} from '../../../../../store/reducers'
import dayjs from 'dayjs'
import {editRetrievalOrderApi} from '../../../../../store/apis/admin'
import {useNavigate} from 'react-router-dom'
import {showNotification} from '../../../components/notification'

type propState = {
  retrievalOrderInfo: {
    empty_return_date_other: string
    empty_return_time_other: string
    checkout_location_other: string
    checkout_date_other: string
    checkout_time_other: string
    special_instruction: string
    paid_fee: string
  }
  retrievalOrder: any
}

const ContentRetrievalOrder = (props: propState) => {
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  const {retrievalOrderInfo, retrievalOrder} = props
  const navigateTo = useNavigate()

  const products = useSelector((state: RootState) => state.admin.products)
  const paymentMethod = useSelector((state: RootState) => state.admin.ref.paymentMethod)
  const paymentStatus = useSelector((state: RootState) => state.admin.ref.paymentStatus)
  const [retrievalOrderItems, setRetrievalOrderItems] = useState<any[]>([])
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [paymentStatusId, setPaymentStatusId] = useState('')
  const [lumpSum, setLumpSum] = useState('')
  const [specialInstruction, setSpecialInstruction] = useState('')
  const [walkup, setWalkup] = useState(0)
  const [floorFee, setFloorFee] = useState('')
  const [nextdayState, setNextdayState] = useState(false)
  const [qrCode, setQrCode] = useState('')

  const profileDetailsSchema = Yup.object().shape({
    checkout_location_other: Yup.string()
      .required('Name is required')
      .min(3, 'Name should be 3 numbers at least')
      .max(50, 'Name should be 50 numbers at maximum'),
    checkout_date_other: Yup.date().required('Checkout Date is required'),
    checkout_time_other: Yup.string().required('Checkout Time is required'),
    empty_return_date_other: Yup.date().required('Empty return Date is required'),
    empty_return_time_other: Yup.string().required('Empty return Time is required'),
    paid_fee: Yup.string().required('Paid fee is required.'),
  })

  const initialValues = retrievalOrderInfo

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      editRetrievalOrderApi({
        data: {
          items: retrievalOrderItems,
          ...values,
          special_instruction: specialInstruction,
          payment_status_id: paymentStatusId,
          payment_type_id: paymentMethodId,
          walkup: walkup,
          total_fee: lumpSum,
          remark_qr_code: qrCode,
        },
        id: retrievalOrder.id,
      })
        .then((res) => {
          setLoading(false)
          navigateTo(-1)
          showNotification('success', 'Success', 'Update successfully.')
        })
        .catch((err) => {
          setLoading(false)
          showNotification('success', 'Success', err.data.message)
        })
    },
  })

  useEffect(() => {
    let __retrievalOrderItems: any[] = []
    let __orderItems = retrievalOrder.order.items
    __orderItems.forEach((item: any) => {
      if (item.item_category === 'box') {
        retrievalOrder.items.forEach((element: any) => {
          if (element.item_id === item.item_id) {
            __retrievalOrderItems.push({
              id: element.id,
              retrieval_order_id: element.retrieval_order_id,
              item_id: element.item_id,
              price: element.item_delivery_fee,
              quantity: element.item_qty,
              limit_quantity: item.item_qty,
              name: element.item_display_name,
            })
          }
        })
      }
    })
    setRetrievalOrderItems([...__retrievalOrderItems])
    setPaymentMethodId(retrievalOrder.payment_type_id)
    setPaymentStatusId(retrievalOrder.payment_status_id)
    setSpecialInstruction(
      retrievalOrder.special_instruction ? retrievalOrder.special_instruction : ''
    )
    setWalkup(retrievalOrder.walkup)
    setFloorFee(retrievalOrder.floor)
    setLumpSum(retrievalOrder.total_fee)
    setQrCode(retrievalOrder.remark_qr_code ? retrievalOrder.remark_qr_code : '')
    let __checkout = dayjs(retrievalOrder.checkout_date_other)
    let __emptyreturn = dayjs(retrievalOrder.empty_return_date_other)
    if (Math.ceil(__emptyreturn.diff(__checkout, 'day', true)) >= 1) {
      setNextdayState(true)
    }
  }, [retrievalOrder])

  useEffect(() => {
    let __subTotalFee = 0

    retrievalOrderItems.forEach((item) => {
      __subTotalFee += (parseInt(item.quantity) + 1) * parseFloat(item.price)
    })
    retrievalOrderItems.forEach((item) => {
      if (walkup !== 0 && !isNaN(walkup) && item.quantity > 0) {
        __subTotalFee += walkup * parseFloat(floorFee)
      }
    })
    if (nextdayState) __subTotalFee += 116
    let __totalFee = __subTotalFee
    setLumpSum(__totalFee.toFixed(2))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, walkup, retrievalOrderItems])

  return (
    <div className='mx-auto mw-1000px'>
      <div className=''>
        <div className='mx-5 mx-xl-15'>
          <h2 className='fw-bolder fs-1 px-7'>Retrieval Order</h2>
        </div>
        <div className='mx-5 mx-xl-15 my-7'>
          <div className='card mb-5 mb-xl-10'>
            <div id='kt_account_profile_details' className='collapse show'>
              <form onSubmit={formik.handleSubmit} noValidate className='form'>
                <div className='card-body border-top p-9'>
                  <div className='row'>
                    <div className='col-lg-6' style={{paddingRight: '30px'}}>
                      <div className='row py-4 flex items-center'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>Code</label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            disabled
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Code'
                            value={retrievalOrder.code}
                          />
                        </div>
                      </div>

                      <div className='row py-4 flex items-center'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>Name</label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            disabled
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Name'
                            value={retrievalOrder.client.name}
                          />
                        </div>
                      </div>

                      <div className='row py-4'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Pickup location</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Pickup location'
                            {...formik.getFieldProps('checkout_location_other')}
                          />
                          {formik.touched.checkout_location_other &&
                            formik.errors.checkout_location_other && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.checkout_location_other}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className='row py-4'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Pickup date</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='date'
                            min={dayjs(retrievalOrder.order.checkin_date_other).format(
                              'YYYY-MM-DD'
                            )}
                            max={dayjs(formik.values.checkout_date_other).format('YYYY-MM-DD')}
                            onKeyDown={(e) => e.preventDefault()}
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Pickup date'
                            {...formik.getFieldProps('checkout_date_other')}
                          />
                          {formik.touched.checkout_date_other && formik.errors.checkout_date_other && (
                            <div className='fv-plugins-message-container'>
                              <div className='fv-help-block'>
                                {formik.errors.checkout_date_other}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='row py-4'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Pickup time</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Pickup time'
                            {...formik.getFieldProps('checkout_time_other')}
                          />
                          {formik.touched.checkout_time_other && formik.errors.checkout_time_other && (
                            <div className='fv-plugins-message-container'>
                              <div className='fv-help-block'>
                                {formik.errors.checkout_time_other}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='row py-4'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Empty Box return date</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='date'
                            min={dayjs(formik.values.empty_return_date_other).format('YYYY-MM-DD')}
                            max={dayjs(retrievalOrder.order.storage_expired_date).format(
                              'YYYY-MM-DD'
                            )}
                            onKeyDown={(e) => e.preventDefault()}
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Empty Box return date'
                            {...formik.getFieldProps('empty_return_date_other')}
                          />
                          {formik.touched.empty_return_date_other &&
                            formik.errors.empty_return_date_other && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.empty_return_date_other}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className='row py-4'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Empty Box return time</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Empty Box return time'
                            {...formik.getFieldProps('empty_return_time_other')}
                          />
                          {formik.touched.empty_return_time_other &&
                            formik.errors.empty_return_time_other && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.empty_return_time_other}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className='row py-4 flex items-center'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          Special requirement
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='text'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Special requirement'
                            value={specialInstruction}
                            onChange={(e) => {
                              setSpecialInstruction(e.target.value)
                            }}
                          />
                        </div>
                      </div>

                      <div className='row py-4 flex items-center'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>Floor</label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='number'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='floor'
                            value={walkup}
                            onChange={(e) => {
                              setWalkup(parseInt(e.target.value))
                            }}
                          />
                        </div>
                      </div>

                      <div className='row py-4'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>QR Code</label>
                        <div className='col-lg-8 fv-row'>
                          <textarea
                            className='form-control form-control-lg form-control-solid h-100px'
                            placeholder='QR Code'
                            value={qrCode}
                            onChange={(e) => {
                              setQrCode(e.target.value)
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className='col-lg-6' style={{paddingLeft: '30px'}}>
                      <>
                        {retrievalOrderItems?.length > 0 &&
                          retrievalOrderItems.map((item: any, index) => (
                            <div className='row py-4 border-bottom' key={index}>
                              <label className='col-lg-4 col-form-label fw-bold fs-6'>Name</label>
                              <div className='col-lg-8 fv-row mb-3'>
                                <select
                                  className='form-select form-select-solid'
                                  value={item.item_id}
                                  disabled
                                  onChange={(e) => {}}
                                >
                                  <option value={'default'}>Select item's name</option>
                                  {products &&
                                    products?.length > 0 &&
                                    products.map((element: any, index: number) => (
                                      <option value={element.id} key={index}>
                                        {element.display_name}
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                Quantity
                              </label>
                              <div className='col-lg-8'>
                                <div className='input-group mb-3'>
                                  <div className='input-group-prepend'>
                                    <span
                                      className='input-group-text btn btn-secondary'
                                      onClick={(e) => {
                                        let __qty = parseInt(item.quantity) - 1
                                        if (__qty < 0) __qty = 0
                                        item.quantity = __qty.toString()
                                        setRetrievalOrderItems([...retrievalOrderItems])
                                      }}
                                    >
                                      <MinusOutlined />
                                    </span>
                                  </div>
                                  <input
                                    type='number'
                                    className='form-control form-control-lg form-control-solid text-center'
                                    value={item.quantity}
                                    onChange={(e) => {
                                      item.quantity = e.target.value
                                      setRetrievalOrderItems([...retrievalOrderItems])
                                    }}
                                  />
                                  <div className='input-group-append'>
                                    <span
                                      className='input-group-text btn btn-secondary'
                                      onClick={(e) => {
                                        let __qty = parseInt(item.quantity) + 1
                                        if (__qty >= item.limit_quantity)
                                          __qty = item.limit_quantity
                                        item.quantity = __qty.toString()
                                        setRetrievalOrderItems([...retrievalOrderItems])
                                      }}
                                    >
                                      <PlusOutlined />
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                Delivery fee
                              </label>
                              <div className='col-lg-8 fv-row'>
                                <input
                                  type='number'
                                  className='form-control form-control-lg form-control-solid'
                                  placeholder='Enter delivery fee'
                                  value={item.price}
                                  onChange={(e) => {
                                    let __price = parseFloat(e.target.value)
                                    if (__price < 0) __price = 0
                                    item.price = __price.toString()
                                    setRetrievalOrderItems([...retrievalOrderItems])
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </>

                      <div className='row py-4 flex items-center'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Payment Method</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <select
                            className='form-select form-select-solid'
                            value={paymentMethodId}
                            onChange={(e) => {
                              setPaymentMethodId(e.target.value)
                            }}
                          >
                            <option value=''>Select payment method</option>
                            {paymentMethod &&
                              paymentMethod.length > 0 &&
                              paymentMethod.map((element: any, index: number) => (
                                <option value={element.id} key={index}>
                                  {element.description}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className='row py-4 flex items-center'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Payment status</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <select
                            className='form-select form-select-solid'
                            value={paymentStatusId}
                            onChange={(e) => {
                              setPaymentStatusId(e.target.value)
                            }}
                          >
                            <option value=''>Select payment status</option>
                            {paymentStatus &&
                              paymentStatus.length > 0 &&
                              paymentStatus.map((element: any, index: number) => (
                                <option value={element.id} key={index}>
                                  {element.description}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className='row py-4 flex items-center'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className=''>Lump sum</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='string'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Lump sum'
                            value={lumpSum}
                            onChange={(e) => {
                              setLumpSum(e.target.value)
                            }}
                            disabled
                          />
                        </div>
                      </div>

                      <div className='row py-4'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Paid amount</span>
                        </label>
                        <div className='col-lg-8 fv-row'>
                          <input
                            type='string'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Paid amount'
                            {...formik.getFieldProps('paid_fee')}
                          />
                          {formik.touched.paid_fee && formik.errors.paid_fee && (
                            <div className='fv-plugins-message-container'>
                              <div className='fv-help-block'>{formik.errors.paid_fee}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='card-footer d-flex justify-content-end py-6 px-9'>
                  <span
                    className='btn btn-secondary mx-7'
                    onClick={(e) => {
                      navigateTo(-1)
                    }}
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
      </div>
    </div>
  )
}

export default ContentRetrievalOrder
