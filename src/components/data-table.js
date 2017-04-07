import React from 'react';
import './data-table.less';

export default class DataTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {columns:{}, messages: [], error: ''};
    }

    componentDidMount(){
        this.startConnection();
    }

    startConnection(){
        if (!window.EventSource) {
            this.setState({error: 'EventSource is not supported in your browser!'});
            return;
        }
        this.eventSource = new EventSource(AppConfig.serverUrl);
        this.eventSource.onerror = () => this.setState({error: 'Connection error!'});
        this.eventSource.onopen = () => this.setState({columns: {Serial: ''}});
        this.eventSource.onmessage = e => {
            let data = [];
            try{
                data = JSON.parse(e.data);
            }catch(error){
                console.log(error);
            }
            let {columns, message} = data.reduce((res, curr) => {
                res.columns[curr.name] = curr.unit;
                res.message[curr.name] = curr;
                return res;
            }, {columns:this.state.columns, message:{}});

            let messages = [...this.state.messages, message];

            this.setState({messages, columns});
        }
    }

    stopConnection(){
        this.eventSource && this.eventSource.close();
    }

    componentWillUnmount(){
        this.stopConnection();
    }

    render(){
        let {columns, messages} = this.state;
        function parseValue (value){
            if (!value || !value.length) return ['-'];
            let str = value.reduce((res, curr) => {
                if (curr.length < 2){
                    console.log('format error in measurements');
                    return ['?'];
                }else{
                    let measure = curr[1];
                    switch (typeof measure) {
                        case 'string':
                        case 'number':
                            return [...res, measure];
                        case 'object':
                            if(measure instanceof Array) return [...res, measure.join(', ')];
                        default:
                            return ['unknown'];
                    }
                }
            }, []);
            return str;
        }

        let errorMsg = this.state.error? <div className="msg">{this.state.error}</div> : null;

        return (
            <div className="screen">
                <div className="screen-header">
                    <div className="screen-header-top">
                        <button onClick={()=>this.startConnection()} className="btn btn-green">Start</button>&nbsp;
                        <button onClick={()=>this.stopConnection()} className="btn btn-red">Stop</button>
                        {errorMsg}
                    </div>
                    <div>
                        {Object.keys(columns).map((col, key) =>
                            <div className="tbl-col" key={key}>{col}{(columns[col])? ', '+columns[col] : ''}</div>)}
                    </div>
                </div>
                <div className="screen-content">
                    <table>
                        <tbody>
                            {messages.map((msg, i) =>
                                <tr key={i}>
                                    {Object.keys(columns).map((col,j) => <td key={`${i}${j}`}>
                                        {msg[col] ? (parseValue(msg[col].measurements)).map((el,k) => <div key={`${i}${j}${k}`}>{el}</div>) : '-'}
                                    </td>)}
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
