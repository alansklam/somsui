import {useEffect, useState} from 'react'
import {useListView} from '../../core/SettingsListViewProvider'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {editSettingsApi} from '../../../../../store/apis/admin'
import {showNotification} from '../../../components/notification'

export const SettingsAddModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate, data, fetchSettingsFunc} = useListView()

  const profileDetailsSchema = Yup.object().shape({
    value: Yup.string().required('Value is required'),
    code: Yup.string().required('Label is required'),
  })

  useEffect(() => {
    if (data.length > 0 && itemIdForUpdate !== null) {
      if (itemIdForUpdate !== undefined && itemIdForUpdate !== null) {
      }
    }
  }, [data, itemIdForUpdate])

  const initialValues =
    itemIdForUpdate == null
      ? {
          value: '',
          code: '',
        }
      : {
          value: data[itemIdForUpdate].value,
          code: data[itemIdForUpdate].code,
        }

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      itemIdForUpdate == null
        ? editSettingsApi({data: {...values}, id: undefined})
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Create successfully.')
              fetchSettingsFunc()
            })
            .catch((err) => {
              setLoading(false)
              showNotification('error', 'Error', err.data.message)
            })
        : editSettingsApi({
            data: {...values},
            id: data[itemIdForUpdate].id,
          })
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Update successfully.')
              fetchSettingsFunc()
            })
            .catch((err) => {
              setLoading(false)
              showNotification('error', 'Error', err.data.message)
            })
    },
  })

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label required fw-bold fs-6'>Code</label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Code'
                    disabled
                    {...formik.getFieldProps('code')}
                  />
                  {formik.touched.code && formik.errors.code && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.code}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Value</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Value'
                    {...formik.getFieldProps('value')}
                  />
                  {formik.touched.value && formik.errors.value && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.value}</div>
                    </div>
                  )}
                </div>
              </div>
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
