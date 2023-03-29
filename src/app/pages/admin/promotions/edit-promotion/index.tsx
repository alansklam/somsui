import {useState, useEffect} from 'react'
import ContentPromotion from '../components/content'
import {useSearchParams} from 'react-router-dom'
import {getPromotionApi} from '../../../../store/apis/admin'
import dayjs from 'dayjs'

const EditPromotion = () => {
  const [searchParams] = useSearchParams()
  const promotionId = searchParams.get('promotionId')
  const [promotionInfo, setPromotionInfo] = useState({
    code: '',
    name: '',
    effective_from: '',
    effective_to: '',
    items: [],
  })

  useEffect(() => {
    getPromotionApi({id: promotionId})
      .then((res) => {
        let __promotion = res.data.result
        setPromotionInfo({
          ...promotionInfo,
          code: __promotion.code,
          name: __promotion.name,
          effective_from: dayjs(__promotion.effective_from).format('YYYY-MM-DD'),
          effective_to: dayjs(__promotion.effective_to).format('YYYY-MM-DD'),
          items: __promotion.items,
        })
      })
      .catch((err) => {
        console.log('err', err.data.msg)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promotionId])

  return <>{promotionInfo.code !== '' && <ContentPromotion promotionInfo={promotionInfo} />}</>
}

export default EditPromotion
