import {useEffect, useState} from 'react'
import {useListView} from '../../core/PeriodsListViewProvider'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {editPeriodsApi} from '../../../../../store/apis/admin'
import {showNotification} from '../../../components/notification'

export const StoragePeriodsAddModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate, data, fetchPeriodsFunc} = useListView()

  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')

  const profileDetailsSchema = Yup.object().shape({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
  })

  useEffect(() => {
    if (data.length > 0 && itemIdForUpdate !== null) {
      if (itemIdForUpdate !== undefined && itemIdForUpdate !== null) {
        let min = NaN
        let max = NaN
        min = data[itemIdForUpdate].min ? data[itemIdForUpdate].min : NaN
        max = data[itemIdForUpdate].max ? data[itemIdForUpdate].max : NaN
        setMinValue(isNaN(min) ? '' : min.toString())
        setMaxValue(isNaN(max) ? '' : max.toString())
      }
    }
  }, [data, itemIdForUpdate])

  const initialValues =
    itemIdForUpdate == null
      ? {
          code: '',
          name: '',
        }
      : {
          code: data[itemIdForUpdate].code,
          name: data[itemIdForUpdate].name,
        }

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      if (minValue === '' && maxValue === '') {
        showNotification('error', 'Error', 'Please fill min or max field.')
        return
      }
      if (parseInt(minValue) > parseInt(maxValue)) {
        showNotification('error', 'Error', 'Please fix the periods.')
        return
      }
      setLoading(true)
      itemIdForUpdate == null
        ? editPeriodsApi({data: {...values, min: minValue, max: maxValue}, id: undefined})
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Create successfully.')
              fetchPeriodsFunc()
            })
            .catch((err) => {
              setLoading(false)
              showNotification('error', 'Error', err.data.message)
            })
        : editPeriodsApi({
            data: {...values, min: minValue, max: maxValue},
            id: data[itemIdForUpdate].id,
          })
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Update successfully.')
              fetchPeriodsFunc()
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
                  <span className='required'>Name</span>
                </label>

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
                  <span className='required'>Minimum storage period</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='number'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Minimum storage month'
                    value={minValue}
                    onChange={(e) => {
                      setMinValue(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Maximum storage period</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='number'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Maximum storage month'
                    value={maxValue}
                    onChange={(e) => {
                      setMaxValue(e.target.value)
                    }}
                  />
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
