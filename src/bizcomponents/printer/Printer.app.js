import React from 'react'
import PropTypes from 'prop-types'
import {
  Layout,
  Menu,
  Icon,
  Avatar,
  Dropdown,
  Tag,
  message,
  Spin,
  Breadcrumb,
  AutoComplete,
  Input,Button
} from 'antd'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'
import { Link, Route, Redirect, Switch } from 'dva/router'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'
import styles from './Printer.app.less'
import {sessionObject} from '../../utils/utils'

import HeaderSearch from '../../components/HeaderSearch';
import NoticeIcon from '../../components/NoticeIcon';
import GlobalFooter from '../../components/GlobalFooter';


import GlobalComponents from '../../custcomponents';

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
}




class PrinterBizApp extends React.PureComponent {
  constructor(props) {
    super(props)
    // 把一级 Layout 的 children 作为菜单项
    // this.menus = getNavData().reduce((arr, current) => arr.concat(current.children), [])
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    }
  }

  componentDidMount() {}
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout)
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    })
  }

  getDefaultCollapsedSubMenus = (props) => {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)]
    currentMenuSelectedKeys.splice(-1, 1)
    if (currentMenuSelectedKeys.length === 0) {
      return ['/printer/']
    }
    return currentMenuSelectedKeys
  }
  getCurrentMenuSelectedKeys = (props) => {
    const { location: { pathname } } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key]
    }
    return keys
  }
  
  getNavMenuItems = () => {
  

    const menuData = sessionObject('menuData')
    const targetApp = sessionObject('targetApp')
	const {objectId}=targetApp;
  
    return (
      
		  <Menu
             theme="dark"
             mode="inline"
            
             
             onOpenChange={this.handleOpenChange}
            
             defaultOpenKeys={['firstOne']}
             style={{ margin: '16px 0', width: '100%' }}
           >
           

             <Menu.Item key="dashboard">
               <Link to={`/printer/${this.props.printer.id}/dashboard`}><Icon type="dashboard" /><span>仪表板</span></Link>
             </Menu.Item>
             
		 <Menu.Item key="homepage">
               <Link to={"/home"}><Icon type="home" /><span>回到主页</span></Link>
             </Menu.Item>
             
             
        {menuData.subItems.map((item)=>(<Menu.Item key={item.name}>
          <Link to={`/${menuData.menuFor}/${objectId}/list/${item.name}/${item.displayName}列表`}>
          <Icon type="bars" /><span>{item.displayName}</span>
          </Link>
        </Menu.Item>))}
       
       <Menu.Item key="preference">
               <Link to={`/printer/${this.props.printer.id}/preference`}><Icon type="setting" /><span>设置</span></Link>
             </Menu.Item>
      
           </Menu>
    )
  }
  



  getPrinterTaskSearch = () => {
    const {PrinterTaskSearch} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      name: "打印机任务",
      role: "printerTask",
      data: state._printer.printerTaskList,
      count: state._printer.printerTaskCount,
      currentPage: state._printer.printerTaskCurrentPageNumber,
      searchFormParameters: state._printer.printerTaskSearchFormParameters,
      loading: state._printer.loading,
      partialList: state._printer.partialList,
      owner: { type: '_printer', id: state._printer.id, 
      referenceName: 'printer', 
      listName: 'printerTaskList', ref:state._printer, 
      listDisplayName: '打印机任务列表' }, // this is for model namespace and
    }))(PrinterTaskSearch)
  }
  getPrinterTaskCreateForm = () => {
   	const {PrinterTaskCreateForm} = GlobalComponents;
    return connect(state => ({
      rule: state.rule,
      role: "printerTask",
      data: state._printer.printerTaskList,
      count: state._printer.printerTaskCount,
      currentPage: state._printer.printerTaskCurrentPageNumber,
      searchFormParameters: state._printer.printerTaskSearchFormParameters,
      loading: state._printer.loading,
      owner: { type: '_printer', id: state._printer.id, referenceName: 'printer', listName: 'printerTaskList', ref:state._printer, listDisplayName: '打印机任务列表'}, // this is for model namespace and
    }))(PrinterTaskCreateForm)
  }
  
  getPrinterTaskUpdateForm = () => {
  	const {PrinterTaskUpdateForm} = GlobalComponents;
    return connect(state => ({
      selectedRows: state._printer.selectedRows,
      role: "printerTask",
      currentUpdateIndex: state._printer.currentUpdateIndex,
      owner: { type: '_printer', id: state._printer.id, listName: 'printerTaskList', ref:state._printer, listDisplayName: '打印机任务列表' }, // this is for model namespace and
    }))(PrinterTaskUpdateForm)
  }


  
  buildRouters = () =>{
  	const {PrinterDashboard} = GlobalComponents
  	const {PrinterPreference} = GlobalComponents
  	
  	
  	const routers=[
  	{path:"/printer/:id/dashboard", component: PrinterDashboard},
  	{path:"/printer/:id/preference", component: PrinterPreference},
  	
  	
  	
  	{path:"/printer/:id/list/printerTaskList", component: this.getPrinterTaskSearch()},
  	{path:"/printer/:id/list/printerTaskCreateForm", component: this.getPrinterTaskCreateForm()},
  	{path:"/printer/:id/list/printerTaskUpdateForm", component: this.getPrinterTaskUpdateForm()},
     	
  	
  	]
  	
  	const {extraRoutesFunc} = this.props;
	const extraRoutes = extraRoutesFunc?extraRoutesFunc():[]
    const finalRoutes = routers.concat(extraRoutes)
    
  	return (<Switch>
             {finalRoutes.map((item)=>(<Route key={item.path} path={item.path} component={item.component} />))}    
  	  	</Switch>)
  	
  
  }
 

  getPageTitle = () => {
    // const { location } = this.props
    // const { pathname } = location
    const title = '书香社区'
    return title
  }
 
  handleOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1)
    this.setState({
      openKeys: latestOpenKey ? [latestOpenKey] : [],
    })
  }
   toggle = () => {
     const { collapsed } = this.props
     this.props.dispatch({
       type: 'global/changeLayoutCollapsed',
       payload: !collapsed,
     })
   }
    logout = () => {
   
    console.log("log out called")
    this.props.dispatch({ type: 'launcher/signOut' })
  }
   render() {
     // const { collapsed, fetchingNotices,loading } = this.props
     const { collapsed } = this.props
     const { breadcrumb }  = this.props

     //const {PrinterEditDetail} = GlobalComponents
     //const {PrinterViewDetail} = GlobalComponents
     
     
     const targetApp = sessionObject('targetApp')
     const currentBreadcrumb =sessionObject(targetApp.id)
     
     
     // Don't show popup menu when it is been collapsed
     const menuProps = collapsed ? {} : {
       openKeys: this.state.openKeys,
     }
     const layout = (
     <Layout>
        <Header>
          
          <div className={styles.left}>
          <img
            src="./favicon.png"
            alt="logo"
            onClick={this.toggle}
            className={styles.logo}
          />
          {currentBreadcrumb.map((item)=>{
            return (<Link  key={item.link} to={`${item.link}`} className={styles.breadcrumbLink}> &gt;{item.name}</Link>)

          })}
         </div>
          <div className={styles.right}  >
          <Button type="primary"  icon="logout" onClick={()=>this.logout()}>
          退出</Button>
          </div>
          
        </Header>
       <Layout>
         <Sider
           trigger={null}
           collapsible
           collapsed={collapsed}
           breakpoint="md"
           onCollapse={()=>this.onCollapse(collapsed)}
           collapsedWidth={56}
           className={styles.sider}
         >
           




             {this.getNavMenuItems(this.props.printer.id)}
            
         </Sider>
         <Layout>
           <Content style={{ margin: '24px 24px 0', height: '100%' }}>
           
           {this.buildRouters()}
 
             
             
           </Content>
          </Layout>
        </Layout>
      </Layout>
     )
     return (
       <DocumentTitle title={this.getPageTitle()}>
         <ContainerQuery query={query}>
           {params => <div className={classNames(params)}>{layout}</div>}
         </ContainerQuery>
       </DocumentTitle>
     )
   }
}

export default connect(state => ({
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  printer: state._printer,
  ...state,
}))(PrinterBizApp)



