import {useState} from 'react'
import {useListView} from '../../core/ItemsListViewProvider'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {editItemsApi} from '../../../../../store/apis/admin'

export const ItemsEditModalFormWrapper = () => {
  const {itemIdForEdit, setItemIdForEdit, data, fetchItemsFunc} = useListView()

  const profileDetailsSchema = Yup.object().shape({})

  const initialValues = {}

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true)
      editItemsApi({
        data: {
          ...values,
        },
        id: itemIdForEdit !== undefined ? data[itemIdForEdit].id : '',
      })
        .then((res) => {
          setLoading(false)
          fetchItemsFunc()
          setItemIdForEdit(undefined)
        })
        .catch((err) => {
          setLoading(false)
        })
    },
  })

  return (
    <>
      <div className='card mb-5 mb-xl-10'>
        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'></div>

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
