import {useTranslation} from 'react-i18next'

export default function RetrievalCart(props) {
  const {cartInfo, retrievalOrder} = props
  const {t, i18n} = useTranslation()

  return (
    <div className='cart-container'>
      <div className='content'>
        <div className='mb-[29px]'>
          <span className='text-header text-black'>{t('cart.no-upfront')}</span>
        </div>
        <div>
          <span className='text-header text-black'>
            {t('customer-retrieval.wd-retrieval-delivery')}
          </span>
        </div>
        <div>
          <div className='flex space-between mt-[20px]'>
            <div>
              <div className='text-normal text-black'>
                {t('customer-retrieval.wd-delivery-fee')}
              </div>
              <div className='text-normal text-black'>
                ${cartInfo.per_delivery_fee} {t('customer-retrieval.wd-each-retrieval')}
              </div>
            </div>
            <div className='my-auto'>
              <span className='text-normal text-black'>
                ${Math.round(parseFloat(cartInfo.per_delivery_fee) * 100) / 100}
              </span>
            </div>
          </div>
          {cartInfo &&
            cartInfo.delivery_items &&
            Object.keys(cartInfo.delivery_items).map((iter, index) => {
              const item = cartInfo.delivery_items[iter]
              if (item.count === 0) return <div key={index}></div>
              return (
                <div className='flex space-between mt-[20px]' key={index}>
                  <div>
                    <div className='text-normal text-black'>
                      {item.count} x {i18n.language === 'zh' ? item.name_cn : item.name}
                    </div>
                    <div className='text-normal text-black'>
                      ${item.delivery_fee} {t('cart.no-per-box')}
                    </div>
                  </div>
                  <div className='my-auto'>
                    <span className='text-normal text-black'>
                      $
                      {cartInfo.free_delivery_state
                        ? 0
                        : Math.round(item.count * parseFloat(item.delivery_fee) * 100) / 100}
                    </span>
                  </div>
                </div>
              )
            })}
          <div className='space-line mt-[20px] mb-[20px]'></div>
          <div className='flex space-between'>
            <span className='text-header text-black'>{t('common.wd-subtotal')}</span>
            <span className='text-header text-black'>${cartInfo.delivery_fee}</span>
          </div>
        </div>
        <div>
          <div className='mt-[30px]'>
            <span className='text-header text-black'>
              {t('customer-retrieval.wd-additional-charge')}
            </span>
          </div>
          <div className='flex space-between mt-[20px]'>
            <div className='text-normal text-black'>
              {t('customer-retrieval.wd-nextday-return-emptybox')}
            </div>
            <div className='my-auto'>
              <span className='text-normal text-black'>${cartInfo.next_day_fee}</span>
            </div>
          </div>
          <div className='flex space-between mt-[20px]'>
            <div>
              <div className='text-normal text-black'>
                {cartInfo.floors} x {t('customer-retrieval.wd-floors')}
              </div>
              <div className='text-normal text-black'>
                ${cartInfo.per_floor_fee} {t('customer-retrieval.wd-per-item-floor')}
              </div>
            </div>
            <div className='my-auto'>
              <span className='text-normal text-black'>${cartInfo.floor_fee}</span>
            </div>
          </div>
        </div>
        <div className='space-line mt-[20px] mb-[20px]'></div>
        <div className='flex space-between'>
          <span>
            <span className='text-header text-black'>{t('common.wd-total')}</span>
            <span className='text-normal text-black'>{cartInfo.storage_month}</span>
          </span>
          <span className='text-header text-black'>${cartInfo ? cartInfo.total_fee : 0}</span>
        </div>
        {cartInfo.min_delivery_state && (
          <div className='flex justify-end mt-[20px]'>
            <span className='text-normal text-red'>
              {t('customer-retrieval.wd-minmum-retrieval-fee', {fee: cartInfo.min_delivery_fee})}
            </span>
          </div>
        )}
        <div className='mt-[20px]'>
          <span className='text-header text-black'>
            {t('customer-retrieval.wd-retrieval-items')}
          </span>
        </div>
        <div className='mt-[15px]'>
          <span className='text-normal text-black'>{retrievalOrder?.qr_code}</span>
        </div>
      </div>
      <div className='note'>
        <div className='text-normal text-black'>{t('cart.no-cancel-notice')}</div>
      </div>
    </div>
  )
}
