import {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {Grid, RadioGroup} from '@mui/material'
import CustomColorRadio from '../../../components/custom-components/RadioButton'
import CssFormControlLabel from '../../../components/custom-components/FormControlLabel'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import PaymentForm from '../../../components/payment'
import LoadingSpinner from '../../../components/loading-spinner'
import {payConfirm} from '../../../store/apis/ordering'
import {ShowNotification} from '../../../components/notification'
import {outstandPayApi} from '../../../store/apis/client'
import ContentPage6 from '../../order/ContentPage6'
import {PaymentType} from '../../../constants/payment-type'
import {useDispatch, useSelector} from 'react-redux'
import {getPaymentMethod} from '../../../store/actions/order'
import {useNavigate} from 'react-router-dom'

export const PaymentDetail = (props) => {
  const {orderId} = props
  const [isLoading, setIsLoading] = useState(false)
  const navigateTo = useNavigate()
  const [paymentType, setPaymentType] = useState(PaymentType.CREDITCARD)
  const {t} = useTranslation()
  const [paymentCode, setPaymentCode] = useState('')
  const [order, setOrder] = useState({})
  const [payStatus, setPayStatus] = useState(false)
  const [notify, setNotify] = useState({title: '', message: '', visible: false, status: 0})
  const [lang, setLang] = useState('')
  const [initial, setInitial] = useState(false)
  const dispatch = useDispatch()
  const paymentMethod = useSelector((state) => state.order.paymentMethod)
  const __lang = JSON.parse(localStorage.getItem('ubox-lang'))

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
              clearInterval(payConfirmTimer)
              setPayStatus(true)
              setTimeout(() => {
                navigateTo('/client/dashboard')
              }, 3000)
            }
          })
          .catch((err) => {
            console.log('error', err)
            setTimeout(() => {
              navigateTo('/client/dashboard')
            }, 3000)
          })
      }, 3000)
      setTimeout(() => {
        if (isLoading) {
          showNotification({
            title: 'warning',
            message: 'No connect.',
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
          setTimeout(() => {
            navigateTo('/client/dashboard')
          }, 3000)
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
      outstandPayApi({
        stripeToken: '',
        order_id: orderId,
        payment_code: paymentCode,
        payment_type: paymentType,
        lang: lang,
      })
        .then((res) => {
          if (res.data.success === true) {
            openCheckoutUrl(res.data.data)
            setPaymentCode(res.data.code)
            setOrder(res.data.order)
          } else {
            setPaymentCode('')
            console.log('responseError', res.data)
            showNotification({
              title: 'warning',
              message: 'No connect.',
              visible: true,
              status: Math.floor(Math.random() * 100000),
            })
            setTimeout(() => {
              navigateTo('/client/dashboard')
            }, 3000)
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
          setTimeout(() => {
            navigateTo('/client/dashboard')
          }, 3000)
        })
    }
  }

  const orderSubmitHandler = (stripeToken) => {
    setPaymentCode('')
    outstandPayApi({
      stripeToken: stripeToken,
      order_id: orderId,
      payment_code: paymentCode,
      payment_type: paymentType,
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
          setOrder(res.data.order)
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

  const openCheckoutUrl = (url) => window.open(url, '_self')

  return (
    <>
      {payStatus ? (
        <ContentPage6 order={order} />
      ) : (
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
                              label={
                                __lang === 'en' ? element?.description : element?.description_cn
                              }
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
                      case PaymentType.CASH:
                        return (
                          <CssFormControlLabel
                            value={PaymentType.CASH}
                            control={<CustomColorRadio />}
                            label={__lang === 'en' ? element?.description : element?.description_cn}
                            key={index}
                          />
                        )
                      default:
                        return <></>
                    }
                  })}
                </RadioGroup>
              </Grid>
            </Grid>
          </div>
          <div className='flex item-center mt-[60px]'>
            <span className='custom-btn hand' onClick={onNextHandler}>
              {t('common.wd-next')}
            </span>
          </div>
        </div>
      )}
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
