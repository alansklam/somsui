import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useListView} from '../../core/ItemsListViewProvider'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {editItemsApi} from '../../../../../store/apis/admin'
import {fetchRef, fetchProducts} from '../../../../../store/actions/admin'
import {showNotification} from '../../../components/notification'

export const ItemsAddModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate, data, fetchItemsFunc} = useListView()
  const dispatch = useDispatch()

  const [descriptionCn, setDescriptionCn] = useState('')
  const [category, setCategory] = useState('box')
  const [topState, setTopState] = useState(false)

  const profileDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    name_cn: Yup.string().required('Name CN is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.string().required('Price is required'),
    delivery_fee: Yup.string().required('Delivery fee is required'),
    uri: Yup.string().required('Image URL is required'),
  })

  const initialValues =
    itemIdForUpdate == null
      ? {
          name: '',
          name_cn: '',
          category: '',
          description: '',
          price: '',
          delivery_fee: '',
          qrcode: '',
          uri: '',
        }
      : {
          name: data[itemIdForUpdate].name,
          name_cn: data[itemIdForUpdate].name_cn,
          category: data[itemIdForUpdate].category ? data[itemIdForUpdate].category : '',
          description: data[itemIdForUpdate].description ? data[itemIdForUpdate].description : '',
          price: data[itemIdForUpdate].price ? data[itemIdForUpdate].price : '',
          delivery_fee: data[itemIdForUpdate].delivery_fee
            ? data[itemIdForUpdate].delivery_fee
            : '',
          qrcode: data[itemIdForUpdate].qr_code ? data[itemIdForUpdate].qr_code : '',
          uri: data[itemIdForUpdate].uri ? data[itemIdForUpdate].uri : '',
        }

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      itemIdForUpdate == null
        ? editItemsApi({
            data: {
              ...values,
              category: category,
              description_cn: descriptionCn,
              top_state: topState,
            },
            id: undefined,
          })
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Create successfully.')
              fetchItemsFunc()
              dispatch(fetchProducts())
              dispatch(fetchRef())
            })
            .catch((err) => {
              setLoading(false)
              showNotification('error', 'Error', 'Failed create.')
            })
        : editItemsApi({
            data: {
              ...values,
              category: category,
              description_cn: descriptionCn,
              top_state: topState,
            },
            id: data[itemIdForUpdate].id,
          })
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Update successfully.')
              fetchItemsFunc()
              dispatch(fetchProducts())
              dispatch(fetchRef())
            })
            .catch((err) => {
              showNotification('error', 'Error', 'Failed update.')
              setLoading(false)
            })
    },
  })

  useEffect(() => {
    if (itemIdForUpdate !== undefined && itemIdForUpdate !== null) {
      if (data[itemIdForUpdate].top_state === 1) {
        setTopState(true)
      }
      setCategory(data[itemIdForUpdate].category)
      setDescriptionCn(
        data[itemIdForUpdate].description_cn ? data[itemIdForUpdate].description_cn : ''
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIdForUpdate])

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
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
                  <span className='required'>Name CN</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Name CN'
                    {...formik.getFieldProps('name_cn')}
                  />
                  {formik.touched.name_cn && formik.errors.name_cn && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.name_cn}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Category</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select form-select-solid'
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)
                    }}
                  >
                    <option value={'box'}>{'Box'}</option>
                    <option value={'bag'}>{'Bag'}</option>
                  </select>
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Description</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <textarea
                    // type='text'
                    className='form-control form-control-lg form-control-solid h-150px'
                    placeholder='Description'
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.description}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>Description CN</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <textarea
                    className='form-control form-control-lg form-control-solid h-150px'
                    placeholder='Description CN'
                    value={descriptionCn}
                    onChange={(e) => {
                      setDescriptionCn(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Price</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='number'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Price'
                    {...formik.getFieldProps('price')}
                  />
                  {formik.touched.price && formik.errors.price && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.price}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Delivery fee</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='number'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Delivery fee'
                    {...formik.getFieldProps('delivery_fee')}
                  />
                  {formik.touched.delivery_fee && formik.errors.delivery_fee && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.delivery_fee}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Image URL</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='text'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Image URL'
                    {...formik.getFieldProps('uri')}
                  />
                  {formik.touched.uri && formik.errors.uri && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.uri}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>QR code</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <textarea
                    className='form-control form-control-lg form-control-solid h-100px'
                    placeholder='QR Code'
                    {...formik.getFieldProps('qrcode')}
                  />
                  {formik.touched.qrcode && formik.errors.qrcode && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>{formik.errors.qrcode}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className=''>Top State</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch form-check-custom form-check-solid'>
                    <input
                      className='form-check-input cursor-pointer'
                      type='checkbox'
                      checked={topState}
                      onChange={() => {
                        setTopState(!topState)
                      }}
                    />
                  </div>
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
