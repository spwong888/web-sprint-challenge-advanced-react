import React, { useState } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [gridIndex, setGridIndex] = useState(initialIndex);
  const [message, setMessage] = useState(initialMessage);
  const [payload, setPayload] = useState({
    x: 1,
    y: 1,
    steps: initialSteps,
    email: initialEmail,
  });

  function getXY() {
    const x = (gridIndex % 3) + 1;
    const y = Math.floor(gridIndex / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setGridIndex(initialIndex);
    setMessage(initialMessage);
    setPayload({
      x: 1,
      y: 1,
      steps: 0,
      email: initialEmail,
    });
  }

  function getNextIndex(direction) {
    let newIndex = gridIndex;
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

  function move(evt) {
    const nextIndex = getNextIndex(evt.target.id);
    if (nextIndex !== gridIndex) {
      setGridIndex(nextIndex);
      setPayload({ ...payload, steps: payload.steps + 1 });
    }
  }

  function onChange(evt) {
    const newEmail = evt.target.value;
    setPayload({ ...payload, email: newEmail });
  }

  function onSubmit(evt) {
    evt.preventDefault();
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
          setMessage(data.success);
        } else if (data.error) {
          setMessage(data.error);
        }
      })
      .catch(() => {
        setMessage('An error occurred while submitting the data. Please try again.');
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {payload.steps} times</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === gridIndex ? ' active' : ''}`}>
            {idx === gridIndex ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          Reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="Type email"
          value={payload.email}
          onChange={onChange}
        ></input>
        <input id="submit" type="submit" value="Submit"></input>
      </form>
    </div>
  );
}
