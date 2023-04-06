import {useEffect, useState} from 'react'
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
    university_id: string | undefined
    mobile_phone_cn: string | undefined
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
  const [universityId, setUniversityId] = useState<string>('')
  const [resetPassword, setResetPassword] = useState(false)
  const [errorStatus, setErrorStatus] = useState(false)
  const [loading, setLoading] = useState(false)

  const profileDetailsSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name should be 3 numbers at least')
      .max(50, 'Name should be 50 numbers at maximum'),
    email: Yup.string()
      .email('Wrong email format')
      .min(3, 'Email should be 3 numbers at least')
      .max(50, 'Email should be 50 numbers at maximum')
      .required('Email is required'),
    contact: Yup.number()
      .required('Contact is required')
      .positive('This field should be positive integer')
      .integer('This field should be positive integer')
      .min(9999999, 'Contact should be 8 numbers at least')
      .max(100000000000, 'Contact should be 11 numbers at maximum'),
    mobile_phone_cn: Yup.number()
      .positive('This field should be positive integer')
      .integer('This field should be positive integer')
      .min(9999999, 'Phone CN should be 8 numbers at least')
      .max(100000000000, 'Phone CN should be 11 numbers at maximum'),
    address1: Yup.string()
      .required('Address is required')
      .min(3, 'Address should be 3 letters at least')
      .max(100, 'Address should be 100 letters at maximum'),

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
              navigateTo(-1)
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
              navigateTo(-1)
              showNotification('success', 'Success', 'Updated successfully.')
            })
            .catch((err) => {
              setLoading(false)
              setErrorStatus(true)
              showNotification('error', 'Error', err.data.message)
            })
    },
  })

  useEffect(() => {
    console.log('university', customerInfo?.university_id)
    if (clientId) {
      setUniversityId(
        customerInfo?.university_id?.toString() ? customerInfo?.university_id.toString() : ''
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

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
                      <span className=''>Phone CN</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='number'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Phone CN'
                        {...formik.getFieldProps('mobile_phone_cn')}
                      />
                      {formik.touched.mobile_phone_cn && formik.errors.mobile_phone_cn && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.mobile_phone_cn}</div>
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
                            <option value={university.id.toString()} key={index}>
                              {university.display_name}
                            </option>
                          ))}
                      </select>
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

                  {!createState && (
                    <div className='row mt-6'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'></label>

                      <div className='col-lg-8 fv-row flex flex-end'>
                        <span
                          className='btn btn-danger'
                          onClick={(e) => {
                            setResetPassword(true)
                          }}
                        >
                          Reset Password
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className='card-footer d-flex justify-content-end py-10 px-9'>
                  <span
                    className='btn btn-secondary mx-7'
                    onClick={(e) => {
                      navigateTo(-1)
                    }}
                  >
                    Cancel
                  </span>

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
