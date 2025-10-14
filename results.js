class ResultsPage {
  constructor() {
    this.yes = parseInt(localStorage.getItem('yesVotes') || '0', 10);
    this.no = parseInt(localStorage.getItem('noVotes') || '0', 10);

    this.totalEl = document.getElementById('totalVotes');
    this.yesPctEl = document.getElementById('yesPercent');
    this.noPctEl = document.getElementById('noPercent');
    this.yesVotesEl = document.getElementById('yesVotes');
    this.noVotesEl = document.getElementById('noVotes');
    this.yesBar = document.getElementById('yesBar');
    this.noBar = document.getElementById('noBar');

    this.render();
  }

  render() {
    const total = this.yes + this.no;
    const yesPct = total > 0 ? (this.yes / total) * 100 : 0;
    const noPct = total > 0 ? (this.no / total) * 100 : 0;

    this.totalEl.textContent = String(total);
    this.yesPctEl.textContent = `${yesPct.toFixed(1)}%`;
    this.noPctEl.textContent = `${noPct.toFixed(1)}%`;
    this.yesVotesEl.textContent = `${this.yes} votes`;
    this.noVotesEl.textContent = `${this.no} votes`;

    // Animate bars
    requestAnimationFrame(() => {
      this.yesBar.style.width = `${yesPct}%`;
      this.noBar.style.width = `${noPct}%`;
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ResultsPage();
});
