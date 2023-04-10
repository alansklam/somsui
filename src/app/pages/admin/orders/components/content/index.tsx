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
import Select from 'react-select'
import {searchClientApi} from '../../../../../store/apis/admin'

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
  // const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any>({})
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [newItemsList, setNewItemsList] = useState<any[]>([])
  const [storageExpireDate, setStorageExpireDate] = useState<string>('')
  const [qrCode, setQrCode] = useState('')
  let changeTime = 0
  let __options: any[] = []
  const [searchClients, setSearchClients] = useState<any[]>([])
  const [productTotalFee, setProductTotalFee] = useState<string>('')

  const profileDetailsSchema = Yup.object().shape({
    emptyout_location_other: Yup.string()
      .required('Emptyout location is required')
      .min(3, 'Emptyout location should be 3 letters at least')
      .max(50, 'Emptyout location should be 50 letters at maximum'),
    emptyout_date_other: Yup.date().required('Emptyout Date is required'),
    emptyout_time_other: Yup.string().required('Emptyout Time is required'),
    checkin_location_other: Yup.string()
      .required('Checkin location is required')
      .min(3, 'Checkin location 3 letters at least')
      .max(50, 'Checkin location 50 letters at maximum'),
    checkin_date_other: Yup.date().required('Checkin Date is required'),
    checkin_time_other: Yup.string().required('Checkin Time is required'),
    checkout_location_other: Yup.string()
      .required('Checkout location is required')
      .min(3, 'Checkout location 3 letters at least')
      .max(50, 'Checkout location 50 letters at maximum'),
    checkout_date_other: Yup.date().required('Checkout Date is required'),
    checkout_time_other: Yup.string().required('Checkout Time is required'),
    paid_fee: Yup.string().required('Paid fee is required.'),
  })

  const initialValues = orderInfo

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      if (!selectedClient.value) {
        showNotification('error', 'Error', 'Please selecte the name of client.')
        return
      }
      if (orderItems.length === 0) {
        showNotification('error', 'Error', 'Please add items.')
        return
      }
      if (orderStatusId === '') {
        showNotification('error', 'Error', 'Please select the order status.')
        return
      }
      if (paymentMethodId === '') {
        showNotification('error', 'Error', 'Please select the payment method.')
        return
      }
      if (paymentStatusId === '') {
        showNotification('error', 'Error', 'Please select the payment status.')
        return
      }
      if (order === 0) {
        showNotification('error', 'Error', 'Please add items.')
        return
      }
      if (orderItems.length === 0) {
        showNotification('error', 'Error', 'Please add items.')
      } else {
        let __state_id = false
        let __state_price = false
        orderItems.forEach((item) => {
          if (item.id === undefined) __state_id = true
          if (item.price === '0') __state_price = true
        })
        if (__state_id) {
          showNotification('error', 'Error', "Please select the item's name.")
          return
        } else if (__state_price) {
          showNotification('error', 'Error', "Please enter the item's price.")
          return
        }
      }
      setLoading(true)
      editOrderApi({
        data: {
          ...values,
          client_id: selectedClient.value,
          items: orderItems,
          order_status_id: orderStatusId,
          payment_type_id: paymentMethodId,
          payment_status_id: paymentStatusId,
          special_instruction: specialInstruction,
          storage_month: storageMonth,
          product_total_fee: productTotalFee,
          total_fee: lumpSum,
          remark_qrcode: qrCode,
          storage_expired_date: storageExpireDate,
        },
        id: order.id ? order.id : '',
      })
        .then((res) => {
          setLoading(false)
          navigateTo(-1)
          showNotification('success', 'Success', 'Update successfully.')
        })
        .catch((err) => {
          setLoading(false)
          showNotification('error', 'Error', 'Failed update.')
        })
    },
  })

  useEffect(() => {
    searchClientApi(order.client?.name ? order.client?.name : '').then((res) => {
      let __data = res.data.result
      __data.forEach((item: any) => {
        __options.push({
          value: item.id.toString(),
          label: item.name,
        })
      })
      setSearchClients(__options)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let __items: any[] = []
    if (order?.items) {
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
    }

    setOrderItems(__items)
    setStorageExpireDate(order.storage_expired_date ? order.storage_expired_date : '')
    setOrderStatusId(order.order_status_id ? order.order_status_id : '')
    setPaymentMethodId(order.payment_type_id ? order.payment_type_id : '6')
    setPaymentStatusId(order.payment_status_id ? order.payment_status_id : '1')
    setSpecialInstruction(order.special_instruction ? order.special_instruction : '')
    setLumpSum(order.total_fee ? order.total_fee : '0')
    setQrCode(order.remark_qrcode ? order.remark_qrcode : '')
    setSelectedClient({
      value: order.client?.id ? order.client?.id : undefined,
      label: order.client?.name ? order.client?.name : undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  useEffect(() => {
    if (products && products?.length > 0) {
      let __newItemsList = products.filter((element: any) => {
        let __state = false
        order?.items &&
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
    if (!order.id) {
      setStorageExpireDate(formik.values.checkout_date_other)
    } else {
      if (dayjs(formik.values.checkout_date_other) > dayjs(order.storage_expired_date)) {
        setStorageExpireDate(formik.values.checkout_date_other)
      } else {
        setStorageExpireDate(order.storage_expired_date)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.checkout_date_other])

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
      let __checkout
      if (order.id && storageExpireDate) {
        __checkout = dayjs(storageExpireDate)
      } else {
        __checkout = dayjs(formik.values.checkout_date_other)
      }
      __months = Math.ceil(__checkout.diff(__checkin, 'month', true))
      //   __months = Math.ceil((__checkout.getTime() - __checkin.getTime()) / (1000 * 3600 * 24 * 30))
      setStorageMonth(__months.toString())
    }
    let __product_total_fee = __subTotalFee
    if (isNaN(__product_total_fee)) {
      __product_total_fee = 0
    }
    setProductTotalFee(__product_total_fee.toFixed(2))
    let __totalFee = __subTotalFee * __months + __packageFee
    if (isNaN(__totalFee)) {
      __totalFee = 0
    }
    setLumpSum(__totalFee.toFixed(2))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values, orderItems])

  return (
    <div>
      <div className='mx-auto mw-1300px'>
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
                        <div className='row py-3 flex items-center'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>Code</label>
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

                        <div className='row py-3 flex items-center'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>Name</label>
                          <div className='col-lg-8 fv-row'>
                            {/* <input
                              type='text'
                              disabled
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Name'
                              value={order?.client?.name}
                            /> */}
                            <Select
                              className='basic-single'
                              classNamePrefix='select'
                              isDisabled={false}
                              isLoading={false}
                              isClearable={true}
                              isRtl={false}
                              isSearchable={true}
                              value={selectedClient}
                              onChange={(value) => {
                                setSelectedClient(value)
                              }}
                              onInputChange={(value) => {
                                changeTime = Date.now()
                                setTimeout(() => {
                                  if (Date.now() - changeTime >= 500) {
                                    if (value === '') return
                                    searchClientApi({name: value}).then((res) => {
                                      let __data = res.data.result
                                      __data.forEach((item: any) => {
                                        __options.push({
                                          value: item.id.toString(),
                                          label: item.name,
                                        })
                                      })
                                      setSearchClients(__options)
                                    })
                                  }
                                }, 500)
                              }}
                              options={[...searchClients]}
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
                              onKeyDown={(e) => e.preventDefault()}
                              max={dayjs(formik.errors.checkin_date_other).format('YYYY-MM-DD')}
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
                              onKeyDown={(e) => e.preventDefault()}
                              min={dayjs(formik.errors.emptyout_date_other).format('YYYY-MM-DD')}
                              max={dayjs(formik.errors.checkout_date_other).format('YYYY-MM-DD')}
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
                              min={dayjs(formik.errors.checkin_date_other).format('YYYY-MM-DD')}
                              onKeyDown={(e) => e.preventDefault()}
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

                        <div className='row py-3 flex items-center'>
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

                        <div className='row py-3 flex items-center'>
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

                        <div className='row py-3 flex items-center'>
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

                        <div className='row py-3 flex items-center'>
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

                        <div className='row py-3 flex items-center'>
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

                        <div className='row py-3 flex items-center'>
                          <label className='col-lg-4 col-form-label fw-bold fs-6'>
                            <span className=''>Storage expire date</span>
                          </label>
                          <div className='col-lg-8 fv-row'>
                            <input
                              type='string'
                              disabled
                              className='form-control form-control-lg form-control-solid'
                              placeholder='Storage expire date'
                              value={storageExpireDate}
                            />
                          </div>
                        </div>

                        <div className='row py-3 flex items-center'>
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
    </div>
  )
}

export default ContentOrder
