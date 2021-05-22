
import React from "react";
import {useState, useEffect} from "react";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,} from 'recharts';


//make ag-grid sorting key case insensititive
const customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
};

function setCellStyle(params) {
    return {fontSize: "20px", 
            fontFamily:'Bahnschrift SemiBold',
            color:"white"

            };
}

const columns = [
    {headerName:"Date", field: "date",sortable: true, comparator: customComparator, cellStyle: setCellStyle, width:280, filter:true},
    {headerName:"Open", field: "open", sortable: true, comparator: customComparator, cellStyle: setCellStyle, width:180},
    {headerName:"High", field: "high",sortable: true, comparator: customComparator, cellStyle: setCellStyle,width:180},
    {headerName:"Low", field: "low",sortable: true, comparator: customComparator, cellStyle: setCellStyle,width:180},
    {headerName:"Close", field: "close",sortable: true, comparator: customComparator, cellStyle: setCellStyle,width:180},
    {headerName:"Volumes", field: "volumes",sortable: true, comparator: customComparator, cellStyle: setCellStyle,width:180}

];



function SearchBar(props) {
    const [innerSearch, setInnerSearch] = useState("");
    return (
      <div>
        <Input

          placeholder = "Enter Symbol to search"
          aria-labelledby="search-button"
          fontColor ="white"
          
          name="search"
          id="search"
          type="search"
          onChange={e => {
            setInnerSearch(e.target.value)}}
          
          value={innerSearch}
        />
        <Button 
          size="small"
          variant="outlined"
          id="search-button"
          type="button"
          onClick={() => props.onSubmit(innerSearch)}
        >
          Search
        </Button>
      </div>
    );


  }
  
// Get the latest quote for a stock based on user's search
function GetQuotes(search){
    const [rowData, setRowData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [stockName, setStockName] = useState("NO data")

 
    const url =`http://131.181.190.87:3000/stocks/${search}` ;
    
    useEffect(() => {
         fetch(url)
                .then((res) => {
                    if (res.status === 404) {
                        throw new Error(`symbol not found, please enter a valid symbol to search! `);
                      }
                    if (res.status === 400){
                        throw new Error(` \n Usage: enter 1~5 uppercase letters to search`);
                    }
                      return res.json()})
               .then((res) => {return {date: res.timestamp ,
                                       name: res.name,
                                       symbol: res.symbol,
                                       industry: res.industry,
                                       open: res.open,
                                       high: res.high,
                                       low: res.low,
                                       close:res.close,
                                       volumes:res.volumes
               }})
               .then((quote) => {setRowData([quote]);
                                 let dataObj = [        
                                 { name: 'open', price:quote.open },
                                 { name: 'high',  price:quote.high },
                                 { name: 'low',   price:quote.close },
                                 { name: 'close', price:quote.low },];
                                 setChartData(dataObj);
                                 setStockName(quote.name);
                                 })
                .catch(error =>{
                    setChartData(null);
                    setRowData(null);
                    setStockName("No data");
                    alert(error);
                })
                

                    

    }, [url]);

    return {rowData, chartData, stockName};
  

}


function Quote(){
    const [search, setSearch] = useState();
    const {rowData, chartData, stockName} = GetQuotes(search);

    const onSubmit = innerSearch => {
        setSearch(innerSearch.toUpperCase());
      };



    return(
        <div className="quote-page">

                <div className="quoteData">
                    {
                    <h1>{stockName}</h1> 
                    }
                </div>
        

            <div className="search-bar">
            <h2>Search for Quote</h2>
            <SearchBar onSubmit={onSubmit} />

            </div>



            <div className="quote-table">
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
            </div>

            <div className="chart">
           <h2>Price variation chart</h2>
            <LineChart
                    width={1280}
                    height={300}
                    data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="black" />
                </LineChart>
            </div>
        </div>
    );
}




export default Quote;