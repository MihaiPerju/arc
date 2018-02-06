import React, {Component} from 'react';
import PayItem from './PayItem';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default class PayerBlock extends Component {
    render() {
        var settings = {
            infinite: true,
            speed: 500,
            slidesToShow: 4,            
            nextArrow: <RightArrow/>,
            prevArrow: <LeftArrow/>,
            slidesToScroll: 1
        };
        return (
            <div className="action-block">
                <div className="header__block">
                    <div className="title-block text-uppercase">Payer Breakdown</div>
                </div>
                <div className="main__block">
                    <div className="slide-payers">
                        <Slider {...settings}>
                            <div><PayItem/></div>
                            <div><PayItem/></div>
                            <div><PayItem/></div>
                            <div><PayItem/></div>
                            <div><PayItem/></div>
                            <div><PayItem/></div>
                        </Slider>
                    </div>
                </div>
            </div>
        )
    }
}

class RightArrow extends Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="btn-next">
                <i className="icon-angle-right"/>
            </div>
        )
    }
}

class LeftArrow extends Component {
    render() {
        return (
            <div onClick={this.props.onClick} className="btn-prev">
                <i className="icon-angle-left"/>
            </div>
        )
    }
}