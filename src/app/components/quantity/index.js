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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disable])

  const minusValue = () => {
    if (value === '' || value <= 0) {
      onChangeInput(0)
    } else {
      onChangeInput(parseInt(value) - 1)
    }
  }
  const plusValue = () => {
    if (value === '') {
      onChangeInput(1)
    } else {
      onChangeInput(parseInt(value) + 1)
    }
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
      if (isNaN(value)) {
        onChangeHandler(item, 0)
      } else {
        onChangeHandler(item, value)
      }
      setValue(value)
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
