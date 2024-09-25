// resource url to get real time currency value w.r.t 1 USD
const base_url = 'https://api.fxratesapi.com/latest';


// get two input element (i.e country1 and countr2 select from the drop-down list)
let input_country = document.querySelectorAll('.input')

// this is use for buliding logic and intially kept the value zero and when user select any country from drop-down list then it will get get some value
let country1_currency_value = 0;
let country2_currency_value = 0;

// this is base value means how many currency2 value would have for currency1 one value and initially kept the value 1 for building some elogic
let currency1_box_Basevalue = 1;
let currency2_box_Basevalue = 1;

// array of two input element where user can see currency value
let currency_box_elements = document.querySelectorAll("input[name='currency-box']");

// currency input elements which means user can display the value with the help of these elements
let box1_element = document.querySelector("#currency-value1")
let box2_element = document.querySelector("#currency-value2")

// these are div elements or box where we can insert the image of flag
let flag1_box = document.querySelector("#flag1");
let flag2_box = document.querySelector("#flag2");

// create and append image element of flags under div element and it would be use for display the country flag image whatever country would be selected from the drop-down list
let flag1_createElement = document.createElement("img");
flag1_box.appendChild(flag1_createElement);
let flag2_createElement = document.createElement("img");
flag2_box.appendChild(flag2_createElement);

// get div elements where we can display the symbol of currency based on country selection
let currency1_symbol_element = document.querySelector("#symbol1");
let currency2_symbol_element = document.querySelector("#symbol2");

// get div element where we can display two currency data (i.e 1 USD = 83.33 INR)
let currency_compare_element = document.querySelector("#currency-update");

// create the variable and kept some initial value which can be use of default function and other logic as well
let currency1_shortName = 'USD';
let currency2_shortName = 'INR'

// get div elements wheere we can display the graph as comparison between two currency
let graph1_element = document.querySelector("#graph1-display");
let graph2_element = document.querySelector("#graph2-display");

// get button element which can be use to refresh graph and currency update value
let refresh_element = document.querySelector("#refresh");

// get footer element which can be to insert data and time of currency coverstion
let footer_element = document.querySelector(".footer");


//============================ CONVERTER API CALL FUNCTION ======================================================//
//==============================================================================================================//

// asysnc function which will return the promise and user can fetch the result using then(res) or cathc(err)
async function converter(currency){
    
    // first get response of the API then move to the next statement
    let promise_currency = await fetch(base_url,{
        method : 'GET',   // get method to get response body
    });

    // console.log(promise_currency);

    // convert above response to the more accurate response i.e in the form of JSON object
    let currencies_json = await promise_currency.json();
    // console.log(currencies_json);
    // console.log(currency);

    // get required part of the json object (i.e rates object)
    let rates = currencies_json.rates;
    let utc_time = currencies_json.date;

    footer_element.innerText = new Date(utc_time);

    // get country currency value against 1 USD and also convert the the value upto 4 decimal only
    let currency_value = Number(rates[currency]).toFixed(8);
    // console.log(currency_value,typeof(currency_value));
    
    // returning currency value in Number format
    return Number(currency_value);
}

//=============================== GRAPH and CURRENCY UPDATE FUNCTION ===========================================//
//==============================================================================================================//


//  function to update graph represntation and currency compare data
function currencyCampareData(currency1_shortName, currency2_shortName, currency2_value_against_currency1){

  // print text in small div element b/w two graphs  
  currency_compare_element.innerText = `1 ${currency1_shortName} = ${currency2_value_against_currency1} ${currency2_shortName}`

// logic for grpahs height
  if(currency2_value_against_currency1 > 1){
    let biggerValue = 4 + (currency2_value_against_currency1/15);
    graph2_element.style.height='2vh';
    graph1_element.style.height= `${biggerValue}vh`
  }
  else if(currency2_value_against_currency1 < 1){ 
    let biggerValue = 4 + (1/(currency2_value_against_currency1*15));
    graph1_element.style.height='2vh';
    graph2_element.style.height= `${biggerValue}vh`
  }
  else{
    graph1_element.style.height='10vh';
    graph2_element.style.height='10vh';
  }

}

//================================== DEFAULT FUNCTION ===========================================================//
//==============================================================================================================//


// function called whenever page is refresh or load
let defaultSetting = ()=>{
    let count = 0;   // initail kept value zero for bulid logic

    // array function to apply logic on each element
    input_country.forEach((defaultCountry)=>{

        // here it will set bydefault country 1 as America and their flag, currency value & symbol
        if(count===0){
            count++
            defaultCountry.value='America';
            flag1_createElement.setAttribute("src",`https://flagicons.lipis.dev/flags/4x3/us.svg`);
            flag1_createElement.setAttribute("alt","America");
            currency1_symbol_element.innerText = document.querySelector(`option[value=America]`).getAttribute('symbol');
            box1_element.value = 1; 
            country1_currency_value = box1_element.value;
            currency1_box_Basevalue = box1_element.value;
        }

        // here it will set by default country 2 as India and other details like symbol and currency value & flag
        else{
            defaultCountry.value='India';
            flag2_createElement.setAttribute("src",`https://flagicons.lipis.dev/flags/4x3/in.svg`);
            flag2_createElement.setAttribute("alt","India");
            currency2_symbol_element.innerText = document.querySelector(`option[value=India]`).getAttribute('symbol');
            converter('INR').then((result)=>{
                // console.log(result);
                box2_element.value = Number((result).toFixed(4));
                country2_currency_value = box2_element.value; 
                currency2_box_Basevalue = box2_element.value

                // call function for display graph and small text update for comparing two countries currencies
                currencyCampareData(currency1_shortName,currency2_shortName,currency2_box_Basevalue);
            })
        }
        
    })
    
}


// call default setting function whenever pags gets load or refresh
defaultSetting();

//===============================LOGIC BUILD FOR FETCH CURRENCY REAL TIME DATA =================================//
//==============================================================================================================//


// Array function use to apply addEvent listner for both input value so it will apply logic if an input get trigger
input_country.forEach((country)=>{   // here country is referred as 'input' element

    //appy event listner so whenever Input value get change then it will apply below logic
    country.addEventListener("change",()=>{

        // using try and catch to print the error if any
        try{
        let country_name = country.value;  // get user input value (means country name)
        let input_field = country.getAttribute("name");  // get name attribute value

        // (get option element for input value
        // here using the double around country_name becuase this way it can take string with spaces as well )
        let country_option_element = document.querySelector(`option[value="${country_name}"]`);
        let country_currency = country_option_element.innerText;  // get innerText value for option element
        
        let flag = country_option_element.getAttribute("flag");   // get flag attribute value i.e in, us etc

        // get symbol attribute value to use for printing currency symbol of selected country
        let currency_symbol_code = country_option_element.getAttribute("symbol");
        // console.log(currency_symbol_code);

        // logic for displaying for country1 Name, flag, symbol and currencies value
             if(input_field==="input1"){

                currency1_shortName = country_currency;
                // console.log(currency1_shortName,typeof(currency1_shortName));

                flag1_createElement.setAttribute("src",`https://flagicons.lipis.dev/flags/4x3/${flag}.svg`);
                flag1_createElement.setAttribute("alt",country_name);

                currency1_symbol_element.innerText = currency_symbol_code;
                
               converter(country_currency).then((result)=>{
                country1_currency_value = result;
                // console.log(country1_currency_value);

        // print currency1 and currency2 value (i.e. currency1 = 1  and currency2 = 83.3333)
                if(country1_currency_value>0 && country2_currency_value>0){
                    currency2_box_Basevalue = Number((country2_currency_value/country1_currency_value).toFixed(5));
                    // console.log(currency1_box_Basevalue,currency2_box_Basevalue);
                    box1_element.value = currency1_box_Basevalue;
                    box2_element.value = currency2_box_Basevalue;
                    
                    currencyCampareData(currency1_shortName,currency2_shortName,currency2_box_Basevalue);
                }

               })
            }

        // logic for displaying for country2 Name, flag, symbol and currencies value
            else{
                currency2_shortName = country_currency;

                flag2_createElement.setAttribute("src",`https://flagicons.lipis.dev/flags/4x3/${flag}.svg`);
                flag2_createElement.setAttribute("alt",country_name);
                // flag2_box.appendChild(flag2_createElement);

                currency2_symbol_element.innerText = currency_symbol_code;

                converter(country_currency).then((result)=>{
                    country2_currency_value = result;
                    // console.log(country2_currency_value);

                    if(country1_currency_value>0 && country2_currency_value>0){
                        currency2_box_Basevalue = Number((country2_currency_value/country1_currency_value).toFixed(5));
                        // console.log(currency1_box_Basevalue,currency2_box_Basevalue);
                        box1_element.value = currency1_box_Basevalue;
                        box2_element.value = currency2_box_Basevalue;

                        currencyCampareData(currency1_shortName,currency2_shortName,currency2_box_Basevalue);
                    }

                   })
            }
        }

        // print error in console if any
        catch(err){

            console.log("error with country drop-down input field:",err);

            try{
                if(input_field==="input1"){
                    country1_currency_value=0;
                }
                    else{
                        country2_currency_value=0;
                    }
            }
            catch(error){
                console.log("error with currency-box after country drop-down selection:",error);
            }

        }
       
    })
})

//================================= FUNCTION CALL AFTER EDIT CURRENCY VALUE =====================================//
//==============================================================================================================//


// Array function to apply logic on each array element
currency_box_elements.forEach((currency_box)=>{

    // Apply event listner for both currency box input
    currency_box.addEventListener("change",()=>{

    // logic call whenever user change or edit the current value of any of country currency value
        try{
            let currency_box_field = currency_box.getAttribute("box")
                if(currency_box_field === "box1"){
                let currency1_value = currency_box.value;
                let currency2_value = Number((currency2_box_Basevalue * currency1_value).toFixed(4));
                box2_element.value = currency2_value;
            }
            else{
                let currency2_value = currency_box.value;
                let currency1_value = ((currency2_value/currency2_box_Basevalue).toFixed(4));
                box1_element.value = currency1_value;
            }
            }
            catch(error){
                console.log("error in currency box:",error);
        }
    })
})

//============================== REFRESH BUTTON LOGIC============================================================//
//==============================================================================================================//


// whenver user click on refresh button if will refresh the graphs and small currency update data
refresh_element.addEventListener("click",()=>{
    refresh_element.classList.add("spin-refresh");
    currency_compare_element.innerText = "loading..."
    let refresh_currency1;
    let refresh_currency2;
    converter(currency1_shortName).then((result1)=>{
        refresh_currency1 = result1;
        converter(currency2_shortName).then((result2)=>{
            refresh_currency2= result2;
            refresh_currency2 = Number((refresh_currency2/refresh_currency1).toFixed(5));
            setTimeout(
            currencyCampareData(currency1_shortName,currency2_shortName,refresh_currency2), 1000);
            // console.log("It's working");
        })
    })
    setTimeout(()=>{
        refresh_element.classList.remove("spin-refresh")
    },2000);
})

//===================================== THE END =============================================================//
//==============================================================================================================//

