import {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useRetrievalOrdersListView } from '../../core/RetrievalOrdersListViewProvider';
// import {IProfileDetails, profileDetailsInitValues as initialValues} from '../SettingsModel'
import * as Yup from 'yup';
import {useFormik} from 'formik';
import { editRetrievalOrderApi } from '../../../../../store/apis/admin';
// import { fetchOrders } from '../../../../../store/actions/admin'
import { RootState } from '../../../../../store/reducers';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

export const RetrievalOrdersAddModalFormWrapper = () => {

  // const dispatch = useDispatch();
  const { retrievalOrderIdForUpdate, setRetrievalOrderIdForUpdate, data, fetchOrdersFunc } = useRetrievalOrdersListView();
  const products = useSelector((state:RootState) => state.admin.products);
  const paymentMethod = useSelector((state:RootState) => state.admin.ref.paymentMethod);
  const paymentStatus = useSelector((state:RootState) => state.admin.ref.paymentStatus);
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [paymentStatusId, setPaymentStatusId] = useState("");
  const [lumpSum, setLumpSum] = useState("");
  const [storageMonth, setStorageMonth] = useState("");
  const [price, setPrice] = useState({
    documentBox: "",
    oversizeBox: "",
    wardrobeBox: "",
    packageBox: "",
  });
  const [quantity, setQuantity] = useState({
    documentBox: "0",
    oversizeBox: "0",
    wardrobeBox: "0",
    packageBox: "0",
  });

  useEffect(() => {
    let __documentBox = "";
    let __oversizeBox = "";
    let __wardrobeBox = "";
    let __packageBox = "";
    let __paymentStatusId = "";
    let __paymentMethodId = "";
    let __lumpSum = "";
    let __storageMonth = "";

    if(data.length > 0 && retrievalOrderIdForUpdate !== undefined && retrievalOrderIdForUpdate !== null) {
      let items = data[retrievalOrderIdForUpdate].items;
      if(items && items.length > 0) {
        items.forEach((item) => {
          if(item.item_id === 2) {
            __documentBox = item.item_delivery_fee;
          } else if(item.item_id === 4) {
            __oversizeBox = item.item_delivery_fee;
          } else if(item.item_id === 9) {
            __wardrobeBox = item.item_delivery_fee;
          } else if(item.item_id === 10) {
            __packageBox = item.item_delivery_fee;
          }
        })
      };
      let __price = {
        documentBox: __documentBox,
        oversizeBox: __oversizeBox,
        wardrobeBox: __wardrobeBox,
        packageBox: __packageBox
      };
      setPrice({...__price});

      __documentBox = "0";
      __oversizeBox = "0";
      __wardrobeBox = "0";
      __packageBox = "0";

      if(items && items.length > 0) {
        items.forEach((item) => {
          if(item.item_id === 2) {
            __documentBox = item.item_qty.toString();
          } else if(item.item_id === 4) {
            __oversizeBox = item.item_qty.toString();
          } else if(item.item_id === 9) {
            __wardrobeBox = item.item_qty.toString();
          } else if(item.item_id === 10) {
            __packageBox = item.item_qty.toString();
          }
        })
      }
      let __quantity = {
        documentBox: __documentBox,
        oversizeBox: __oversizeBox,
        wardrobeBox: __wardrobeBox,
        packageBox: __packageBox
      }
      setQuantity({...__quantity});

      __paymentMethodId = data[retrievalOrderIdForUpdate].payment_type_id.toString();
      __lumpSum = data[retrievalOrderIdForUpdate].total_fee;
      __storageMonth = data[retrievalOrderIdForUpdate].storage_month;
    };
    setLumpSum(__lumpSum);
    setPaymentMethodId(__paymentMethodId);
    setPaymentStatusId(__paymentStatusId);
    setStorageMonth(__storageMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, retrievalOrderIdForUpdate]);

  const profileDetailsSchema = Yup.object().shape({
    checkout_location_other: Yup.string()
              .required('Name is required')
              .min(3, 'Name 3 symbols')
              .max(50, 'Name 50 symbols'),
    checkout_date_other: Yup.date()
              .required('Date is required'),
    checkout_time_other: Yup.string()
              .required('Time is required'),
    paid_fee: Yup.string()
              .required('This field is required.'),
  });

  const initialValues = (retrievalOrderIdForUpdate == null) ? {
    checkout_location_other: "",
    checkout_date_other: "",
    checkout_time_other: "",
    empty_return_date_other: "",
    empty_return_time_other: "",
    special_instruction: "",
    paid_fee: "",
  } : {
    checkout_location_other: data[retrievalOrderIdForUpdate].checkout_location_other !== null ? data[retrievalOrderIdForUpdate].checkout_location_other : "",
    checkout_date_other: data[retrievalOrderIdForUpdate].checkout_date_other !== null ? data[retrievalOrderIdForUpdate].checkout_date_other : "",
    checkout_time_other: data[retrievalOrderIdForUpdate].checkout_time_other !== null ? data[retrievalOrderIdForUpdate].checkout_time_other : "",
    empty_return_date_other: data[retrievalOrderIdForUpdate].empty_return_date_other !== null ? data[retrievalOrderIdForUpdate].empty_return_date_other : "",
    empty_return_time_other: data[retrievalOrderIdForUpdate].empty_return_time_other !== null ? data[retrievalOrderIdForUpdate].empty_return_time_other : "",
    special_instruction: data[retrievalOrderIdForUpdate].special_instruction !== null ? data[retrievalOrderIdForUpdate].special_instruction : "",
    paid_fee: data[retrievalOrderIdForUpdate].paid_fee !== null ? data[retrievalOrderIdForUpdate].paid_fee : "",
  }

  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: profileDetailsSchema,
    onSubmit: (values) => {
      setLoading(true);
      (retrievalOrderIdForUpdate == null) ? 
      editRetrievalOrderApi({
        data: {...values,
          quantity,
          price,
          payment_type_id: paymentMethodId,
          storage_month: storageMonth,
          total_fee: lumpSum,
        }, 
        id: undefined
      })
        .then((res) => {
          setLoading(false);
          setRetrievalOrderIdForUpdate(undefined);
          fetchOrdersFunc();
        })
        .catch((err) => {
          setLoading(false);
        }) :
      editRetrievalOrderApi({
        data: {...values,
          quantity,
          price,
          payment_type_id: paymentMethodId,
          storage_month: storageMonth,
          total_fee: lumpSum,
        }, 
        id: data[retrievalOrderIdForUpdate].id 
      })
        .then((res) => {
          setLoading(false);
          setRetrievalOrderIdForUpdate(undefined);
          fetchOrdersFunc();
        })
        .catch((err) => {
          setLoading(false);
        })
    }
  });

  useEffect(() => {
    // let __subTotalFee = 0;
    // if(quantity.documentBox !== "0" && !isNaN(parseInt(price.documentBox))) {
    //   __subTotalFee += parseInt(price.documentBox) * parseInt(quantity.documentBox);
    // }
    // if(quantity.oversizeBox !== "0" && !isNaN(parseInt(price.oversizeBox))) {
    //   __subTotalFee += parseInt(price.oversizeBox) * parseInt(quantity.oversizeBox);
    // }
    // if(quantity.packageBox !== "0" && !isNaN(parseInt(price.packageBox))) {
    //   __subTotalFee += parseInt(price.packageBox) * parseInt(quantity.packageBox);
    // }
    // if(quantity.wardrobeBox !== "0" && !isNaN(parseInt(price.wardrobeBox))) {
    //   __subTotalFee += parseInt(price.wardrobeBox) * parseInt(quantity.wardrobeBox);
    // }
    // let __months = parseInt(storageMonth);
    // let __totalFee = __subTotalFee * __months;
    // setLumpSum(__totalFee.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, quantity, formik.values]);

  return (
    <>
      <div className='card mb-5 mb-xl-10'>

        <div id='kt_account_profile_details' className='collapse show'>
          <form onSubmit={formik.handleSubmit} noValidate className='form'>
            <div className='card-body border-top p-9'>
              <div className='row'>

                <div className='col-lg-6' style={{paddingRight: '30px'}}>
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>The code</label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        disabled
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Code'
                        value={(retrievalOrderIdForUpdate === undefined || retrievalOrderIdForUpdate == null ) ? "" : data[retrievalOrderIdForUpdate].code}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Name</label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        disabled
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Name'
                        value={(retrievalOrderIdForUpdate === undefined || retrievalOrderIdForUpdate == null ) ? "" : data[retrievalOrderIdForUpdate].client.name}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Pickup location</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Pickup location'
                        {...formik.getFieldProps('checkout_location_other')}
                      />
                      {formik.touched.checkout_location_other && formik.errors.checkout_location_other && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.checkout_location_other}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Pickup date</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='date'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Pickup date'
                        {...formik.getFieldProps('checkout_date_other')}
                      />
                      {formik.touched.checkout_date_other && formik.errors.checkout_date_other && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.checkout_date_other}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Pickup time</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Pickup time'
                        {...formik.getFieldProps('checkout_time_other')}
                      />
                      {formik.touched.checkout_time_other && formik.errors.checkout_time_other && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.checkout_time_other}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Empty Box return date</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='date'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Empty Box return date'
                        {...formik.getFieldProps('empty_return_date_other')}
                      />
                      {formik.touched.empty_return_date_other && formik.errors.empty_return_date_other && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.empty_return_date_other}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Empty Box return time</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Empty Box return time'
                        {...formik.getFieldProps('empty_return_time_other')}
                      />
                      {formik.touched.empty_return_time_other && formik.errors.empty_return_time_other && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.empty_return_time_other}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Special requirement</label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Special requirement'
                        {...formik.getFieldProps('special_instruction')}
                      />
                    </div>
                  </div> 
                </div>

                <div className='col-lg-6' style={{paddingLeft: '30px'}}>

                  <div className='row mb-6'>
                    <label className='col-lg-12 col-form-label fw-bold fs-6 mb-2'>
                      {products[0].name} original price HKD {products[0].price}
                    </label>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Quantity</label>
                    <div className='col-lg-8'>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = parseInt(quantity.documentBox) - 1;
                              if(__qty < 0) __qty = 0;
                              setQuantity({...quantity, documentBox: __qty.toString()})
                            }}
                          >
                            <MinusOutlined />
                          </span>
                        </div>
                        <input 
                          type="number" 
                          className="form-control form-control-lg form-control-solid text-center" 
                          value={quantity.documentBox}
                          onChange={(e) => {setQuantity({...quantity, documentBox: e.target.value})}}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = (parseInt(quantity.documentBox) + 1).toString();
                              setQuantity({...quantity, documentBox: __qty})
                            }}
                          >
                            <PlusOutlined />
                          </span>
                        </div>
                      </div>
                    </div>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Price</label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Enter price'
                        value={price.documentBox}
                        onChange={(e) => {setPrice({...price, documentBox: e.target.value})}}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-12 col-form-label fw-bold fs-6 mb-2'>
                      {products[1].name} original price HKD {products[1].price}
                    </label>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Quantity</label>
                    <div className='col-lg-8'>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = parseInt(quantity.oversizeBox) - 1;
                              if(__qty < 0) __qty = 0;
                              setQuantity({...quantity, oversizeBox: __qty.toString()})
                            }}
                          >
                            <MinusOutlined />
                          </span>
                        </div>
                        <input 
                          type="number" 
                          className="form-control form-control-lg form-control-solid text-center" 
                          value={quantity.oversizeBox}
                          onChange={(e) => {setQuantity({...quantity, oversizeBox: e.target.value})}}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = (parseInt(quantity.oversizeBox) + 1).toString();
                              setQuantity({...quantity, oversizeBox: __qty})
                            }}
                          >
                            <PlusOutlined />
                          </span>
                        </div>
                      </div>
                    </div>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Price</label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Enter price'
                        value={price.oversizeBox}
                        onChange={(e) => {setPrice({...price, oversizeBox: e.target.value})}}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-12 col-form-label required fw-bold fs-6 mb-2'>
                      {products[2].name} original price HKD {products[2].price}
                    </label>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Quantity</label>
                    <div className='col-lg-8'>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = parseInt(quantity.wardrobeBox) - 1;
                              if(__qty < 0) __qty = 0;
                              setQuantity({...quantity, wardrobeBox: __qty.toString()})
                            }}
                          >
                            <MinusOutlined />
                          </span>
                        </div>
                        <input 
                          type="number" 
                          className="form-control form-control-lg form-control-solid text-center" 
                          value={quantity.wardrobeBox}
                          onChange={(e) => {setQuantity({...quantity, wardrobeBox: e.target.value})}}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = (parseInt(quantity.wardrobeBox) + 1).toString();
                              setQuantity({...quantity, wardrobeBox: __qty})
                            }}
                          >
                            <PlusOutlined />
                          </span>
                        </div>
                      </div>
                    </div>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Price</label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Enter price'
                        value={price.wardrobeBox}
                        onChange={(e) => {setPrice({...price, wardrobeBox: e.target.value})}}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-12 col-form-label required fw-bold fs-6 mb-2'>
                      {products[3].name} original price HKD {products[3].price}
                    </label>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Quantity</label>
                    <div className='col-lg-8'>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = parseInt(quantity.packageBox) - 1;
                              if(__qty < 0) __qty = 0;
                              setQuantity({...quantity, packageBox: __qty.toString()})
                            }}
                          >
                            <MinusOutlined />
                          </span>
                        </div>
                        <input 
                          type="number" 
                          className="form-control form-control-lg form-control-solid text-center" 
                          value={quantity.packageBox}
                          onChange={(e) => {setQuantity({...quantity, packageBox: e.target.value})}}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text btn btn-secondary"
                            onClick={(e) => {
                              let __qty = (parseInt(quantity.packageBox) + 1).toString();
                              setQuantity({...quantity, packageBox: __qty})
                            }}
                          >
                            <PlusOutlined />
                          </span>
                        </div>
                      </div>
                    </div>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>Price</label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='text'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Enter price'
                        value={price.packageBox}
                        onChange={(e) => {setPrice({...price, packageBox: e.target.value})}}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Payment Method</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <select 
                        className='form-select form-select-solid'
                        value={paymentMethodId}
                        onChange={(e) => {setPaymentMethodId(e.target.value)}}
                      >
                        <option value="">Select payment method</option>
                        {
                          paymentMethod && paymentMethod.length > 0 &&
                          paymentMethod.map((element: any, index: number) => 
                          <option value={element.id} key={index}>{element.description}</option>)
                        }
                      </select>
                    </div>
                  </div>
                  
                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Payment status</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <select 
                        className='form-select form-select-solid'
                        value={paymentStatusId}
                        onChange={(e) => {setPaymentStatusId(e.target.value)}}
                      >
                        <option value="">Select payment status</option>
                        {
                          paymentStatus && paymentStatus.length > 0 &&
                          paymentStatus.map((element: any, index: number) => 
                          <option value={element.id} key={index}>{element.description}</option>)
                        }
                      </select>
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Storage month</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='string'
                        disabled
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Storage month'
                        value={storageMonth}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className=''>Lump sum</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='string'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Lump sum'
                        value={lumpSum}
                        onChange={(e) => {setLumpSum(e.target.value)}}
                      />
                    </div>
                  </div>

                  <div className='row mb-6'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6'>
                      <span className='required'>Paid amount</span>
                    </label>
                    <div className='col-lg-8 fv-row'>
                      <input
                        type='string'
                        className='form-control form-control-lg form-control-solid'
                        placeholder='Paid amount'
                        {...formik.getFieldProps('paid_fee')}
                      />
                      {formik.touched.paid_fee && formik.errors.paid_fee && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>{formik.errors.paid_fee}</div>
                        </div>
                      )}
                    </div>
                  </div>

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