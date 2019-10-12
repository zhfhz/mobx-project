import { action, observable, computed } from 'mobx';
import { routerStore } from '../../../router-store';
import { menus } from '../../routes';
import { http } from '../../../services/http';
import { message } from 'antd';
import * as uuidv1 from 'uuid/v1';
import * as OSS from 'ali-oss';

/**
 *
 * @param {*} user
 */
function _storeUser (user) {
  if (user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('user');
  }
}

/**
 *
 */
function _fetchUser () {
  try {
    return JSON.parse(sessionStorage.getItem('user'));
  } catch (e) {
    return undefined;
  }
}

/**
 *
 */
function _findExactMenu () {
  const {
    history: { location }
  } = routerStore;
  const [, sub, item] = location.pathname.split('/');
  const subMenu = menus.find(it => it.path === sub);
  if (!subMenu) return;
  if (!subMenu.children || !subMenu.children.length)
    return {
      openKeys: [],
      selectedKeys: [subMenu.key]
    };
  const menuItem = subMenu.children.find(it => it.path === item);
  if (!menuItem) return;
  return {
    openKeys: [subMenu.key],
    selectedKeys: [menuItem.key]
  };
}

export class AppStore {
  @observable user = _fetchUser();
  @observable siderCollapsed = false;
  @observable openKeys = [];
  @observable selectedKeys = [];
  @observable showHead = false;
  @observable showPassword = false;
  @observable HeadImage = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).HeadImageUrl : '';
  @observable loading = false;
  @observable ImageUrl = '';
  @observable oldPassword = '';
  @observable newPassword = '';
  @observable confirmPassword = '';
  @observable oldPasswordError = '';
  @observable newPasswordError = '';
  @observable confirmPasswordError = '';
  @observable UserId = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).UserID : '';
  @observable visibleOptions = false;

  @computed get authorized () {
    return !!this.user;
  }

  @action foldSider = () => {
    this.siderCollapsed = true;
    this.openKeys = [];
  };
  @action unfoldSider = () => (this.siderCollapsed = false);

  @action updateOpenKeys = keys => (this.openKeys = keys);
  @action updateSelectedKeys = keys => (this.selectedKeys = keys);

  @action login = user => {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    this.UserId = user ? user.UserID : '';
    this.HeadImage = this.user ? this.user.HeadImageUrl : '';
    _storeUser(user);
  };
  @action updateToken = (access_token, refresh_token) => {
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('refresh_token', refresh_token);
  };
  @action updateMainCategoryID = CategoryId => {
    sessionStorage.setItem('MainCategoryID', CategoryId);
  };

  get accessToken () {
    return sessionStorage.getItem('access_token');
  }

  get refreshToken () {
    return sessionStorage.getItem('refresh_token');
  }
  get MainCategoryID () {
    return sessionStorage.getItem('MainCategoryID');
  }
  get CompanyID () {
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    return user && user.CompanyID;
  }
  get UserId () {
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    return user && user.UserId;
  }
  get CompanyName () {
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    return user && user.CompanyName;
  }

  @action syncMenuWithRouter = () => {
    const exactMenu = _findExactMenu();
    if (!exactMenu) return;
    this.updateOpenKeys(exactMenu.openKeys);
    this.updateSelectedKeys(exactMenu.selectedKeys);
  };

  @action showOptions = e => {
    e.stopPropagation();
    e.preventDefault();
    this.visibleOptions = true;
  };

  @action hideOptions = () => {
    this.visibleOptions = false;
  };

  @action logout = () => {
    sessionStorage.clear();
    window.location.href = '/sign/login';
  };
  @action catchException = () => {
    window.location.href = '/exception';
  };
  @action closeModal = () => {
    this.showHead = false;
    this.showPassword = false;
    this.ImageUrl = '';
    this.oldPasswordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
  };
  @action oldpassChange = e => {
    this.oldPassword = e.target.value.trim();
  };
  @action newpassChange = e => {
    this.newPassword = e.target.value.trim();
  };
  @action confirmpassChange = e => {
    this.confirmPassword = e.target.value.trim();
  };
  @action checkOldPass = () => {
    if (!this.oldPassword || !/^[a-zA-Z0-9]{6,18}$/.test(this.oldPassword)) {
      this.oldPasswordError = '原始密码输入错误';
    } else {
      this.oldPasswordError = '';
    }
  };
  @action checkNewPass = () => {
    if (!this.newPassword || !/^[a-zA-Z0-9]{6,18}$/.test(this.newPassword)) {
      this.newPasswordError = '新密码输入错误';
    } else {
      this.newPasswordError = '';
    }
  };
  @action checkConfirmPass = () => {
    if (!this.confirmPassword || !/^[a-zA-Z0-9]{6,18}$/.test(this.confirmPassword)) {
      this.confirmPasswordError = '确认密码输入错误';
    } else {
      if (this.newPassword !== this.confirmPassword) {
        this.confirmPasswordError = '2次输入的密码不一致';
      } else {
        this.confirmPasswordError = '';
      }
    }
  };
  @action deleteImg = () => {
    this.ImageUrl = '';
  };
  @action onChange = () => {
    this.loading = true;
  };
  @action aliOSS = async file => {
    const bucket = 'img-emake-cn';
    const region = 'oss-cn-shanghai';
    const accessKeyId = 'LTAIjK54yB5rocuv';
    const accessKeySecret = 'T0odXNBRpw2tvTffxcNDdfcHlT9lzD';

    const client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket
    });
    let fileName = '';
    let fileTypeName = '';
    if (file) {
      const bool = file.size / 1024 / 1024 < 2;
      fileName = file.name;
      const arr = fileName.split('.');
      fileTypeName = arr[1];
      if (!bool) {
        message.error('请上传小于2M的图片!');
        return;
      }
    }

    const result = await client.put(uuidv1() + '.' + fileTypeName, file);
    if (result.res.status === 200 && result.res.statusCode === 200) {
      this.ImageUrl = result.url;
      this.CompanyLicenseImgError = '';
      message.success('上传成功！');
    } else {
      message.error('上传失败');
    }
  };
  @action postHeadImg = async e => {
    e.preventDefault();
    if (this.ImageUrl === '') {
      message.error('请先上传图片');
      return;
    }
    const { Ok, ResultInfo } = await http.put('/factory/set/headimage', {
      HeadImageUrl: this.ImageUrl
    });
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    message.success('设置头像成功！');
    this.showHead = false;
    this.HeadImage = this.ImageUrl;
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};
    user.HeadImageUrl = this.HeadImage;
    sessionStorage.setItem('user', JSON.stringify(user));
    this.ImageUrl = '';
  };
  @action postNewPassword = async obj => {
    this.checkOldPass();
    this.checkNewPass();
    this.checkConfirmPass();
    if (this.oldPasswordError || this.newPasswordError || this.confirmPasswordError) {
      return;
    }
    const { Ok, ResultInfo } = await http.put('/factory/mod/password', obj);
    if (!Ok) {
      message.error(ResultInfo);
      return;
    }
    message.success('修改密码成功！');
    this.showPassword = false;
  };
}

export default new AppStore();
