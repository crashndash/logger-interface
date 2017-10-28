import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import MenuIcon from 'material-ui-icons/Menu';
import Hidden from 'material-ui/Hidden';
import Button from 'material-ui/Button';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';

import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const URL_BASE = 'https://logger_api.crashndash.com'

const drawerWidth = 240;
const styles = theme => ({
  root: {
    width: '100%',
    height: 430,
    marginTop: theme.spacing.unit * 3,
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
});

class IplogComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {log: [], offset: 0}
    this.classes = props.classes
  }
  getLog (offset = '') {
    fetch(`${URL_BASE}/api/iplog/${offset}`, {
      credentials: 'include'
    })
    .then((data) => {
      return data.json()
    })
    .then((json) => {
      let offset = json[json.length - 1].timestamp
      this.setState({
        log: json,
        offset: offset
      })
    })
  }
  componentWillReceiveProps (newProps) {
    if (newProps.location === this.props.location) {
      this.setState(this.getState(newProps));
    }
  }
  componentDidMount(){ this.getState() }

  getState (props) {
    props = props || this.props;
    return {
      log: this.getLog(props.offset)
    };
  }
  render () {
    var items = ''
    if (this.state && this.state.log) {
      items = this.state.log.map((item, i) => {
        let time = new Date(item.timestamp).toString()
        return (<TableRow key={i}>
        <TableCell>
          {item.name}
        </TableCell>
        <TableCell>
          {item.ip}
        </TableCell>
        <TableCell>
          {time}
        </TableCell>
      </TableRow>)
      })
    }
    var offset = ''
    if (this.state.offset) {
      offset = this.state.offset
    }
    var nextPage = '/iplog/' + offset

    return (
      <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>IP</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items}
        </TableBody>
      </Table>
      <Link to={nextPage}>
      <Button raised color="primary">
        Next page
      </Button>
      </Link>
      </div>
    )
  }
}

const Iplog = ({ match }) => (
  <IplogComponent offset={match.params.offset} />
)

const Numbers = () => (
  <div>
    <h3>Numbers</h3>
  </div>
)

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {mobileOpen: false}
    this.classes = props.classes
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  render () {
    const drawer = (
      <div>
        <MenuItem><Link to="/">Log</Link></MenuItem>
        <MenuItem><Link to="/numbers">Numbers</Link></MenuItem>
      </div>
    );
    return (
      <Router>
      <div className={this.classes.appFrame}>
        <AppBar className={this.classes.appBar}>
        <Toolbar>
              <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={this.classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>

            <Typography type="title" color="inherit" noWrap>
              Logger
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
            <Drawer
              type="temporary"
              anchor="left"
              open={this.state.mobileOpen}
              classes={{
                paper: this.classes.drawerPaper,
              }}
              onRequestClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden mdDown implementation="css">
            <Drawer
              type="permanent"
              open
              classes={{
                paper: this.classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={this.classes.content}>

              <Route exact path="/" component={Iplog}/>
              <Route exact path="/iplog" component={Iplog}/>
              <Route exact path="/iplog/:offset" component={Iplog}/>
              <Route path="/numbers" component={Numbers}/>
          </main>

      </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
