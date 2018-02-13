import React from 'react';

class Nav extends React.Component {
  render(){
    return(

      <div className="nav-bar">
        <h3 className="nav-subHead"><a href="https://westongibler.com">Back</a></h3>
        <h1 className="nav-header"><u><b>Weston's <em>React</em> Inbox</b></u></h1>

        <h3 className="nav-subHeader"><a href="https://github.com/giblerw/react-inbox">Github Repo</a></h3>
        <p className="nav-sub">A <em>Full-Stack</em> Application,<br /> Made with React and Bootstrap</p>
      </div>
    )
  }
}

export default Nav;
