import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/Checkout/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth'
import Logout from './containers/Auth/Logout/Logout'
import * as actions from './store/actions/index'
import {connect} from 'react-redux'


class App extends Component {
  componentDidMount(){
    this.props.tryAgaintSignIn()
  }
  render () {
    return (
      <div>
        <Layout>
          <Switch>
      
            { this.props.isAuthinticated ?  <Route path="/checkout" component={Checkout} />: null}
            { this.props.isAuthinticated ? <Route path="/orders" component={Orders} />: null}
            <Route path="/auth"  component={Auth} />
            <Route path="/logout"  component={Logout} />
            <Route basename="/" exact component={BurgerBuilder} />
         
          </Switch>
        </Layout>
      </div>
    );
  }
}
const mapStateToProps = state =>{
  return{
    isAuthinticated: state.auth.token !==null
  }

}

const mapDispatchToProps = dispatch =>{
  return {
    tryAgaintSignIn: ()=> dispatch(actions.authCheckState())

  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
