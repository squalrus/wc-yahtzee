import {LitElement, html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import {Score} from './score';

@customElement('my-yahtzee')
export class Yahtzee extends LitElement {
  static override styles = css`
    :host {
      background-color: #00000020;
      border-radius: 0.5em;
      display: block;
      font-family: system-ui;
      font-size: 16px;
      margin: 0 auto;
      max-width: 470px;
      min-width: 400px;
      padding: 6px 20px 20px 20px;
      width: 50%;
    }

    h1 {
      line-height: 1em;
      text-align: center;
    }

    table {
      border-collapse: collapse;
      text-align: left;
      width: 100%;
    }

    table + table {
      margin-top: 24px;
    }

    thead {
      background-color: #00000020;
    }

    thead th {
      text-transform: uppercase;
    }

    tr td {
      padding-top: 6px;
    }

    .label {
      width: 40%;
    }

    th.label {
      padding: 4px 24px;
    }

    th.score {
      padding: 4px 24px;
    }

    thead th.label:first-child,
    thead th.score:first-child {
      padding-left: 4px;
    }

    thead th.label:last-child,
    thead th.score:last-child {
      padding-right: 4px;
    }

    td.rule {
      font-size: 11px;
      padding-left: 24px;
      padding-right: 24px;
    }

    .score {
      width: 20%;
    }

    .score input[type='number'] {
      float: right;
      width: 50px;
    }

    input[type='number'] {
      border: none;
      font-size: 18px;
      padding: 3px;
    }

    input[type='number']:valid {
      background-color: #ffffff;
    }

    input[type='number']:invalid {
      background-color: lightpink;
    }

    input[type='number'][readonly] {
      background-color: #f9f9f9;
    }
  `;

  @state()
  scores: Array<Score> = [
    {
      id: 'u-1s',
      label: 'Aces <span style="float:right">🎲 = 1</span>',
      score: 0,
      rule: 'Count and add only aces',
      min: 0,
      max: 6,
      step: 1,
    },
    {
      id: 'u-2s',
      label: 'Twos <span style="float:right">🎲 = 2</span>',
      score: 0,
      rule: 'Count and add only twos',
      min: 0,
      max: 10,
      step: 2,
    },
    {
      id: 'u-3s',
      label: 'Threes <span style="float:right">🎲 = 3</span>',
      score: 0,
      rule: 'Count and add only threes',
      min: 0,
      max: 15,
      step: 3,
    },
    {
      id: 'u-4s',
      label: 'Fours <span style="float:right">🎲 = 4</span>',
      score: 0,
      rule: 'Count and add only fours',
      min: 0,
      max: 20,
      step: 4,
    },
    {
      id: 'u-5s',
      label: 'Fives <span style="float:right">🎲 = 5</span>',
      score: 0,
      rule: 'Count and add only fives',
      min: 0,
      max: 25,
      step: 5,
    },
    {
      id: 'u-6s',
      label: 'Sixes <span style="float:right">🎲 = 6</span>',
      score: 0,
      rule: 'Count and add only sixes',
      min: 0,
      max: 30,
      step: 6,
    },
    {
      id: 'l-3oak',
      label: '3 of a Kind',
      score: 0,
      rule: 'Add total of all dice',
      min: 0,
      max: 30,
      step: 1,
    },
    {
      id: 'l-4oak',
      label: '4 of a Kind',
      score: 0,
      rule: 'Add total of all dice',
      min: 0,
      max: 30,
      step: 1,
    },
    {
      id: 'l-fullhouse',
      label: 'Full House',
      score: 0,
      rule: 'Score 25',
      min: 0,
      max: 25,
      step: 25,
    },
    {
      id: 'l-smallstraight',
      label: 'SM Straight',
      score: 0,
      rule: 'Score 30',
      min: 0,
      max: 30,
      step: 30,
    },
    {
      id: 'l-largestraight',
      label: 'LG Straight',
      score: 0,
      rule: 'Score 40',
      min: 0,
      max: 40,
      step: 40,
    },
    {
      id: 'l-yahtzee',
      label: 'YAHTZEE',
      score: 0,
      rule: 'Score 50',
      min: 0,
      max: 50,
      step: 50,
    },
    {
      id: 'l-chance',
      label: 'Chance',
      score: 0,
      rule: 'Score total of all dice',
      min: 0,
      max: 30,
      step: 1,
    },
  ];

  @state()
  totalScore = 0;

  @state()
  upperScore = 0;

  @state()
  lowerScore = 0;

  @state()
  bonusScore = 0;

  private _calculateTotals() {
    let upper = 0;
    let lower = 0;
    let total = 0;

    this.scores.forEach((element) => {
      upper = upper + (element.id.startsWith('u') ? element.score : 0);
      lower += element.id.startsWith('l') ? element.score : 0;
      total += element.score;
    });

    this.bonusScore = upper >= 63 ? 35 : 0;

    this.upperScore = upper + this.bonusScore;
    this.lowerScore = lower;

    this.totalScore = this.upperScore + this.lowerScore;
  }

  private _updateScore(e: Event) {
    const element = e.target as HTMLTextAreaElement;
    const value = element?.value;
    const id = element?.id;

    const number = parseFloat(value);
    const score = !Number.isNaN(number) ? number : 0;

    const index = this.scores.findIndex((x) => x.id == id);
    if (index !== -1) {
      this.scores[index].score = score;
    }

    this._calculateTotals();
  }

  private _renderTableHead(label: String, rule: String, score: String) {
    return html` <thead>
      <tr>
        <th class="label">${label}</th>
        <th class="rule">${rule}</th>
        <th class="score">${score}</th>
      </tr>
    </thead>`;
  }

  private _renderTotalRow(label: String, value: Number) {
    return html`<tr>
      <th class="label">${label}</th>
      <th class="rule"></th>
      <td class="score">
        <input type="number" value="${value}" readonly />
      </td>
    </tr>`;
  }

  private _renderRow(row: Score) {
    return html` <tr>
      <th class="label">${unsafeHTML(String(row.label))}</th>
      <td class="rule">${row.rule}</td>
      <td class="score">
        <input
          type="number"
          @keyup="${this._updateScore}"
          @change="${this._updateScore}"
          id="${row.id}"
          min="${row.min !== undefined ? row.min : false}"
          max="${row.max !== undefined ? row.max : false}"
          step="${row.step !== undefined ? row.step : false}"
        />
      </td>
    </tr>`;
  }

  override render() {
    return html` <h1>Yahtzee 🎲🎲🎲🎲🎲</h1>
      <table>
        ${this._renderTableHead('UPPER SECTION', 'How to score', 'Score')}
        <tbody>
          ${this.scores
            .filter((score) => score.id.startsWith('u'))
            .map((item) => {
              return this._renderRow(item);
            })}
          ${this._renderTotalRow('BONUS', this.bonusScore)}
          ${this._renderTotalRow('UPPER SCORE', this.upperScore)}
        </tbody>
      </table>

      <table>
        ${this._renderTableHead('LOWER SECTION', 'How to score', 'Score')}
        <tbody>
          ${this.scores
            .filter((score) => score.id.startsWith('l'))
            .map((item) => {
              return this._renderRow(item);
            })}
          ${this._renderTotalRow('LOWER SCORE', this.lowerScore)}
        </tbody>
      </table>

      <table>
        ${this._renderTableHead('TOTAL', '', 'Score')}
        <tbody>
          ${this._renderTotalRow('UPPER SCORE', this.upperScore)}
          ${this._renderTotalRow('LOWER SCORE', this.lowerScore)}
          ${this._renderTotalRow('GRAND TOTAL', this.totalScore)}
        </tbody>
      </table>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-yahtzee': Yahtzee;
  }
}
