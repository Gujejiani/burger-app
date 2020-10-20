import React from 'react';

import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import {Link} from 'react-router-dom'

const toolbar = ( props ) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.drawerToggleClicked} />
        <div className={classes.Logo}>
      <Link to="/" >    <Logo /></Link>  
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems token={props.token} />
        </nav>
    </header>
);

export default toolbar;