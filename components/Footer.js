import React, {Component} from 'react';
import '../css/weather.css';

class ARKFooter extends Component{
    render(){
        return(
            <div className='ark-footer'>
                <div className='ark-company'>
                    <span>Ahaan & Ahavhaan Raj Kishore Associates</span><br/>
                </div>
                <div className='ark-copyright'>
                    <small>Copyright &copy; 2018 reserved.<label className='ark-logo'>&nbsp;&nbsp;A<sup>2</sup>RK Associates&nbsp;&nbsp;</label></small><br/>
                </div>
            </div>
        );
    }
}

export default ARKFooter;