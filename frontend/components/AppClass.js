import React, { Component } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

class AppClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    };
  }

  getXY() {
    const x = (this.state.index % 3) + 1;
    const y = Math.floor(this.state.index / 3) + 1;
    return { x, y };
  }

  getXYMessage() {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  }

  reset() {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  }

  getNextIndex(direction) {
    let newIndex = this.state.index;
    switch (direction) {
      case 'left':
        if (newIndex % 3 !== 0) newIndex -= 1;
        break;
      case 'up':
        if (newIndex >= 3) newIndex -= 3;
        break;
      case 'right':
        if (newIndex % 3 !== 2) newIndex += 1;
        break;
      case 'down':
        if (newIndex < 6) newIndex += 3;
        break;
      default:
        break;
    }
    return newIndex;
  }

  move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
      }));
    }
  };

  onChange = (evt) => {
    const newEmail = evt.target.value;
    this.setState({ email: newEmail });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    const payload = {
      x: this.getXY().x,
      y: this.getXY().y,
      steps: this.state.steps,
      email: this.state.email,
    };

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          this.setState({ message: data.success });
        } else if (data.error) {
          this.setState({ message: data.error });
        }
      })
      .catch(() => {
        this.setState({ message: 'An error occurred while submitting the data. Please try again.' });
      });
  };

  render() {
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
              {idx === this.state.index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>
            LEFT
          </button>
          <button id="up" onClick={this.move}>
            UP
          </button>
          <button id="right" onClick={this.move}>
            RIGHT
          </button>
          <button id="down" onClick={this.move}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            Reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="Type email"
            value={this.state.email}
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit" value="Submit"></input>
        </form>
      </div>
    );
  }
}

export default AppClass;
