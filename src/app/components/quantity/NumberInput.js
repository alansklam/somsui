const NumberInput = (props) => {
  const {onChange} = props
  const onChangeHandle = (e) => {
    onChange(parseInt(e.target.value))
  }
  const onBlurHandle = (e) => {
    let __value = e.target.value
    if (e.target.value === '') {
      __value = '0'
    }
    onChange(parseInt(__value))
  }

  return (
    <>
      <input
        type='number'
        min={0}
        max={18}
        value={props.value}
        onChange={onChangeHandle}
        onBlur={onBlurHandle}
        className={`number-input ${
          props.value !== 0 && !isNaN(props.value) ? 'bg-active' : 'bg-default'
        } text-normal-18 text-white ${props.className}`}
      />
    </>
  )
}
export default NumberInput
