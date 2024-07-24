import {useState, useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import dayjs from 'dayjs'
import {createTheme, Grid, MenuItem, ThemeProvider, RadioGroup} from '@mui/material'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import CssFormControlLabel from '../../../components/custom-components/FormControlLabel'
import CustomColorRadio from '../../../components/custom-components/RadioButton'
import CssTextField from '../../../components/custom-components/TextField'
import Quantity from '../../../components/quantity'
import {useDispatch, useSelector} from 'react-redux'
import {
  fetchRetrievalAddress,
  fetchRetrievalDates,
  fetchRetrievalEmptyDates,
} from '../../../store/actions/client'
import {fetchRetrievalLimitApi} from '../../../store/apis/client'
// import {showNotification} from '../../admin/components/notification'

export default function RetrievalEdit(props) {
  const {
    order,
    products,
    retrievalOrder,
    setRetrievalOrder,
    cartInfo,
    setCartInfo,
    onCartHandler,
    setPermitRetrieve,
  } = props
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const freeRetrievalDates = useSelector((state) => state.client.retrievalDates)
  const retrievalEmptyDates = useSelector((state) => state.client.retrievalEmptyDates)
  const retrievalAddresses = useSelector((state) => state.client.retrievalAddress)
  const client = useSelector((state) => state.client.client)
  const additionalDay = parseInt(process.env.REACT_APP_RETRIEVAL_ADDITIONAL_DATE)

  const [initState, setInitState] = useState(false)
  const [retrievalDate, setRetrievalDate] = useState(
    dayjs().add(additionalDay, 'day').format('YYYY-MM-DD')
  )
  const [retrievalTimeIndex, setRetrievalTimeIndex] = useState(0)
  const [emptyBoxReturnDate, setEmptyBoxReturnDate] = useState(
    dayjs().add(additionalDay, 'day').format('YYYY-MM-DD')
  )
  const [emptyBoxReturnTimeIndex, setEmptyBoxReturnTimeIndex] = useState(0)
  const [retrievalAddress, setRetrievalAddress] = useState('')
  const [isSameDay, setIsSameDay] = useState(1)
  const [isGroupReturnDay, setIsGroupReturnDay] = useState(0)
  const [groupReturnAddress, setGroupReturnAddress] = useState([])
  const [needWalk, setNeedWalk] = useState(0)
  const [freeDates, setFreeDates] = useState([])
  const [freeDeliveryState, setFreeDeliveryState] = useState(false)
  const [retrievalEmptyGroupDates, setRetrievalEmptyGroupDates] = useState([])
  const [isMaxDate, setIsMaxDate] = useState(false)
  const allReturn = 1

  useEffect(() => {
    setInitState(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initState) {
      dispatch(fetchRetrievalDates())
      dispatch(fetchRetrievalAddress())
      dispatch(fetchRetrievalEmptyDates())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initState, dispatch])

  useEffect(() => {
    if (order.emptyout_date_other) {
      if (order.order_status_id >= 20) {
        window.location.href = '/client/order'
      }

      let __storage_month = dayjs().diff(dayjs(order.emptyout_date_other), 'month')

      const newDate = dayjs().add(2, 'day').isBefore(dayjs(order?.checkin_date_other))
        ? dayjs(order?.checkin_date_other)
        : dayjs().add(additionalDay, 'day')

      setRetrievalDate(newDate.format('YYYY-MM-DD'))
      setEmptyBoxReturnDate(newDate.format('YYYY-MM-DD'))

      setRetrievalOrder({
        ...retrievalOrder,
        storage_month: __storage_month,
        retrieval_date: newDate.format('YYYY-MM-DD'),
        retrieval_time: getTime(0),
        empty_box_return_date: newDate.format('YYYY-MM-DD'),
        empty_box_return_time: getTime(0),
        retrieval_address: order.checkout_location_other,
        special_instruction: order.special_instruction,
        qr_code: getQrcode(),
      })
      setRetrievalAddress(order.checkout_location_other)
    }
  }, [order])

  useEffect(() => {
    let __dates = []
    let __university_id = client.university_id
    let __expireDate = order.storage_expired_date
    if (freeRetrievalDates.length > 0 && __expireDate) {
      let __retrievalDates = freeRetrievalDates.filter((item) => item.id === __university_id)
      if (__retrievalDates && __retrievalDates.length > 0) {
        __retrievalDates[0].retrieval_dates?.forEach((item) => {
          let __startDate = dayjs(item.retrieval_date).add(-item.day, 'day')
          if (__startDate > dayjs() && dayjs(__expireDate) >= dayjs(item.retrieval_date)) {
            __dates.push(dayjs(item.retrieval_date).format('YYYY-MM-DD'))
          }
        })
      }
    }
    setFreeDates([...__dates])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeRetrievalDates, client.university_id, order.storage_expired_date])

  useEffect(() => {
    let __university_id = client.university_id
    let __address = []
    if (retrievalAddresses.length > 0 && __university_id) {
      let __retrievalAddress = retrievalAddresses.filter((item) => item.id === __university_id)
      if (__retrievalAddress && __retrievalAddress.length > 0) {
        __retrievalAddress[0].retrieval_address?.forEach((item) => {
          __address.push(item.retrieval_address)
        })
      }
    }
    setGroupReturnAddress(__address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievalAddresses, client.university_id])

  useEffect(() => {
    let __dates = []
    let __university_id = client.university_id
    let __expireDate = order.storage_expired_date
    if (retrievalEmptyDates.length > 0 && __expireDate && retrievalDate) {
      let __retrievalEmptyDates = retrievalEmptyDates.filter((item) => item.id === __university_id)
      if (__retrievalEmptyDates && __retrievalEmptyDates.length > 0) {
        __retrievalEmptyDates[0].retrieval_empty_dates?.forEach((item) => {
          let __startDate = dayjs(item.retrieval_empty_date).add(-item.day, 'day')
          if (
            __startDate > dayjs() &&
            dayjs(retrievalDate) <= dayjs(item.retrieval_empty_date) &&
            dayjs(__expireDate) >= dayjs(item.retrieval_empty_date)
          ) {
            __dates.push(dayjs(item.retrieval_empty_date).format('YYYY-MM-DD'))
          }
        })
      }
    }
    // if (!__dates?.length > 0) {
    //   setIsGroupReturnDay(0)
    // } else {
    //   if (isGroupReturnDay) {
    //     handleEmptyBoxReturnDateChange(__dates[0])
    //   }
    // }
    setRetrievalEmptyGroupDates([...__dates])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievalEmptyDates, client.university_id, retrievalDate, order.storage_expired_date])

  useEffect(() => {
    setIsSameDay(1)
    if (freeDeliveryState) {
      onCartHandler(null, null, true)
      handleRetrievalDateChange(dayjs(freeDates[0]).format('YYYY-MM-DD'))
    } else {
      onCartHandler(null, null, false)
      handleRetrievalDateChange(dayjs().add(additionalDay, 'day'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeDeliveryState])

  useEffect(() => {
    let __emptyBoxReturnDate = dayjs(retrievalDate).format('YYYY-MM-DD')
    if (isSameDay) {
      setIsGroupReturnDay(0)
      handleNextDayFeeChange(true)
    } else {
      handleNextDayFeeChange(false)
      if (isGroupReturnDay) {
        __emptyBoxReturnDate = dayjs(retrievalEmptyGroupDates[0]).format('YYYY-MM-DD')
      }
    }
    setRetrievalOrder({
      ...retrievalOrder,
      empty_box_return_date: __emptyBoxReturnDate,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSameDay])

  useEffect(() => {
    let __emptyBoxReturnDate = ''
    let __retrievalAddress = ''
    if (isGroupReturnDay) {
      handleNextDayFeeChange(true)
      __emptyBoxReturnDate = dayjs(retrievalEmptyGroupDates[0]).format('YYYY-MM-DD')
      __retrievalAddress = groupReturnAddress[0]?.toString()
    } else {
      handleNextDayFeeChange(false)
      __emptyBoxReturnDate = dayjs(retrievalDate).format('YYYY-MM-DD')
      if (freeDeliveryState) {
        __retrievalAddress = groupReturnAddress[0]?.toString()
      } else {
        __retrievalAddress = client.address1 ? client.address1 : ''
      }
    }
    setEmptyBoxReturnDate(__emptyBoxReturnDate)
    setRetrievalAddress(__retrievalAddress)
    setRetrievalOrder({
      ...retrievalOrder,
      empty_box_return_date: __emptyBoxReturnDate,
      retrieval_address: __retrievalAddress,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGroupReturnDay])

  useEffect(() => {
    if (retrievalDate && typeof retrievalDate === 'string') {
      fetchRetrievalLimitApi({date: dayjs(retrievalDate).format('YYYY-MM-DD')})
        .then((res) => {
          let __limit_retrieval = res.data.limit_retrieval
          if (__limit_retrieval && __limit_retrieval.available_state === 0) {
            setPermitRetrieve(true)
            setIsMaxDate(false)
          } else {
            setPermitRetrieve(false)
            setIsMaxDate(true)
          }
        })
        .catch((err) => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retrievalDate])

  const getQrcode = () => {
    let __qr_code = order?.remark_qrcode ? order?.remark_qrcode : ''
    __qr_code = __qr_code.replace(/\n/g, ' ')
    return __qr_code
  }

  const handleRetrievalDateChange = (value) => {
    let newValue = dayjs(value).format('YYYY-MM-DD')
    let __storage_month = dayjs(newValue) - dayjs(order.emptyout_date_other)
    __storage_month = dayjs(__storage_month).format('MM')

    let __retrievalAddress = groupReturnAddress[0]?.toString()
    if (!freeDeliveryState) {
      __retrievalAddress = client.address1 ? client.address1 : ''
    }
    setRetrievalAddress(__retrievalAddress)
    setRetrievalDate(newValue)

    if (isSameDay === 1) {
      setRetrievalOrder({
        ...retrievalOrder,
        retrieval_date: dayjs(newValue).format('YYYY-MM-DD'),
        empty_box_return_date: dayjs(newValue).format('YYYY-MM-DD'),
        storage_month: parseInt(__storage_month),
        retrieval_address: __retrievalAddress,
      })
      setEmptyBoxReturnDate(newValue)
    } else {
      if (
        dayjs(newValue) > dayjs(emptyBoxReturnDate) ||
        dayjs(newValue).add(14, 'day') < dayjs(emptyBoxReturnDate)
      ) {
        setRetrievalOrder({
          ...retrievalOrder,
          retrieval_date: dayjs(newValue).format('YYYY-MM-DD'),
          empty_box_return_date: dayjs(newValue).format('YYYY-MM-DD'),
          storage_month: parseInt(__storage_month),
          retrieval_address: __retrievalAddress,
        })
        setEmptyBoxReturnDate(newValue)
      } else {
        setRetrievalOrder({
          ...retrievalOrder,
          retrieval_date: dayjs(newValue).format('YYYY-MM-DD'),
          storage_month: parseInt(__storage_month),
          retrieval_address: __retrievalAddress,
        })
      }
    }
  }

  const handleRetrievalTimeChange = (e) => {
    let __index = parseInt(e.target.value)
    setRetrievalTimeIndex(__index)
    if (isSameDay) {
      setRetrievalOrder({
        ...retrievalOrder,
        retrieval_time: getTime(__index),
        empty_box_return_time: getTime(__index),
      })
      setEmptyBoxReturnTimeIndex(__index)
    } else {
      setRetrievalOrder({
        ...retrievalOrder,
        retrieval_time: getTime(__index),
      })
    }
  }

  const handleEmptyBoxReturnDateChange = (newValue) => {
    setEmptyBoxReturnDate(newValue)
    setRetrievalOrder({
      ...retrievalOrder,
      empty_box_return_date: dayjs(newValue).format('YYYY-MM-DD'),
    })
  }

  const handleEmptyBoxReturnTimeChange = (e) => {
    let __index = parseInt(e.target.value)
    setEmptyBoxReturnTimeIndex(__index)
    setRetrievalOrder({
      ...retrievalOrder,
      empty_box_return_time: getTime(__index),
    })
  }

  const handleRetrievalAddress = (address) => {
    if (address === undefined) return
    setRetrievalAddress(address)
    setRetrievalOrder({
      ...retrievalOrder,
      retrieval_address: address,
    })
  }

  const handleIsSameDayRadioChange = (e) => {
    setIsSameDay(Number(e.target.value))
  }

  const handleNextDayFeeChange = (value) => {
    let __floor_fee = freeDeliveryState ? 0 : cartInfo.floor_fee
    if (value) {
      if (initState) {
        setCartInfo({
          ...cartInfo,
          retrieval_next_day: false,
          next_day_fee: 0,
          total_fee: cartInfo.delivery_fee + 0 + __floor_fee,
        })
      }
      setEmptyBoxReturnDate(dayjs(retrievalDate))
      setEmptyBoxReturnTimeIndex(retrievalTimeIndex)
    } else {
      if (initState) {
        setCartInfo({
          ...cartInfo,
          retrieval_next_day: true,
          next_day_fee: cartInfo.min_delivery_fee,
          total_fee: cartInfo.delivery_fee + cartInfo.min_delivery_fee + __floor_fee,
        })
      }
    }
  }

  const handleIsNeedWalkRadioChange = (e) => {
    setNeedWalk(Number(e.target.value))
    if (Number(e.target.value) === 0) {
      setCartInfo({
        ...cartInfo,
        floor_fee: 0,
        total_fee: cartInfo.delivery_fee + cartInfo.next_day_fee + 0,
      })
    } else {
      let __floor_fee = 0
      let __floors = cartInfo.floors
      cartInfo.delivery_items.forEach((item) => {
        __floor_fee = __floor_fee + item.count * __floors * cartInfo.per_floor_fee
      })
      let __total_fee = cartInfo.delivery_fee + cartInfo.next_day_fee + __floor_fee
      if (freeDeliveryState) {
        __total_fee = cartInfo.delivery_fee + cartInfo.next_day_fee + 0
      }
      setCartInfo({
        ...cartInfo,
        floor_fee: __floor_fee,
        total_fee: __total_fee,
      })
    }
  }

  const timelist = [
    {
      value: 0,
      label: '09:00 - 13:00',
    },
    {
      value: 1,
      label: '13:00 - 18:00',
    },
  ]

  const getTime = (index) => {
    switch (index) {
      case 0:
        return '09:00 - 13:00'
      case 1:
        return '13:00 - 18:00'
      default:
        return '09:00 - 13:00'
    }
  }

  const customColor = {
    500: '#FFBE3D',
    700: '#FFBE3D',
  }

  const defaultMaterialTheme = createTheme({
    palette: {
      primary: customColor,
    },
  })

  return (
    <>
      <ThemeProvider theme={defaultMaterialTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className='text-header text-black pb-[10px]'>
            {t('customer-retrieval.an-when-retrieval')}
          </div>
          <div>
            <div className='text-normal text-black'>
              {t('customer-retrieval.wd-indicate-retrieval')}
            </div>
            {freeDates && freeDates.length > 0 && groupReturnAddress?.length > 0 && (
              <div className='mt-[10px]'>
                <Grid container>
                  <Grid item xs={12} sm={8} md={8} className='align-items-center'>
                    <span className='text-normal'>
                      {t('customer-retrieval.an-do-you-retrieve-free')}
                    </span>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <RadioGroup
                      row
                      aria-labelledby='demo-radio-buttons-group-label'
                      name='radio-buttons-group'
                      value={freeDeliveryState}
                      onChange={(e) => {
                        setFreeDeliveryState(!freeDeliveryState)
                      }}
                    >
                      <CssFormControlLabel
                        value={true}
                        control={<CustomColorRadio />}
                        label='Yes'
                      />
                      <CssFormControlLabel
                        value={false}
                        control={<CustomColorRadio />}
                        label='No'
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </div>
            )}

            <Grid container className='mx-[-8px]'>
              {freeDeliveryState === true ? (
                <Grid item xs={12} sm={6} md={7} className='px-[8px] py-[15px]'>
                  <CssTextField
                    id='standard-select-currency1'
                    select
                    fullWidth
                    label=''
                    value={dayjs(retrievalDate).format('YYYY-MM-DD')}
                    onChange={(e) => {
                      handleRetrievalDateChange(e.target.value)
                    }}
                    className='mt-17 relative'
                    helperText=''
                    variant='standard'
                  >
                    {freeDates.map((date, index) => (
                      <MenuItem key={index} value={date} style={{fontSize: '16px'}}>
                        {dayjs(date).format('DD/MM/YYYY')}
                      </MenuItem>
                    ))}
                  </CssTextField>
                  {isMaxDate && (
                    <div className='absolute text-red pt-1'>
                      Select the other date. The number of orders was over the max.
                    </div>
                  )}
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={7} className='px-[8px] py-[15px]'>
                  <DesktopDatePicker
                    label={t('common.wd-retrieval-date')}
                    inputFormat='DD/MM/YYYY'
                    minDate={dayjs().add(additionalDay, 'day')}
                    maxDate={order?.storage_expired_date}
                    value={retrievalDate}
                    onChange={handleRetrievalDateChange}
                    renderInput={(params) => (
                      <CssTextField
                        required
                        fullWidth
                        onKeyDown={(e) => e.preventDefault()}
                        id='standard-required1'
                        label={t('common.wd-retrieval-date')}
                        variant='standard'
                        {...params}
                        sx={{svg: {color: '#FFBE3D'}, button: {fontSize: 16}}}
                      />
                    )}
                  />
                  {isMaxDate && (
                    <div className='absolute text-red pt-1'>
                      The number of orders was over the max.
                    </div>
                  )}
                </Grid>
              )}
              {/* <Grid item xs={12} sm={6} md={7} className='px-[8px] py-[15px]'>
                <DesktopDatePicker
                  label={t('common.wd-retrieval-date')}
                  inputFormat='DD/MM/YYYY'
                  minDate={dayjs().add(additionalDay, 'day')}
                  maxDate={order?.storage_expired_date}
                  value={retrievalDate}
                  onChange={handleRetrievalDateChange}
                  renderInput={(params) => (
                    <CssTextField
                      required
                      fullWidth
                      onKeyDown={(e) => e.preventDefault()}
                      id='standard-required1'
                      label={t('common.wd-retrieval-date')}
                      variant='standard'
                      {...params}
                      sx={{svg: {color: '#FFBE3D'}, button: {fontSize: 16}}}
                    />
                  )}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={5} className='px-[8px] py-[15px]'>
                <CssTextField
                  id='standard-select-currency1'
                  select
                  fullWidth
                  label=''
                  value={retrievalTimeIndex}
                  onChange={handleRetrievalTimeChange}
                  className='mt-17'
                  helperText=''
                  variant='standard'
                >
                  {timelist.map((option) => (
                    <MenuItem key={option.value} value={option.value} style={{fontSize: '16px'}}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CssTextField>
              </Grid>
            </Grid>
          </div>
          <div className='mt-[10px]'>
            <Grid container>
              <Grid item xs={12} sm={8} md={8} className='align-items-center'>
                <span className='text-normal'>{t('customer-retrieval.an-are-you-sameday')}</span>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <RadioGroup
                  row
                  aria-labelledby='demo-radio-buttons-group-label'
                  name='radio-buttons-group'
                  value={isSameDay}
                  onChange={handleIsSameDayRadioChange}
                >
                  <CssFormControlLabel value={1} control={<CustomColorRadio />} label='Yes' />
                  <CssFormControlLabel value={0} control={<CustomColorRadio />} label='No' />
                </RadioGroup>
              </Grid>
            </Grid>
          </div>
          {isSameDay !== 1 && (
            <div>
              {retrievalEmptyGroupDates &&
                retrievalEmptyGroupDates.length > 0 &&
                groupReturnAddress?.length > 0 && (
                  <Grid container className=''>
                    <Grid item xs={12} sm={8} md={8} className='align-items-center'>
                      <span className='text-normal'>
                        {t('customer-retrieval.an-do-you-group-empty')}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                      <RadioGroup
                        row
                        aria-labelledby='demo-radio-buttons-group-label'
                        name='radio-buttons-group'
                        value={isGroupReturnDay}
                        onChange={(e) => {
                          setIsGroupReturnDay(Number(e.target.value))
                        }}
                      >
                        <CssFormControlLabel value={1} control={<CustomColorRadio />} label='Yes' />
                        <CssFormControlLabel value={0} control={<CustomColorRadio />} label='No' />
                      </RadioGroup>
                    </Grid>
                  </Grid>
                )}
              <Grid container className='mx-[-8px]'>
                {isGroupReturnDay === 1 ? (
                  <Grid item xs={12} sm={6} md={7} className='px-[8px] py-[15px]'>
                    <CssTextField
                      id='standard-select-currency2'
                      select
                      fullWidth
                      label=''
                      value={dayjs(emptyBoxReturnDate).format('YYYY-MM-DD')}
                      onChange={(e) => {
                        let newValue = dayjs(e.target.value)
                        handleEmptyBoxReturnDateChange(newValue.format('YYYY-MM-DD'))
                      }}
                      className='mt-17 relative'
                      helperText=''
                      variant='standard'
                    >
                      {retrievalEmptyGroupDates.map((date, index) => (
                        <MenuItem key={index} value={date} style={{fontSize: '16px'}}>
                          {dayjs(date).format('DD/MM/YYYY')}
                        </MenuItem>
                      ))}
                    </CssTextField>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={6} md={7} className='px-[8px] py-[15px]'>
                    <DesktopDatePicker
                      label={t('common.wd-empty-box-return-date')}
                      inputFormat='DD/MM/YYYY'
                      minDate={retrievalDate}
                      maxDate={
                        dayjs(order?.storage_expired_date) < dayjs(retrievalDate).add(14, 'day')
                          ? order?.storage_expired_date
                          : dayjs(retrievalDate).add(14, 'day')
                      }
                      value={dayjs(emptyBoxReturnDate).format('YYYY-MM-DD')}
                      onChange={handleEmptyBoxReturnDateChange}
                      renderInput={(params) => (
                        <CssTextField
                          required
                          fullWidth
                          onKeyDown={(e) => e.preventDefault()}
                          id='standard-required1'
                          label={t('common.wd-empty-box-return-date')}
                          variant='standard'
                          {...params}
                          sx={{svg: {color: '#FFBE3D'}, button: {fontSize: 16}}}
                        />
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={5} className='px-[8px] py-[15px]'>
                  <CssTextField
                    id='standard-select-currency1'
                    select
                    fullWidth
                    label=''
                    value={emptyBoxReturnTimeIndex}
                    onChange={handleEmptyBoxReturnTimeChange}
                    className='mt-17'
                    helperText=''
                    variant='standard'
                  >
                    {timelist.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value.toString()}
                        style={{fontSize: '16px'}}
                      >
                        {option.label.toString()}
                      </MenuItem>
                    ))}
                  </CssTextField>
                </Grid>
              </Grid>
            </div>
          )}
          <div className='mt-[10px]'>
            <Grid item xs={12} sm={12} md={12} className='pr-[16px]'>
              {freeDeliveryState || isGroupReturnDay === 1 ? (
                <CssTextField
                  id='standard-select-currency2'
                  select
                  fullWidth
                  label={t('customer-retrieval.wd-retrieval-address')}
                  value={retrievalAddress}
                  onChange={(e) => {
                    handleRetrievalAddress(e.target.value)
                  }}
                  className='mt-17 relative'
                  helperText=''
                  variant='standard'
                >
                  {groupReturnAddress?.map((address, index) => (
                    <MenuItem key={index} value={address.toString()} style={{fontSize: '16px'}}>
                      {address.toString()}
                    </MenuItem>
                  ))}
                </CssTextField>
              ) : (
                <CssTextField
                  fullWidth
                  id='retrievalAddress'
                  label={t('customer-retrieval.wd-retrieval-address')}
                  variant='standard'
                  // value={retrievalOrder.retrieval_address ? retrievalOrder.retrieval_address : ''}
                  value={retrievalAddress}
                  onChange={(e) => {
                    handleRetrievalAddress(e.target.value)
                  }}
                />
              )}
            </Grid>
          </div>
          <div className='mt-[25px]'>
            <Grid container>
              <Grid item xs={12} sm={8} md={8} className='align-items-center'>
                <span className='text-normal'>{t('customer-retrieval.an-need-walkup')}</span>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <RadioGroup
                  row
                  aria-labelledby='demo-radio-buttons-group-label'
                  name='radio-buttons-group'
                  value={needWalk}
                  onChange={handleIsNeedWalkRadioChange}
                >
                  <CssFormControlLabel value={1} control={<CustomColorRadio />} label='Yes' />
                  <CssFormControlLabel value={0} control={<CustomColorRadio />} label='No' />
                </RadioGroup>
              </Grid>
            </Grid>
          </div>
          {needWalk === 1 && (
            <div className='mt-[10px]'>
              <Grid item xs={12} sm={12} md={12} className='pr-[16px]'>
                <Grid item xs={12} sm={8} md={8} className='align-items-center'>
                  <span className='text-normal'>{t('customer-retrieval.an-how-many-floors')}</span>
                </Grid>
                <div className='mt-[20px]'>
                  <CssTextField
                    fullWidth
                    id='floors'
                    label={t('customer-retrieval.an-how-many-floors')}
                    variant='standard'
                    value={cartInfo.floors}
                    onChange={(e) => {
                      let __floors = e.target.value ? parseInt(e.target.value) : 0
                      if (__floors > 1000) __floors = 1000
                      let __floor_fee = 0
                      cartInfo.delivery_items.forEach((item) => {
                        __floor_fee = __floor_fee + item.count * __floors * cartInfo.per_floor_fee
                      })
                      let __total_fee = cartInfo.delivery_fee + cartInfo.next_day_fee + __floor_fee
                      if (freeDeliveryState) {
                        __total_fee = cartInfo.delivery_fee + cartInfo.next_day_fee + 0
                      }
                      setCartInfo({
                        ...cartInfo,
                        floors: __floors,
                        floor_fee: __floor_fee,
                        total_fee: __total_fee,
                      })
                    }}
                  />
                </div>
              </Grid>
            </div>
          )}
          <div className='mt-[10px]'>
            <Grid item xs={12} sm={12} md={12} className='pr-[16px]'>
              <div className='mt-[20px]'>
                <CssTextField
                  fullWidth
                  id='instruction'
                  label={t('customer-retrieval.wd-special-instruction')}
                  variant='standard'
                  value={
                    retrievalOrder.special_instruction ? retrievalOrder.special_instruction : ''
                  }
                  onChange={(e) => {
                    setRetrievalOrder({
                      ...retrievalOrder,
                      special_instruction: e.target.value,
                    })
                  }}
                />
              </div>
            </Grid>
          </div>
          <div className='mt-[25px]'>
            <Grid container>
              <Grid item xs={12} sm={8} md={8} className='align-items-center'>
                <span className='text-normal'>{t('customer-retrieval.an-want-all-items')}</span>
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <RadioGroup
                  row
                  aria-labelledby='demo-radio-buttons-group-label'
                  name='radio-buttons-group'
                  value={allReturn}
                  disabled={true}
                >
                  <CssFormControlLabel value={1} control={<CustomColorRadio />} label='Yes' />
                </RadioGroup>
              </Grid>
            </Grid>
          </div>
          <div className='row align-items-center justify-around pr-[20px] pt-[20px]'>
            {products?.store_items &&
              order.items &&
              order.items.map((item, index) =>
                item.item_qty === 0 || item.item_category === 'bag' ? (
                  <div key={index} style={{width: '0px', padding: '0px', display: 'none'}}></div>
                ) : (
                  <div
                    className='col-md-3 col-sm-6 col-6 flex-col align-items-center mt-[25px] min-w-[120px]'
                    key={index}
                  >
                    <div className='mr-[0px] image-area'>
                      <img
                        src={item.item.uri}
                        alt='material'
                        style={{width: '90px', height: '90px'}}
                      />
                    </div>
                    <div className='min-w-[120px] py-[20px]' style={{zIndex: '100'}}>
                      <Quantity
                        value={item.item_qty}
                        maxValue={item.item_qty}
                        disable={allReturn}
                        item={item.item}
                        key={index}
                        onChangeHandler={onCartHandler}
                      />
                    </div>
                  </div>
                )
              )}
          </div>
          <div>
            <Grid item xs={12} sm={12} md={12} className='pr-[16px]'>
              <div className='mt-[20px] mb-[30px]'>
                <CssTextField
                  fullWidth
                  id='retrivalQrCode'
                  label={t('customer-retrieval.an-which-item-retrieval')}
                  variant='standard'
                  value={retrievalOrder.qr_code ? retrievalOrder.qr_code : ''}
                  readOnly
                  // onChange={(e) => {
                  //   setRetrievalOrder({
                  //     ...retrievalOrder,
                  //     qr_code: e.target.value,
                  //   })
                  // }}
                />
              </div>
            </Grid>
          </div>
        </LocalizationProvider>
      </ThemeProvider>
    </>
  )
}
