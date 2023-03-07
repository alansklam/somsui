import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {Grid, RadioGroup} from '@mui/material'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import CustomColorRadio from '../../../components/custom-components/RadioButton'
import CssFormControlLabel from '../../../components/custom-components/FormControlLabel'
import PaymentForm from '../../../components/payment'
import LoadingSpinner from '../../../components/loading-spinner'
import {payConfirm} from '../../../store/apis/ordering'
import {ShowNotification} from '../../../components/notification'
import {PaymentType} from '../../../constants/payment-type'
import {getPaymentMethod} from '../../../store/actions/order'
import {retrievalPayApi} from '../../../store/apis/client'

export default function PaymentMethod(props) {
  const {orderId, cartInfo, retrievalOrder, confirmOrder, setComfirmOrder, setOrderState} = props
  const [isLoading, setIsLoading] = useState(false)
  const [paymentType, setPaymentType] = useState(PaymentType.CREDITCARD)
  const {t} = useTranslation()
  const [paymentCode, setPaymentCode] = useState('')
  const [payStatus, setPayStatus] = useState(false)
  const [notify, setNotify] = useState({title: '', message: '', visible: false, status: 0})
  const [lang, setLang] = useState('')
  const [initial, setInitial] = useState(false)
  const dispatch = useDispatch()
  const paymentMethod = useSelector((state) => state.order.paymentMethod)
  const __lang = JSON.parse(localStorage.getItem('ubox-lang'))
  const user = JSON.parse(localStorage.getItem('ubox-user'))

  useEffect(() => {
    setLang(JSON.parse(localStorage.getItem('ubox-lang')))
    setInitial(true)
  }, [])

  useEffect(() => {
    if (initial) {
      dispatch(getPaymentMethod())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial])

  useEffect(() => {
    if (paymentCode !== undefined && paymentCode !== '') {
      const payConfirmTimer = setInterval(() => {
        payConfirm({code: paymentCode})
          .then((res) => {
            if (res.data.success === true) {
              setIsLoading(false)
              clearInterval(payConfirmTimer)
              setPayStatus(true)
              if (res.data.payment_status === 'PAID') {
                setOrderState(true)
                showNotification({
                  title: 'success',
                  message: 'Total fee was paid fully',
                  visible: true,
                  status: Math.floor(Math.random() * 100000),
                })
              } else {
                showNotification({
                  title: 'warning',
                  message: 'Total fee was not paid fully',
                  visible: true,
                  status: Math.floor(Math.random() * 100000),
                })
              }
            }
          })
          .catch((err) => {
            setIsLoading(false)
            console.log('error', err)
          })
      }, 3000)
      setTimeout(() => {
        if (isLoading) {
          // console.log('isloading', isLoading)
          // showNotification({
          //   title: 'warning',
          //   message: 'No connect.',
          //   visible: true,
          //   status: Math.floor(Math.random() * 100000),
          // })
          clearInterval()
          setIsLoading(false)
        }
      }, 60000)
    } else {
      clearInterval()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentCode])

  const showNotification = ({title, message, visible, status}) => {
    setNotify({title, message, visible, status})
  }

  const closeNotify = () => {
    setNotify({
      ...notify,
      visible: false,
    })
  }

  const getStripe = () => {
    const stripeKey = process.env.REACT_APP_STRIPE_KEY
    const stripePromise = loadStripe(stripeKey)
    return stripePromise
  }

  const handleRadioChange = (event) => {
    let type = parseInt(event.target.value)
    setPaymentType(type)
    setPaymentCode('')
  }

  const onNextHandler = (e) => {
    clearInterval()
    if (paymentType === PaymentType.CREDITCARD) {
      document.querySelector('form').requestSubmit()
      setIsLoading(true)
    } else if (paymentType === PaymentType.CASH) {
      setIsLoading(true)
      let stripeToken = ''
      orderSubmitHandler(stripeToken)
    } else {
      setIsLoading(true)
      retrievalPayApi({
        stripeToken: '',
        client_id: user.id,
        order_id: orderId,
        order_code: confirmOrder.code ? confirmOrder.code : null,
        payment_code: paymentCode,
        payment_type: paymentType,
        cart_info: cartInfo,
        retrieval_order: retrievalOrder,
        lang: lang,
      })
        .then((res) => {
          if (res.data.success === true) {
            openCheckoutUrl(res.data.data)
            setPaymentCode(res.data.code)
            setComfirmOrder(res.data.retrieval_order)
          } else {
            setPaymentCode('')
            console.log('responseError', res.data)
            showNotification({
              title: 'warning',
              message: 'No connect.',
              visible: true,
              status: Math.floor(Math.random() * 100000),
            })
            setIsLoading(false)
          }
        })
        .catch((err) => {
          setIsLoading(false)
          console.log('errors_message', err)
          showNotification({
            title: 'error',
            message: err.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
        })
    }
  }

  const orderSubmitHandler = (stripeToken) => {
    setPaymentCode('')
    retrievalPayApi({
      stripeToken: stripeToken,
      client_id: user.id,
      order_id: orderId,
      order_code: confirmOrder.code ? confirmOrder.code : null,
      payment_code: paymentCode,
      payment_type: paymentType,
      cart_info: cartInfo,
      retrieval_order: retrievalOrder,
      lang: lang,
    })
      .then((res) => {
        if (res.data.code === 'success') {
          showNotification({
            title: res.data.code,
            message: res.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
          setComfirmOrder(res.data.retrieval_order)
          setOrderState(true)
          setPayStatus(true)
        } else if (res.data.code === 'error') {
          console.log('responseError', res.data)
          showNotification({
            title: 'warning',
            message: res.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
          setPayStatus(false)
        }
      })
      .catch((err) => {
        console.log('errors_message', err)
        showNotification({
          title: 'error',
          message: err.data.message,
          visible: true,
          status: Math.floor(Math.random() * 100000),
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onCallbackFunc = (error, token) => {
    setIsLoading(false)
    if (!error) {
      // Backend is not implemented yet, but once there isn’t any errors,
      // you can pass the token and payment data to the backend to complete
      // the charge
      setIsLoading(true)
      let stripeToken = token.id
      orderSubmitHandler(stripeToken)
    } else {
      showNotification({
        title: 'error',
        message: error.message,
        visible: true,
        status: Math.floor(Math.random() * 100000),
      })
    }
  }

  const openCheckoutUrl = (url) => window.open(url, '_blank')?.focus()

  return (
    <>
      <div>
        <div className='text-normal text-black py-[0px]'>
          <span className='text-header text-black'>{t('page5.qu-which-payment')}</span>
        </div>
        <div className='mt-[33px]'>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12}>
              <RadioGroup
                aria-labelledby='payment-type-radio-buttons-group'
                name='radio-buttons-group'
                value={paymentType}
                onChange={handleRadioChange}
              >
                {paymentMethod.map((element, index) => {
                  switch (element.id) {
                    case PaymentType.CREDITCARD:
                      return (
                        <div key={index}>
                          <CssFormControlLabel
                            value={PaymentType.CREDITCARD}
                            control={<CustomColorRadio />}
                            label={__lang === 'en' ? element?.description : element?.description_cn}
                          />
                          <Grid item xs={12} sm={12} md={12}>
                            <div className='flex items-center'>
                              {paymentType === PaymentType.CREDITCARD && (
                                <div className='h-[20px] w-[100%] my-[10px]'>
                                  <Elements stripe={getStripe()}>
                                    <PaymentForm onCallbackHandler={onCallbackFunc} />
                                  </Elements>
                                </div>
                              )}
                            </div>
                          </Grid>
                        </div>
                      )
                    case PaymentType.WECHATPAY:
                      return (
                        <CssFormControlLabel
                          value={PaymentType.WECHATPAY}
                          control={<CustomColorRadio />}
                          label={__lang === 'en' ? element?.description : element?.description_cn}
                          key={index}
                        />
                      )
                    case PaymentType.ALIPAY:
                      return (
                        <CssFormControlLabel
                          value={PaymentType.ALIPAY}
                          control={<CustomColorRadio />}
                          label={__lang === 'en' ? element?.description : element?.description_cn}
                          key={index}
                        />
                      )
                    default:
                      return <div key={index}></div>
                  }
                })}
              </RadioGroup>
            </Grid>
          </Grid>
        </div>
        {!payStatus && (
          <div className='flex item-center my-[30px]'>
            <span className='custom-btn hand' onClick={onNextHandler}>
              {t('customer-retrieval.wd-retrieve-my-items')}
            </span>
          </div>
        )}
      </div>
      <ShowNotification
        title={notify.title}
        message={notify.message}
        visible={notify.visible}
        status={notify.status}
        closeNotify={closeNotify}
      />
      <LoadingSpinner isLoading={isLoading} />
    </>
  )
}
