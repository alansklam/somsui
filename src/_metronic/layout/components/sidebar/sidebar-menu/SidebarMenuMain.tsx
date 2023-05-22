/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import {useIntl} from 'react-intl'
// import {KTSVG} from '../../../../helpers'
import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import {useSelector} from 'react-redux'
import {RootState} from '../../../../../app/store/reducers'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const universities = useSelector((state: RootState) => state.admin.universities)

  return (
    <>
      <SidebarMenuItem
        to='/admin/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>
      <SidebarMenuItem
        to='/admin/clients'
        icon='/media/icons/duotune/communication/com006.svg'
        title={'Customer list'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItemWithSub
        to='/admin/payments'
        icon='/media/icons/duotune/general/gen051.svg'
        title='Payment History'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/admin/payments/normal' title='Normal Payment' hasBullet={true} />
        <SidebarMenuItem
          to='/admin/payments/retrieval'
          title='Retrieval Payment'
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to='/admin/storage-periods'
        icon='/media/icons/duotune/general/gen054.svg'
        title={'Storage Period List'}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/admin/promotions'
        icon='/media/icons/duotune/general/gen022.svg'
        title='Promotion List'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItemWithSub
        to='/admin/orders'
        title='Client Group'
        icon='/media/icons/duotune/general/gen049.svg'
      >
        <SidebarMenuItem to='/admin/orders?uid=90' title='All' hasBullet={true} />
        {universities &&
          universities.length > 0 &&
          universities.map((university, index) => (
            <SidebarMenuItem
              key={index}
              to={'/admin/orders?uid=' + university.id}
              title={university.university_alias}
              hasBullet={true}
            />
          ))}
      </SidebarMenuItemWithSub>
      <SidebarMenuItem
        to='/admin/retrieval-order'
        icon='/media/icons/duotune/general/gen005.svg'
        title='Retrieval Orders List'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/admin/items'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Item List'
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItemWithSub
        to='/admin/retrieval-date'
        title='Retrieval Date List'
        icon='/media/icons/duotune/general/gen049.svg'
      >
        {universities &&
          universities.length > 0 &&
          universities.map((university, index) => (
            <SidebarMenuItem
              key={index}
              to={'/admin/retrieval-date?uid=' + university.id}
              title={university.university_alias}
              hasBullet={true}
            />
          ))}
      </SidebarMenuItemWithSub>
    </>
  )
}

export {SidebarMenuMain}
