import {useState, useEffect} from 'react'
// import { useSelector } from 'react-redux'
import { useRetrievalOrdersListView } from '../../core/RetrievalOrdersListViewProvider'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { editClientApi } from '../../../../../store/apis/admin'
// import { RootState } from '../../../../../store/reducers'

export const RetrievalOrdersClientEditModalFormWrapper = () => {

  // const universities = useSelector((state:RootState) => state.admin.universities);
  const [universityId, setUniversityId] = useState("");
  const { clientIdForUpdate, setClientIdForUpdate, data, fetchOrdersFunc } = useRetrievalOrdersListView();
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
  });

  const initialValues = (clientIdForUpdate == null) ? {
    name: "",
    email: "",
    contact: undefined,
    address1: "",
    wechat: "",
    student_id: "",
    password: "",
    confirmPassword: "",
  } : {
    name: data[clientIdForUpdate]?.client?.name,
    email: data[clientIdForUpdate]?.client?.email,
    contact: data[clientIdForUpdate]?.client?.contact ? data[clientIdForUpdate]?.client?.contact : undefined,
    address1: data[clientIdForUpdate]?.client?.address1 ? data[clientIdForUpdate]?.client?.address1 : "",
    wechat: data[clientIdForUpdate]?.client?.wechat ? data[clientIdForUpdate]?.client?.wechat : "",
    student_id: data[clientIdForUpdate]?.client?.student_id ? data[clientIdForUpdate]?.client?.student_id : "",
    password: "",
    confirmPassword: "",
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true);
      (clientIdForUpdate == null) ? 
      editClientApi({data: {...values, universityId}, id: undefined})
        .then((res) => {
          setLoading(false);
          setClientIdForUpdate(undefined);
          fetchOrdersFunc();
        })
        .catch(() => {
          setLoading(false);
        }) :
      editClientApi({data: {...values, universityId}, id: data[clientIdForUpdate].client.id})
        .then((res) => {
          setLoading(false);
          setClientIdForUpdate(undefined);
          fetchOrdersFunc();
        })
        .catch((err) => {
          setLoading(false);
        })
    },
  });

  useEffect(() => {
    if(data.length > 0 && clientIdForUpdate !== undefined) {
      if(clientIdForUpdate !== null) {
        let __universityId = data[clientIdForUpdate].client.university_id?.toString();
        __universityId && setUniversityId(__universityId);
      } else {
        setUniversityId("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
                    placeholder='Minimum storage month'
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

              <div className='row mb-6'>
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
              
              {
                (clientIdForUpdate == null) && 
                <>
                  <div className='row mb-6'>
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

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Confirm Password</span>
                    </label>

                    <div className='col-lg-8 fv-row'>
                      <input
                        type='password'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Confirm Password'
                        {...formik.getFieldProps('confirmPassword')}
                      />
                      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.confirmPassword} {formik.values.password === formik.values.confirmPassword ? 'Confirm password is incorrect' : ''}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              }
            </div>

            <div className='card-footer d-flex justify-content-end py-6 px-9'>
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
    </>
  )
}