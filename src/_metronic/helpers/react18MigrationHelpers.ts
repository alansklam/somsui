import {ReactNode} from 'react'
import {MenuComponent} from '../assets/ts/components'

type WithChildren = {
  children?: ReactNode,
  paymentRemarkId?: number,
}

const reInitMenu = () => {
  setTimeout(() => {
    MenuComponent.reinitialization()
  }, 500)
}

export {type WithChildren, reInitMenu}
