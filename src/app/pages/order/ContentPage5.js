import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Grid, RadioGroup} from '@mui/material'
import CustomColorRadio from '../../components/custom-components/RadioButton'
import CssFormControlLabel from '../../components/custom-components/FormControlLabel'
import {loadStripe} from '@stripe/stripe-js'
import {Elements} from '@stripe/react-stripe-js'
import PaymentForm from '../../components/payment'
import {orderSubmit} from '../../store/apis/ordering'
import LoadingSpinner from '../../components/loading-spinner'
import {payConfirm} from '../../store/apis/ordering'
import {PaymentType} from '../../constants/payment-type'
import {getPaymentMethod} from '../../store/actions/order'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function ContentPage5(props) {
  const {onNotification, cartInfo, setCartInfo, stuffInfo, accountInfo, order, setOrder} = props
  const navigateTo = useNavigate()
  const [paymentType, setPaymentType] = useState(PaymentType.CREDITCARD)
  const [isLoading, setIsLoading] = useState(false)
  const {t} = useTranslation()
  const [paymentCode, setPaymentCode] = useState('')
  const [lang, setLang] = useState('')
  const [initial, setInitial] = useState(false)
  const dispatch = useDispatch()
  const paymentMethod = useSelector((state) => state.order.paymentMethod)

  const __carts = cartInfo
  const __duration = cartInfo.storage_month
  // const __payment_type = cartInfo.payment_type;
  const __stuff_info = stuffInfo
  const __account_info = accountInfo
  const __user_info = JSON.parse(localStorage.getItem('ubox-user'))
  const __lang = JSON.parse(localStorage.getItem('ubox-lang'))

  let __account_info_student = {}
  if (__account_info.isStudent === 0) {
    __account_info_student = {
      ...__account_info,
      studentID: '',
      university: {},
      wechatID: '',
    }
  } else {
    __account_info_student = __account_info
  }

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
              props.onChangeStep()
            }
          })
          .catch((err) => {
            onNotification({
              title: 'error',
              message: 'Error on payment',
              visible: true,
              status: Math.floor(Math.random() * 100000),
            })
            setTimeout(() => {
              navigateTo('/client/dashboard')
            }, 3000)
          })
      }, 3000)
      setTimeout(() => {
        if (isLoading) {
          clearInterval(payConfirmTimer)
          onNotification({
            title: 'error',
            message: 'Expired time.',
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

  const getStripe = () => {
    const stripeKey = process.env.REACT_APP_STRIPE_KEY
    const stripePromise = loadStripe(stripeKey)
    return stripePromise
  }
  const handleRadioChange = (event) => {
    let type = parseInt(event.target.value)
    setPaymentType(type)
    setPaymentCode('')
    setCartInfo({
      ...cartInfo,
      payment_type: event.target.value,
    })
  }

  const onNextHandler = (e) => {
    if (paymentType === PaymentType.CREDITCARD) {
      document.querySelector('form').requestSubmit()
      setIsLoading(true)
    } else if (paymentType === PaymentType.CASH) {
      setIsLoading(true)
      let stripeToken = ''
      orderSubmitHandler(stripeToken)
    } else {
      setIsLoading(true)
      setPaymentCode('')
      orderSubmit({
        stripeToken: '',
        carts: {...__carts, duration: __duration, payment_type: paymentType},
        stuff: {
          ...__stuff_info,
        },
        account: __account_info_student,
        somsclient_id: __user_info.id,
        order_code: order?.code ? order?.code : null,
        lang: lang,
      })
        .then((res) => {
          setOrder(res.data.order)
          if (res.data.success === true) {
            openCheckoutUrl(res.data.data)
            setPaymentCode(res.data.code)
            setIsLoading(true)
          } else {
            setPaymentCode('')
            console.log('responseError', res.data)
            onNotification({
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
          onNotification({
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
    orderSubmit({
      stripeToken: stripeToken,
      carts: {...__carts, duration: __duration, payment_type: paymentType},
      stuff: {
        ...__stuff_info,
      },
      account: __account_info_student,
      somsclient_id: __user_info.id,
      order_code: order?.code ? order?.code : null,
      lang: lang,
    })
      .then((res) => {
        setOrder(res.data.order)
        if (res.data.code === 'success') {
          onNotification({
            title: res.data.code,
            message: res.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
          props.onChangeStep()
        } else if (res.data.code === 'error') {
          console.log('responseError', res.data)
          onNotification({
            title: 'warning',
            message: res.data.message,
            visible: true,
            status: Math.floor(Math.random() * 100000),
          })
          // props.onChangeStep()
        }
      })
      .catch((err) => {
        console.log('errors_message', err)
        onNotification({
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
      onNotification({
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
      <LoadingSpinner isLoading={isLoading}></LoadingSpinner>
      <div className='content-container'>
        <div className='content-page'>
          <div className='text-header text-black pb-[10px]'>{t('page5.qu-which-payment')}</div>
          <div className='text-normal text-black'>{t('page5.an-which-payment')}</div>
          <div className='mt-[33px]'>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={12} lg={9}>
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
              <Grid item xs={12} sm={12} md={12} lg={9}>
                <div className='text-lg'>{t('common.wd-checkout-note')}</div>
              </Grid>
            </Grid>
          </div>
        </div>
        <div className='flex item-center mt-[30px]'>
          <span className='custom-btn hand' onClick={onNextHandler}>
            {t('common.wd-next')}
          </span>
        </div>
      </div>
    </>
  )
}
