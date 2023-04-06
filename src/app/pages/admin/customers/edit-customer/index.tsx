import {useEffect, useState} from 'react'
import ContentCustomer from '../components/content'
import {useSearchParams} from 'react-router-dom'
import {getClientApi} from '../../../../store/apis/admin'

const EditCustomer = () => {
  const [searchParams] = useSearchParams()
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    contact: undefined,
    address1: '',
    wechat: '',
    student_id: '',
    mobile_phone_cn: '',
    password: '',
    confirmPassword: '',
    university_id: '',
  })

  useEffect(() => {
    let clientId = searchParams.get('clientId')

    getClientApi({id: clientId})
      .then((res) => {
        let client = res.data.result
        setCustomerInfo({
          ...customerInfo,
          name: client.name ? client.name : '',
          email: client.email ? client.email : '',
          contact: client.contact ? client.contact : '',
          address1: client.address1 ? client.address1 : '',
          wechat: client.wechat ? client.wechat : '',
          student_id: client.student_id ? client.student_id : '',
          mobile_phone_cn: client.mobile_phone_cn ? client.mobile_phone_cn : '',
          university_id: client.university_id ? client.university_id.toString() : '',
          password: '',
          confirmPassword: '',
        })
      })
      .catch((err) => {
        console.log('err', 'err')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const saveHandler = () => {}

  return (
    <>
      {customerInfo.name !== '' && (
        <ContentCustomer customerInfo={customerInfo} onSave={saveHandler} createState={false} />
      )}
    </>
  )
}

export default EditCustomer
