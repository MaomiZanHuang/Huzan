import React from 'react';
import {List, Button, Tag, Flex, InputItem, Toast} from 'antd-mobile';
import { SubPage } from '../components/SubPage';
import {withRouter} from 'react-router';
import $ from 'axios';
import util from '../util/index';

var data, qzonetoken, g_tk, qq, cookie;
var HOST = 'http://120.78.74.34';
// 对本地记录进行，没有刷完或者因网络原因提交失败的订单进行恢复

const ls = util.ls;
var hasAccessbility = false;

class QQ_ZAN extends React.Component {
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
      inputRef: qq || '',
      qqs: []
    };

    window.afterZan = this.afterZan.bind(this);
    window.afterCheck = this.afterCheck.bind(this);
    window.Q = this;
  }
  afterCheck() {
    hasAccessbility = true;
  }
  afterZan(res) {
    var task = {
      qq: this.state.inputRef,
      type: 'QQ_ZAN',
      num: this.state.type.num,
      qqs: res.qqs.join(',')
    };
    ls.QQ_ZAN.clear();
    this.putTask.call(this, task);
  }
  startZan() {
    if (!hasAccessbility) {
      window.Zan.checkAccessbility();
      return false;
    }

    var task = {
      qq: this.state.inputRef.trim(),
      type: 'QQ_ZAN',
      num: this.state.type.num
    };

    if (!util.checkQQ(task.qq)) {
      Toast.info("qq号格式不正确~");
      return false;
    }
    
    var remainTasks = ls.QQ_ZAN.getTask();
    if (remainTasks.length) {
      Toast.info('您上次还有未完成的任务！');
      window.Zan.startZan(remainTasks.join(','));
      return false;
    }
    

    var _this = this;
    Toast.loading("正在获取任务中，请稍后！", 0);
    util.Log("Request", `${HOST}/mzz/index.php?m=Home&c=Huzan&a=getOTask&qq=${task.qq}&type=QQ_ZAN&num=${task.num}`);
    $.get(`${HOST}/mzz/index.php?m=Home&c=Huzan&a=getOTask&qq=${task.qq}&type=QQ_ZAN&num=${task.num}`)
      .then(({data}) => {
        util.Log("Response", data);
        var qqs = data.data;
        if (!qqs.length) {
          Toast.offline('暂时没有更多的任务，请稍后再来！');
          return false;
        }
        _this.setState({qqs: qqs});
        ls.QQ_ZAN.addTask(qqs);
        Toast.loading("正在刷赞中，请勿关闭此页面!", 0);
        window.Zan.startZan(qqs.join(','));
      })
      .catch(err => {
        Toast.offline('网络连接失败！');
      });
  }
  putTask(task) {
    Toast.loading("正在同步数据中...", 0);
    console.log(JSON.stringify(task));
    $.post(`${HOST}/mzz/index.php?m=Home&c=Huzan&a=putTask`, {
        type: task.type,
        qq: task.qq,
        num: task.num,
        report: task.qqs,
        sign: util.sign(task)
    }).then(({data}) => {

      Toast.info(data.msg);
      if (data.status) {
        setTimeout(() => {
          this.props.router.push('/result');
        }, 2000);
      }
    }).catch(err => {
      Toast.offline('网络连接失败！');
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
      <SubPage title="QQ名片赞">
        <div style={{padding: '10px'}}>
          <Flex>
            <Flex.Item style={{flex: 1}}>
              <img src={'http://q1.qlogo.cn/g?b=qq&nk='+(this.state.inputRef || '10000')+'&s=100'}  style={{ width: '100%'}}/>
            </Flex.Item>
            <Flex.Item style={{flex: 4}}>
                  <InputItem
                    clear
                    placeholder="输入您的QQ号"
                    value={this.state.inputRef}
                    onChange={
                      val => {
                        this.setState({ inputRef: val});
                      }
                    }></InputItem>
            </Flex.Item>
          </Flex>
          <div>
            <p style={{color: '#aaa'}}>选择一个代刷数量</p>
            <Flex style={{ padding: '10px 0'}}>
              {
                types.map(type => {
                  return (
                    <Flex.Item>
                      <Tag selected={this.state.type.num === type.num} style={{height: '40px', lineHeight: '40px'}} onChange={
                        e => {
                          this.setState({ type: type });
                          console.log(this.state.type);
                        }
                      }>{type.title}</Tag>
                    </Flex.Item>
                  );
                })
              }
            </Flex>
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
              <li style={{color: '#656565', marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              刷赞过程中，可以按音量下键中止;因为是互刷，需要你先为别人刷，别人才会为你刷哦，所以可能无法立即到账~
              </li>
              <li style={{color: '#656565', marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              一个QQ号每天最多可以给别人点赞5000，可以切换登录的QQ(非QQ空间)无上限点赞~
              </li>
              <li style={{color: '#656565', marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              如果刷太多导致账号被冻结，只需要改密码即可解冻~大家尽量用自己的活跃的大号来刷~
              </li>
              <li style={{color: '#656565', marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              首页拇指赞官方代刷下单，无需为别人刷，秒到账，价格便宜，服务有保障~
              </li>
            </Item>
          </List>
        </div>
      </SubPage>
    );
  }
  componentWillUnmount() {
    Toast.hide();
  }
}

export default withRouter(QQ_ZAN);