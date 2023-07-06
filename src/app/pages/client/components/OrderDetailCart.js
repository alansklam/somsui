import {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {Link} from 'react-router-dom'
import {PaymentType} from '../../../constants/payment-type'

export const OrderDetailCart = (props) => {
  const {order, user, orderId} = props
  const {t, i18n} = useTranslation()
  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardName, setCardName] = useState('')
  const [payStatus, setPayStatus] = useState(true)

  useEffect(() => {
    if (order.payment_type_id) {
      switch (order.payment_type_id) {
        case PaymentType.CREDITCARD:
          setPaymentMethod('common.wd-credit-card')
          break
        case PaymentType.WECHATPAY:
          setPaymentMethod('common.wd-wechat-pay')
          break
        case PaymentType.ALIPAY:
          setPaymentMethod('common.wd-alipay')
          break
        case PaymentType.CASH:
          setPaymentMethod('common.wd-cash/atm')
          break
        default:
          break
      }
      let __cardName = order.payments.slice(-1)[0]?.trans_id
      setCardName(__cardName)
      if (parseFloat(order.balance) > 0) {
        setPayStatus(true)
      } else {
        setPayStatus(false)
      }
    }
  }, [order])

  const getBalance = (value) => {
    let balance = parseFloat(value)
    if (isNaN(balance)) balance = 0
    if (balance <= 0) balance = 0
    return balance.toFixed(2)
  }

  const getPaidFee = (value) => {
    let result = ''
    let paid_fee = parseFloat(value?.paid_fee)
    let total_fee = parseFloat(value?.total_fee)
    if (isNaN(paid_fee)) paid_fee = 0
    if (isNaN(total_fee)) total_fee = 0
    if (total_fee - paid_fee >= 0) {
      result = '$' + paid_fee.toFixed(2)
    } else {
      result = t('common.wd-paid-by', {name: ''})
    }
    return result
  }

  return (
    <div className='content'>
      <div className='mb-[29px]'>
        <span className='text-header text-black'>{t('cart.no-order-detail')}</span>
      </div>
      <div>
        <span className='text-header text-black'>{t('cart.no-storage-month')}</span>
      </div>
      <div>
        {order.items?.map((item, index) => {
          if (item.item_qty === 0) return <div key={index}></div>
          if (item.item_category !== 'bag') {
            return (
              <div className='flex space-between mt-[20px]' key={index}>
                <div>
                  <div className='text-normal text-black'>
                    {item.item_qty} x {i18n.language === 'zh' ? item.item.name_cn : item.item.name}
                  </div>
                  <div className='text-normal text-black'>
                    ${item.item_price} {t('cart.no-per-box')}
                  </div>
                </div>
                <div className='my-auto'>
                  <span className='text-normal text-black'>
                    ${Math.round(item.item_qty * item.item_price * 100) / 100}
                  </span>
                </div>
              </div>
            )
          }
          return <div key={index}></div>
        })}
        <div className='space-line mt-[20px] mb-[20px]'></div>
      </div>
      <div className='flex space-between my-[20px]'>
        <span className='text-header text-black'>{t('common.wd-subtotal')}</span>
        <span className='text-header text-black'>
          ${order.product_total_fee ? order.product_total_fee : '0.00'}
        </span>
      </div>
      {order.vacuumBags !== undefined && order.vacuumBags > 0 && (
        <div className='mt-[20px]'>
          <div>
            <span className='text-header text-black'>{t('cart.no-packing-materials')}</span>
          </div>
          {order.items?.map((item, index) => {
            if (item.item_qty === 0) return <div key={index}></div>
            if (item.item_category === 'bag') {
              return (
                <div className='flex space-between mt-[20px]' key={index}>
                  <div>
                    <div className='text-normal text-black'>
                      {item.item_qty} x{' '}
                      {i18n.language === 'zh' ? item.item.name_cn : item.item.name}
                    </div>
                    <div className='text-normal text-black'>
                      ${item.item_price} {t('cart.no-per-box')}
                    </div>
                  </div>
                  <div className='my-auto'>
                    <span className='text-normal text-black'>
                      ${item.item_qty * item.item_price}
                    </span>
                  </div>
                </div>
              )
            }
            return <div key={index}></div>
          })}
          <div className='space-line mt-[20px] mb-[20px]'></div>
        </div>
      )}
      <div className='flex space-between my-[20px]'>
        <span>
          <span className='text-header text-black'>{t('common.wd-total')}</span>
          <span className='text-normal text-black'>
            {' '}
            ({order.storage_month ? order.storage_month : 0} {t('common.wd-months')})
          </span>
        </span>
        <span className='text-header text-black'>
          ${order.total_fee ? order.total_fee : '0.00'}
        </span>
      </div>
      <div className='flex space-between my-[20px]'>
        <span>
          <span className='text-header text-black'>
            {t('common.wd-paid-by', {name: user.name ? user.name : ''})}
          </span>
        </span>
        <span className='text-header text-black'>{getPaidFee(order)}</span>
      </div>
      <div className='flex space-between my-[20px]'>
        <span>
          <span className='text-header text-black'>{t('common.wd-outstanding')}</span>
        </span>
        <span className='text-header text-black'>${getBalance(order.balance)}</span>
      </div>
      <div className='flex space-between my-[20px]' style={{position: 'relative'}}>
        <span>
          <span className='text-header text-black'>{t('common.wd-payment-method')}</span>
        </span>
        <span className='text-header text-black'>{t(paymentMethod)}</span>
      </div>
      <div className='' style={{position: 'relative'}}>
        <span className='text-header text-black card-name'>{cardName}</span>
      </div>
      <div className='flex my-[30px] justify-content-end'>
        <Link to={payStatus ? '/client/order/outstand-payment/' + orderId : '#'}>
          <span className={payStatus ? 'custom-btn hand' : 'custom-btn disabled-btn'}>
            {t('common.wd-pay-now')}
          </span>
        </Link>
      </div>
      <div className='space-line mt-[20px] mb-[20px]'></div>
      <div>
        <span className='text-header text-black'>{t('common.wd-qr-code')}</span>
      </div>
      <div>
        <span className='text-normal text-black'>
          {order.remark_qrcode ? order.remark_qrcode : ''}
        </span>
      </div>
    </div>
  )
}
