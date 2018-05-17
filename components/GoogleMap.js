import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from 'react-pure-render/function';
import GoogleMap from 'google-map-react';
import '../css/weather.css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class ARKGoogleMap extends Component {
    static propTypes = {
        center: PropTypes.object,
        zoom: PropTypes.number,
        greatPlaceCoords: PropTypes.any,
    };
static defaultProps = {
        center: { lat: 28.675210399999997, lng: 77.3691952 },
        zoom: 11,
        greatPlaceCoords: { lat: 28.675210399999997, lng: 77.3691952 }
    }

    state = {
        latitude: undefined,//28.675210399999997,
        longitude: undefined,//77.3691952,
        center: [],
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    componentDidMount(){
        return undefined === this.state.latitude ? this.getGeoValues(this.props.lat, this.props.lng) : '';
    }

    getGeoValues(lat, lng){
        let s = this.state;
        s.latitude = lat;
        s.longitude = lng;
        s.center = [lat, lng];
        this.setState({ s });
    }

    _onClick = ({ x, y, lat, lng, event }) => {
        this.getGeoValues(lat, lng);
        this.props.getGoogleGeoCoordinates(event, lat, lng);
    }

    render() {
        return (
            <div className='fadeIn'>
                <div className='ark-coord-view'>
                    <table className='ark-map-table'>
                        <tbody>
                            <tr>
                                <td className='ark-map-label'>Latitude </td>
                                <td className='ark-map-text'>{this.state.latitude}</td>
                                <td className='ark-map-label'>Longitude </td>
                                <td className='ark-map-text'>{this.state.longitude}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='ark-map-view'>
                    <GoogleMap
                        bootstrapURLKeys={{ key: process.env.REACT_APP_GMA_KEY }}
                        center={this.props.center}
                        zoom={this.props.zoom}
                        maptype='roadmap'
                        hoverDistance={20}
                        onClick={this._onClick}>
                        <AnyReactComponent
                            lat={this.props.center.lat}
                            lng={this.props.center.lng}
                            text={'My Places'}
                        />
                    </GoogleMap>
                </div>
            </div>
        );
    }
}