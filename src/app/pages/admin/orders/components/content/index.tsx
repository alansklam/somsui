import {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {RootState} from '../../../../../store/reducers'
import {MinusOutlined, PlusOutlined} from '@ant-design/icons'
import {editOrderApi} from '../../../../../store/apis/admin'
import dayjs from 'dayjs'
import {useNavigate} from 'react-router-dom'
import {showNotification} from '../../../components/notification'

type propState = {
  orderInfo: {
    emptyout_location_other: string
    emptyout_date_other: string
    emptyout_time_other: string
    checkin_location_other: string
    checkin_date_other: string
    checkin_time_other: string
    checkout_location_other: string
    checkout_date_other: string
    checkout_time_other: string
    special_instruction: string
    paid_fee: string
  }
  order: any
}

const ContentOrder = (props: propState) => {
  const {orderInfo, order} = props
  const navigateTo = useNavigate()
  const products = useSelector((state: RootState) => state.admin.ref.orderItems)
  const paymentMethod = useSelector((state: RootState) => state.admin.ref.paymentMethod)
  const paymentStatus = useSelector((state: RootState) => state.admin.ref.paymentStatus)
  const orderStatus = useSelector((state: RootState) => state.admin.ref.orderStatus)
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [paymentStatusId, setPaymentStatusId] = useState('')
  const [orderStatusId, setOrderStatusId] = useState('')
  const [specialInstruction, setSpecialInstruction] = useState('')
  const [lumpSum, setLumpSum] = useState('')
  const [storageMonth, setStorageMonth] = useState('')
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [newItemsList, setNewItemsList] = useState<any[]>([])
  const [qrCode, setQrCode] = useState('')

  const profileDetailsSchema = Yup.object().shape({
    emptyout_location_other: Yup.string()
      .required('Name is required')
      .min(3, 'Name 3 symbols')
      .max(50, 'Name 50 symbols'),
    emptyout_date_other: Yup.date().required('Date is required'),
    emptyout_time_other: Yup.string().required('Time is required'),
    checkin_location_other: Yup.string()
      .required('Name is required')
      .min(3, 'Name 3 symbols')
      .max(50, 'Name 50 symbols'),
    checkin_date_other: Yup.date().required('Date is required'),
    checkin_time_other: Yup.string().required('Time is required'),
    checkout_location_other: Yup.string()
      .required('Name is required')
      .min(3, 'Name 3 symbols')
      .max(50, 'Name 50 symbols'),
    checkout_date_other: Yup.date().required('Date is required'),
    checkout_time_other: Yup.string().required('Time is required'),
    paid_fee: Yup.string().required('This field is required.'),
  })

  const initialValues = orderInfo

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      editOrderApi({
        data: {
          ...values,
          items: orderItems,
          order_status_id: orderStatusId,
          payment_type_id: paymentMethodId,
          payment_status_id: paymentStatusId,
          special_instruction: specialInstruction,
          storage_month: storageMonth,
          total_fee: lumpSum,
          remark_qrcode: qrCode,
        },
        id: order.id,
      })
        .then((res) => {
          setLoading(false)
          navigateTo('/admin/orders?uid=90')
          showNotification('success', 'Success', 'Update successfully.')
        })
        .catch((err) => {
          setLoading(false)
          showNotification('error', 'Error', 'Failed update.')
        })
    },
  })

  useEffect(() => {
    if (order?.items) {
      let __items: any[] = []
      order.items.forEach((item: any) => {
        __items.push({
          id: item.item_id,
          name: item.item_display_name,
          item_id: item.id,
          order_id: item.order_id,
          quantity: item.item_qty,
          price: item.item_price,
          category: item.item_category,
          added_item: false,
        })
      })
      setOrderItems(__items)
    }
    setOrderStatusId(order.order_status_id)
    setPaymentMethodId(order.payment_type_id)
    setPaymentStatusId(order.payment_status_id)
    setSpecialInstruction(order.special_instruction ? order.special_instruction : '')
    setLumpSum(order.total_fee)
    setQrCode(order.remark_qrcode ? order.remark_qrcode : '')
  }, [order])

  useEffect(() => {
    if (products && products?.length > 0) {
      let __newItemsList = products.filter((element: any) => {
        let __state = false
        order.items.forEach((item: any) => {
          if (element.id === item.item_id) __state = true
        })
        if (!__state) {
          return element
        } else {
          return undefined
        }
      })
      setNewItemsList(__newItemsList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  useEffect(() => {
    let __subTotalFee = 0
    let __packageFee = 0
    let __months = parseInt(storageMonth)
    orderItems.forEach((item) => {
      if (item.category === 'box') {
        __subTotalFee += parseFloat(item.price) * parseInt(item.quantity)
      } else if (item.category === 'bag') {
        __packageFee += parseFloat(item.price) * parseInt(item.quantity)
      }
    })
    if (formik.values.checkin_date_other && formik.values.checkout_date_other) {
      let __checkin = dayjs(formik.values.checkin_date_other)
      let __checkout = dayjs(formik.values.checkout_date_other)
      __months = Math.ceil(__checkout.diff(__checkin, 'month', true))
      //   __months = Math.ceil((__checkout.getTime() - __checkin.getTime()) / (1000 * 3600 * 24 * 30))
      setStorageMonth(__months.toString())
    }
    let __totalFee = (__subTotalFee * __months + __packageFee).toFixed(2)
    setLumpSum(__totalFee.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, orderItems])

  return (
    <div>
      <div className='mx-auto mw-1000px'>
        <div className=''>
          <div className='mx-5 mx-xl-15'>
            <h2 className='fw-bolder fs-1 px-7'>Order</h2>
          </div>
          <div className='mx-5 mx-xl-15 my-7'>
            <div className='card mb-5 mb-xl-10'>
              <div id='kt_account_profile_details' className='collapse show'>
                <form onSubmit={formik.handleSubmit} noValidate className='form'>
                  <div className='card-body border-top p-9'>
                    <div className='row'>
                      <div className='col-lg-6 px-8'>
                        <div className='row py-4 flex items-center'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>The code</label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='text'
                              disabled
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Code'
                              value={order?.code}
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
                              value={order?.client?.name}
                            />
                          </div>
                        </div>

                        <div className='row py-4'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Empty box location</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Empty box location'
                              {...formik.getFieldProps('emptyout_location_other')}
                            />
                            {formik.touched.emptyout_location_other &&
                              formik.errors.emptyout_location_other && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors.emptyout_location_other}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className='row py-4 flex'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Empty box date</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='date'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Empty box date'
                              {...formik.getFieldProps('emptyout_date_other')}
                            />
                            {formik.touched.emptyout_date_other &&
                              formik.errors.emptyout_date_other && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors.emptyout_date_other}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className='row py-4 flex'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Empty box time</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='string'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Empty box time'
                              {...formik.getFieldProps('emptyout_time_other')}
                            />
                            {formik.touched.emptyout_time_other &&
                              formik.errors.emptyout_time_other && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors.emptyout_time_other}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className='row py-4 flex'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Storage location</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Storage location'
                              {...formik.getFieldProps('checkin_location_other')}
                            />
                            {formik.touched.checkin_location_other &&
                              formik.errors.checkin_location_other && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors.checkin_location_other}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className='row py-4 flex'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Storage date</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='date'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Storage date'
                              {...formik.getFieldProps('checkin_date_other')}
                            />
                            {formik.touched.checkin_date_other && formik.errors.checkin_date_other && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.checkin_date_other}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='row py-4 flex'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Storage time</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='text'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Storage time'
                              {...formik.getFieldProps('checkin_time_other')}
                            />
                            {formik.touched.checkin_time_other && formik.errors.checkin_time_other && (
                              <div className='fv-plugins-message-container'>
                                <div className='fv-help-block'>
                                  {formik.errors.checkin_time_other}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className='row py-4 flex'>
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

                        <div className='row py-4 flex'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Pickup date</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='date'
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Pickup date'
                              {...formik.getFieldProps('checkout_date_other')}
                            />
                            {formik.touched.checkout_date_other &&
                              formik.errors.checkout_date_other && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors.checkout_date_other}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <div className='row py-4 flex'>
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
                            {formik.touched.checkout_time_other &&
                              formik.errors.checkout_time_other && (
                                <div className='fv-plugins-message-container'>
                                  <div className='fv-help-block'>
                                    {formik.errors.checkout_time_other}
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
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className='required'>Order status</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <select
                              className='form-select form-select-solid'
                              value={orderStatusId}
                              onChange={(e) => {
                                setOrderStatusId(e.target.value)
                              }}
                            >
                              <option>Select order status</option>
                              {orderStatus &&
                                orderStatus.length > 0 &&
                                orderStatus.map((element: any, index: number) => (
                                  <option value={element.id} key={index}>
                                    {element.description}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        <div className='row py-4 flex'>
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

                      <div className='col-lg-6 px-8'>
                        <>
                          {orderItems?.length > 0 &&
                            orderItems.map((item: any, index) => (
                              <div className='row py-4 border-bottom' key={index}>
                                <label className='col-lg-4 col-form-label fw-bold fs-6'>Name</label>
                                {item.added_item ? (
                                  <div className='col-lg-8 fv-row mb-3'>
                                    <select
                                      className='form-select form-select-solid'
                                      value={item.id}
                                      disabled={!item.added_item}
                                      onChange={(e) => {
                                        console.log('target', e.target.value)
                                        let __item = orderItems.filter(
                                          (element) => element.id === parseInt(e.target.value)
                                        )
                                        console.log('item', __item)
                                        if (e.target.value === 'default' || __item?.length > 0) {
                                          item.id = 'default'
                                          setOrderItems([...orderItems])
                                          return
                                        } else {
                                          let __new_item = newItemsList.filter(
                                            (element: any) =>
                                              element.id === parseInt(e.target.value)
                                          )[0]
                                          item.id = parseInt(e.target.value)
                                          item.category = __new_item.category
                                          item.price = __new_item.price
                                          setOrderItems([...orderItems])
                                          // let __newItemsList = newItemsList.filter(
                                          //   (element) => element.id !== parseInt(e.target.value)
                                          // )
                                          // setNewItemsList([...__newItemsList])
                                        }
                                      }}
                                    >
                                      <option value={'default'}>Select item's name</option>
                                      {newItemsList &&
                                        newItemsList?.length > 0 &&
                                        newItemsList.map((element: any, index: number) => (
                                          <option value={element.id} key={index}>
                                            {element.display_name}
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                ) : (
                                  <div className='col-lg-8 fv-row mb-3'>
                                    <select
                                      className='form-select form-select-solid'
                                      value={item.id}
                                      disabled
                                    >
                                      <option>{item.name}</option>
                                    </select>
                                  </div>
                                )}

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
                                          setOrderItems([...orderItems])
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
                                        setOrderItems([...orderItems])
                                      }}
                                    />
                                    <div className='input-group-append'>
                                      <span
                                        className='input-group-text btn btn-secondary'
                                        onClick={(e) => {
                                          let __qty = parseInt(item.quantity) + 1
                                          item.quantity = __qty.toString()
                                          setOrderItems([...orderItems])
                                        }}
                                      >
                                        <PlusOutlined />
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                                  Price
                                </label>
                                <div className='col-lg-8 fv-row'>
                                  <input
                                    type='number'
                                    className='form-control form-control-lg form-control-solid'
                                    placeholder='Enter price'
                                    value={item.price}
                                    onChange={(e) => {
                                      let __price = parseFloat(e.target.value)
                                      if (__price < 0) __price = 0
                                      item.price = __price.toString()
                                      setOrderItems([...orderItems])
                                    }}
                                  />
                                </div>
                                {item.added_item && (
                                  <div className='flex flex-end py-3'>
                                    <div
                                      className='btn btn-sm bg-danger'
                                      onClick={() => {
                                        orderItems.pop()
                                        setOrderItems([...orderItems])
                                      }}
                                    >
                                      <span className='text-white'>Delete Item</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          <div className='py-3'>
                            <span
                              className={`btn btn-sm text-white ${
                                orderItems?.length === products?.length
                                  ? `bg-secondary`
                                  : `bg-success`
                              } `}
                              onClick={() => {
                                if (orderItems?.length === products?.length) return
                                let __item = {
                                  id: undefined,
                                  item_id: null,
                                  order_id: order.id,
                                  category: '',
                                  quantity: 0,
                                  price: 0,
                                  added_item: true,
                                }
                                orderItems.push(__item)
                                setOrderItems([...orderItems])
                              }}
                            >
                              Add item
                            </span>
                          </div>
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
                                paymentMethod?.length > 0 &&
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
                                paymentStatus?.length > 0 &&
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
                            <span className=''>Storage month</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='string'
                              disabled
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Storage month'
                              value={storageMonth}
                            />
                          </div>
                        </div>

                        <div className='row py-4 flex items-center'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className=''>Lump sum</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='string'
                              disabled
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Lump sum'
                              value={lumpSum}
                            />
                          </div>
                        </div>

                        <div className='row py-4 flex'>
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
    </div>
  )
}

export default ContentOrder
