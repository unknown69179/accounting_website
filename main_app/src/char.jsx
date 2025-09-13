import { useContext , useEffect , useState } from "react"
import { Nightsetting } from "./dashboard"
import axios from "axios";
import { Page } from "./pager";

import {
  Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend, } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export function Chart(){

    const {nightMode} = useContext(Nightsetting);
    const {refresh,set_data_content,userSelect1} = useContext(Page);

    const [points,setpoints] = useState([0,100,1000]);
    const [months,setmonths] = useState(["Jan", "Feb", "Mar", "Apr", "May"]);
    const [label,setlabel] = useState("monthly income");
    const [charType,setCharType] = useState("income");
    const [incoms, setIncoms] = useState([]);
    const [expense, setExpense] = useState([]);

    const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November","December"]

    function normal_char(char){
        const monthsArray = [];
        const pointsArray = [];

        char.forEach(item => {
          const date = new Date(item.date_time);
          const monthIdx = date.getMonth();
          const monthLabel = Months[monthIdx];

          const existingIndex = monthsArray.indexOf(monthLabel);
          if (existingIndex === -1) {
            monthsArray.push(monthLabel);
            pointsArray.push(Number(item.amount));
          } else {
            pointsArray[existingIndex] += Number(item.amount);
          }
        });
        setpoints(pointsArray);
        setmonths(monthsArray);
}
    function net_char(char1,char2){

    const counter = [];
    const monthsArray = [];

    const allItems = [...char1, ...char2];
    allItems.forEach(item => {
        const date = new Date(item.date_time);
        const monthLabel = Months[date.getMonth()];

        const existingIndex = monthsArray.indexOf(monthLabel);
        if (existingIndex === -1) {
            monthsArray.push(monthLabel);
            if(item.type_ === "income") counter.push(Number(item.amount));
            else counter.push(-Number(item.amount));
        } else {
            if(item.type_ === "income") counter[existingIndex] += Number(item.amount);
            else counter[existingIndex] -= Number(item.amount);
        }
    });
      setpoints(counter);
      setmonths(monthsArray);
}
        const fetching = async () => {
    try {
        const response = await axios.post("http://localhost:5000",{userSelect1},{withCredentials: true});
        set_data_content(response.data);

        console.log(response);

        if(response.data.length == 0){
          return;
        }
        
      setIncoms(response.data.filter(x => x.type_ === "income"));
      setExpense(response.data.filter(x => x.type_ === "expense"));

    } catch (err) {
        console.log("Error fetching data:", err);
    }
        }
    
        useEffect(() => {    
            fetching();
        },[refresh])

        useEffect(() => {
          
          if (charType == "income"){
            setlabel("monthly income")
            normal_char(incoms);
          }
          else if(charType == "expense"){
            setlabel("monthly expenses")
            normal_char(expense)
          }
          else if(charType == "net"){
            setlabel("monthly net revenue")
            net_char(incoms,expense)
          }
        },[charType, incoms, expense])

    const data = {
        labels:months,
        datasets:[
            {
            label:label,
            data:points,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "hsla(180, 48%, 52%, 0.20)",
            tension: 0.4,
        },],        
    };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "nearest", axis: "x", intersect: false },
  };

    const Dcont1_style = {
        width:"600px",
        height:"200px",
        color:nightMode ? "white":"black",
        boxShadow:nightMode ? " 0px 0px 0px hsl(0, 0%, 50%)":" 0px 0px 15px hsl(0, 0%, 50%)",
        backgroundColor:nightMode ? "hsl(209, 100%, 10%)":"white",
        transition:"background-color 0.25s",
        textAlign:"center",
        display:"flex",
    }

    const inputStyle = {
        color:nightMode ? "white":"black",
        borderRadius:"20px",
        backgroundColor:nightMode ? "hsl(209, 100%, 20%)":"hsl(0, 0%, 90%)",
        border:"none",
        padding:"2px 7px",
        position:"relative"
    }

    return(

        <div className="board" style={Dcont1_style}>
                <Line data={data} options={options}/>
                  <div>  
                    <select style={inputStyle} onChange={(e) => {setCharType(e.target.value)}}>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                      <option value="net">Net Value</option>
                    </select>
                  </div>
        </div>
    )
}