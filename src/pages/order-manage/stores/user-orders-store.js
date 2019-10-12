import { observable, computed, action } from 'mobx'
import {http} from '../../../services/http'
import { message } from 'antd'

export class UserOrders {
  @observable demo = '用户订单'
  @observable keyword = ''
  @observable curStatLabel = '全部'
  @observable OrderState = '';
  @observable dataList = []
  // 分页配置
  @observable paging = {
    current: 1,
    total: 0,
    size: 10,
    hideOnSinglePage: true,
    onChange: (page) => {
      this.paging.current = page
      this.getUseOrder()
    }
  }
  @observable OrderNum0 = '';
  @observable OrderNum1 = '';
  @observable OrderNum2 = '';
  @observable OrderNum3 = '';

  @computed get dataDisplay () {
    return this.dataList.map((it, index) =>({ ...it, key: index}))
  }

  @action getUseOrder = async () => {
    // 用户订单列表
    const { Data, Ok, ResultInfo } = await http.get('/dfcommon/order', {
      UserType: '2',
      OrderState: this.OrderState,
      pageIndex: this.paging.current,
      pageSize: this.paging.size,
      SearchContent: this.keyword,
      OrderType: '0'
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    this.dataList = Data.ResultList
    this.paging.total = Data.ResultCount
    this.OrderNum0 = Data.OrderNum.OrderNum0
    this.OrderNum1 = Data.OrderNum.OrderNum1
    this.OrderNum2 = Data.OrderNum.OrderNum2
    this.OrderNum3 = Data.OrderNum.OrderNum3
  }

  @action dispose = () => {
    this.curStatLabel = '全部'
    this.OrderState = ''
    this.paging.current = 1
    this.keyword = ''
  }

  @action keywordChange = (val) => {
    this.keyword = val
    if (this.keyword.trim() === '') {
      this.paging.current = 1
      this.getUseOrder()
    }
  }

  @action search = () => {
    this.getUseOrder()
  }
  @action changeStat = (label) => () => {
    this.curStatLabel = label
    this.paging.current = 1
    if (label === '全部') {
      this.OrderState = ''
    } else if (label === '待付款') {
      this.OrderState = '0'
    } else if (label === '待发货') {
      this.OrderState = '1'
    } else if (label === '待收货') {
      this.OrderState = '2'
    } else if (label === '已完成') {
      this.OrderState = '3'
    }
    this.getUseOrder()
  }

}

export default new UserOrders()
