import React from 'react';
import {List, Button, TextareaItem, Flex, InputItem, Toast} from 'antd-mobile';
import { SubPage } from '../components/SubPage';
import $ from 'axios';
import util from '@/util/index.js';

var data, qzonetoken, g_tk, qq, cookie;
const ls = util.ls;
var HOST = 'http://120.78.74.34';

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
      inputRef: qq || '',
      comment: '%随机内容%'
    };
  }
  qzoneComment() {
    var remainTasks = ls.QZONE_COMMENT.getTask();
    if (remainTasks.length) {
      Toast.info('您上次还有未完成的任务！');
      this.startTasks(remainTasks);
      return false;
    }

    var task = {
      qq: this.state.inputRef.trim(),
      type: 'QZONE_COMMENT',
      content: this.state.comment
    };

    if (!util.checkQQ(task.qq) || task.content.trim() == '') {
      Toast.info("qq或留言内容不正确~");
      return false;
    }

    var _this = this;
    Toast.loading("正在获取任务中，请稍后！", 0);
    util.Log("Request", `GET ${HOST}/mzz/index.php?m=Home&c=Huzan&a=getUTask&qq=${task.qq}&type=${task.type}`);

    $.get(`${HOST}/mzz/index.php?m=Home&c=Huzan&a=getUTask&qq=${task.qq}&type=${task.type}`)
      .then(({data}) => {
        util.Log("Response", data);
        var qqs = data.data;
        if (!qqs.length) {
          Toast.offline('暂时没有更多的任务，请稍后再来！');
          return false;
        }
        Toast.info("获取到" + qqs.length + "条数据!");
        ls.QZONE_COMMENT.addTask(qqs);
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
        type: 'QZONE_COMMENT',
        qqs: tasks.map(e => e.qq),
        qq: this.state.inputRef,
        content: this.state.comment
      });
      return false;
    }
    var task = tasks[idx];
    var d = +new Date();
    Toast.loading("正在刷取第"+(idx+1)+"/"+tasks.length+"个任务");
    
    util.Log("Request", `POST https://mobile.qzone.qq.com/msgb/fcg_add_msg?qzonetoken=${qzonetoken}&g_tk=${g_tk}`);
    $.post(`https://mobile.qzone.qq.com/msgb/fcg_add_msg?qzonetoken=${qzonetoken}&g_tk=${g_tk}`,{
      res_uin: task.qq,
      format: 'json',
      content: util.renderTpl(task.content || '%随机内容%'),
      opr_type: 'add_comment'
    })
    .then(({data}) => {
      util.Log("Respsone", data);
      // 重点检测繁忙的数据，繁忙的数据不踢除
      if (data.message.indexOf("登录") > -1) {
        Toast.info("检测到您未登录，请重启APP后重试！");
        return false;
      }
      if (data.message.indexOf("频繁") > -1) {
        Toast.loading("评论频繁，10s后重试...", 0);
        setTimeout(() => {
          this.startTasks(tasks, idx);
        }, 10000);
      } else {
        setTimeout(() => {
          this.startTasks(tasks, idx+1);
        }, 3000);
        ls.QZONE_COMMENT.removeTask(tasks[idx].qq);
      }
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
      content: task.content,
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
    console.log(err);
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
      <SubPage title="空间留言">
        <div style={{padding: '10px'}}>
          <Flex>
            <Flex.Item style={{flex: 1}}>
              <img src={'http://q1.qlogo.cn/g?b=qq&nk='+(this.state.inputRef || '10000')+'&s=100'}  style={{ width: '100%'}}/>
            </Flex.Item>
            <Flex.Item style={{flex: 4}}>
                  <InputItem
                    clear
                    placeholder="输入要刷的QQ空间"
                    value={this.state.inputRef}
                    onChange={
                      val => {
                        this.setState({ inputRef: val});
                      }
                    }></InputItem>
            </Flex.Item>
          </Flex>
          <div>
          <Brief>留言内容</Brief>
          <TextareaItem
            value={this.state.comment}
            rows={5}
            count={100}
            onChange={
              val => {
                this.setState({ comment: val});
              }
            }
          />
          </div>
          <div>
            <Button style={{backgroundColor: 'rgb(72, 187, 243)', color: '#fff'}} onClick={this.qzoneComment.bind(this)}>开刷</Button>
          </div>
        </div>
        {/* 提示说明文字 */}
        <div>
          <List>
            <Item>
              <Brief>温馨提示</Brief>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>空间必须开放才能刷哦~使用的人越多，可以互刷的越多哦，建议分享给更多人使用，人人为我，我为人人~</li>
              <li style={{marginBottom: '12px', overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '12px'}}>
              固定留言里可以使用替代标签，比如
              <br/>%随机内容%   随机内容
              <br/>%当前时间%       当前时间 
              <br/>%随机数字%       随机数字 
              <br/>%随机昵称%       随机昵称
              <br/>示例: %随机昵称%在%当前时间%来冒个泡%随机数字%,祝你生日快乐！
              <br/>说好de悻福在2018/09/22 12:02:03来冒个泡3，祝你生日快乐！
              </li>
            </Item>
          </List>
        </div>
    </SubPage>
    );
  }
}