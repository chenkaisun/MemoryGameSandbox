import "./front_pages_style.css";
import React from "react";
import Timer from "./timer";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handle = this.handle.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.shuffleArray = this.shuffleArray.bind(this);
    this.reset_game = this.reset_game.bind(this);

    this.state = {
      cards: [],
      last_seen_card_i: -1,

      selected: false,
      is_multi: false,
      is_single: true,
      is_hard: false,

      matched_pairs: 0,
      num_pairs: 0,

      score_a: 0,
      score_b: 0,
      score_best: 0,
      turn: 0
    };
  }

  shuffleArray(A) {
    for (let i = A.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = A[i];
      A[i] = A[j];
      A[j] = temp;
    }
  }

  handle(event) {
    event.preventDefault();
    console.log("in submit");
    console.log(this.state);
    let tmp = this.state;
    tmp["selected"] = true;
    tmp["num_pairs"] = !tmp["is_hard"] ? 18 : 27;
    tmp["cards"] = [];
    for (let i = 0; i < tmp["num_pairs"]; ++i) {
      tmp["cards"].push({ value: i, revealed: false, matched: false });
      tmp["cards"].push({ value: i, revealed: false, matched: false });
    }
    this.shuffleArray(tmp["cards"]);
    this.setState(tmp);
  }

  handleClick(e) {
    let tmp = {
      cards: [],
      last_seen_card_i: -1,
      matched_pairs: 0,
      selected: false,
      is_multi: false,
      is_single: true,
      is_hard: false,
      num_pairs: 0,
      score_a: 0,
      score_b: 0,
      turn: 0
    };
    tmp["score_best"] = this.state.score_best;
    this.setState(tmp);
  }

  update(index) {
    if (this.state["cards"][index].revealed) {
      return;
    }

    let tmp = this.state;
    let cur_val = tmp["cards"][index].value;
    tmp["cards"][index].revealed = true;
    this.setState(tmp);
    console.log("cur_val", cur_val);
    if (tmp["last_seen_card_i"] >= 0) {
      console.log("has seen sth.");
      let prev_val = tmp["cards"][tmp["last_seen_card_i"]].value;
      console.log("last_seen_card_i", tmp["last_seen_card_i"], "  ", prev_val);
      if (cur_val == prev_val) {
        console.log("equal");
        tmp["cards"][tmp["last_seen_card_i"]].matched = true;
        tmp["cards"][index].matched = true;
        tmp["last_seen_card_i"] = -1;
        tmp["matched_pairs"] += 1;
        if (tmp["is_multi"]) {
          if (tmp["turn"] % 2 == 0) {
            tmp["score_a"] += 1;
          } else {
            tmp["score_b"] += 1;
          }
          tmp["score_best"] = Math.max(tmp["score_best"], tmp["score_a"]);
          tmp["score_best"] = Math.max(tmp["score_best"], tmp["score_b"]);
        } else {
          tmp["score_a"] += 1;
          tmp["score_best"] = Math.max(tmp["score_best"], tmp["score_a"]);
        }
        tmp["turn"] += 1;
        this.setState(tmp);
      } else {
        console.log("not equal");
        setTimeout(() => {
          tmp["cards"][tmp["last_seen_card_i"]].revealed = false;
          tmp["cards"][index].revealed = false;
          tmp["last_seen_card_i"] = -1;
          tmp["turn"] += 1;
          this.setState(tmp);
        }, 200);
      }
    } else {
      console.log("prepare next");
      tmp["last_seen_card_i"] = index;
      this.setState(tmp);
    }
    console.log(tmp);
  }

  toggleCheckbox(e) {
    console.log("start toggle");
    const name = e.target.name;
    const checked = e.target.checked;
    let tmp = this.state;
    tmp[name] = !tmp[name];
    if (name == "is_single") {
      tmp["is_multi"] = !tmp["is_multi"];
    }
    if (name == "is_multi") {
      tmp["is_single"] = !tmp["is_single"];
    }
    console.log(tmp);
    this.setState(tmp);
  }

  reset_game() {
    let tmp = this.state;
    tmp["cards"] = [];
    for (let i = 0; i < tmp["num_pairs"]; ++i) {
      tmp["cards"].push({ value: i, revealed: false, matched: false });
      tmp["cards"].push({ value: i, revealed: false, matched: false });
    }
    this.shuffleArray(tmp["cards"]);
    tmp["last_seen_card_i"] = -1;
    tmp["matched_pairs"] = 0;
    tmp["score_a"] = 0;
    tmp["score_b"] = 0;
    tmp["turn"] = 0;
    this.setState(tmp);
  }
  render() {
    if (!this.state.selected) {
      return (
        <div>
          <h1>Welcome to Memory Card Game</h1>
          <form>
            <div className="scontainer" />
            <div className="container">
              <span>
                <label className="checkbox">
                  <input
                    type="radio"
                    name="is_multi"
                    checked={this.state.is_multi}
                    onChange={this.toggleCheckbox}
                  />
                  <span className="checkbox-label">Multi player</span>
                </label>
                &nbsp;
                <label className="checkbox">
                  <input
                    type="radio"
                    name="is_single"
                    checked={this.state.is_single}
                    onChange={this.toggleCheckbox}
                  />
                  <span className="checkbox-label">Single Player</span>
                </label>
              </span>

              <hr />

              <label className="checkbox">
                <input
                  type="checkbox"
                  className="checkbox-control"
                  name="is_hard"
                  checked={this.state.is_hard}
                  onChange={this.toggleCheckbox}
                />
                <span className="checkbox-label">Hard Mode</span>
              </label>

              <hr />
            </div>
            <div className="scontainer" />
            <button className="registerbtn" onClick={this.handle}>
              Done
            </button>
          </form>
        </div>
      );
    } else if (this.state.matched_pairs == this.state.num_pairs) {
      if (this.state.is_single) {
        return (
          <div>
            You Win!!!
            <hr />
            <button className="registerbtn" onClick={this.handleClick}>
              Back to Menu
            </button>
          </div>
        );
      } else {
        return (
          <div>
            {this.state.score_a >= this.state.score_b ? (
              <div>
                {this.state.score_a == this.state.score_b
                  ? "Draw!!!"
                  : "Player A Wins!!!"}
              </div>
            ) : (
              "Player B Wins!!!"
            )}

            <button className="registerbtn" onClick={this.handleClick}>
              Back to Menu
            </button>
          </div>
        );
      }
    } else {
      return (
        <div>
          <button className="registerbtn" onClick={this.reset_game}>
            Reset Game
          </button>
          <button className="registerbtn" onClick={this.handleClick}>
            Back to Menu
          </button>
          <span>
            <strong>Current Score </strong>
          </span>&nbsp; (
          <span>
            <strong>Player1:</strong> {this.state.score_a}&nbsp;
          </span>
          {this.state.is_multi ? (
            <span>
              <strong>Player2:</strong> {this.state.score_b}
            </span>
          ) : (
            ""
          )})
          <div>
            <strong>Turn</strong> <span>{this.state.turn}</span>
          </div>
          {this.state.is_multi ? (
            <div>
              <strong>Current Player is</strong>{" "}
              {this.state.turn % 2 == 0 ? "A" : "B"}
            </div>
          ) : (
            ""
          )}
          <div>
            <Timer />
          </div>
          <div>
            <strong>Best Score: </strong> {this.state.score_best}
          </div>
          <hr />
          {this.state.cards.map((card, i) => {
            return card.revealed ? (
              <div
                className="card_up"
                key={i}
                onClick={e => {
                  if (!card.revealed) {
                    this.update(i);
                  }
                }}
              >
                <span>{card.value}</span>
              </div>
            ) : (
              <div
                className="card_down"
                key={i}
                onClick={e => {
                  if (!card.revealed) {
                    this.update(i);
                  }
                }}
              >
                <span>&nbsp;</span>
              </div>
            );
          })}
        </div>
      );
    }
  }
}
