import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import './index.css';
//import React, { useState, useEffect } from "react";

//import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';
import XYAxis from './components/axis/xy-axis';
import Line from './components/line/line';
import {scaleLinear, scaleBand, scaleOrdinal, scaleIdentity} from 'd3-scale';
import { line, curveMonotoneX } from 'd3-shape';
import {extent, nice} from 'd3-array';
import { transition } from 'd3-transition';
class App extends Component {
    intervalID;

    constructor() {
        super();

        this.state = {
            millData: [],
            ballmillData: [],
            val : [],
            data : [],
        }
    }


    formatData(millData,key,key1) {
        const temp=[];
        for(let i = 0; i < millData.length; i++)
        {
            temp[i] = {"name": millData[i][key1].slice(17,25) ,"value":millData[i][key]};
        }
        console.log("zxcv",millData);
        return temp;
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);

    }

    componentWillMount() {

        axios.get(`http://192.168.1.2:5000/api/ballmill`)
            .then(res => {
                const millData = res.data;
                this.setState({millData});
                this.state.val=this.formatData(millData["ballmill"],"seperator_power","created_on");

            })
        this.intervalID=setInterval(this.formatData.bind(this),5000);
        console.log("asdf", this.intervalID);
       //setTimeout(this.formatData,5000);
    }

   /* componentDidUpdate() {
        for(let i=5;i<0;i--) {
            // while(i>5) {
            axios.get(`http://192.168.1.2:5000/api/ballmill`)
                .then(res => {
                    const millData = res.data;
                    this.setState({millData});
                    this.state.val = this.formatData(millData["ballmill"], "seperator_power", "created_on");

                })
            // i=0;
            //}
        }
    }
*/
    componentDidMount() {
        axios.get(`http://192.168.1.2:5000/api/ballmill`)
            .then(res => {
                const millData = res.data;
                this.setState({millData});
                this.state.val=this.formatData(millData["ballmill"],"seperator_power","created_on");
                    console.log("hello",this.state.val);

            })
        this.intervalID=setInterval(this.formatData.bind(this),5000);
        console.log("asdf", this.intervalID);
    }
    render() {
        const data = this.state.val;

        //const data1 = [{"name":"13:48:57","value":30.222},{"name":"13:49:07","value":40.333},
        // {"name":"13:49:17","value":50.24},{"name":"13:49:27","value":90.99},{"name":"13:49:37","value":20.56}]
        //console.log("qwe",data1)
        const parentWidth = 500;
        const margins = {
            top: 20,
            right: 20,
            bottom: 50,
            left: 50,
        };
        const width = parentWidth - margins.left - margins.right;
        const height = 200 - margins.top - margins.bottom+100;
        const ticks = 5;
        const t = transition().duration(1000);
        const xScale = scaleBand()
              .domain(data.map(d => d.name))
              .rangeRound([0, width+this.state.val.length]).padding(0.01);
        //const xScale = scaleLinear()
            //.domain(extent(data, d => d.name))
           // .range([0, width])
            //.nice();

        const yScale = scaleLinear()
            .domain(extent(data, d => d.value))
            .range([height, 0])
            .nice();
        const lineGenerator = line()
            .x(d => xScale(d.name))
            .y(d => yScale(d.value))
            .curve(curveMonotoneX);
        return (
            <div align={"center"} color={"blue"} /*onLoad="JavaScript:AutoRefresh(1000000);"*/>

                <h1>Data Visualization</h1>
                <svg

                    className="lineChartSvg"
                    width={width + margins.left+20 + margins.right}
                    height={height + margins.top + margins.bottom}
                >
                    <g transform={`translate(${margins.left}, ${margins.top})`}>
                        <XYAxis {...{ xScale, yScale, height, ticks, t }} />
                        <Line data={data} xScale={xScale} yScale={yScale} lineGenerator={lineGenerator} width={width} height={height} onLoad="JavaScript:AutoRefresh(5000);"/>
                    </g>
                </svg>
<br/>
                <h4> &emsp;&emsp;&emsp;&emsp;&emsp; Graph : Separator Power</h4>
                <table >
                <tr>
                    <td>
                        <table width="100%" border="1" bordercolor="pink" cellspacing="2" cellpadding="2">
                            <tr>
                                <td colspan="2" align={"center"}>Details</td>
                            </tr>
                            <tr>
                                <td>Graph</td>
                                <td>time -vs- seperator power</td>

                            </tr>

                            <tr>
                                <td>x-Axis</td>
                                <td>time</td>

                            </tr>
                            <tr>
                                <td>y-Axis</td>
                                <td>Seperator power</td>

                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            </div>
        );
    }
}
render(<App />, document.getElementById('root'));
/*ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();