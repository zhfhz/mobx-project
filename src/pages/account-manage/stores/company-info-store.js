import { observable, action } from 'mobx'
import { message } from 'antd'
import { http } from '../../../services/http'

export class CompanyInfoStore {
  @observable demo = '账户管理--公司信息'
  @observable MobileNumber = ''
  @observable Contacter = sessionStorage['Contacter'] || ''
  @observable CompanyName = sessionStorage['CompanyName']
  @observable MainCategoryID = sessionStorage['MainCategoryID']
  @observable MainCategoryName = sessionStorage['MainCategoryName'] || '输配电'
  @observable CompanyAddress = sessionStorage['CompanyAddress'] ||  ''
  @observable CompanyArea = sessionStorage['CompanyArea'] ||  ''
  @observable AppointmentTime = sessionStorage['AppointmentTime'] || ''
  @observable CompanyLicenseImg = sessionStorage['CompanyLicenseImg']
  @observable CompanyState = '0'
  @observable province = '北京'
  @observable city = '北京'
  @observable area = '东城区'
  @observable profile = '工厂简介工厂简介工厂简介工厂简介工厂简介工厂简介工厂简介工厂简介工厂简介工厂简介工厂简介工厂简介'
  @observable CompanyImgs = ['http://placehold.it/120x120','http://placehold.it/120x120','http://placehold.it/120x120','http://placehold.it/120x120',]
  @observable showModal = false
  @observable modalList = []
  @observable selectItem
  @observable detailList = []
  @observable selectList = []
  @observable selectedText = ''
  @observable activeIndex = 0;
  @observable deleteList =[];

  @action showModalHandle =() => {
    this.showModal = true
  };
  @action hideModalHandle =() => {
    this.showModal = false
  };
  @action getCatagories = async () => {
    this.selectList = []
    this.selectedText = ''
    const {Ok, ResultInfo, Data } = await http.get('/factory/user/operatecategory')
    if (!Ok) {
      message.error(ResultInfo)
      return
    }
    this.modalList = Data.ResultList
    this.selectList = this.modalList.filter(it => {
      return it.Selected === '1'
    })
    this.selectList.map((it,index)=> {
      return this.selectedText +=it.CategoryName + (index === (this.selectList.length -1) ? '': '、')
    })
    // console.log(toJS(this.selectList));
    // console.log(this.selectedText)
  };
  @action checkActive = (detailItem) => {
    const arr= this.selectList.filter(it => {
      return it.CategoryId === detailItem.CategoryId && it.CategoryName === detailItem.CategoryName
    })
    if(arr.length>0){
      return true
    }else{
      return false
    }
  };
  @action getUserInfo = ()=> {
    const {
      CategoryName,
      CompanyAddress,
      CompanyArea,
      CompanyDesc,
      CompanyLicenseImg,
      CompanyName,
      CompanyViewList,
      MobileNumber,
      Contacter
    } = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')):{}
    this.MobileNumber = MobileNumber ? MobileNumber : ''
    this.Contacter = Contacter? Contacter : ''
    this.CompanyName = CompanyName ? CompanyName: ''
    this.MainCategoryName = CategoryName ? CategoryName : ''
    this.CompanyAddress = CompanyAddress ? CompanyAddress : ''
    this.CompanyLicenseImg = CompanyLicenseImg ? CompanyLicenseImg : ''
    this.province = CompanyArea ? CompanyArea.split('-')[0]:'北京'
    this.city = CompanyArea ? CompanyArea.split('-')[1]: '北京'
    this.area = CompanyArea ? CompanyArea.split('-')[2]: '东城区'
    this.profile = CompanyDesc ? CompanyDesc : ''
    this.CompanyImgs = CompanyViewList ? CompanyViewList : []
  };
}

export default new CompanyInfoStore()
