import ContentCustomer from '../components/content'

const AddCustomer = () => {
  const customerInfo = {
    name: '',
    email: '',
    contact: undefined,
    address1: '',
    wechat: '',
    student_id: '',
    password: '',
    confirmPassword: '',
  }

  const saveHandler = () => {}

  return (
    <>
      <ContentCustomer customerInfo={customerInfo} onSave={saveHandler} createState={true} />
    </>
  )
}

export default AddCustomer
