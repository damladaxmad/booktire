import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import MaterialTable from 'material-table';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CustomButton from '../../reusables/CustomButton';
import moment from 'moment';
import { constants } from '../../Helpers/constantsFile';

export default function ProductStatement({ product, goBack }) {
    const [data, setData] = useState([]);
    const token = useSelector(state => state.login.token)
    const { business } = useSelector(state => state.login.activeUser)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${constants.baseUrl}/products/get-business-product-statement/${business?._id}/${product?._id}`, {
                    headers: {
                        'Authorization': token
                    }
                });
                setData(response.data?.data?.transactions);
            } catch (error) {
                console.error('Error fetching product statement:', error);
            }
        };

        fetchData();
    }, [product.id, token]);

    console.log(data)

    const columns = [
        { title: 'Type', field: 'inQty', render: (data) => {
            if (data.inQty == 0) return <p>OUT</p>
            if (data.outQty == 0) return <p>IN</p>
        } },
        { title: 'Quantity', field: 'itemName', render: (data) => {
            if (data.inQty == 0) return <p>{data.outQty}</p>
            if (data.outQty == 0) return <p>{data.inQty}</p>
        }  },
        { title: 'Date', field: 'date' , render: (data) => {
            if (data.sale) return <p>{moment(data?.sale?.date).format("YYYY-MM-DD")}</p>
            if (data.purchase) return <p>{moment(data?.purchase?.date).format("YYYY-MM-DD")}</p>
        }   },
        { title: 'User', field: 'user' , render: (data) => {
            if (data.sale) return <p>{data?.sale?.user}</p>
            if (data.purchase) return <p>{data?.purchase?.user}</p>
        }  },
        { title: 'Payment', field: 'payment'  , render: (data) => {
            if (data.sale) return <p>{data?.sale?.paymentType}</p>
            if (data.purchase) return <p>{data?.purchase?.paymentType}</p>
        }   },
        { title: 'Inv-No', field: 'invoiceNumber', render: (data) => {
            if (data.sale) return <p>{data?.sale?.saleNumber}</p>
            if (data.purchase) return <p>{data?.purchase?.purchaseNumber}</p>
        }   },
    ];

    return (
        <div style={{ padding: '20px', width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Typography variant="h4">{product.name}</Typography>
                    <Typography variant="subtitle1">{product.quantity} - {product.unitMeasurment}</Typography>
                </div>
                <CustomButton
                    text = "Go Back"
                    onClick={goBack}
                />
            </div>
            <MaterialTable
                title=""
                columns={columns}
                data={data}
                options={{
                    search: false,
                    paging: false,
                    showTitle: false,
                    toolbar: false,
                    headerStyle: {fontWeight: "bold"}
                }}
                style = {{marginTop: "20px", boxShadow: "none"}}
            />
        </div>
    );
}
