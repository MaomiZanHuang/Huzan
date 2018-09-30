import React from 'react';
import ReactDOM from 'react-dom';
import ReactMixin from 'react-mixin';
import { Router, Route, hashHistory, IndexRoute, Lifecycle } from 'react-router';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import $ from 'axios';

import Home from './pages/Home';
import QQ_ZAN from './pages/QQ_ZAN';
import SS_ZAN from './pages/SS_ZAN';
import SS_COMMENT from './pages/SS_COMMENT';
import SS_LIULAN from './pages/SS_LIULAN';
import QZONE_ZAN from './pages/QZONE_ZAN';
import QZONE_LIULAN from './pages/QZONE_LIULAN';
import QZONE_COMMENT from './pages/QZONE_COMMENT';
import ResultPage from './pages/ResultPage';

import '@/assets/css/index.less';
import "@/assets/css/reset.less";

$.interceptors.request.use(config => {
  config.transformRequest = [function (data) {
    var d = data;
    var qs = "";
    for(var k in d) {
      qs += k + "=" + encodeURIComponent(d[k])+'&';
    }
    return data ? qs : data ;
  }];
  return config;
});


const Index = React.createClass({
  mixins: [Lifecycle],
  getInitialState() {
    return {
      transitionName: 'slide-right'
    };
  },
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName={this.state.transitionName}
        component="div"
        className="child-view"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        <div key={this.props.location.pathname} style={{position:"absolute", width: "100%"}}>
        {this.props.children}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
});

const checkIsLogin = (data) => {
  const {qzonetoken, g_tk, qq, cookie} = data;
  $.get(`https://mobile.qzone.qq.com/list?qzonetoken=${qzonetoken}&g_tk=${g_tk}&format=json&list_type=shuoshuo&action=0&res_uin=${qq}&count=10`)
  .then(({data}) => {
    if (data.code !== 0) {
      localStorage['isLogin'] = 0;
    } else {
      localStorage['isLogin'] = 1;
    }
  })
  .catch(e => {
    alert('网络连接失败！');
    console.log('网络连接失败！');
  });
}
var data = JSON.parse(localStorage['login'] || '{}');
checkIsLogin(data);

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Index}>
      <IndexRoute component={Home} />
      <Route path="/qq_zan" component={QQ_ZAN} />
      <Route path="/ss_zan" component={SS_ZAN} />
      <Route path="/ss_liulan" component={SS_LIULAN} />
      <Route path="/ss_comment" component={SS_COMMENT} />
      <Route path="/qzone_zan" component={QZONE_ZAN} />
      <Route path="/qzone_comment" component={QZONE_COMMENT} />
      <Route path="/qzone_liulan" component={QZONE_LIULAN} />
      <Route path="/result" component={ResultPage} />
    </Route>
  </Router>
, document.getElementById('example'));