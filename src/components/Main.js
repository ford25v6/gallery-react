require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
	handleClick(e){
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}

  render(){
    var styleObj = {};

    if (this.props.arrange.pos) {
    	styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.rotate) {
    	(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
            styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
          }.bind(this));
    }

    if (this.props.arrange.isCenter) {
    	styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
          <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
              <img src={this.props.data.imageURL}
                   alt={this.props.data.title}
              />
              <figcaption>
                  <h2 className="img-title">{this.props.data.title}</h2>
                  <div className="img-back" onClick={this.handleClick}>
                    <p>
                      {this.props.data.desc}
                    </p>
                  </div>
              </figcaption>
          </figure>
      );
  }
}

class ControllerUnit extends React.Component {
	handleClick(e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}

		e.preventDefault();
		e.stopPropagation();	
	}
  render(){
    var controllerUnitClassName = 'controller-unit';

    // 如果对应的是居中的图片，显示控制按钮的居中态
    if (this.props.arrange.isCenter) {
        controllerUnitClassName += ' is-center';

        // 如果同时对应的是翻转图片， 显示控制按钮的翻转态
        if (this.props.arrange.isInverse) {
            controllerUnitClassName += ' is-inverse';
        }
    }

    return (
        <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}

class AppComponent extends React.Component {

  constructor() {
  	super();
  	this.Constant = {
	    centerPos: {
	        left: 0,
	        right: 0
	    },
	    hPosRange: {
	        leftSecX: [0, 0],
	        rightSecX: [0, 0],
	        y: [0, 0]
	    },
	    vPosRange: {
	        x: [0, 0],
	        topY: [0, 0]
	    }
		};

		this.state = {
			imgsArrangeArr: []
							// {
       //          pos: {
       //              left: '0',
       //              top: '0'
       //          },
       //          rotate: 0,    // 旋转角度
       //          isInverse: false,    // 图片正反面
       //          isCenter: false,    // 图片是否居中
       //      	} || []
		};
  }


  inverse(index){
   	return function () {
    	var imgsArrangeArr = this.state.imgsArrangeArr;

    	imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

    	this.setState({
      	imgsArrangeArr: imgsArrangeArr
    	});
  	}.bind(this);
  }

  rearrange(centerIndex){
   var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
        imgsArrangeCenterArr[0] = {
          pos: centerPos,
          rotate: 0,
          isCenter: true
        };

        // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
        imgsArrangeTopArr[index] = {
          pos: {
              top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        };
    });

    // 布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
        var hPosRangeLORX = null;

        // 前半部分布局左边， 右半部分布局右边
        if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
        } else {
            hPosRangeLORX = hPosRangeRightSecX;
        }

        imgsArrangeArr[i] = {
          pos: {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        };

    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
        imgsArrangeArr: imgsArrangeArr
    });
  }

  center(index){
    return function () {
      this.rearrange(index);
    }.bind(this);
  }

	componentDidMount() {
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
    };

    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
	}

  render() {
    var controllerUnits = [],
        imgFigures = [];

		var imageDatasJson = require('../data/imageDatas.json');

		var imageDatas = (function genImageURL(imageDatasArr){
			for (var i = 0, j = imageDatasArr.length; i < j; i++){
				var singleImageData = imageDatasArr[i];
				singleImageData.imageURL = require('../images/' + singleImageData.fileName);
				imageDatasArr[i] = singleImageData;
			}
			return imageDatasArr;
		})(imageDatasJson);

   imageDatas.forEach(function (value, index) {
        if (!this.state.imgsArrangeArr[index]) {
            this.state.imgsArrangeArr[index] = {
                pos: {
                    left: 0,
                    top: 0
                },
                rotate: 0,
                isInverse: false,
                isCenter: false
            };
        }

        imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

        controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
    }.bind(this));

    return (
        <section className="stage" ref="stage">
            <section className="img-sec">
                {imgFigures}
            </section>
            <nav className="controller-nav">
                {controllerUnits}
            </nav>
        </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
