import {useEffect, useState} from 'react'
import {useListView} from '../../core/RetrievalDateListViewProvider'
import {useFormik} from 'formik'
import {editRetrievalDateApi} from '../../../../../store/apis/admin'
import {showNotification} from '../../../components/notification'
import {useSelector} from 'react-redux'
import {RootState} from '../../../../../store/reducers'

export const RetrievalDateAddModalFormWrapper = () => {
  const {uid, itemIdForUpdate, setItemIdForUpdate, data, fetchRetrievalDatesFunc} = useListView()
  const [retrievalDate, setRetrievalDate] = useState('')
  const [retrievalDay, setRetrievalDay] = useState('')
  const [universityId, setUniversityId] = useState('default')
  const universities = useSelector((state: RootState) => state.admin.universities)

  useEffect(() => {
    if (data.length > 0 && itemIdForUpdate !== null) {
      if (itemIdForUpdate !== undefined && itemIdForUpdate !== null) {
        let __day = NaN
        __day = data[itemIdForUpdate].day ? data[itemIdForUpdate].day : NaN
        setRetrievalDay(isNaN(__day) ? '' : __day.toString())
        let __retrieval_date = data[itemIdForUpdate].retrieval_date
          ? data[itemIdForUpdate].retrieval_date
          : ''
        setRetrievalDate(__retrieval_date ? __retrieval_date : '')
        // let __universityId = data[itemIdForUpdate].university_id
        //   ? data[itemIdForUpdate].university_id?.toString()
        //   : 'default'
        // setUniversityId(__universityId ? __universityId : 'default')
      }
    }
    setUniversityId(uid ? uid : 'default')
  }, [uid, data, itemIdForUpdate])

  const initialValues =
    itemIdForUpdate == null
      ? {
          day: '',
        }
      : {
          day: data[itemIdForUpdate].day,
        }

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (retrievalDate === '') {
        showNotification('error', 'Error', 'Please enter the date.')
        return
      }
      if (universityId === 'default') {
        showNotification('error', 'Error', 'Please select the university.')
        return
      }
      if (retrievalDay === '') {
        showNotification('error', 'Error', 'Please select the Retrieval Day.')
        return
      }
      setLoading(true)
      itemIdForUpdate == null
        ? editRetrievalDateApi({
            data: {
              retrieval_date: retrievalDate,
              day: retrievalDay,
              university_id: universityId,
              uid,
            },
            id: undefined,
          })
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Create successfully.')
              fetchRetrievalDatesFunc()
            })
            .catch((err) => {
              setLoading(false)
              showNotification('error', 'Error', err.data.message)
            })
        : editRetrievalDateApi({
            data: {
              retrieval_date: retrievalDate,
              day: retrievalDay,
              university_id: universityId,
              uid,
            },
            id: data[itemIdForUpdate].id,
          })
            .then((res) => {
              setLoading(false)
              setItemIdForUpdate(undefined)
              showNotification('success', 'Success', 'Update successfully.')
              fetchRetrievalDatesFunc()
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
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>University</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <select
                    className='form-select form-select-solid'
                    disabled
                    onChange={(e) => {
                      let __id = ''
                      if (e.target.value !== 'default') {
                        __id = e.target.value
                      }
                      setUniversityId(__id)
                    }}
                    value={universityId}
                  >
                    <option value='default'>Select University</option>
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
                  <span className='required'>Retrieval Date</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='date'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Date'
                    value={retrievalDate}
                    onChange={(e) => {
                      setRetrievalDate(e.target.value)
                    }}
                  />
                </div>
              </div>

              <div className='row mb-6'>
                <label className='col-lg-4 col-form-label fw-bold fs-6'>
                  <span className='required'>Retrieval Day</span>
                </label>

                <div className='col-lg-8 fv-row'>
                  <input
                    type='number'
                    className='form-control form-control-lg form-control-solid'
                    placeholder='Retrieval Day'
                    value={retrievalDay}
                    onChange={(e) => {
                      setRetrievalDay(e.target.value)
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
