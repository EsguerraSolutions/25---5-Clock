const initialState = {
  breakCount : 5,
  sessionCount : 25,
  clockCount : 25*60,
  currentTimer : "Session",
  isPlaying : false
}

const backgroundStyle = [
  "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)"
  ,"linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)"
]

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = initialState;
      this.loop = undefined;
      this.handlePlayPause = this.handlePlayPause.bind(this);
      this.handleReset = this.handleReset.bind(this);
      this.handleSessionDecrease = this.handleSessionDecrease.bind(this);
      this.handleSessionIncrease = this.handleSessionIncrease.bind(this);
      this.handleBreakDecrease = this.handleBreakDecrease.bind(this);
      this.handleBreakIncrease = this.handleBreakIncrease.bind(this);
      this.setClockCount = this.setClockCount.bind(this);
    }

    handlePlayPause() {
      const {isPlaying} = this.state;
      
      if (isPlaying) {
        clearInterval(this.loop);
        this.setState({
          isPlaying : false
        });
      }

      else {
        this.loop = setInterval(() => {
          const {clockCount,breakCount,sessionCount,currentTimer} = this.state;
          if(clockCount > 0) {
            this.setState((state) => ({
              clockCount : state.clockCount - 1
            }));
          }

          else {
            if (currentTimer === "Session") {
              $("body").css("backgroundImage",backgroundStyle[1]);
              this.setState((state) => ({
                currentTimer : "Break",
                clockCount : breakCount * 60
              }));
            }
            else {
              $("body").css("backgroundImage",backgroundStyle[0]);
              this.setState((state) => ({
                currentTimer : "Session",
                clockCount : sessionCount * 60
              }));
            }
            this.audioBeep.play();
          }
        },1000);

        this.setState({
          isPlaying : true
        });
      }
    }

    handleReset() {
      clearInterval(this.loop);
      this.setState(initialState);
      this.audioBeep.pause();
      this.audioBeep.currentTime = 0;
      $("body").css("backgroundImage",backgroundStyle[0]);
    }

    handleSessionDecrease() {
      const {sessionCount,currentTimer,isPlaying} = this.state;
      if (sessionCount > 1 && isPlaying == false ) {
        this.setState((state) => ({
          sessionCount : state.sessionCount - 1
        }));
        if (currentTimer === "Session") {
          this.setClockCount((sessionCount - 1) * 60);
        }
      }
    }

    handleSessionIncrease() {
      const {sessionCount,currentTimer,isPlaying} = this.state;
      if (sessionCount < 60 && isPlaying == false ) {
        this.setState((state) => ({
          sessionCount : state.sessionCount + 1
        }));
        if (currentTimer === "Session") {
          this.setClockCount((sessionCount + 1) * 60);
        }
      }
    }

    handleBreakDecrease() {
      const {breakCount,currentTimer,isPlaying} = this.state;
      if (breakCount > 1 && isPlaying == false) {
        this.setState((state) => ({
          breakCount : state.breakCount - 1
        }));
        if (currentTimer === "Break") {
          this.setClockCount((breakCount - 1) * 60);
        }
      }
    }

    handleBreakIncrease() {
      const {breakCount,currentTimer,isPlaying} = this.state;
      if (breakCount < 60 && isPlaying == false) {
        this.setState((state) => ({
          breakCount : state.breakCount + 1
        }));
        if (currentTimer === "Break") {
          this.setClockCount((breakCount + 1) * 60);
        }
      }
    }

    setClockCount(n) {
      this.setState({
        clockCount : n 
      }) 
    }

    componentWillUnmount() {
      clearInterval(this.loop);
    }
    
    render() {
      const {breakCount, sessionCount, clockCount, currentTimer, isPlaying} = this.state;
      const sessionProps = {
        setterLabel : "Session Length",
        count : sessionCount,
        setterID : "session-label",
        decrementID : "session-decrement",
        incrementID : "session-increment",
        counterID : "session-length",
        handleDecrease : this.handleSessionDecrease,
        handleIncrease : this.handleSessionIncrease
      }

      const breakProps = {
        setterLabel : "Break Length",
        count : breakCount,
        setterID : "break-label",
        decrementID : "break-decrement",
        incrementID : "break-increment",
        counterID : "break-length",
        handleDecrease : this.handleBreakDecrease,
        handleIncrease : this.handleBreakIncrease
      }

      return(
        <div id="container" className="animate__animated animate__zoomInDown">
          <div id="header">
            <h1>25 + 5 Clock</h1>
            <p>Coded by Jonathan</p>
          </div>
          <div id="set-container">
            <SetTimer {...sessionProps}/>
            <SetTimer {...breakProps}/>
          </div>
          <Clock clockLabel={currentTimer} clockCount={clockCount} handlePlayPause={this.handlePlayPause} handleReset={this.handleReset} isPlaying={isPlaying}/>
          <audio id="beep" preload="auto" ref={(audio) => {
            this.audioBeep = audio;
            }} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          />
        </div>
      );
    }
  }
  
class SetTimer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {setterLabel,count,setterID,decrementID,incrementID,counterID,handleIncrease,handleDecrease} = this.props;
        return(
        <div className="set-timer">
            <h2 className="setter-label" id={setterID}>{setterLabel}</h2>
            <div className="buttons-container">
                <button type="button" className="btn btn-primary" id={decrementID} onClick={handleDecrease}><i class="fas fa-minus"></i></button>
                <span id={counterID} className="counter-length">{count}</span>
                <button type="button" className="btn btn-primary" id={incrementID} onClick={handleIncrease}><i class="fas fa-plus"></i></button>
            </div>
        </div>
        );
    }
}

class Clock extends React.Component {
  constructor(props) {
      super(props);
  }

  convertToTime = (count) => {
    let minutes = Math.floor(count/60);
    let seconds = count % 60;
    let time = "";
    time = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    time = seconds < 10 ? time.concat(`0${seconds}`) : time.concat(`${seconds}`) ;
    return time;
  }

  render() {
      const {clockLabel,clockCount,handlePlayPause,handleReset,isPlaying} = this.props;
      return(
      <div id="clock-container">
          <h2 id="timer-label">{clockLabel}</h2>
          <div id="time-left">{this.convertToTime(clockCount)}</div>
          <div className="buttons-container">
              <button type="button" className="btn btn-primary" id="start_stop" onClick={handlePlayPause}><i className={`fas fa-${isPlaying ? "pause":"play"}`}></i></button>
              <button type="button" className="btn btn-primary" id="reset" onClick={handleReset}><i className="fas fa-redo"></i></button>
          </div>
      </div>
      );
  }
}
  
  ReactDOM.render(<App/>,document.getElementById("root"));