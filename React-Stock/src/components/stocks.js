
import React from "react";
import {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";


//make ag-grid sorting key case insensititive
const customComparator = (valueA, valueB) => {
    return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
};

function setCellStyle(params) {
    return {fontSize: "20px", 
            fontFamily:'Bahnschrift SemiBold',
            };
}

function testCellValue(filterValue, cellValue){
    return cellValue!=null &&cellValue === this.displayKey;
}
const columns = [
        {headerName:"Name", field: "name", sortable:true, comparator: customComparator, height:100, width:400, cellStyle:setCellStyle},
        {headerName:"Symbol", field: "symbol", sortable:true, cellStyle:setCellStyle, width:400}, 
        {headerName:"Industry", field: "industry", sortable:true,  width: 400, cellStyle:setCellStyle,
        filter: "agTextColumnFilter", filterParams:{
            width:800,
            filterOptions:[
                "empty",
                {displayKey:"health care",
                 displayName:"Health Care",
                 test: testCellValue,
                 hideFilterInput: true,
                },
                {displayKey:"industrials",
                displayName:"Industrials",
                test: testCellValue,
                hideFilterInput: true,
               },
                {displayKey:"consumer discretionary",
                displayName:"Consumer Discretionary",
                test: testCellValue,
                hideFilterInput: true,
              },                
                {displayKey:"information technology",
                displayName:"Information Technology",
                test: testCellValue,
                hideFilterInput: true,
             },             
                {displayKey:"consumer staples",
                displayName:"Consumer Staples",
                hideFilterInput: true,
                test: testCellValue,
            },             
               {displayKey:"utilities",
                displayName:"Utilities",
                test: testCellValue,
                hideFilterInput: true,
           },         
                  {displayKey:"financials",
                displayName:"Financials",
                test: testCellValue,
                hideFilterInput: true,
                },         
                    {displayKey:"real estate",
                displayName:"Real Estate",
                test: testCellValue,
                hideFilterInput: true,
            },         
                    {displayKey:"materials",
                displayName:"Materials",
                test: testCellValue,
                hideFilterInput: true,
            },            
                {displayKey:"telecommunication services",
                displayName:"Telecommunication Services",
                test: testCellValue,
                hideFilterInput: true,
        },

            ],
            suppressAndOrCondition:true

        }}

    ]

const gridOptions = {
    columnDefs: columns,
    enableColResize: true,
    floatingFilter:true
    }




function Stock(){
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    let token = localStorage.getItem("token");

    const url ="http://131.181.190.87:3000/stocks/symbols";
    useEffect(() => {
        setLoading(true);
        fetch(url)
        .then((res) => {
            if (res.status === 404) //I won't have this error because I used a dropdown filter for industry
            {
                throw new Error(`Industry sector not found`);
            }
            return res.json();
        })
        
        .then((res) => res.map(stock => ({
            name: stock.name,
            symbol: stock.symbol,
            industry: stock.industry
        })))
        .then(stocks => {
            setRowData(stocks);
            setLoading(false);
        })
        .catch(error => {
            setLoading(false);
            alert(error);

        })
        
    }, []);

    if (loading){
        return <h1>Loading</h1>;
    }

    else{
        return(
            <div className="stock-page">
                <div className="stocksData">
                    <h1>Stock Infomation</h1>
                    <h3>Log in and click on a row to view price history</h3>
                </div>


                <div className="ag-theme-alpine-dark"
                style={{
                    height:"600px",
                    width: "1200px",
                }}>
                    <AgGridReact 

                    rowData={rowData}
                    pagination={true}
                    gridOptions={gridOptions}
                    paginationPageSize={11}
                    onRowClicked={row => {
                        if(token != null){
                        history.push(`/${row.data.symbol}`)}
                        else{
                            alert("Sorry! Access denied, you have to log in to view price history!");
                        }
                    
                    }}
                    />
                </div>

            </div>
        );
    }


}


export default Stock;