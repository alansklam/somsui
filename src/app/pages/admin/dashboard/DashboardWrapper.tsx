/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useSelector} from 'react-redux'
// import {toAbsoluteUrl} from '../../../../_metronic/helpers'
import {PageTitle} from '../../../../_metronic/layout/core'
import {RootState} from '../../../store/reducers'
import {UniversityWidget} from './UniversityWidget'
import {LoadingSpinner} from '../components/spinner/LoadingSpinner'
import {fetchDashboardDataApi} from '../../../store/apis/admin'

const DashboardPage: FC = () => {
  // const universities = useSelector((state: RootState) => state.admin.universities)
  const isLoading = useSelector((state: RootState) => state.admin.loading)
  const [dashboardData, setDashboardData] = useState<any[]>([])

  const getColor = (index: number) => {
    switch (index) {
      case 0:
        return 'warning'
      case 1:
        return 'success'
      case 2:
        return 'primary'
      case 3:
        return 'danger'
      case 4:
        return 'info'
      case 5:
        return 'primary'
      case 6:
        return 'success'
      case 7:
        return 'warning'
      case 8:
        return 'danger'
      case 9:
        return 'info'
      default:
        return ''
    }
  }

  useEffect(() => {
    fetchDashboardDataApi().then((res) => {
      let __data = res.data
      setDashboardData(__data)
    })
  }, [])

  return (
    <>
      <div className='row'>
        {dashboardData.length > 0 &&
          dashboardData.map((item, index) => (
            <div className='col-xl-4 col-sm-4 col-xs-12 py-5' key={index}>
              <UniversityWidget
                location={'/admin/orders?uid=90&order_status_id=' + item?.order_status_id}
                className='card-xl-stretch mb-xl-8 min-h-200px'
                svgIcon='/media/icons/duotune/ecommerce/ecm008.svg'
                iconColor='white'
                color={getColor(index)}
                title={item.count}
                titleColor='white'
                description={item.label}
                descriptionColor='white'
              />
            </div>
          ))}
      </div>
      {isLoading && <LoadingSpinner />}
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
