import React, { Component } from 'react';
import { geolocated } from 'react-geolocated';
import { countries } from 'country-data';
import Popup from 'reactjs-popup';
import ARKGoogleMap from './GoogleMap';
import '../css/weather.css';

class ARKWeatherInfo extends Component {
    state = {
        hourVisible: false,
        detailVisible: false,
        hourIndex: -1,
        dayIndex: -1,
        latitude: undefined,
        longitude: undefined,
        bCoordinatesAvailable: false,
        bWeatherInfoAvaiable: false,
        city: undefined,
        country: undefined,
        count: undefined,
        hourDeatil: [],
        dateList: [],
        weather_list: []
    }

    populateWeatherData(weather_data) {
        let s = this.state;
        s.city = weather_data.city.name;
        s.country = countries[weather_data.city.country].name;
        s.count = weather_data.cnt;
        let weatherList = [];
        let dateInfo = [];
        let count = 0;
        let dateS = '';
        let hours = [];
        for (var i = 0; i < s.count; i++) {
            let dt_txt = weather_data.list[i].dt_txt;
            dt_txt = dt_txt.split(' ');
            if (dateS === '')
                dateS = dt_txt[0].trim();

            const weather = {
                time: dt_txt[1].trim(),
                //date: dt_txt[0].trim(),
                temp: weather_data.list[i].main.temp,
                temp_min: weather_data.list[i].main.temp_min,
                temp_max: weather_data.list[i].main.temp_max,
                pressure: weather_data.list[i].main.pressure,
                sea_level: weather_data.list[i].main.sea_level,
                grnd_level: weather_data.list[i].main.grnd_level,
                humidity: weather_data.list[i].main.humidity,
                temp_kf: weather_data.list[i].main.temp_kf,
                w_type: weather_data.list[i].weather[0].main,
                w_desc: weather_data.list[i].weather[0].description,
                w_icon: "http://openweathermap.org/img/w/" + weather_data.list[i].weather[0].icon + ".png",
                cloud: weather_data.list[i].clouds.all,
                wnd_speed: weather_data.list[i].wind.speed,
                wnd_deg: weather_data.list[i].wind.deg,
            };

            if (dateS !== dt_txt[0].trim()) {
                dateS = dt_txt[0].trim();
                weatherList.push(hours);
                dateInfo.push(dateS);
                count = 0;
                hours = [];
                hours[count] = weather;
            } else {
                hours[count++] = weather;
            }
        }
        weatherList.push(hours);
        s.weather_list = weatherList;
        s.dateList = dateInfo;
        this.setState({ s });
    }

    getGeoCoordinates = async () => {
        if (this.state.bCoordinatesAvailable) {
            return;
        }
        if (this.props.isGeolocationAvailable) {
            if (this.props.isGeolocationEnabled) {
                if (this.props.coords) {
                    let s = this.state;
                    s.latitude = this.props.coords.latitude;
                    s.longitude = this.props.coords.longitude;
                    s.bCoordinatesAvailable = true;
                    this.setState({ s });
                }
            }
        }
    }

    getGoogleGeoCoordinates = (event, lat, lng) => {
        event.preventDefault();
        let s = this.state;
        s.latitude = lat;
        s.longitude = lng;
        this.setState({ s });
        this.getWeatherInfo();
        return true;
    }

    getWeatherInfo = async () => {
        try {
            const url = process.env.REACT_APP_OWMA_URL + this.state.latitude + "&lon=" + this.state.longitude + "&APPID=" + process.env.REACT_APP_OWMA_KEY + "&units=metric";
            const weatherInfo = await fetch(url);
            const weather_data = await weatherInfo.json();
            let s = this.state;
            s.bWeatherInfoAvaiable = true;
            this.setState({ s });
            this.populateWeatherData(weather_data);
        } catch (err) {
            console.log(err);
        }
    }

    componentDidUpdate() {
        return false === this.state.bCoordinatesAvailable ? this.getGeoCoordinates() : (false === this.state.bWeatherInfoAvaiable ? this.getWeatherInfo() : null);
    }

    componentWillReceiveProps() {
        return false === this.state.bCoordinatesAvailable ? this.getGeoCoordinates() : (false === this.state.bWeatherInfoAvaiable ? this.getWeatherInfo() : null);
    }

    componentDidMount() {
        return false === this.state.bCoordinatesAvailable ? this.getGeoCoordinates() : (false === this.state.bWeatherInfoAvaiable ? this.getWeatherInfo() : null);
    }

    onClick = (event) => {
        let s = this.state;
        s.hourVisible = true;
        s.detailVisible = false;
        s.dayIndex = parseInt(event.target.id, 10);
        this.setState({ s });
    }

    onClickHourDetails = (event) => {
        let s = this.state;
        s.detailVisible = true;
        s.hourIndex = parseInt(event.target.id, 10);
        let details = s.weather_list[s.dayIndex];
        s.hourDeatil = details[s.hourIndex];
        this.setState({ s });
    }

    onClickPopup = () => {
        let s = this.state;
        s.hourVisible = false;
        s.detailVisible = false;
        this.setState({ s });
    }

    convertDegree2Direction = (degree) => {
        let val = Math.floor((degree / 22.5) + 0.5);
        let arr = ['North', 'North-North East', 'North-East', 'East-North East', 'East', 'East-South East', 'South-East', 'South-South East', 'South', 'South-South West', 'South West', 'West-South West', 'West', 'West-North West', 'North West', 'North-North West'];
        return arr[val % 16];
    }

    render() {
        let weatherList = this.state.weather_list;
        let dayIndex = this.state.dayIndex >= weatherList.length ? 0 : this.state.dayIndex;

        return (
            /* MAIN DIV */
            <div>
                {/* POPUP LINK AREA */}
                <div className='ark-weather-area'>
                    <Popup
                        trigger={
                            <span className='ark-modal-link'>
                                <a className='button' onClick={this.onClickPopup}>
                                    Pick your location...
                            </a>
                            </span>}
                        modal>
                        {close => (
                            <div className="ark-modal">
                                <a className="close" onClick={close}>
                                    &times;
                            </a>
                                <div className="header"> Google Map </div>
                                <div className="content fadeIn">
                                    <ARKGoogleMap getGoogleGeoCoordinates={this.getGoogleGeoCoordinates} lat={this.state.latitude} lng={this.state.longitude} />
                                </div>
                            </div>
                        )
                        }
                    </Popup>
                </div>

                {/* DIV LOCATION {City, Country} */}
                <div className={this.state.hourVisible ? 'ark-modal-label fadeIn' : 'ark-modal-label fadeOut'}>
                    {undefined !== this.state.count ? this.state.city + ',' + this.state.country : ''}
                </div>

                {/* DIV HOUR DETAILS... */}
                <div className={this.state.detailVisible ? 'ark-weather-details fadeIn' : 'ark-weather-details: fadeOut'}>
                    {
                        -1 !== this.state.hourIndex ?
                            <div>
                                <span className='ark-weather-details-label'>Tempratue: </span>{this.state.hourDeatil.temp}&#8451; <span className='ark-weather-details-label'>Max.: </span>{this.state.hourDeatil.temp_max}&#8451; <span className='ark-weather-details-label'>Min.: </span>{this.state.hourDeatil.temp_min}&#8451;<br />
                                <span className='ark-weather-details-label'>Weather Info: </span>
                                {this.state.hourDeatil.w_desc}, <span className='ark-weather-details-label'>Humidity: </span>{this.state.hourDeatil.humidity}<br />
                                <span className='ark-weather-details-label'>Wind: </span>{this.state.hourDeatil.wnd_speed}KmpH, <span className='ark-weather-details-label'>Direction: </span>{this.convertDegree2Direction(this.state.hourDeatil.wnd_deg)}<br />
                                <span className='ark-weather-details-label'>Presuure: </span>{this.state.hourDeatil.pressure}mmHg, <span className='ark-weather-details-label'>Ground Level: </span>{this.state.hourDeatil.grnd_level}mmHg, <span className='ark-weather-details-label'>Sea Level: </span>{this.state.hourDeatil.sea_level}mmHg
                        </div> : ''
                    }
                </div>

                {/* DIV HOUR STRIP... */}
                <div className={this.state.hourVisible ? 'ark-weather-hour fadeIn' : 'ark-weather-hour fadeOut'}>
                    {
                        this.state.hourVisible ?
                            <table>
                                <tbody>
                                    <tr>
                                        {
                                            weatherList[dayIndex].map((element, index) => {
                                                index = index >= weatherList[dayIndex].length ? 0 : index;
                                                return (
                                                    <td id={index} key={index} onClick={(index) => this.onClickHourDetails(index)}>
                                                        <img id={index} alt={element.w_desc} src={element.w_icon} width={96} height={64} />
                                                        <h1 id={index}>
                                                            {element.temp} &#8451;
                                                </h1>
                                                        @{element.time}
                                                    </td>);
                                            })
                                        }
                                    </tr>
                                </tbody>
                            </table>
                            : ''
                    }
                </div>

                {/* DIV DAY STRIP... */}
                <div className='ark-weather-day'>
                    <table>
                        <tbody>
                            <tr>
                                {
                                    this.state.dateList.map((element, index) => {
                                        return <td id={index} key={index} onClick={(index) => this.onClick(index)}>
                                            <h1 id={index}>
                                                {element}
                                            </h1>
                                        </td>
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(ARKWeatherInfo);