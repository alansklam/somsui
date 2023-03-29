import {useState} from 'react'
import {useSelector} from 'react-redux'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {RootState} from '../../../../../store/reducers'
import {editClientApi} from '../../../../../store/apis/admin'
import {useNavigate} from 'react-router-dom'
import {useSearchParams} from 'react-router-dom'
import {showNotification} from '../../../components/notification'

type propsState = {
  customerInfo: {
    name: string | undefined
    email: string | undefined
    contact: number | undefined
    address1: string | undefined
    wechat: string | undefined
    student_id: string | undefined
    password: string | undefined
    confirmPassword: string | undefined
  }
  onSave: Function
  createState: boolean
}

const ContentCustomer = (props: propsState) => {
  const navigateTo = useNavigate()
  const {customerInfo, createState} = props
  const [searchParams] = useSearchParams()
  const clientId = searchParams.get('clientId')
  const universities = useSelector((state: RootState) => state.admin.universities)
  const [universityId, setUniversityId] = useState('')
  const [resetPassword, setResetPassword] = useState(false)
  const [errorStatus, setErrorStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  const profileDetailsSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name 3 symbols')
      .max(50, 'Name 50 symbols'),
    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Email 3 symbols')
      .max(50, 'Email 50 symbols')
      .required('Email is required'),
    contact: Yup.number()
      .required('Contact is required')
      .positive('This field should be positive integer')
      .integer('This field should be positive integer')
      .min(9999999, 'Contact 8 symbols')
      .max(100000000000, 'Contact 11 symbols'),
    address1: Yup.string()
      .required('Name is required')
      .min(3, 'Name 3 symbols')
      .max(100, 'Name 100 symbols'),

    // password: Yup.string()
    //         .required('Password is required')
    //         .min(5, 'Password 5 symbols')
    //         .max(50, 'Password 50 symbols'),
    // confirmPassword: Yup.string()
    //         .required('Password is required')
    //         .min(5, 'Password 5 symbols')
    //         .max(50, 'Password 50 symbols'),
  })

  const initialValues = customerInfo
  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      createState
        ? editClientApi({data: {...values, universityId}, id: undefined})
            .then((res) => {
              setLoading(false)
              setErrorStatus(false)
              navigateTo('/admin/clients')
              showNotification('success', 'Success', 'Created successfully.')
            })
            .catch((err) => {
              setLoading(false)
              setErrorStatus(true)
              showNotification('error', 'Error', err.data.message)
            })
        : editClientApi({data: {...values, universityId}, id: clientId})
            .then((res) => {
              setLoading(false)
              setErrorStatus(false)
              navigateTo('/admin/clients')
              showNotification('success', 'Success', 'Updated successfully.')
            })
            .catch((err) => {
              setLoading(false)
              setErrorStatus(true)
              showNotification('error', 'Error', err.data.message)
            })
    },
  })

  return (
    <div className='mw-800px box mx-auto'>
      <div className=''>
        <div className='mx-5 mx-xl-15'>
          <h2 className='fw-bolder fs-1 px-9'>Client</h2>
        </div>
        <div className='mx-5 mx-xl-15 my-7'>
          <div className='card mb-5 mb-xl-10'>
            <div id='kt_account_profile_details' className='collapse show'>
              <form onSubmit={formik.handleSubmit} noValidate className='form'>
                <div className='card-body border-top p-9'>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6'>Name</label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Name'
                        {...formik.getFieldProps('name')}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.name}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Email</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Email'
                        {...formik.getFieldProps('email')}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.email}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Contact</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='number'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Contact'
                        {...formik.getFieldProps('contact')}
                      />
                      {formik.touched.contact && formik.errors.contact && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.contact}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Address</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Address'
                        {...formik.getFieldProps('address1')}
                      />
                      {formik.touched.address1 && formik.errors.address1 && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.address1}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Univerisity</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <select
                        className='form-select form-select-solid'
                        onChange={(e) => {
                          let __id = ''
                          if (e.target.value !== 'default') {
                            __id = e.target.value
                          }
                          setUniversityId(__id)
                        }}
                        value={universityId}
                      >
                        <option value='default'>Select Univeristy</option>
                        {universities.length > 0 &&
                          universities.map((university, index) => (
                            <option value={university.id} key={index}>
                              {university.display_name}
                            </option>
                          ))}
                      </select>
                      {formik.touched.address1 && formik.errors.address1 && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.address1}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>WeChat</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='WeChat'
                        {...formik.getFieldProps('wechat')}
                      />
                      {formik.touched.wechat && formik.errors.wechat && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.wechat}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Student ID</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Student ID'
                        {...formik.getFieldProps('student_id')}
                      />
                      {formik.touched.student_id && formik.errors.student_id && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.student_id}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {(resetPassword === true || createState === true) && (
                    <>
                      <div className='row mt-6'>
                        <label className='col-lg-4 col-form-label fw-bold fs-6'>
                          <span className='required'>Password</span>
                        </label>

                        <div className='col-lg-8 fv-row'>
                          <input
                            type='password'
                            className='form-control form-control-lg form-control-solid'
                            placeholder='Password'
                            autoComplete='new-password'
                            {...formik.getFieldProps('password')}
                          />
                          {formik.touched.password && formik.errors.password && (
                            <div className='fv-plugins-message-container'>
                              <div className='fv-help-block'>{formik.errors.password}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {errorStatus && (
                    <div className='alert alert-danger mt-6'>
                      <div className='alert-text font-weight-bold'>Email is already exist.</div>
                    </div>
                  )}
                </div>

                <div className='card-footer d-flex justify-content-end py-10 px-9'>
                  {!createState && (
                    <span
                      className='btn btn-danger mx-7'
                      onClick={(e) => {
                        setResetPassword(true)
                      }}
                    >
                      Reset Password
                    </span>
                  )}

                  <button type='submit' className='btn btn-primary' disabled={loading}>
                    {!loading && 'Save Changes'}
                    {loading && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...{' '}
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentCustomer
