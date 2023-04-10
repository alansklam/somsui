// import { useRef } from "react"
import React from 'react'
// const {useRef} = React;

type propState = {
  min: string
  max: string
  value: string
  onChange: Function
  placeholder: string
}

const CustomDatepicker = (props: propState) => {
  const {min, max, value, onChange, placeholder} = props
  const date = React.useRef<HTMLInputElement>(null)
  const onClickHandler = () => {
    console.log('date', date)
    date.current?.focus()
    date.current?.click()
  }
  return (
    <>
      <span>{value}</span>
      <button onClick={onClickHandler}>date</button>
      <input
        type='string'
        disabled
        onClick={onClickHandler}
        className='form-control form-control-lg form-control-solid'
        placeholder={placeholder}
        value={value}
      />
      <input
        id='customDate'
        type='date'
        ref={date}
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          onChange(e)
        }}
        onKeyDown={(e) => e.preventDefault()}
      />
    </>
  )
}

export default CustomDatepicker
