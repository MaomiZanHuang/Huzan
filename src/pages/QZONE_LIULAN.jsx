import React from 'react';
import {List, Toast, Button, Tag, Flex, InputItem} from 'antd-mobile';
import { SubPage } from '../components/SubPage';
import $ from 'axios';
import {withRouter} from 'react-router';
import util from '../util/index';

var data, qzonetoken, g_tk, qq, cookie;
var HOST = 'http://120.78.74.34';
const ls = util.ls;
class QZONE_LIULAN extends React.Component {
  constructor(props) {
    super(props);
    data = JSON.parse(localStorage['login'] || '{}');
    qzonetoken = data.qzonetoken;
    g_tk = data.g_tk;
    qq = data.qq;
    cookie = data.cookie;

    this.state = {
      inputRef: qq || '10001'
    };
  }
  qzoneLiulan() {
    var task = {
      qq: this.state.inputRef.trim(),
      type: 'QZONE_LIULAN'
    };

    if (!util.checkQQ(task.qq)) {
      Toast.info("qq号格式不正确！");
      return false;
    }

    var remainTasks = ls.QZONE_LIULAN.getTask();
    if (remainTasks.length) {
      Toast.info('您上次还有未完成的任务！');
      this.startTasks(remainTasks);
      return false;
    }


    var _this = this;
    Toast.loading("正在获取任务中，请稍后！", 0);
    $.get(`${HOST}/mzz/index.php?m=Home&c=Huzan&a=getOTask&qq=${task.qq}&type=${task.type}`)
      .then(({data}) => {
        var qqs = data.data;
        if (!qqs.length) {
          Toast.offline('暂时没有更多的任务，请稍后再来！');
          return false;
        }
        if (data.message.indexOf("登录") > -1) {
          Toast.info("检测到您未登录，请重启APP后重试！");
          return false;
        }

        Toast.info("获取到" + qqs.length + "条数据!");
        _this.setState({qqs: qqs});
        ls.QZONE_LIULAN.addTask(qqs);
        this.startTasks(qqs);
      })
      .catch(err => {
        Toast.offline('网络连接失败！');
      });
    }
    startTasks(tasks, idx=0) {
      if (idx >= tasks.length) {
        Toast.info("已完成所有任务！");
        this.putTask.call(this, {
          type: 'QZONE_LIULAN',
          qqs: tasks,
          qq: this.state.inputRef
        });
        return false;
      }
      var _qq = tasks[idx];
      var d = +new Date();
      Toast.loading("正在刷取第"+idx+"/"+tasks.length+"个任务");
      $.get(`https://h5.qzone.qq.com/mqzone/profile?starttime=${d}&hostuin=${_qq}`)
      .then(({data}) => {
        // 重点检测繁忙的数据，繁忙的数据不踢除
        this.startTasks(tasks, idx+1);
        ls.QZONE_LIULAN.removeTask(tasks[idx]);
      })
      .catch(e => {
        Toast.offline("网络连接失败！跳过任务！");
        this.startTasks(tasks, idx+1);
      });
  }
  putTask(task) {
    Toast.loading("正在同步数据中...", 0);
    $.post(`${HOST}/mzz/index.php?m=Home&c=Huzan&a=putTask`, {
        type: task.type,
        qq: task.qq,
        num: task.num,
        report: task.qqs,
        sign: util.sign(task.qq, task.num, task.type)
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
      <SubPage title="空间互访">
        <div style={{padding: '10px'}}>
          <Flex>
            <Flex.Item style={{flex: 1}}>
              <img src={'http://q1.qlogo.cn/g?b=qq&nk='+(this.state.inputRef || '10000')+'&s=100'}  style={{ width: '100%'}}/>
            </Flex.Item>
            <Flex.Item style={{flex: 4}}>
                  <InputItem
                    clear
                    placeholder="输入要访问的的QQ空间"
                    value={this.state.inputRef}
                    onChange={
                      val => {
                        this.setState({ inputRef: val});
                      }
                    }></InputItem>
            </Flex.Item>
          </Flex>
          <div>
            
          </div>
          <div>
            <Button style={{backgroundColor: 'rgb(72, 187, 243)', color: '#fff'}} onClick={this.qzoneLiulan.bind(this)}>访问</Button>
          </div>
        </div>
        {/* 提示说明文字 */}
        <div>
        <List>
            <Item>
              <Brief>提示说明</Brief>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>空间必须开放才能刷哦~</li>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>使用的人越多，可以互刷的越多哦，建议分享给更多人使用，人人为我，我为人人~</li>
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


export default withRouter(QZONE_LIULAN);