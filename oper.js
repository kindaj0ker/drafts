"use strict";

//Fake data
class User {
  constructor(fName, lName, bDay, email, password) {
    // this.id = uniqid();
    this.fName = fName;
    this.lN = lName;
    this.bDay = bDay;
    this.email = email;
    this.password = password;
    this.cards = [];
    this.transactions = [
      //   {
      //     group: "",
      //     cardId: "",
      //     transactionId: "",
      //     amount: "",
      //     currency: "",
      //     date: "",
      //     type: "",
      //     from: "",
      //     to: "",
      //   },
    ];
  }
  createNewCard(cardPlan, ID, expired = "", currency = "$") {
    const data = new Map([
      ["id", `${ID}`], // CHANGE BACK ON LIBRARY UNIQID
      ["plan", `${cardPlan}`],
      ["date", `${new Date().toISOString().split("T")[0]}`],
      ["currency", `${currency}`],
      ["expired", ``],
    ]);
    const card = Object.fromEntries(data);
    this.cards.push(card);
  }
  createNewTransaction(group, amount, currency, type, cardId) {
    const data = new Map([
      ["group", `${group}`], // other data needs to be added
      ["amount", `${amount}`],
      ["currency", `${currency}`],
      ["type", `${type}`],
      ["cardID", `${cardId}`],
    ]);
    const transaction = Object.fromEntries(data);
    this.transactions.push(transaction);
  }
}
//Functions call
const userPeter = new User(
  "Peter",
  "Jackson",
  "2000-02-02",
  "peterJ@gmail.com",
  "IamPeter00!"
);
userPeter.createNewCard("VIP", "1", "", "$");
userPeter.createNewCard("PLUS", "2", "", "$");

userPeter.createNewTransaction("other", "130", "$", "deposit", "1");
userPeter.createNewTransaction("loan", "500", "$", "deposit", "1");
userPeter.createNewTransaction("other", "100", "$", "withdrawal", "1");
userPeter.createNewTransaction("receive", "700", "$", "deposit", "1");
userPeter.createNewTransaction("loan", "100", "$", "deposit", "1");
userPeter.createNewTransaction("savings", "100", "$", "withdrawal", "1");
userPeter.createNewTransaction("grocery", "60", "$", "withdrawal", "1");
userPeter.createNewTransaction("other", "140", "$", "withdrawal", "1");
userPeter.createNewTransaction("utilities", "50", "$", "withdrawal", "1");
userPeter.createNewTransaction("grocery", "310", "$", "withdrawal", "1");
userPeter.createNewTransaction("other", "10", "$", "deposit", "1");
userPeter.createNewTransaction("other", "13", "$", "deposit", "1");
userPeter.createNewTransaction("grocery", "28", "$", "withdrawal", "1");
userPeter.createNewTransaction("grocery", "108", "$", "withdrawal", "1");
userPeter.createNewTransaction("clothes", "450", "$", "withdrawal", "1");
userPeter.createNewTransaction("savings", "10", "$", "withdrawal", "1");
userPeter.createNewTransaction("savings", "15", "$", "withdrawal", "1");
userPeter.createNewTransaction("receive", "100", "$", "deposit", "2");
userPeter.createNewTransaction("receive", "20000", "$", "deposit", "2");
userPeter.createNewTransaction("utilities", "100", "$", "withdrawal", "2");
userPeter.createNewTransaction("grocery", "35", "$", "withdrawal", "2");
userPeter.createNewTransaction("grocery", "80", "$", "withdrawal", "2");
userPeter.createNewTransaction("clothes", "120", "$", "withdrawal", "2");
userPeter.createNewTransaction("savings", "50", "$", "withdrawal", "2");
userPeter.createNewTransaction("savings", "140", "$", "withdrawal", "2");
userPeter.createNewTransaction("other", "36", "$", "withdrawal", "2");
userPeter.createNewTransaction("send", "60", "$", "withdrawal", "2");
userPeter.createNewTransaction("grocery", "29", "$", "withdrawal", "2");
userPeter.createNewTransaction("grocery", "41", "$", "withdrawal", "2");
userPeter.createNewTransaction("clothes", "35", "$", "deposit", "2");
userPeter.createNewTransaction("send", "10", "$", "withdrawal", "2");
userPeter.createNewTransaction("savings", "15", "$", "withdrawal", "2");

const curUser = userPeter; // get curuser from local storage via email

//Show Balance

const showBalance = function (transactions) {
  return transactions.reduce((total, cur) => {
    if (cur.type === "withdrawal") {
      return (total -= Number(cur.amount));
    } else return (total += Number(cur.amount));
  }, 0);
};

//Reveal cards
const cardsZone = document.querySelector(".user-cards__zone");
const revealCards = function (curUser) {
  //Show balance of every card
  curUser.cards.forEach((card) => {
    const curId = card.id;
    const curCardTrans = curUser.transactions.filter((t) => t.cardID === curId);
    const balance = showBalance(curCardTrans);
    const cardHtml = `
    <div class="total-card__info">
      <div class="user-card" id=${card.id}>
        <div class="card-wrapper">
          <img class="user-card__img" src="./${card.plan.toUpperCase()}.png" />
        </div>
        <div class="card-info__block">
          <p class="card-number">#1 card</p>
          <p class="card-plan">${card.plan.toUpperCase()} plan</p>
          <p class="expiry-date">expired by ${card.expired}</p>
          <p class="transactions-init">Show transactions↓</p>
        </div>
        <div class="balance-info__block">
          <h3>Balance</h3>
          <p class="balance">${balance + " " + card.currency}</p>
        </div>
      </div>
    </div>`;

    cardsZone.insertAdjacentHTML("afterbegin", cardHtml);
  });
};
revealCards(curUser);

//Sort transactions
const sortTransactions = function (curCard) {
  const transactions = curUser.transactions.filter(function (transaction) {
    return transaction.cardID === curCard;
  });
};

//Reveal card transactions block
const revealTransactions = function (transactions, curTarget) {
  const cardTransactionsContainer = curTarget.closest(".total-card__info");
  const transastions = `<div class="sorting-box">
      <div>
        <input class="radio" type="radio" id="all" name="trans" value="all" checked/>
        <label for="trans">All transactions</label>
      </div>
      <div>
        <input class="radio" type="radio" id="withdrawal" name="trans" value="withdrawals" />
        <label for="trans">Withdrawals</label>
      </div>
      <div>
        <input class="radio" type="radio" id="deposit" name="trans" value="deposits"/>
        <label for="trans">Deposits</label>
      </div>
    </div>
    <div class="transactions">
    </div>
                        `;
  cardTransactionsContainer.insertAdjacentHTML("beforeEnd", transastions);
  const cardTransactionsBlock =
    cardTransactionsContainer.querySelector(".transactions");
  transactions.forEach((t) => {
    const htmlString = `<div class="transaction ${t.type}">
            <span class="transaction-group">
              <img class="oper-group__img" src="./${t.group}.png" />
            </span>
            <div class="transaction-name--date__block">
              <span class="transaction--name">AMAZON</span>
              <span class="transaction--date">Today</span>
            </div>
            <div class="transaction-amount">
              <span class="transaction-currency">${t.currency}</span>
              <span class="transaction--amount">${t.amount}</span>
            </div>
          </div>`;
    cardTransactionsBlock.insertAdjacentHTML("beforeend", htmlString);
  });
};

// Show/close transactions block
const openTransactions = document.addEventListener("click", function (e) {
  const curTarget = e.target;
  const curCard = curTarget.closest(".user-card");
  if (curTarget.classList.contains("transactions-init")) {
    //Toggle open class to define that transactions info is open
    curCard.classList.toggle("open");
    const closeTransactions = curTarget.closest(".transactions-init");
    if (curCard.classList.contains("open")) {
      //Change text to close transactions
      closeTransactions.textContent = "Close transactions information ↑";

      //Add transactions info
      const curCardID = curCard.id;
      sortTransactions(curCardID);
      revealTransactions(curUser.transactions, curTarget);
      const radioBtns = document.getElementsByName("trans");
      radioBtns.forEach((btn) =>
        btn.addEventListener("click", sortingTrans(curCard, btn))
      );
    } else {
      //Close block
      closeTransactions.textContent = "Show transactions↓";
      const transactionsBlock = curTarget.closest(".total-card__info");
      const transactions = transactionsBlock.querySelector(".transactions");
      const radioBtns = transactionsBlock.querySelector(".sorting-box");
      transactionsBlock.removeChild(transactions);
      transactionsBlock.removeChild(radioBtns);
    }
  }
});
//Add transaction info function

//Time-out function
const timer = document.querySelector(".timer");
let time = 60;
const countDownTimerFunc = setInterval(
  function () {
    const min = toString(Math.trunc(`${time / 60}`));
    const sec = toString(`${time % 60}`);
    timer.textContent = `${min}:${sec}`;
    time--;
  },
  1000,
  time
);
//Sorting functions
const sortingTrans = function (curCard, btn) {
  if (btn.checked === true && !(btn.id === "all")) {
    const type = btn.id;
    showSortedOperations(curCard, type);
  }
};

//Sorting box
const showSortedOperations = function (curCard, type) {
  curUser.transactions.filter(function (t) {
    return t.cardID === curCard && t.type === type;
  });
};
// const logOutTimer = setTimeout(function () {
//   if (min === "0" && sec === "0") {
//     console.log(lpggedout);
//   }
// }, time);
// window.addEventListener("click", countDownTimerFunc);
