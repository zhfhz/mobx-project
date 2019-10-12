import React, { Component, Suspense, lazy } from 'react';
import { Layout, Menu, Icon, Form, Input, Button, Upload, message, Dropdown, Modal } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import _ from 'lodash';
import { reaction } from 'mobx';
import { menus, routes, unsignedRoutes, chatRoute } from '../routes';
import './app.scss';
import logo_dark from '../../assets/img/logo_dark.png';
import logo_white from '../../assets/img/logo_white.png';
import defaultHead from '../../assets/img/image.png';
import * as Md5 from 'md5';
import { openMsgWindow, setNormalPage } from '../../services/winref';
import service from '../../assets/img/客服.png';

const { Header, Content, Sider } = Layout;
const { SubMenu, Item: MenuItem } = Menu;

// function _onDrag(update) {
//   return function (e) {
//     const { clientX, clientY } = e
//     if (!clientX && !clientY) return
//     update(clientY)
//   }
// }

// function FloatMenu() {
//   const [offsetTop, updateOffsetTop] = useState('28%')
//   return (
//     <div
//       style={{ top: offsetTop }}
//       className={'app-float close'}
//       onDrag={_onDrag(updateOffsetTop)}
//       onDragEnd={_onDrag(updateOffsetTop)}
//       draggable
//       ref={ref => float = ref}
//     >
//       <>
//         <img
//           className='main-icon'
//           src={fm0}
//           alt='客服'
//           onClick={() => openMsgWindow('/chat/0001','都市智造官方客服')}
//         />
//       </>
//     </div>
//   )
// }

const indexHome = '/sign/login';
const frameHome = '/homePage';

/**
 *
 */
function Loading () {
  return <div>Loading</div>;
}

/**
 *
 * @param {*} param0
 */
function PrivateRoute ({ component: Component, shouldRoute, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        shouldRoute ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: indexHome,
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

// @inject(stores => _.pick(stores, ['app', 'route']))
// @observer
// class UserOptions extends React.Component {
//   setHeadImage = () => {
//     const s = this.props.app;
//     s.showHead = true;
//     s.showPassword = false;
//   };
//   changePassword = () => {
//     const s = this.props.app;
//     s.showHead = false;
//     s.showPassword = true;
//   };
//   loginOut = () => {
//     sessionStorage.clear();
//     window.location.href = './sign/login';
//   };
//   handleSubmit = () => {
//     const { oldPassword, newPassword, postNewPassword, UserId } = this.props.app;
//     const data = {
//       UserID: UserId,
//       NewPassword: Md5(`${newPassword}:emake`).toUpperCase(),
//       OldPassword: Md5(`${oldPassword}:emake`).toUpperCase()
//     };
//     postNewPassword(data);
//   };
//   deleteAvatar = () => {
//     const { deleteImg } = this.props.app;
//     deleteImg();
//   };

//   beforeUpload = file => {
//     const isLt2M = file.size / 1024 / 1024 < 5;
//     if (!isLt2M) {
//       message.error('图片大小必须在5M以内');
//     }
//     return isLt2M;
//   };
//   handleChange = async () => {
//     const { onChange } = this.props.app;
//     onChange();
//   };
//   customRequest = ({ file }) => {
//     const { aliOSS } = this.props.app;
//     aliOSS(file);
//   };
//   changeHeadImage = () => {
//     const { postHeadImg } = this.props.app;
//     postHeadImg();
//   };

//   render () {
//     const {
//       loading,
//       showHead,
//       showPassword,
//       closeModal,
//       oldPasswordError,
//       newPasswordError,
//       confirmPasswordError,
//       oldpassChange,
//       newpassChange,
//       confirmpassChange,
//       ImageUrl,
//       postHeadImg
//     } = this.props.app;
//     const deleteButton = (
//       <div className="delete-container" onClick={this.deleteAvatar}>
//         <Icon className="delete-icon" type="close-circle" />
//       </div>
//     );
//     return (
//       <>
//         <ul className="user_setting_container">
//           <li onClick={this.setHeadImage}>
//             <Icon type="user" />
//             &nbsp;&nbsp; 设置头像
//           </li>
//           <li onClick={this.changePassword}>
//             <Icon type="lock" />
//             &nbsp;&nbsp; 修改密码
//           </li>
//           <li onClick={this.loginOut}>
//             <Icon type="poweroff" />
//             &nbsp;&nbsp; 退出登录
//           </li>
//         </ul>
//         <Modal title={showHead ? '设置头像' : '修改密码'} visible={showHead || showPassword} onCancel={closeModal} footer={null}>
//           {showHead ? (
//             <div className="set-head">
//               <Upload
//                 action={'//git.emake.cn:4000/image'}
//                 name="avatar"
//                 accept="image/*"
//                 showUploadList={false}
//                 beforeUpload={this.beforeUpload}
//                 onChange={this.handleChange}
//                 loading={loading}
//                 customRequest={this.customRequest}
//               >
//                 <Button>
//                   <Icon type="upload" /> 上传图片
//                 </Button>
//               </Upload>
//               <div className="img_container">
//                 {ImageUrl ? deleteButton : null}
//                 {ImageUrl ? <img src={ImageUrl} /> : null}
//               </div>
//               <div className="btnGroup" style={{ marginTop: 20 }}>
//                 <Button type="default" onClick={closeModal}>
//                   取消
//                 </Button>
//                 <Button type="primary" onClick={postHeadImg}>
//                   确定
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="change_password">
//               <Form className="change-form">
//                 <Form.Item style={{ width: 380 }} help={oldPasswordError} validateStatus={oldPasswordError ? 'error' : undefined}>
//                   <Input prefix={<label>旧密码</label>} onChange={oldpassChange} type="password" placeholder="请输入原始登录密码" />
//                 </Form.Item>
//                 <Form.Item style={{ width: 380 }} help={newPasswordError} validateStatus={newPasswordError ? 'error' : undefined}>
//                   <Input prefix={<label>新密码</label>} type="password" onChange={newpassChange} placeholder="请输入6-18位新密码" />
//                 </Form.Item>
//                 <Form.Item style={{ width: 380 }} help={confirmPasswordError} validateStatus={confirmPasswordError ? 'error' : undefined}>
//                   <Input prefix={<label>确认密码</label>} type="password" onChange={confirmpassChange} placeholder="请再次输入新密码" />
//                 </Form.Item>
//               </Form>
//               <div className="btnGroup">
//                 <Button type="default" onClick={closeModal}>
//                   取消
//                 </Button>
//                 <Button type="primary" onClick={this.handleSubmit}>
//                   确定
//                 </Button>
//               </div>
//             </div>
//           )}
//         </Modal>
//       </>
//     );
//   }
// }

@inject(stores => _.pick(stores, ['app', 'route']))
@observer
class App extends Component {
  componentDidMount () {
    const { syncMenuWithRouter } = this.props.app;
    syncMenuWithRouter();
    reaction(() => this.props.route.location, syncMenuWithRouter);
    setNormalPage();
  }

  _onMainMenuClick = menuGroup => () => {
    const subMenu = menuGroup.subMenus[0];
    if (subMenu) {
      const menuItem = subMenu.children[0];
      if (menuItem) {
        this.props.route.push(['', menuGroup.path, subMenu.path, menuItem.path].join('/'));
      }
    }
  };

  _onMenuItemClick = ({ item, key }) => {
    this.props.app.updateSelectedKeys([key]);
    this.props.route.push(item.props.path);
  };

  _onSubMenuClick = openKeys => {
    this.props.app.updateOpenKeys(openKeys);
  };

  _renderContent () {
    const { authorized } = this.props.app;
    const path = window.location.pathname;
    return (
      <div style={{ padding: path === '/homePage' ? '0 2px' : '0 20px', height: '100%' }}>
        <Suspense fallback={<Loading />}>
          <Switch>
            {routes.map(it => (
              <PrivateRoute key={it.path} exact={it.exact} path={it.path} component={lazy(it.page)} shouldRoute={authorized} />
            ))}
            <Redirect from="*" to={frameHome} />
          </Switch>
        </Suspense>
      </div>
    );
  }

  _renderContentHeader () {
    const { siderCollapsed, foldSider, unfoldSider } = this.props.app;
    return (
      <div>
        <Icon style={{ color: 'white' }} onClick={siderCollapsed ? unfoldSider : foldSider} type={siderCollapsed ? 'menu-unfold' : 'menu-fold'} />
      </div>
    );
  }

  _renderContentSider () {
    const { siderCollapsed, openKeys, selectedKeys } = this.props.app;

    return (
      <Menu mode="inline" inlineCollapsed={siderCollapsed} onClick={this._onMenuItemClick} onOpenChange={this._onSubMenuClick} selectedKeys={selectedKeys} openKeys={openKeys}>
        {menus.map(sub =>
          sub.children ? (
            <SubMenu
              key={sub.key}
              title={
                <span>
                  <img src={sub.icon} style={{ width: 18, marginRight: 10 }} />
                  <span>{sub.title}</span>
                </span>
              }
            >
              {sub.children.map(item => (
                <MenuItem key={item.key} path={['', sub.path, item.path].join('/')}>
                  {item.title}
                </MenuItem>
              ))}
            </SubMenu>
          ) : (
            <MenuItem key={sub.key} path={['', sub.path].join('/')}>
              <span>
                <img src={sub.icon} style={{ width: 18, marginRight: 10 }} />
                <span>{sub.title}</span>
              </span>
            </MenuItem>
          )
        )}
        <MenuItem key={'chatService'} onClick={() => openMsgWindow('/chat/0001', '都市智造官方客服', '')}>
          <span>
            <img src={service} style={{ width: 18, marginRight: 10 }} />
            <span>{'客服平台'}</span>
          </span>
        </MenuItem>
      </Menu>
    );
  }

  setHeadImage = () => {
    const s = this.props.app;
    s.showHead = true;
    s.showPassword = false;
  };
  changePassword = () => {
    const s = this.props.app;
    s.showHead = false;
    s.showPassword = true;
  };
  loginOut = () => {
    sessionStorage.clear();
    window.location.href = './sign/login';
  };
  handleSubmit = () => {
    const { oldPassword, newPassword, postNewPassword, UserId } = this.props.app;
    const data = {
      UserID: UserId,
      NewPassword: Md5(`${newPassword}:emake`).toUpperCase(),
      OldPassword: Md5(`${oldPassword}:emake`).toUpperCase()
    };
    postNewPassword(data);
  };
  deleteAvatar = () => {
    const { deleteImg } = this.props.app;
    deleteImg();
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('图片大小必须在5M以内');
    }
    return isLt2M;
  };
  handleChange = async () => {
    const { onChange } = this.props.app;
    onChange();
  };
  customRequest = ({ file }) => {
    const { aliOSS } = this.props.app;
    aliOSS(file);
  };
  changeHeadImage = () => {
    const { postHeadImg } = this.props.app;
    postHeadImg();
  };

  _renderFramePage () {
    const {
      siderCollapsed,
      hideOptions,
      loading,
      showHead,
      showPassword,
      closeModal,
      oldPasswordError,
      newPasswordError,
      confirmPasswordError,
      oldpassChange,
      newpassChange,
      confirmpassChange,
      ImageUrl,
      postHeadImg
    } = this.props.app;
    const deleteButton = (
      <div className="delete-container" onClick={this.deleteAvatar}>
        <Icon className="delete-icon" type="close-circle" />
      </div>
    );
    return (
      <>
        <Layout onClick={hideOptions}>
          <div style={{ overflowY: 'scroll', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '250px', height: '72px', lineHeight: '72px', backgroundColor: 'rgba(0, 0, 0, 0.87)', color: '#fff', textAlign: 'center', paddingBottom: '16px' }}>
              <img src={logo_dark} style={{ width: 60, marginRight: 15, marginBottom: 15 }} />
              都市智造-超级线上工厂
            </div>
            <Sider
              theme="light"
              collapsible
              collapsed={siderCollapsed}
              style={{
                backgroundColor: '#151516',
                flex: 1,
                flexGrow: 1
              }}
            >
              {this._renderContentSider()}
            </Sider>
          </div>
          <Content style={{ flex: '1' }}>
            <Header
              style={{
                backgroundColor: '#fff',
                textAlign: 'right',
                boxShadow: '0px 2px 20px 0px rgba(0,0,0,0.2)',
                marginBottom: '12px'
              }}
            >
              {/* <Popover placement="bottomRight" title="个人中心" content={<UserOptions />} trigger="click" visible={visibleOptions}>
                <span style={{cursor: 'pointer'}} onClick={showOptions}><img style={{width: 50,}} src={this.props.app.HeadImage ? this.props.app.HeadImage: defaultHead} /></span>
              </Popover> */}
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={this.setHeadImage}>
                      <Icon type="user" />
                      &nbsp;&nbsp;设置头像
                    </Menu.Item>
                    <Menu.Item onClick={this.changePassword}>
                      <Icon type="lock" />
                      &nbsp;&nbsp;修改密码
                    </Menu.Item>
                    <Menu.Item onClick={this.loginOut}>
                      <Icon type="poweroff" />
                      &nbsp;&nbsp;退出登录
                    </Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
              >
                <span style={{ cursor: 'pointer' }}>
                  <img style={{ width: 50 }} src={this.props.app.HeadImage ? this.props.app.HeadImage : defaultHead} />
                </span>
              </Dropdown>
              <Modal title={showHead ? '设置头像' : '修改密码'} visible={showHead || showPassword} onCancel={closeModal} footer={null}>
                {showHead ? (
                  <div className="set-head">
                    <Upload
                      action={'//git.emake.cn:4000/image'}
                      name="avatar"
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                      loading={loading}
                      customRequest={this.customRequest}
                    >
                      <Button>
                        <Icon type="upload" /> 上传图片
                      </Button>
                    </Upload>
                    <div className="img_container">
                      {ImageUrl ? deleteButton : null}
                      {ImageUrl ? <img src={ImageUrl} /> : null}
                    </div>
                    <div className="btnGroup" style={{ marginTop: 20 }}>
                      <Button type="default" onClick={closeModal}>
                        取消
                      </Button>
                      <Button type="primary" onClick={postHeadImg}>
                        确定
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="change_password">
                    <Form className="change-form">
                      <Form.Item style={{ width: 380 }} help={oldPasswordError} validateStatus={oldPasswordError ? 'error' : undefined}>
                        <Input prefix={<label>旧密码</label>} onChange={oldpassChange} type="password" placeholder="请输入原始登录密码" />
                      </Form.Item>
                      <Form.Item style={{ width: 380 }} help={newPasswordError} validateStatus={newPasswordError ? 'error' : undefined}>
                        <Input prefix={<label>新密码</label>} type="password" onChange={newpassChange} placeholder="请输入6-18位新密码" />
                      </Form.Item>
                      <Form.Item style={{ width: 380 }} help={confirmPasswordError} validateStatus={confirmPasswordError ? 'error' : undefined}>
                        <Input prefix={<label>确认密码</label>} type="password" onChange={confirmpassChange} placeholder="请再次输入新密码" />
                      </Form.Item>
                    </Form>
                    <div className="btnGroup">
                      <Button type="default" onClick={closeModal}>
                        取消
                      </Button>
                      <Button type="primary" onClick={this.handleSubmit}>
                        确定
                      </Button>
                    </div>
                  </div>
                )}
              </Modal>
            </Header>
            {this._renderContent()}
          </Content>
        </Layout>
      </>
    );
  }

  _checkPath = path => {
    switch (path) {
    case '/sign/register':
      return '欢迎注册';
    case '/sign/reset':
      return '忘记密码';
    case '/sign/certificate':
      return '验厂申请';
    case '/sign/waitaudit':
      return '正在审核';
    case '/sign/auditfailed':
      return '审核失败';
    }
  };
  _renderFullPage () {
    const pathname = window.location.pathname;

    const msg = this._checkPath(pathname);
    return (
      <>
        {pathname.indexOf('login') !== -1 ? null : (
          <Header className="myHeader">
            <p>
              <img src={logo_white} style={{ width: 60 }} />
              <span style={{ color: '#4dbecd' }}>都市智造-超级线上工厂 | </span>
              <span>{msg}</span>
            </p>
            <p>
              已有账号,<Link to="/sign/login">&nbsp;&nbsp;请登录</Link>
            </p>
          </Header>
        )}
        <Content>
          <Suspense fallback={<Loading />}>
            <Switch>
              {unsignedRoutes.map(it => (
                <Route key={it.path} exact={it.exact} path={it.path} component={lazy(it.page)} />
              ))}
              <Redirect from="*" to={indexHome} />
            </Switch>
          </Suspense>
        </Content>
      </>
    );
  }

  _renderChat () {
    const { authorized } = this.props.app;
    const Chat = lazy(chatRoute.page);
    return (
      <Content style={{ height: '100%' }}>
        <Switch>
          <PrivateRoute
            path={chatRoute.path}
            component={props => (
              <Suspense fallback={<Loading />}>
                <Chat {...props} />
              </Suspense>
            )}
            shouldRoute={authorized}
            redirect={indexHome}
          />
          <Redirect from="*" to={frameHome} />
        </Switch>
      </Content>
    );
  }

  render () {
    const { authorized } = this.props.app;
    const {
      location: { pathname }
    } = this.props.route;
    return <Layout className="app">{authorized ? (pathname.startsWith('/chat') ? this._renderChat() : this._renderFramePage()) : this._renderFullPage()}</Layout>;
  }
}

export default withRouter(App);
