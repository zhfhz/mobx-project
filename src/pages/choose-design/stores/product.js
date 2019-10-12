import { observable, computed, action } from 'mobx'
import { http } from '../../../services/http'
import { message } from 'antd'
import appStore from '../../app/stores/app'

export class Product {
  @observable demo = '选择设计--待选择'
  @observable curStatLabel = '待选择'
  @observable visible = false
  @observable visible1 = false
  @observable CategoryId1 = appStore.MainCategoryID
  @observable DesignState1 = 2
  @observable CompanyID = ''
  @observable keyword = ''
  // 分页配置
  @observable paging = {
    current: 1,
    total: 0,
    size: 10,
    hideOnSinglePage: true,
    onChange: (page) => {
      this.paging.current = page
      this.getDesignManage()
    }
  }
  @observable dataList = []
  @observable CategoryName1 = ''   // 行业名称
  @observable CategoryName2 = ''   // 一级品类名称
  @observable CategoryName3 = ''   // 二级品类名称 （品咧名称是由一级品类名称和二级品类名称拼起来的）
  @observable BrandName = ''       // 品牌名称
  @observable BrandViewList = []   // 品牌图片
  @observable BrandCulture = ''    // 品牌内涵
  @observable GoodsSeriesName = '' // 产品设计名称
  @observable ViewList = []      // 产品设计展示图
  @observable DesignDesc = ''      // 设计描述
  @observable DesignFileList = []  // 设计文件
  @observable DesignRate = ''     // 设计师分成比例
  @observable choiceGoodsSeriesCode = ''
  @observable CoopState = ''

  @computed get dataDisplay () {
    return this.dataList.map((it, index) => ({ ...it, key: index }))
  }

  @computed get brandViewDisplay () {
    return this.BrandViewList.map((it) => (it.Url))
  }

  @computed get viewListDisplay () {
    return this.ViewList.map((it) => (it.Url))
  }
  @computed get descriptionDisplay () {
    return this.ViewList.map((it) => (it.Name))
  }

  @computed get fileListDisplay () {
    return this.DesignFileList.map((it, index) => ({ ...it, key: index }))
  }

  @action keywordChange = (val) => {
    this.keyword = val
    if (this.keyword.trim() === '') {
      this.paging.current = 1
      this.getDesignManage()
    }
  }

  @action search = () => {
    this.getDesignManage()
  }

  @action getDesignManage = async () => {
    // 设计列表
    const { Data, Ok, ResultInfo } = await http.get('/dfcommon/designmanage', {
      IsDesign: 0,
      UserType: 2,
      DesignState: this.DesignState1,
      pageIndex: this.paging.current,
      pageSize: this.paging.size,
      SearchContent: this.keyword,
      CategoryId1: this.CategoryId1,
      CompanyID: this.CompanyID
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    this.dataList = Data.ResultList
    this.paging.total = Data.ResultCount
  }

  @action dispose = () => {
    this.keyword = ''
    this.curStatLabel = '待选择'
    this.DesignState1 = 2
    this.paging.current = 1
  }

  @action getDesignDetails = async (GoodsSeriesCode) => {
    // 设计详情页
    const { Data, Ok, ResultInfo } = await http.get('/dfcommon/designmanage', {
      IsDesign: 0,
      UserType: 2,
      GoodsSeriesCode: GoodsSeriesCode
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    for (var i = 0; i < Data.ResultList.length; i++) {
      this.CategoryName1 = Data.ResultList[0].CategoryName1
      this.CategoryName2 = Data.ResultList[0].CategoryName2
      this.CategoryName3 = Data.ResultList[0].CategoryName3
      this.BrandName = Data.ResultList[0].BrandName
      this.BrandViewList = Data.ResultList[0].BrandViewList
      this.BrandCulture = Data.ResultList[0].BrandCulture
      this.GoodsSeriesName = Data.ResultList[0].GoodsSeriesName
      this.ViewList = Data.ResultList[0].ViewList
      this.DesignDesc = Data.ResultList[0].DesignDesc
      this.DesignFileList = Data.ResultList[0].DesignFileList
      this.DesignRate = Data.ResultList[0].DesignRate
    }
  }

  @action getChoiceCoop = async () => {
    const { Ok, ResultInfo } = await http.put('factory/choicecoop', {
      GoodsSeriesCode: this.choiceGoodsSeriesCode,
      CoopState: this.CoopState
    })
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
  }

  @action changeStat = (label) => () => {
    this.curStatLabel = label
    this.paging.current = 1
    if (label === '已合作') {
      this.DesignState1 = 3
    } else if (label === '待选择') {
      this.DesignState1 = 2
    }
    this.getDesignManage()
  }

  @action close = () => {
    this.visible = false
    this.visible1 = false
  }
  @action handleOk = () => {
    this.visible = false
    this.CoopState = 1
    this.getChoiceCoop()
    // 不跳转到已合作列表
    // this.curStatLabel = '待选择'
    this.DesignState1 = 2
    this.getDesignManage()
  }
  @action handleOk1 = () => {
    this.visible1 = false
  }
  @action showcooperateModal = () => {
    this.visible1 = true
  }

}

export default new Product()
