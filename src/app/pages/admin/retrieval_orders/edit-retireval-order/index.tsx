import {useState, useEffect} from 'react'
import ContentRetrievalOrder from '../components/content'
import {useSearchParams} from 'react-router-dom'
import {getRetrievalOrderApi} from '../../../../store/apis/admin'

const EditRetrievalOrder = () => {
  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [])

  const [searchParams] = useSearchParams()
  const retrievalOrderId = searchParams.get('retrievalOrderId')
  const [retrievalOrder, setRetrievalOrder] = useState({})
  const [retrievalOrderInfo, setRetrievalOrderInfo] = useState({
    empty_return_date_other: '',
    empty_return_time_other: '',
    checkout_location_other: '',
    checkout_date_other: '',
    checkout_time_other: '',
    special_instruction: '',
    paid_fee: '',
  })

  useEffect(() => {
    getRetrievalOrderApi({id: retrievalOrderId})
      .then((res) => {
        let __retrievalOrder = res.data.result
        setRetrievalOrder({
          ...retrievalOrder,
          ...__retrievalOrder,
        })
        setRetrievalOrderInfo({
          ...retrievalOrderInfo,
          empty_return_date_other: __retrievalOrder.empty_return_date_other,
          empty_return_time_other: __retrievalOrder.empty_return_time_other,
          checkout_location_other: __retrievalOrder.checkout_location_other
            ? __retrievalOrder.checkout_location_other
            : '',
          checkout_date_other: __retrievalOrder.checkout_date_other,
          checkout_time_other: __retrievalOrder.checkout_time_other,
          special_instruction: __retrievalOrder.special_instruction
            ? __retrievalOrder.special_instruction
            : '',
          paid_fee: __retrievalOrder.paid_fee ? __retrievalOrder.paid_fee : '',
        })
      })
      .catch((err) => {
        console.log('err', err.data.msg)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievalOrderId])

  return (
    <>
      {retrievalOrderInfo?.checkout_date_other !== '' && (
        <ContentRetrievalOrder
          retrievalOrderInfo={retrievalOrderInfo}
          retrievalOrder={retrievalOrder}
        />
      )}
    </>
  )
}

export default EditRetrievalOrder
