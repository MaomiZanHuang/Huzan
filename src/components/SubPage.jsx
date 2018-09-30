import React from 'react';
import {Icon, NavBar} from 'antd-mobile';

export const SubPage = props => {
  const title = props.title || '??';
  const hideBack = props.hideBack || false;
  const forceBackTo = props.forceBackTo;
  const contentHeight = ((document.documentElement.clientHeight || document.body.clientHeight)  - 45) + 'px';

  return (
  <div class="frame-container">
    <NavBar className="header" mode="light"
      style={{background: 'rgb(72, 187, 243)', width: '100%', zIndex: '998' }}
      onLeftClick={() => {
        if (forceBackTo) {
          this.props.router.push(forceBackTo);
        } else {
          history.back();
        }
      }}
      leftContent={
        hideBack
          ? ''
          : (<Icon type="left" style={{color: '#fff'}} onClick={() => {}}></Icon>)
      }
    >
      <span style={{color: '#fff', fontSize: '14px'}}>{title}</span>
    </NavBar>
    <section style={{height: contentHeight, overflow: 'auto' }}>
      {props.children}
    </section>
  </div>
  );
}
