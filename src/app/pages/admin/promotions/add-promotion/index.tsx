import ContentPromotion from '../components/content'

const AddPromotion = () => {
  const promotionInfo = {
    code: '',
    name: '',
    effective_from: '',
    effective_to: '',
    items: [],
  }

  return (
    <>
      <ContentPromotion promotionInfo={promotionInfo} />
    </>
  )
}

export default AddPromotion
