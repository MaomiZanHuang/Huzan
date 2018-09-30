import React from 'react';
import {Picker, Toast, List, Button, Tag, Flex, InputItem} from 'antd-mobile';
import { SubPage } from '../components/SubPage';
import $ from 'axios';

var data, qzonetoken, g_tk, qq, cookie;

export default class QQ_ZAN extends React.Component {
  constructor(props) {
    super(props);
    data = JSON.parse(localStorage['login'] || '{}');
    qzonetoken = data.qzonetoken;
    g_tk = data.g_tk;
    qq = data.qq;
    cookie = data.cookie;
    this.state = {
      type: {
        title: '100',
        num: 100
      },
      inputRef: qq||'',
      ssList: []
    };
  }
  startZan() {
    
  }
  getSsList() {
    Toast.loading('正在获取说说...', 0);
    var _qq = this.state.inputRef;
    $.get(`https://mobile.qzone.qq.com/list?qzonetoken=${qzonetoken}&g_tk=${g_tk}&format=json&list_type=shuoshuo&action=0&res_uin=${_qq}&count=10`,{
      headers: {
          "Cookie" : cookie,
          "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"
      }
      })
      .then(({data}) => {
        console.log(JSON.stringify(data));
        var d = [];
        if(data.code == 0) {
          d = data.data.vFeeds.map(e => ({
            label: (e.summary||{}).summary || '',
            value: e.comm.curlikekey
          }));
        } else {
          Toast.fail("获取失败！", 1);
        }
        Toast.hide();
        this.setState({ssList: d});
      })
      .catch(err => {
        Toast.offline("网络连接失败！", 1);
        console.log(err);
        this.setState({ssList: []});
      });
  }
  render() {
    const types = [
      { title: '100', num: 100 },
      { title: '300', num: 300 },
      { title: '500', num: 500 },
      { title: '1000', num: 1000 }
    ];
    const {Item} = List;
    const {Brief} = Item;
    return (
      <SubPage title="说说赞">
        <div style={{padding: '10px'}}>
          <Flex>
            <Flex.Item style={{flex: 1}}>
              <img src={'http://q1.qlogo.cn/g?b=qq&nk='+(this.state.inputRef || '10000')+'&s=100'}  style={{ width: '100%'}}/>
            </Flex.Item>
            <Flex.Item style={{flex: 4}}>
                  <InputItem
                    clear
                    value={this.state.inputRef}
                    placeholder="输入您的QQ号"
                    onChange={
                      val => {
                        this.setState({ inputRef: val});
                      }
                    }></InputItem>
            </Flex.Item>
          </Flex>
          <div>
            <Button onClick={this.getSsList.bind(this)}>获取说说</Button>
          <Picker data={this.state.ssList} cols={1}>
            <List.Item arrow="horizontal">选择一条说说</List.Item>
          </Picker>
          </div>
          <div>
            <Button style={{backgroundColor: 'rgb(72, 187, 243)', color: '#fff'}} onClick={this.startZan.bind(this)}>开刷</Button>
          </div>
        </div>
        {/* 提示说明文字 */}
        <div>
        <List>
            <Item>
              <Brief>温馨提示</Brief>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              因为是互刷，需要你先为别人刷，别人才会为你刷哦，所以可能无法立即到账~
              </li>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              一个QQ号每天最多可以给别人点赞5000，可以切换登录的QQ(非QQ空间)无上限点赞~
              </li>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              如果刷太多导致账号被冻结，只需要改密码即可解冻~大家尽量用自己的活跃的大号来刷，这样才容易被腾讯封号~
              </li>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              首页拇指赞官方代刷下单，无需为别人刷，秒到账，价格便宜，服务有保障~
              </li>
            </Item>
          </List>
        </div>
      </SubPage>
    );
  }
}