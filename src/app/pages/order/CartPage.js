import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {PlusOutlined} from '@ant-design/icons'
import {Button, Input} from 'antd'
import {promoCodeValidate} from '../../store/apis/ordering'
import {StepType} from '../../constants/step-type'
import {DownOutlined, UpOutlined} from '@ant-design/icons'

export default function CartPage(props) {
  const {setPromotionPrice, step} = props
  const {t, i18n} = useTranslation()
  const [promoStatus, setPromoStatus] = useState(false)
  const [promoCorrectStatus, setPromoCorrectStatus] = useState(false)
  const [validateStatus, setValidateStatus] = useState({
    status: 'success',
  })
  const [showMessage, setShowMessage] = useState(false)
  const [promoCode, setPromoCode] = useState()

  const onPromoHandler = () => {
    if (step !== StepType.SUCCESS) {
      setPromoStatus(true)
    }
  }

  useEffect(() => {
    if (promoCode) validateCode(promoCode)
  }, [props.carts.storage_month])

  const onPromoCodeHandler = (e) => {
    setPromoCode(e.target.value)
    if (e.target.value) validateCode(e.target.value)
  }

  const validateCode = (code) => {
    promoCodeValidate({storage_month: props.carts.storage_month, promotion_code: code})
      .then((res) => {
        console.log(res.data)
        if (res.data.message && res.data.message === 'invalid months') {
          setPromoCorrectStatus(false)
          setValidateStatus(res.data)
          setPromotionPrice(false, [], 0)
        } else {
          setPromoCorrectStatus(true)
          setValidateStatus({
            status: 'success',
          })
          setPromotionPrice(true, res.data.data.items, res.data.data.id)
        }
      })
      .catch((err) => {
        setPromoCorrectStatus(false)
        setValidateStatus({
          status: 'error',
          message: 'invalid code',
        })
      })
  }

  return (
    <div className='cart-container'>
      <div className='content'>
        <div className='mb-[29px]'>
          {props.step === StepType.SUCCESS ? (
            <span className='text-header text-black'>{t('cart.no-order-summary')}</span>
          ) : (
            <span className='text-header text-black'>{t('cart.no-upfront')}</span>
          )}
        </div>
        <div>
          <span className='text-header text-black'>{t('cart.no-storage-month')}</span>
        </div>
        <div>
          {props.carts &&
            props.carts.stores &&
            Object.keys(props.carts.stores).map((iter, index) => {
              const item = props.carts.stores[iter]
              if (item.count === 0) return <div key={index}></div>
              return (
                <div className='flex space-between mt-[20px]' key={index}>
                  <div>
                    <div className='text-normal text-black'>
                      {item.count} x {i18n.language === 'zh' ? item.name_cn : item.name}
                    </div>
                    <div className='text-normal text-black'>
                      ${item.price} {t('cart.no-per-box')}
                    </div>
                  </div>
                  <div className='my-auto'>
                    <span className='text-normal text-black'>
                      ${Math.round(item.count * parseFloat(item.price) * 100) / 100}
                    </span>
                  </div>
                </div>
              )
            })}
          <div className='space-line mt-[20px] mb-[20px]'></div>
          <div className='flex space-between'>
            <span className='text-header text-black'>{t('common.wd-subtotal')}</span>
            <span className='text-header text-black'>${props.carts.stores_total}</span>
          </div>
          {promoStatus ? (
            <div>
              <div className='flex justify-content-end align-items-center mt-[15px]'>
                {promoCorrectStatus ? (
                  <span className='text-normal text-black pr-[10px]'>
                    {t('common.wd-used-promo')}
                  </span>
                ) : (
                  <span className='text-normal text-black pr-[10px]'>
                    {t('common.wd-enter-promo')}
                  </span>
                )}
                <Input
                  style={{width: '120px', border: 'none', textAlign: 'center'}}
                  onBlur={onPromoCodeHandler}
                  disabled={promoCorrectStatus ? true : false}
                  className={
                    promoCorrectStatus
                      ? 'bg-secondary text-normal text-black'
                      : 'text-normal text-black'
                  }
                />
              </div>
              {validateStatus.status === 'error' && (
                <div className='flex justify-content-end align-items-center my-[10px]'>
                  <span className='text-red'>
                    {validateStatus.message === 'invalid months'
                      ? t('common.wd-promo-validate-months', {month: validateStatus.month})
                      : t('common.wd-promo-validate')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className='flex justify-content-end align-items-center my-[15px]'>
              <span className='text-normal text-black pr-[10px]'>
                {t('common.wd-promo-question')}
              </span>
              <Button
                shape='circle'
                className='plusIcon'
                icon={<PlusOutlined style={{display: 'block'}} />}
                onClick={onPromoHandler}
              />
            </div>
          )}
        </div>
        {props.carts && props.carts.materials_total > 0 && (
          <>
            <div className='mt-[24px]'>
              <span className='text-header text-black'>{t('cart.no-packing-material')}</span>
            </div>
            <div>
              {props.carts &&
                props.carts.materials &&
                Object.keys(props.carts.materials).map((iter, index) => {
                  const item = props.carts.materials[iter]
                  if (item.count === 0) return <div key={index}></div>
                  return (
                    <div className='flex space-between mt-[20px]' key={index}>
                      <div>
                        <div className='text-normal text-black'>
                          {item.count} x {i18n.language === 'zh' ? item.name_cn : item.name}
                        </div>
                        <div className='text-normal text-black'>
                          ${item.price} {t('cart.no-per-box')}
                        </div>
                      </div>
                      <div className='my-auto'>
                        <span className='text-normal text-black'>${item.count * item.price}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </>
        )}
        <div className='my-8'>
          <div className='flex justify-start items-center '>
            <span
              className='cursor-pointer'
              onClick={() => {
                setShowMessage(!showMessage)
              }}
            >
              {!showMessage ? <DownOutlined /> : <UpOutlined />}
            </span>
            <span
              className='text-normal pl-2 cursor-pointer'
              onClick={() => {
                setShowMessage(!showMessage)
              }}
            >
              {t('cart.wd-return-charge-apply')}
            </span>
          </div>
          {showMessage && (
            <div className='text-sm my-6 pl-6 intro-y'>{t('cart.wd-delivery-floor-fee')}</div>
          )}
          <div className='mt-2'>
            <span className='text-normal'>
              {t('cart.wd-delivery-fee')}
              <a
                href='https://www.ubox.com.hk/faq-billing-box-storage/'
                target='_blank'
                rel='noreferrer'
                className='text-blue cursor-pointer'
              >
                {t('cart.wd-delivery-detail-link')}
              </a>
            </span>
          </div>
        </div>
        <div className='space-line mt-[20px] mb-[20px]'></div>
        <div className='flex space-between'>
          <span>
            <span className='text-header text-black'>{t('common.wd-total')}</span>
            <span className='text-normal text-black'>
              {' '}
              ({props.carts.storage_month} {t('common.wd-months')})
            </span>
          </span>
          <span className='text-header text-black'>${props.carts ? props.carts.total : 0}</span>
        </div>
      </div>
      <div className='note'>
        <div className='text-normal text-black'>{t('cart.no-cancel-notice')}</div>
      </div>
    </div>
  )
}
