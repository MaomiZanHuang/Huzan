import React from 'react';
import { hashHistory } from 'react-router';
import { Button, NavBar, Drawer, NoticeBar, Grid, TabBar, Badge } from 'antd-mobile';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import HomeIndex from './Home_Index';
import HomeAbout from './Home_About';

export default class App extends React.Component {
  constructor(props){
    super(props);
    const selectedTab = props.selectedTab || 'index';
    const loginData = JSON.parse(localStorage['login'] || '{}');
    this.state = {
      title: '拇指互刷',
      open: false,
      selectedTab,
      transition: '',
      qq: localStorage['isLogin'] ? loginData.qq : '' 
    };
    window.afterLogin = data => {
      localStorage['isLogin'] = 1;
      localStorage['login'] = JSON.stringify(data);
      this.setState({ qq: data.qq });
    }
  }
  render() {
    const contentHeight = ((document.documentElement.clientHeight || document.body.clientHeight)  - 95) + 'px';
    return (
      <div className="container">
          <NavBar className="header" mode="light"
            style={{background: 'rgb(72, 187, 243)', width: '100%', zIndex: '998' }}
            onLeftClick={() => {}}
            leftContent={<b onClick={() => {
              window.Zan.login();
            }}>
            <img src={'http://q.qlogo.cn/headimg_dl?dst_uin=' + (this.state.qq || '100001') + '&spec=640'} style={{ marginTop: '2.5px', width: '40px', height: '40px', borderRadius: '50%'}} />
            </b>}
            rightContent={
              <span className="iconfont icon-fenxiang" style={{color: '#fff'}} onClick={() => {
                window.Zan.share(JSON.stringify({
                  pic: 'https://ugc.qpic.cn/gbar_pic/2wF3sr2LiaVvBkYLQacXpHDdNu7icXncRAUJEsDqtJoS83mn8dhBXxkA/0',
                  title: '刷最NB的赞就上拇指赞！',
                  content: '金馆长代言，新人领红包换积分，所有业务通通免费刷！',
                  url: 'https://520cy.cn'
                }));
              }}></span>
            }
          >
            <span style={{color: '#fff', fontSize: '14px'}}>{this.state.title}</span>
          </NavBar>


          
          <div className="content" className={this.state.transition} style={{height: contentHeight,overflow: 'auto'}}>       
          <ReactCSSTransitionGroup 
                transitionName="fade" 
                transitionEnterTimeout={500} 
                transitionLeaveTimeout={300}
             >
             {this.state.selectedTab === 'index' ? <HomeIndex key="index"/> : <HomeAbout key="about"/>}
          </ReactCSSTransitionGroup>
          </div>

        <div style={{background: '#fff'}}>
          <TabBar
            noRenderContent={true}>
            <TabBar.Item
              icon={
                <i className="iconfont icon-index"></i>
              }
              selectedIcon={
                <i className="iconfont icon-index" style={{color:'rgb(16, 142, 233)'}}></i>
              }
              title="首页"
              key="index"
              selected={this.state.selectedTab === 'index'}
              onPress={() => {
                this.setState({
                  selectedTab: 'index',
                });
              }}
            >
            </TabBar.Item>
            <TabBar.Item
              icon= {
                <i className="iconfont icon-guanyu"></i>
              }
              selectedIcon= {
                <i className="iconfont icon-guanyu" style={{color:'rgb(16, 142, 233)'}}></i>
              }
              title="关于"
              key="about"
              selected={this.state.selectedTab === 'about'}
              onPress={() => {
                this.setState({
                  selectedTab: 'about',
                });
              }}
            >
            </TabBar.Item>
          </TabBar>
        </div>
    </div>
    );
  }
}
