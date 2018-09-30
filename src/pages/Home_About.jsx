import React from 'react';
import { List, Carousel } from 'antd-mobile';

export default class About extends React.Component {
  render() {
    const {Item} = List;
    const {Brief} = Item;
    const styles = {
      brand: {
        padding: '15px'
      },
      logo: {
        display: 'flex',
        justifyContent: 'center',
        padding: '15px'
      }
    }
    return (
    <div style={{height: '100%'}}>
        <Carousel className="my-carousel"
            dots={true}
            dragging={false}
            swiping={false}
            autoplay
            infinite
            autoplayInterval={1000}
            resetAutoplay={false}
        >
          {[
            'http://ugc.qpic.cn/gbar_pic/2wF3sr2LiaVtbNbyPvU0dibZMCupZT7yWF5ILxibBNTDrzWxtpI5qr3dg/',
            'http://ugc.qpic.cn/gbar_pic/2wF3sr2LiaVtbNbyPvU0dibQ47hialzfrw124ZwZwzZnFZqcNCP2QhkibA/',
            'http://ugc.qpic.cn/gbar_pic/2wF3sr2LiaVtQE337kOWdsAKFuc2y57haIiborP8yNQ2ypXric7RS0rOg/0'
        ].map(type => (
            <div className="v-item" key={type}>
              <img style={{width: '100%'}} src={type} />
            </div>
          ))}
        </Carousel>
        
        <div className="about-content">
          <List>
            <Item>
              <Brief>关于</Brief>
              <p style={{overflow: 'auto', wordSpacing: 'normal', whiteSpace: 'normal', 
     wordBreak: 'break-all', fontSize: '14px'}}>拇指互刷是拇指赞官方(https://520cy.cn)旗下一款互刷产品。</p>
            </Item>
            <Item>
            <Brief>联系我们</Brief>
              
            <p style={{fontSize: '14px'}}>官方Q群: 863391242</p>

            </Item>
          </List>
        </div>
       
        <div className="fixed-bottom" style={{ background: '#f5f5f9', color: '#aaa', fontSize: '10px', textAlign: 'center', paddingBottom: '20px'}}>
          ©拇指赞出品 Copyright 2018<br/>
          All Rights Reserved.
        </div>
    </div>);
  }
}
