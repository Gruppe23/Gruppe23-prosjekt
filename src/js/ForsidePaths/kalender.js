// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import { employee } from '../services';
import {  Button, Container, Divider, Dropdown, Header, Message, Segment, Menu, Icon, Sidebar } from 'semantic-ui-react';
import { AdminPageUserCreate } from "./AdminPage/AdminPageUserCreate.js";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))


class Kalender extends React.Component<{}> {
  constructor(props){
    super(props)
    this.state = {
      kalender: "",
      menuVisible: true,
      showPopup: false
    }
  }



  render() {
    return(
      <div className="full">
        <div className="full">
          <Sidebar.Pushable as={Segment} attached="bottom" >
          <Sidebar as={Menu} animation="overlay" visible={this.state.menuVisible} icon="labeled" vertical inline inverted>
            <Menu.Item><Icon name="home" />Home</Menu.Item>
            <Menu.Item><Icon name="block layout" />Topics</Menu.Item>
            <Menu.Item><Icon name="smile" />Friends</Menu.Item>
            <Menu.Item><Icon as={Button} name="calendar" />Events</Menu.Item>
        </Sidebar> <Sidebar.Pusher>
            <Segment floated="left">
              <div className="full">
                {this.state.kalender}
              </div>
            </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
        {this.state.showPopup ?
<AdminPageUserCreate
  text="Close Me"
  closePopup={this.togglePopup.bind(this)}
/>
:null
}
      </div>
    )
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  componentDidMount(){
    employee.getEvents().then((events) => {
      let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

      this.setState({kalender:
        <BigCalendar
          events={events}
          views={allViews}
          step={60}
          showMultiDayTimes
          defaultDate={new Date()}
          onSelectEvent={event => {this.togglePopup()}}
        />
      })
    })
  }
}



export { Kalender }
