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
const transaction = [
  {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021',
  },
  {
    id: 2,
    description: 'Criação WebSite',
    amount: 500000,
    date: '23/01/2021',
  },
  {
    id: 3,
    description: 'Agua',
    amount: -5000,
    date: '23/01/2021',
  },
];
const Transaction = {
  incomes() {
    //somar as entradas
  },
  expenses() {
    //somar as saídas
  },
  total() {
    //entradas - saídas
  },
};

const DOM = {
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction();
  },

  innerHTMLTransaction() {
    const html = `
    
         <td class="${transaction.description}">Luz</td>
          <td class="expense">${transaction.amount}</td>
          <td class="date">${transaction.date}</td>
          <td><img src="./img/minus.svg" alt="remover transação" </td>
    
    `;
    return html;
  },
};
