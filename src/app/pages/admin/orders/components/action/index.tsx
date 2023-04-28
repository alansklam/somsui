import {useEffect} from 'react'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {KTSVG} from '../../../../../../_metronic/helpers'
import {notification} from 'antd'

type PropState = {
  id: number
  sendInvoice: Function
  data: any
}

const OrderActionList = (props: PropState) => {
  const isLoading = false

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const getProductsCounter = () => {
    let __items = props.data.items
    let __product_count = 0
    __items.forEach((item: any) => {
      if (item.item_category !== 'bag') {
        __product_count += item.item_qty
      }
    })
    return __product_count.toString()
  }

  const getMaterialCounter = () => {
    let __items = props.data.items
    let __material_count = 0
    __items.forEach((item: any) => {
      if (item.item_category === 'bag') {
        __material_count += item.item_qty
      }
    })
    return __material_count.toString()
  }

  return (
    <>
      <button
        disabled={isLoading}
        type='button'
        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm mx-1'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        <KTSVG path='/media/icons/duotune/general/gen019.svg' className='svg-icon-2' />
      </button>

      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold w-200px'
        data-kt-menu='true'
      >
        <div className='menu-item px-3 mt-3'>
          <div
            className='menu-link px-3 justify-center fw-bold fs-6'
            onClick={() => {
              props.sendInvoice(props.id)
            }}
          >
            Send Invoice
          </div>
        </div>
        <div className='menu-item px-3'>
          <a
            href={`https://api.whatsapp.com/send?phone=${props.data.client.contact}&text=${`姓名: ${
              props.data.client.name
            } 香港手機號碼: ${
              props.data.client.contact
            } 儲存箱數量: ${getProductsCounter()} 標準箱 ${getProductsCounter()} 行李箱, ${getMaterialCounter()} 真空袋: ${
              props.data.order_status_id > 8 ? '<存箱入倉>' : '<取吉箱>'
            } 日期 : ${props.data.emptyout_date_other + props.data.emptyout_time_other} 地點: ${
              props.data.client.address1 ? props.data.client.address1 : ''
            } 特別指示: ${props.data.special_instruction ? props.data.special_instruction : ''}`}`}
            target='_blank'
            rel='noopener noreferrer'
            className='menu-link px-3 justify-center fw-bold fs-6'
          >
            Send WhatsApp
          </a>
        </div>
        <div className='menu-item px-3 mb-3'>
          <div
            className='menu-link px-3 justify-center fw-bold fs-6'
            onClick={() => {
              navigator.clipboard.writeText(
                `姓名: ${props.data.client.name} 香港手機號碼: ${
                  props.data.client.contact
                } 儲存箱數量: ${getProductsCounter()} 標準箱 ${getProductsCounter()} 行李箱, ${getMaterialCounter()} 真空袋: ${
                  props.data.order_status_id > 8 ? '<存箱入倉>' : '<取吉箱>'
                } 日期 : ${props.data.emptyout_date_other + props.data.emptyout_time_other} 地點: ${
                  props.data.client.address1 ? props.data.client.address1 : ''
                } 特別指示: ${props.data.special_instruction ? props.data.special_instruction : ''}`
              )

              notification.success({
                message: 'Success',
                description: 'Copy Message!',
                placement: 'topRight',
                duration: 2,
              })
            }}
          >
            Copy WhatsApp
          </div>
        </div>
      </div>
    </>
  )
}

export {OrderActionList}
