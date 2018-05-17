import React, {Component} from 'react';
import '../css/weather.css';

class ARKHeader extends Component{
    render(){
        return(
            <div className='ark-header'>
                <table className='ark-header-table'>
                    <tbody>
                        <tr>
                            <td width='25%' align='center'>
                                <span className='ark-brand'>
                                    <a href='/'>
                                        <h3>Ahaan & Ahavhaan</h3>
                                    </a>
                                    <a href='/'>
                                        <h2>Raj Kishore</h2>
                                    </a>
                                </span>
                            </td>
                            <td align='right' width='75%'>
                                <span className='ark-brand'>
                                    <a href='/' className='ark-brand'>
                                        <h1>Weather</h1>
                                    </a>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ARKHeader;