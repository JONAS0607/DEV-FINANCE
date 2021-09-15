const modal = {
  open() {
    // abrir modal
    // adicionar a class active ao modal
    document.querySelector('.modal-overlay').classList.add('active');
  },
  close() {
    // fechar o modal
    // remover a class active do modal
    document.querySelector('.modal-overlay').classList.remove('active');
  },
};

//Guardando no Storage do Navegador
const Storage = {
  get() {
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || [];
  },
  set(transactions) {
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    );
  },
};

const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },
  remove(index) {
    Transaction.all.splice(index, 1);
    App.reload();
  },
  incomes() {
    let income = 0;
    //somar as entradas
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },
  expenses() {
    let expenses = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });

    //somar as saídas
    return expenses;
  },
  total() {
    let total = 0;

    total = this.incomes() + this.expenses();
    //entradas - saídas

    return total;
  },
};

const DOM = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    DOM.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense';
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `    
         <td class="description">${transaction.description}</td>
          <td class="${CSSclass}">${amount}</td>
          <td class="${CSSclass}">${transaction.date}</td>
          <td><img onclick="Transaction.remove(${index})" src="./img/minus.svg" alt="Remover Transação" </td>    
    `;
    return html;
  },
  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
  clearTransactions() {
    DOM.transactionContainer.innerHTML = '';
  },
};

const Utils = {
  formatAmount(value) {
    value = Number(value.replace(/\,\./g, '')) * 100;
    return value;
  },
  formatDate(date) {
    const splittedDate = date.split('-');
    const year = splittedDate[0];
    const moth = splittedDate[1];
    const day = splittedDate[2];
    return `${day}/${moth}/${year}`;
  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');
    value = Number(value) / 100;

    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return signal + value;
  },
};
const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },
  formateData() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();
    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Preencha todos os campos!');
    }
    // console.log(date);
  },
  saveTransaction(transaction) {
    Transaction.add(transaction);
  },
  clearFields() {
    Form.description.value = '';
    Form.amount.value = '';
    Form.date.value = '';
  },

  submit(event) {
    event.preventDefault();
    try {
      //verificando se as informações foram preenchidas
      Form.validateFields();
      //formatar os dados para salvar
      const transaction = Form.formateData();
      //salvar
      Form.saveTransaction(transaction);
      //apagar os dados do formulário
      Form.clearFields();
      //modal feche
      modal.close();
      //atualizar a aplicação
      // App.reload(); já temos no App.add()
    } catch (error) {
      //Pode colocar outra tela para aparecer o erro
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();

