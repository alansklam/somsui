import {useEffect, useState} from 'react'
import Header from '../../components/layout/Header'
import Stepper from '../../components/stepper'
import ContentPage from './ContentPage'
import CartPage from './CartPage'
import {Grid} from '@mui/material'
import Sign from '../../components/auth'
import {getIsLoggedIn, getStoragePeriodItem} from '../../store/apis/ordering'
import dayjs from 'dayjs'
import {StepType} from '../../constants/step-type'
import {initialQueryResponse} from '../../../_metronic/helpers'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0)
  const [loggedIn, setLoggedIn] = useState(0)
  const [cartInfo, setCartInfo] = useState({
    stores: [],
    stores_total: 0,
    materials: [],
    materials_total: 0,
    storage_month: 4,
    storage_period_id: 1,
    promotions: [],
    promotion_id: 0,
    total: 0,
    payment_type: 3,
  })
  const [stuffInfo, setStuffInfo] = useState({})
  const [accountInfo, setAccountInfo] = useState({})
  const [products, setProducts] = useState([])
  const [materials, setMaterials] = useState([])
  const [originProducts, setOriginProducts] = useState([])
  const [originMaterials, setOriginMaterials] = useState([])
  const [order, setOrder] = useState({})
  const min_count = process.env.REACT_APP_ORDER_ITEMS_LIMIT

  useEffect(() => {
    const v = JSON.parse(localStorage.getItem('ubox-is-authenticated'))
    if (v === 1) {
      getIsLoggedIn()
        .then(() => {
          setLoggedIn(1)
        })
        .catch(() => {
          setLoggedIn(0)
        })
    } else {
      localStorage.setItem('ubox-is-authenticated', 0)
      localStorage.removeItem('ubox-user')
      setLoggedIn(0)
    }
  }, [])

  // Fetch the price following the storage period.
  const getStoragePeriodPrice = (month, initProducts, initMaterials) => {

    if (stuffInfo.tentativeDate) {
      let __tentativeDate = dayjs(stuffInfo.deliveryDate).add(month, 'month').format('YYYY-MM-DD')
      setStuffInfo({
        ...stuffInfo,
        tentativeDate: __tentativeDate,
      })
    }

    getStoragePeriodItem(month).then((res) => {
      let __newPrice = res.data
      let __products
      let __materials
      let __originProducts = initProducts ?? originProducts
      let __originMaterials = initMaterials ?? originMaterials

      materials.length > 0 ? (__materials = materials) : (__materials = initMaterials)
      products.length > 0 ? (__products = products) : (__products = initProducts)

      // Update the price
      __materials.forEach((item, index) => {
        __materials[index].price = item.default_price.toFixed(2)
        __newPrice.forEach((element) => {
          if (element.item_id === item.id) {
            __materials[index].price = element.price
          }
        })
      })

      __products.forEach((item, index) => {
        __products[index].price = item.default_price.toFixed(2)
        __newPrice.forEach((element) => {
          if (element.item_id === item.id) {
            __products[index].price = element.price
          }
        })
      })

      // Update the price
      __originMaterials.forEach((item, index) => {
        __originMaterials[index].price = item.default_price.toFixed(2)
        __newPrice.forEach((element) => {
          if (element.item_id === item.id) {
            __originMaterials[index].price = element.price
          }
        })
      })

      __originProducts.forEach((item, index) => {
        __originProducts[index].price = item.default_price.toFixed(2)
        __newPrice.forEach((element) => {
          if (element.item_id === item.id) {
            __originProducts[index].price = element.price
          }
        })
      })

      console.log('origin', originProducts)
      console.log('update', __originProducts)
      setOriginProducts(JSON.parse(JSON.stringify(__originProducts)))
      setOriginMaterials(JSON.parse(JSON.stringify(__originMaterials)))

      if (cartInfo.promotions.length > 0) {
        let __items = cartInfo.promotions
        __materials.forEach((material, index) => {
          __items.forEach((item) => {
            if (item.item_id === material.id) {
              if (__materials[index].price > item.price) {
                __materials[index].price = item.price
              }
            }
          })
        })

        __products.forEach((product, index) => {
          __items.forEach((item) => {
            if (item.item_id === product.id) {
              if (__products[index].price > item.price) {
                __products[index].price = item.price
              }
            }
          })
        })
      }

      setProducts(__products)
      setMaterials(__materials)

      let __cartInfo = cartInfo
      __cartInfo.stores.forEach((item, index) => {
        item &&
          __products.forEach((product) => {
            if (product.id === item.id) {
              __cartInfo.stores[index].price = product.price
            }
          })
      })

      __cartInfo.materials.forEach((item, index) => {
        item &&
          __materials.forEach((material) => {
            if (material.id === item.id) {
              __cartInfo.materials[index].price = material.price
            }
          })
      })

      onRefreshCartHandler({category: 'storage_month'}, month, __cartInfo)
    })
  }

  const setPromotionPrice = (isValid, promotions, promotion_id) => {
    console.log(isValid, 'isValid')
    console.log(originProducts)
    let __items = promotions
    let __materials = isValid ? materials : JSON.parse(JSON.stringify(originMaterials))
    let __products = isValid ? products : JSON.parse(JSON.stringify(originProducts))

    if (isValid) {
      __materials.forEach((material, index) => {
        __items.forEach((item) => {
          if (item.item_id === material.id) {
            if (__materials[index].price > item.price) {
              __materials[index].price = item.price
            }
          }
        })
      })

      __products.forEach((product, index) => {
        __items.forEach((item) => {
          if (item.item_id === product.id) {
            if (__products[index].price > item.price) {
              __products[index].price = item.price
            }
          }
        })
      })
    }

    setProducts(isValid ? __products : JSON.parse(JSON.stringify(originProducts)))
    setMaterials(isValid ? __materials : JSON.parse(JSON.stringify(originMaterials)))

    let __cartInfo = cartInfo
    __cartInfo.stores.forEach((item, index) => {
      item &&
        __products.forEach((product) => {
          if (product.id === item.id) {
            __cartInfo.stores[index].price = product.price
          }
        })
    })

    __cartInfo.materials.forEach((item, index) => {
      item &&
        __materials.forEach((material) => {
          if (material.id === item.id) {
            __cartInfo.materials[index].price = material.price
          }
        })
    })

    __cartInfo = {
      ...__cartInfo,
      promotions: promotions,
      promotion_id: promotion_id,
    }

    onRefreshCartHandler({category: 'storage_month'}, cartInfo.storage_month, __cartInfo)
  }

  const onChangeStep = (step) => {
    if (loggedIn === 0 && step > StepType.ACCOUNT) setCurrentStep(StepType.PAYMENT)
    else setCurrentStep(step)
  }

  const onReturnFunc = (state) => {
    if (state === true) {
      setCurrentStep(currentStep)
      setLoggedIn(1)
    }
  }

  const onCloseModal = (event) => {
    setCurrentStep(StepType.ACCOUNT)
  }

  // Add the new product and material or update the storage period.
  const onRefreshCartHandler = (item, value, newCartInfo) => {
    let __stores_total = 0
    let __stores = cartInfo.stores
    let __material_total = 0
    let __materials = cartInfo.materials
    let __storage_month = cartInfo.storage_month
    if (item.category !== 'bag' && item.category !== 'storage_month') {
      __stores[item.id] = {...item, count: value}
    }
    if (item.category === 'bag') {
      __materials[item.id] = {...item, count: value}
    }
    if (item.category === 'storage_month') {
      __storage_month = value
    }

    Object.keys(__stores).forEach((iter, index) => {
      __stores_total =
        __stores_total + Number.parseFloat(__stores[iter].price).valueOf() * __stores[iter].count
    })

    Object.keys(__materials).forEach((iter, index) => {
      __material_total =
        __material_total +
        Number.parseFloat(__materials[iter].price).valueOf() * __materials[iter].count
    })

    let __cartInfo = cartInfo
    if (newCartInfo) {
      __cartInfo = newCartInfo
    }
    __stores_total = Math.round(__stores_total * 100) / 100
    __material_total = Math.round(__material_total * 100) / 100
    let __total = Math.round(__stores_total * __storage_month * 100) / 100 + __material_total

    __cartInfo = {
      ...__cartInfo,
      payment_type: 3,
      storage_month: __storage_month,
      stores: __stores,
      stores_total: __stores_total,
      materials: __materials,
      materials_total: __material_total,
      total: __total,
    }
    setCartInfo(__cartInfo)
  }

  const onStepperPrevActionHandler = async () => {
    const carts_data = cartInfo
    if (carts_data === undefined || carts_data == null) return StepType.STOREITEM // step=1
    const carts_info = cartInfo
    if (carts_info.stores_total === 0) return StepType.STOREITEM // step=1
    let __stores = cartInfo.stores
    let __count_items = 0
    let __count_packages = 0
    __stores &&
      Object.keys(__stores).forEach((iter, index) => {
        if (
          __stores[iter] &&
          __stores[iter].count &&
          __stores[iter].category === 'box' &&
          __stores[iter].count > 0
        ) {
          __count_items += parseInt(__stores[iter].count)
        }
        if (
          __stores[iter] &&
          __stores[iter].count &&
          __stores[iter].category === 'package' &&
          __stores[iter].count > 0
        ) {
          __count_packages += parseInt(__stores[iter].count)
        }
      })
    if (__count_items < min_count) {
      if (!__count_packages > 0) {
        return StepType.STOREITEM // step=1
      }
    }
    const stuff_data = stuffInfo
    if (stuff_data === undefined || stuff_data == null) return StepType.STUFF // step=3
    const stuff_info = stuffInfo
    if (
      stuff_info.name === '' ||
      stuff_info.contact === '' ||
      stuff_info.email === '' ||
      stuff_info.address === ''
    )
      return StepType.STUFF // step=3
    if (stuff_info.name && stuff_info.contact && stuff_info.email && stuff_info.address) {
      let __email = stuff_info.email
      let __reEmail = /\S+@\S+\.\S+/
      let __resultEmail = __email.match(__reEmail)
      if (__resultEmail == null) {
        return StepType.STUFF
      }
      let __contact = stuff_info.contact
      let __re = /[^0-9]+/g
      let __result = __contact.match(__re)
      let __length = __contact.length
      if (__result == null && __length <= 11 && __length >= 8) {
      } else {
        return StepType.STUFF
      }
      let __mobile = stuff_info.mobile
      if (__mobile !== undefined && __mobile !== '') {
        let __re_mobile = /[^0-9]+/g
        let __result_mobile = __mobile.match(__re_mobile)
        let __length_mobile = __mobile.length
        if (__result_mobile == null && __length_mobile <= 11 && __length_mobile >= 8) {
        } else {
          return StepType.STUFF
        }
      }
    } else return StepType.STUFF // step=3
    if (
      dayjs(stuff_info.deliveryDate) < dayjs(stuff_info.deliveryMinDate) ||
      dayjs(stuff_info.ladenReturnDate) < dayjs(stuff_info.deliveryDate) ||
      dayjs(stuff_info.ladenReturnDate) > dayjs(stuff_info.deliveryDate).add(1, 'month') ||
      dayjs(stuff_info.tentativeDate) < dayjs(stuff_info.ladenReturnDate) ||
      dayjs(stuff_info.tentativeDate) > dayjs(stuff_info.expirationDate)
    ) {
      return StepType.STUFF
    }
    const account_data = accountInfo
    if (account_data === undefined || account_data == null) return StepType.ACCOUNT // step=4
    if (account_data.isStudent === undefined) return StepType.ACCOUNT
    const account_info = accountInfo
    if (
      account_info.isStudent === 1 &&
      (account_info.university.id === undefined || account_info.university.id == null)
    )
      return StepType.ACCOUNT // step=4
    if (account_info.isStudent === 1 && account_info.studentID === '') return StepType.ACCOUNT // step=4
    return StepType.PAYMENT
  }

  return (
    <div className='top-container'>
      <Header logged={loggedIn}>
        <Stepper
          step={currentStep}
          logged={loggedIn}
          stepChange={onChangeStep}
          previousActionCallback={onStepperPrevActionHandler}
        />
      </Header>
      <main className='main main-content mx-auto'>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={8}>
            <ContentPage
              step={currentStep}
              logged={loggedIn}
              stores={cartInfo.stores}
              cartMaterials={cartInfo.materials}
              storage_month={cartInfo.storage_month}
              setCartInfo={setCartInfo}
              cartInfo={cartInfo}
              products={products}
              setProducts={setProducts}
              materials={materials}
              setMaterials={setMaterials}
              stuffInfo={stuffInfo}
              setStuffInfo={setStuffInfo}
              accountInfo={accountInfo}
              setAccountInfo={setAccountInfo}
              order={order}
              setOrder={setOrder}
              stepChange={onChangeStep}
              onRefreshCart={onRefreshCartHandler}
              getStoragePeriodPrice={getStoragePeriodPrice}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <CartPage
              carts={cartInfo}
              setCartInfo={setCartInfo}
              setPromotionPrice={setPromotionPrice}
              step={currentStep}
            />
          </Grid>
        </Grid>
        {currentStep === StepType.PAYMENT && loggedIn === 0 && (
          <div className='cmodal'>
            <div className='cmodal-background' onClick={onCloseModal}></div>
            <div className='w-[100%] h-[100%] flex item-center item-vcenter'>
              <div className='cmodal-content flex item-center my-auto'>
                <Sign onReturnFunc={onReturnFunc} stuffInfo={stuffInfo} accountInfo={accountInfo} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
