import React from 'react';
import {Result, Toast} from 'antd-mobile';
import { SubPage } from '../components/SubPage';


const myImg = src => <img src={src} className="spe am-icon am-icon-md" alt="" />;
export default class ResultPage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <SubPage title="提交任务">
        <div style={{padding: '10px'}}>
          <Result
            img={myImg('https://gw.alipayobjects.com/zos/rmsportal/HWuSTipkjJRfTWekgTUG.svg')}
            title="等待处理"
            message="您的互刷任务已提交，等待处理中"
          />
        </div>
      </SubPage>
    );
  }
}