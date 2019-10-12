import { observable, computed, action, toJS } from 'mobx'
import { http } from '../../../services/http'
import { message } from 'antd'

export class ProductOrders {
  @observable visible = false
  @observable visible1 = false
  // @observable visible2 = false
  @observable visible3 = false
  @observable visible4 = false
  @observable YGoodsSeriesCode = ''
  @observable YunNum = ''
  @observable keyword = ''
  @observable curStatLabel = '全部'
  @observable value = undefined
  @observable data = {
    RowID: '',
    OrderNo: '',
    BillNo: '',
    ExpName: '',
    DeliveryDate: '',
    Remark: '',
  }
  @observable Address = {}
  @observable UserName = ''
  @observable MobileNumber = ''
  @observable Addressdetail = ''
  @observable GoodsNumber = ''
  @observable GoodsSeriesUnit = ''
  @observable UserNameShip = ''
  @observable MobileNumberShip = ''
  @observable AddressShip = ''
  @observable TotalProductNumberShip = ''
  @observable BillNoShip = ''
  @observable ExpNameShip = ''
  @observable DeliveryDateShip = ''
  @observable OrderState = ''
  @observable GoodsSeriesUnit = ''
  @observable dataList = []
  // @observable OrderNum1 = false
  // @observable OrderNum2 = false
  // @observable OrderNum3 = false
  @observable OrderNum1 = ''
  @observable OrderNum2 = ''
  @observable OrderNum3 = ''
  // 分页配置
  @observable paging = {
    current: 1,
    total: 0,
    size: 10,
    hideOnSinglePage: true,
    onChange: (page) => {
      this.paging.current = page
      this.getProductOrder()
    }
  }
  @observable GoodsParamsExplain = ''
  // @observable ParamOptionalIcon = ''
  @observable GoodsPhoto = ''
  @observable DeliveryDate = ''
  @observable putOrderNo = ''
  @observable putOrderState = ''

  @computed get dataDisplay () {
    return this.dataList.map((it, index) =>({ ...it, key: index}))
  }

  @action getProductOrder = async () => {
    // 生产订单列表
    const { Data, Ok, ResultInfo } = await http.get('/dfcommon/order', {
      UserType: '2',
      OrderType: '1',
      pageIndex: this.paging.current,
      pageSize: this.paging.size,
      OrderState: this.OrderState,
      SearchContent: this.keyword
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    this.dataList = Data.ResultList
    this.paging.total = Data.ResultCount
    this.OrderNum1 = Data.OrderNum.OrderNum1
    this.OrderNum2 = Data.OrderNum.OrderNum2
    this.OrderNum3 = Data.OrderNum.OrderNum3
    // if(Data.OrderNum.OrderNum1 > 0) {
    //   this.OrderNum1 = true
    // }
    // if(Data.OrderNum.OrderNum2 > 0) {
    //   this.OrderNum2 = true
    // }
    // if(Data.OrderNum.OrderNum3 > 0) {
    //   this.OrderNum3 = true
    // }
  }

  @action dispose = () => {
    this.curStatLabel = '全部'
    this.paging.current = 1
    this.OrderState = ''
    this.keyword = ''
  }

  @action getDetailProductOrder = async (OrderNo) => {
    // 查看详情
    const { Data, Ok, ResultInfo } = await http.get('/dfcommon/order', {
      UserType: '2',
      OrderType: '1',
      OrderNo: OrderNo
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    this.GoodsParamsExplain = Data.ResultList[0].GoodsParamsExplain
    this.DeliveryDate = Data.ResultList[0].DeliveryDate
    this.Address = Data.ResultList[0].Address
    if (this.Address != '') {
      this.UserName = this.Address.UserName
      this.MobileNumber = this.Address.MobileNumber
      // this.Addressdetail = this.Address.Address
      // 收货地址拼接
      this.Addressdetail = this.Address.Province + this.Address.City + this.Address.County + this.Address.Address
      this.GoodsSeriesUnit = this.Address.GoodsSeriesUnit
    }
    this.GoodsNumber = Data.ResultList[0].GoodsNumber
    this.GoodsPhoto = Data.ResultList[0].GoodsPhoto
    this.GoodsSeriesUnit = Data.ResultList[0].GoodsSeriesUnit
    // if(Data.ResultList[0].GoodsKind == 1) {
    //   this.ParamOptionalIcon = Data.ResultList[0].GoodsSurfaceImg
    // }else {
    //   this.ParamOptionalIcon = Data.ResultList[0].ParamOptionalIcon
    // }
  }

  @action onchange = (field, value) => {
    this.data[field] = value
  }
  @action handleChange = (field, value) => {
    this.data[field] = value
  }
  @action onChangeData = (field, value) => {
    this.data[field] = value
  }

  @action onchangeY = (e) => {
    this.YunNum = e.target.value
  }

  @action submitData = async () => {
    // 订单物流(新建/编辑)
    // console.log(toJS(this.data))
    if (this.data.OrderNo === '') {
      message.error('订单号为空')
      return
    }
    if (this.data.BillNo === '') {
      message.error('运单号为空')
      return
    }
    if (this.data.ExpName === '') {
      message.error('快递公司为空')
      return
    }
    if (this.data.DeliveryDate === '') {
      message.error('发货时间为空')
      return
    }
    if (this.data.Remark === '') {
      message.error('说明为空')
      return
    }
    this.visible1 = false
    const { Ok, ResultCode, ResultInfo } = await http.post('/dfcommon/ordershipping', this.data)
    if (!Ok) {
      if (ResultCode == -2) {
        this.visible4 = true
        return
      }
      if (ResultCode == -3) {
        this.data.BillNo = ''
        this.data.ExpName = ''
        this.data.DeliveryDate = ''
        this.data.Remark = ''
        return
      }
      message.error(ResultInfo)
      return
    }
    this.getProductOrder()
    this.data.BillNo = ''
    this.data.ExpName = ''
    this.data.DeliveryDate = ''
    this.data.Remark = ''
  }

  @action getYunnum = async () => {
    // 工厂设置库存
    const { Ok, ResultInfo} = await http.put('/factory/set/yunnum', {
      GoodsSeriesCode: this.YGoodsSeriesCode,
      YunNum: this.YunNum
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    this.submitData()
    this.getProductOrder()
  }

  @action getOrdershipping= async (OrderNo) => {
    // 获取订单物流
    const { Data, Ok, ResultInfo } = await http.get('/dfcommon/ordershipping', {
      OrderNo: OrderNo
    })
    if (!Ok) {
      message.error(ResultInfo)
      this.UserNameShip = ''
      this.MobileNumberShip = ''
      this.AddressShip = ''
      this.TotalProductNumberShip = ''
      this.BillNoShip = ''
      this.ExpNameShip = ''
      this.DeliveryDateShip = ''
      return
    }
    this.UserNameShip = Data.UserName
    this.MobileNumberShip = Data.MobileNumber
    this.AddressShip = Data.Province + Data.City + Data.County + Data.Address
    this.TotalProductNumberShip = Data.TotalProductNumber
    this.BillNoShip = Data.BillNo
    this.ExpNameShip = Data.ExpName
    this.DeliveryDateShip = Data.DeliveryDate
  }

  @action keywordChange = (val) => {
    this.keyword = val
    if (this.keyword.trim() === '') {
      this.paging.current = 1
      this.getProductOrder()
    }
  }
  @action search = () => {
    this.getProductOrder()
  }

  @action close = () => {
    this.visible = false
    this.visible1 = false
    this.visible3 = false
    this.visible4 = false
    this.data.BillNo = ''
    this.data.ExpName = ''
    this.data.DeliveryDate = ''
    this.data.Remark = ''
    this.YunNum = ''
  }

  @action handleOk4 = () => {
    // 实时库存弹框的确定按钮
    // 判断如果添加的库存小于订单数量时，提醒用户必须大于等于订单数量
    if (this.YunNum >= this.GoodsNumber) {
      this.visible4 = false
      this.getYunnum()
      // this.getProductOrder()
      // this.submitData()
      return
    } else if (this.YunNum < this.GoodsNumber && this.YunNum != '') {
      message.error('填写的库存数量必须大于等于订单数量')
      return
    } else if (this.YunNum === '') {
      message.error('请输入库存')
      return
    }
  }

  @action changeStat = (label) => () => {
    // 切换Tab
    this.curStatLabel = label
    this.paging.current = 1
    if (label === '全部') {
      this.OrderState = ''
    } else if (label === '待发货') {
      this.OrderState = '1'
    } else if (label === '已发货') {
      this.OrderState = '2'
    } else if (label === '已完成') {
      this.OrderState = '3'
    }
    this.getProductOrder()
  }


  // @action handleOk1 = () => {
  //   // 发货弹框的确定按钮
  //   this.visible1 = false
  //   this.postDesignmanage(this.postOrderNo)
  //   this.getProductOrder()
  // }
  // @action handleOk = () => {
  //   // 待生产完成弹框的确定按钮
  //   this.visible2 = false
  //   this.putDesignmanage(this.putOrderNo,this.putOrderState)
  //   this.getProductOrder()
  // }
  // @action putDesignmanage = async() => {
  //   // 订单状态修改(待生产完成)
  //   const { Ok, ResultInfo } = await http.put('/dfcommon/order', {
  //     OrderNo: this.putOrderNo,
  //     OrderState: this.putOrderState
  //   })
  //   if (!Ok) {
  //     message.error(ResultInfo)
  //     return
  //   }
  // }
  // @action postDesignmanage = async() => {
  //   // 发货(联系快递)
  //   const { Ok, ResultInfo } = await http.post('/dfcommon/order?OrderNo='+ this.postOrderNo)
  //   if (!Ok) {
  //     message.error(ResultInfo)
  //     return
  //   }
  // }
}

export default new ProductOrders()
