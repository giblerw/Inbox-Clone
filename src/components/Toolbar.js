import React from 'react';
import Messages from './Messages';
import Compose from './Compose';

const api = 'https://hypermedia-server.herokuapp.com/api/messages'

class Toolbar extends React.Component {

  constructor() {
    super();
    this.state = {
      checked: false,
      someChecked: false,
      data: [],
      composing: false
    };
  }

  async componentDidMount() {
    const response = await fetch(api)
    const json = await response.json()
    this.setState({data: json["_embedded"].messages})
  }

  async changeItem(item, data) {
    const response = await fetch(api, {
      method: 'PATCH',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    this.setState({data: data})
  }

  async addItem(item){
    const response = await fetch(api, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    this.componentDidMount();
  }

  starClick(i) {
  let newData = this.state.data;
  console.log(newData);
  newData[i].starred = !newData[i].starred
  let patchData = {
    "messageIds": [this.state.data[i].id],
    "command": "star",
    "star": newData[i].starred
  }
  this.changeItem(patchData, newData)
}

  selectedClick(i) {
      let newData = this.state.data;
      let allChecked = true;
      let allUnchecked = true;
      newData[i].selected = !newData[i].selected
      for (var j = 0; j < newData.length; j++) {
        if (newData[j].selected) {
          allUnchecked = false;
        } else {
          allChecked = false;
        }
      }
      if (allChecked) {
        this.setState({checked: true, someChecked: false, data: newData})
      } else if (allUnchecked) {
        this.setState({checked: false, someChecked: false, data: newData})
      } else {
        this.setState({checked: false, someChecked: true, data: newData})
      }
    }

  isChecked() {
      if (this.state.checked) {
        return "fa fa-check-square-o";
      } else if (this.state.someChecked) {
        return "fa fa-minus-square-o";
      } else {
        return "fa fa-square-o";
      }
    }

  checkAll = () => {
      let newData = this.state.data;
      let flag = true;
      for (var i = 0; i < newData.length; i++) {
        if (newData[i].selected) {
          continue;
        } else {
          newData[i].selected = true;
          flag = false;
        }
      }
      if (flag) {
        for (i = 0; i < newData.length; i++) {
          newData[i].selected = false;
        }
        this.setState({checked: false, someChecked: false, data: newData})
      } else {
        this.setState({checked: true, someChecked: false, data: newData})
      }
    }

  markAsRead(isRead) {
    let newData = this.state.data;
    let patchData = {
      "messageIds": [],
      "command": "read",
      "read": isRead
    }
    for (var i = 0; i < newData.length; i++) {
      if (newData[i].selected) {
        newData[i].read = isRead;
        patchData.messageIds.push(newData[i].id)
      }
    }
    this.changeItem(patchData, newData)
  }

  countUnread() {
    let count = 0;
    for (var i = 0; i < this.state.data.length; i++) {
      if (!this.state.data[i].read) {
        count++;
      }
    }
    return count;
  }

  checkDisabled() {
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].selected) {
        return "";
      }
    }
    return "disabled";
  }

  addLabel = (e) => {
    let newData = this.state.data;
    let patchData = {
      "messageIds": [],
      "command": "addLabel",
      "label": e.target.value
    }
    for (var i = 0; i < newData.length; i++) {
      if (newData[i].selected) {
        let add = true;
        for (var j = 0; j < newData[i].labels.length; j++) {
          if (newData[i].labels[j] === e.target.value) {
            add = false;
          }
        }
        if (add) {
          newData[i].labels.push(e.target.value)
          patchData.messageIds.push(newData[i].id)
        }
      }
    }
    this.changeItem(patchData, newData)
  }

  removeLabel = (e) => {
    let newData = this.state.data;
    let patchData = {
      "messageIds": [],
      "command": "removeLabel",
      "label": e.target.value
    }
    for (var i = 0; i < newData.length; i++) {
      if (newData[i].selected) {
        let remove = false;
        for (var j = 0; j < newData[i].labels.length; j++) {
          if (newData[i].labels[j] === e.target.value) {
            remove = true;
            break;
          }
        }
        if (remove) {
          newData[i].labels.splice(newData[i].labels.indexOf(e.target.value), 1);
          patchData.messageIds.push(newData[i].id);
        }
      }
    }
    this.changeItem(patchData, newData)
  }

  toggleCompose = () => {
    return this.setState({
      composing: !this.state.composing
    })
  }

  composeMessage(e){
    e.preventDefault()
    let newData = {
      subject: e.target.subject.value,
      body: e.target.body.value
    }
    this.addItem(newData)
    this.toggleCompose()
  }

  deleteMessages = () => {
  let newData = [];
  let patchData = {
    "messageIds": [],
    "command": "delete"
  }
  for (var i = 0; i < this.state.data.length; i++) {
    if (this.state.data[i].selected) {
      patchData.messageIds.push(this.state.data[i].id)
    } else {
      newData.push(this.state.data[i]);
    }
  }
  this.changeItem(patchData, newData)
  this.setState({checked: false, someChecked: false})
}


  render(){
    return(
      <div>
        <div className="row toolbar">
          <div className="col-md-12">

            <span className="badge badge-primary"><h5>{this.countUnread()}<br/>Unread</h5></span>

            <div className="btn-group" role="group" aria-label="Basic example">
              <button type="button" class="btn btn-success" onClick={this.toggleCompose}><i className="fa fa-plus"><br />New</i></button>
              <button type="button" class="btn btn-primary" onClick={this.checkAll}><i className={this.isChecked()}><br />Select All</i></button>
              <button type="button" class="btn btn-danger" onClick={this.deleteMessages}><i className="fa fa-trash-o"><br />Delete</i></button>
              <button type="button" class="btn btn-light" onClick={() => this.markAsRead(true)} disabled={this.checkDisabled()}>Mark <br/>As Read</button>
              <button type="button" class="btn btn-warning" onClick={() => this.markAsRead(false)} disabled={this.checkDisabled()}>Mark <br/>As Unread</button>
            </div>

            <div className="btn-group label-btns" role="group" aria-label="Basic example">

              <select className="form-control label-select" onChange={this.addLabel} disabled={this.checkDisabled()}>
                <option >+Label</option>
                <option value="dev">dev</option>
                <option value="personal">personal</option>
                <option value="gschool">gschool</option>
              </select>

              <select className="form-control label-select" onChange={this.removeLabel} disabled={this.checkDisabled()}>
                <option>-Label</option>
                <option value="dev">dev</option>
                <option value="personal">personal</option>
                <option value="gschool">gschool</option>
              </select>
            </div>
          </div>
        </div>

        {
          this.state.composing
            ? <Compose data={this.state.data} composeMessage={body => this.composeMessage(body)}/>
            : null
        }

        <Messages data={this.state.data} starClick={i => this.starClick(i)} selectedClick={i => this.selectedClick(i)}/>
      </div>
    )
  }
}

export default Toolbar;
