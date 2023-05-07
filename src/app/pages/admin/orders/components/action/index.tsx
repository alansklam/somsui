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

  const getMessage = (addNextLine: boolean, isLink: boolean) => {
    let __message = ` 姓名: ${props.data.client.name} ${addNextLine ? '\n' : ''} 香港手機號碼: ${
      props.data.client.contact
    } ${addNextLine ? '\n' : ''} 儲存箱數量: ${getProductsCounter()} ${
      addNextLine ? '\n' : ''
    } ${getOrderStatus()} ${addNextLine ? '\n' : ''} 日期 : ${
      props.data.emptyout_date_other + ' ' + props.data.emptyout_time_other
    } ${addNextLine ? '\n' : ''} 地點: ${
      props.data.client.address1 ? props.data.client.address1 : ''
    } ${addNextLine ? '\n' : ''} 特別指示: ${
      props.data.special_instruction ? props.data.special_instruction : ''
    }`

    let __link = `https://api.whatsapp.com/send?phone=${props.data.client.contact}&text=${__message}`

    if (isLink) {
      return __link
    } else {
      return __message
    }
  }

  const getProductsCounter = () => {
    let __items = props.data.items
    let __message = ''
    __items.forEach((item: any) => {
      if (item.item_qty > 0) {
        __message += item.item_qty + ' ' + item.item.name_cn + ' '
      }
    })
    return __message.toString()
  }

  const getOrderStatus = () => {
    let __status = props.data.order_status_id
    switch (__status) {
      case 8:
        return '<存箱入倉>'
      case 1:
        return '<取吉箱>'
      default:
        return '<取吉箱>'
    }
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
            href={getMessage(false, true)}
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
              navigator.clipboard.writeText(getMessage(true, false))
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
