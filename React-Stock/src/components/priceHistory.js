import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import { Button} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,} from 'recharts';


function setCellStyle(params) {
    return {fontSize: "20px", 
            fontFamily:'Bahnschrift SemiBold',
            color:"white"
            };
}

const columns = [
    {headerName:"Date", field: "date", sortable:true, height:100, cellStyle:setCellStyle,width:280},
    {headerName:"Open", field: "open", sortable:true,  cellStyle:setCellStyle,width:180}, 
    {headerName:"High", field: "high", sortable:true,  cellStyle:setCellStyle, width:180},
    {headerName:"Low", field: "low", sortable:true,  cellStyle:setCellStyle, width:180},
    {headerName:"Close", field: "close", sortable:true,  cellStyle:setCellStyle, width:180},
    {headerName:"Volumes", field: "volumes", sortable:true,  cellStyle:setCellStyle, width:180},

]
const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));



export default function PriceHis() {
    const { symbol } = useParams();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const history = useHistory();
    const classes = useStyles();
    const [entryNum, setEntryNum] = useState(0);
    const [rowData, setRowData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [defaultUrl, setDefaultUrl] = useState(true);
    const [loading, setLoading] = useState(true);
    let token = localStorage.getItem("token");
    function logout(){
        localStorage.removeItem("token");
      }

    // logout the user after the token expires
    if(token != null){
        if(token.exp < Date.now()){
            logout();
        }
    }
    //display all entries when date range is not specified
    const url = defaultUrl ? `http://131.181.190.87:3000/stocks/authed/${symbol}?to=2020-3-25`:`http://131.181.190.87:3000/stocks/authed/${symbol}?from=${from}&to=${to}` ;
    
    const headers = {
        accept:"application/json",
        "Content-Type":"application/json",
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetch(url, {headers})
        .then(res => {
            if(res.status === 403){
                alert("Sorry! Access denied, you have to log in to view price history!");
                setLoading(false);
            }if(res.status === 404){
                setRowData(null);
                setChartData(null);
                setEntryNum(0)
                setLoading(false);
                alert("No entries found for this date range! Please try again!");
            }
            return res.json()})
        .then(res => res.map(price => (
            {
            date:price.timestamp,
            open:price.open,
            high:price.high,
            low:price.low,
            close:price.close,
            volumes:price.volumes
        })))
        .then(prices =>{
            setRowData(prices);
            setEntryNum(prices.length);
            let dataObj = []; // get all the chart data for the selected date range in a forloop
            for(let i = 0; i < prices.length; i++){
                dataObj.push({date:prices[i].timestamp, ClosingPrice:prices[i].close})
            }
            setChartData(dataObj);
            setLoading(false)
        })
        .catch(e =>{
        })

    }, [url, headers]);
    if(loading){
        return(<div> <h1>Loading</h1></div>)
    }else{
        return (
        <div className="price-his">
            <h1>{entryNum}&nbsp;&nbsp;entries for {symbol}.</h1>

            <div  className="back-button">
            <div className="date-from-to">
            <Grid container >
                
            <Button size="large" variant="contained" color="secondary" onClick={() => history.push("/Stocks")}>Back</Button>

            <form className={classes.container} noValidate>
            <TextField
                    id="date"
                    label="From"
                    type="date"
                    defaultValue="2019-11-05"
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={e =>{
                        setDefaultUrl(false);
                        setFrom(e.target.value);

                    }}
                        />
                </form>

                <form className={classes.container} noValidate>
            <TextField
                    id="date"
                    label="to"
                    type="date"
                    defaultValue="2020-03-24"
                    fontFamily="IMPACT"
                    className={classes.textField}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    onChange={e =>{
                        setDefaultUrl(false);
                        setTo(e.target.value);
                    }}
                        />
                </form>

            </Grid>
            </div>

            </div>
            <div className="ag-theme-alpine-dark"
                    style={{
                        height:"300px",
                        width: "1200px",
                    }}>
                        <AgGridReact 
                        columnDefs={columns}
                        rowData={rowData}
                        />
                    </div>

                    <div className="close-chart">
                    <LineChart
                        width={1280}
                        height={400}
                        data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="ClosingPrice" stroke="black" />
                    </LineChart>
                    </div>
    
        </div>
        );
    }
}