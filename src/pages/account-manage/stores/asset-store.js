import { observable, computed, action } from 'mobx'
import { http } from '../../../services/http'
import { message } from 'antd'
export class AssetStore {
  @observable demo = '账户管理--我的资产'
  @observable withDrawList = []
  @observable profitList = []
  @observable curStatLabel = '提现记录'
  // 分页配置
  @observable paging = {
    current: 1,
    total: 0,
    size: '10',
    hideOnSinglePage: true,
    onChange: (page) => {
      this.paging.current = page
      this.curStatLabel === '提现记录' ? this.getWithDrawList(page) : this.getProfitList(page)
    }
  }
  @observable WithDrawShow = false
  @observable Count = 0
  @observable WaitIn = 0 // 待入账
  @observable TodayIn = 0 // 今天收益
  @observable KeepMoney = 0 // 余额
  @observable YesterdayIn = 0 // 昨天收益
  @observable AllIn = 0 // 总收益
  @observable OutMoney = 0 // 已提现
  @observable monthIn = 0 // 30天收益
  @observable weekIn = 0 // 7天收益
  @observable moneyError = ''
  @observable Money = ''
  @observable RealName = ''
  @observable IDError = ''
  @observable ID = ''
  @observable CardID = ''

  @computed get withDrawDisplay () {
    return this.withDrawList.map((it, index) =>({ ...it, key: index}))
  }
  @computed get profitDisplay () {
    return this.profitList.map((it, index) =>({ ...it, key: index}))
  }
  @action changeStat = (label) => () => {
    this.curStatLabel = label
    this.paging.current = 1
    if (label === '提现记录') {
      this.getWithDrawList(1)
    } else {
      this.getProfitList(1)
    }
  }
  @action showWithDraw = () => {
    if (this.withDrawList.length === 0) {
      this.WithDrawShow = true
    } else {
      this.getExistAccount()
    }
  }
  @action getExistAccount = () => {
    if (this.withDrawList.length) {
      const data = this.withDrawList[0]
      // console.log(data)
      this.ID = data.ID
      this.RealName = data.RealName
      this.CardID = data.CardId
    }
  }
  @action closeWithDraw = () => {
    this.WithDrawShow = false
  }
  @action moneyChange = (e) => {
    this.Money = e.target.value.trim()
  }
  @action IDChange = (e) => {
    this.ID = e.target.value.trim()
  }
  @action checkMoney = () => {
    if (Number(this.Money) <= 1 || this.Money === '' || this.Money == undefined || isNaN(Number(this.Money)) || !Number.isInteger(Number(this.Money))) {
      this.moneyError = '请输入大于1元的整数提现金额'
    } else {
      this.moneyError = ''
    }
  }
  @action checkID = () => {
    if (this.ID.length !== 15 && this.ID.length !== 18) {
      this.IDError = '身份证号码输入错误'
    } else if (this.ID.length === 15 && !(/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/.test(this.ID))) {
      this.IDError = '身份证号码输入错误'
    } else if (this.ID.length === 18 && !(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.ID))) {
      this.IDError = '身份证号码输入错误'
    } else {
      this.IDError = ''
    }
  }

  @action getData = async () => {
    await this.getProfitList(1)
    await this.getWithDrawList(1)
  }

  @action getProfitList = async (page) => {
    const {Ok, ResultInfo, Data} = await http.get(`/dfcommon/user/incomemoney?UserType=2&pageIndex=${page}&pageSize=${this.paging.size}`)
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    const {WaitIn, TodayIn, KeepMoney, YesterdayIn, AllIn, OutMoney} = Data.InCome
    this.WaitIn = WaitIn
    this.TodayIn = TodayIn
    this.KeepMoney = KeepMoney
    this.YesterdayIn = YesterdayIn
    this.AllIn = AllIn
    this.OutMoney = OutMoney
    this.monthIn = Data.InCome['30In']
    this.weekIn = Data.InCome['7In']
    this.profitList = Data.ResultList
    this.paging.total = Data.ResultCount
  }
  @action getWithDrawList = async (page) => {
    const { Ok, ResultInfo, Data } = await http.get(`/dfcommon/user/outmoney?UserType=2&pageIndex=${page}&pageSize=${this.paging.size}`)
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    this.withDrawList = Data.ResultList
    this.paging.total = Data.ResultCount
  }
  @action getCheckCode = async (MobileNumber, VerificationType) => {
    const { Ok, ResultInfo} = await http.post('/factory/verificationcode', {
      MobileNumber: MobileNumber,
      VerificationType: VerificationType,
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    message.success('验证码已发送，请查收短信。')
    this.Count = 60
    const interval = setInterval(() => {
      this.Count--
      if (this.Count === 0) {
        clearInterval(interval)
      }
    }, 1000)
  };
  @action withdrawMoney = async (obj) => {
    this.checkMoney()
    this.checkID()
    if (this.moneyError || this.IDError) {
      return
    }
    const { Ok, ResultInfo} = await http.post('/dfcommon/user/outmoney', obj)
    if (!Ok) {
      message.error(ResultInfo)
      return false
    }
    message.success('提现申请成功！')
    this.showWithDraw()
    return true
    // this.getProfitList()
    // this.getWithDrawList()
  }
  @action dispose = () => {
    this.moneyError = ''
    this.IDError = ''
    this.ID = ''
    this.CardID = ''
    this.RealName = ''
  }

}

export default new AssetStore()
