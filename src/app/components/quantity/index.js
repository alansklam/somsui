import {useState, useEffect} from 'react'
import NumberInput from './NumberInput'

const Quantity = (props) => {
  const {item, onChangeHandler, maxValue, disable} = props
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    if (disable) {
      setValue(props.value)
      onChangeHandler(item, value)
    }
  }, [disable])

  const minusValue = () => {
    onChangeInput(value === 0 ? 0 : value - 1)
  }
  const plusValue = () => {
    onChangeInput(value + 1)
  }
  const onChangeInput = (value) => {
    if (!disable) {
      if (maxValue !== undefined) {
        if (value > maxValue) {
          setValue(maxValue)
          onChangeHandler(item, maxValue)
        } else {
          setValue(value)
          onChangeHandler(item, value)
        }
        return
      }
      setValue(value)
      onChangeHandler(item, value)
    }
  }
  return (
    <div className='flex item-center'>
      <div className='flex my-auto min-w-[96px]'>
        <div className='my-auto'>
          <img
            src='/images/vleft.png'
            alt='minus'
            className='hand'
            onClick={minusValue}
            width={8}
            height={12}
          />
        </div>
        <NumberInput className='mr-[14px] ml-[14px]' value={value} onChange={onChangeInput} />
        <div className='my-auto'>
          <img
            src='/images/vright.png'
            alt='plus'
            className='hand'
            onClick={plusValue}
            width={8}
            height={12}
          />
        </div>
      </div>
    </div>
  )
}

export default Quantity
