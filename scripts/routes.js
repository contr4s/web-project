document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reportForm');
    const resultContainer = document.getElementById('resultContainer');

    loadTablesFromLocalStorage();

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const gymName = document.getElementById('gymName').value;

        const showRouteName = document.getElementById('showRouteName').checked;
        const showFirstTry = document.getElementById('showFirstTry').checked;
        const showDifficulty = document.getElementById('showDifficulty').checked;
        const showComment = document.getElementById('showComment').checked;

        generateTable(gymName, showRouteName, showFirstTry, showDifficulty, showComment);
    });

    function generateTable(gymName, showRouteName, showFirstTry, showDifficulty, showComment) {
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');

        let tableHTML = `<h2>${gymName}</h2>
                         <button class="deleteTable">Удалить таблицу</button>
                         <button class="addRow">Добавить строку</button>
                         <table border='1' class="reportTable"><tr>`;
        tableHTML += `<th>Удалить</th>
                      <th data-column="Категория трассы">Категория трассы</th>
                      <th data-column="Количество попыток">Количество попыток</th>`;
        
        if (showRouteName) tableHTML += `<th data-column="Название трассы">Название трассы</th>`;
        if (showFirstTry) tableHTML += `<th data-column="Пройдена с первой попытки">Пройдена с первой попытки</th>`;
        if (showDifficulty) tableHTML += `<th data-column="Оценочная сложность">Оценочная сложность</th>`;
        if (showComment) tableHTML += `<th data-column="Комментарий">Комментарий</th>`;
        tableHTML += `</tr>`;
        tableContainer.innerHTML = tableHTML;

        resultContainer.appendChild(tableContainer);
        const table = tableContainer.querySelector('.reportTable');
        addRowToTable(table, showRouteName, showFirstTry, showDifficulty, showComment);

        tableContainer.querySelector('.addRow').addEventListener('click', () => {
            addRowToTable(table, showRouteName, showFirstTry, showDifficulty, showComment);
            makeCellsEditable(table);
            saveTablesToLocalStorage();
        });

        tableContainer.querySelector('.deleteTable').addEventListener('click', () => {
            resultContainer.removeChild(tableContainer);
            saveTablesToLocalStorage();
        });

        makeCellsEditable(table);
        saveTablesToLocalStorage();
    }

    function addRowToTable(table, showRouteName, showFirstTry, showDifficulty, showComment) {
        const newRow = table.insertRow(-1);
        
        newRow.innerHTML = `
            <td><button class="deleteRow">Удалить</button></td>
            <td class="editable" data-column="Категория трассы"></td>
            <td class="editable" data-column="Количество попыток"></td>
            ${showRouteName ? '<td class="editable" data-column="Название трассы"></td>' : ''}
            ${showFirstTry ? '<td data-column="Пройдена с первой попытки"></td>' : ''}
            ${showDifficulty ? '<td class="editable" data-column="Оценочная сложность"></td>' : ''}
            ${showComment ? '<td class="editable" data-column="Комментарий"></td>' : ''}
        `;
        
        newRow.querySelector('.deleteRow').addEventListener('click', () => {
            table.deleteRow(newRow.rowIndex);
            saveTablesToLocalStorage();
        });

        makeCellsEditable(table);
        
        Array.from(newRow.cells).forEach(cell => {
                validateCell(cell);
        });
    }

    function makeCellsEditable(table) {
        const cells = table.querySelectorAll('.editable');
        
        cells.forEach(cell => {
            cell.addEventListener('dblclick', () => {
                let inputElement;

                switch (cell.dataset.column) {
                    case "Категория трассы":
                        inputElement = createSelect(['5b', '5c', '6a', '6b', '6c', '7a', '7b'], cell.innerText);
                        break;
                    case "Количество попыток":
                        inputElement = createInput('number', cell.innerText);
                        break;
                    case "Оценочная сложность":
                        inputElement = createSelect(['5b', '5c', '6a', '6b', '6c', '7a', '7b'], cell.innerText);
                        break;
                    case "Название трассы":
                    case "Комментарий":
                        inputElement = createInput('text', cell.innerText);
                        break;
                    default:
                        return;
                }

                cell.innerHTML = '';
                cell.appendChild(inputElement);

                inputElement.focus();

                inputElement.addEventListener('blur', () => {
                    cell.innerText = inputElement.value;
                    validateCell(cell);
                    saveTablesToLocalStorage(); 
                });
                
                inputElement.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        inputElement.blur();
                    }
                });
            });
            
            cell.addEventListener('blur', () => {
                validateCell(cell);
                cell.setAttribute('contenteditable', 'false');
            });
            
            cell.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    cell.blur();
                }
            });
        });
    }

    function createInput(type, value) {
      const input = document.createElement('input');
      input.type = type;
      input.value = value;
      return input;
    }

    function createSelect(options, selectedValue) {
      const select = document.createElement('select');
      options.forEach(optionValue => {
          const option = document.createElement('option');
          option.value = optionValue;
          option.textContent = optionValue;
          if (optionValue === selectedValue) option.selected = true;
          select.appendChild(option);
      });
      return select;
    }

    function validateCell(cell) {
      const columnName = cell.dataset.column;

      switch (columnName) {
          case "Количество попыток":
              if (!cell.innerText || cell.innerText <= 0) {
                  cell.classList.add('invalid');
              } else {
                  cell.classList.remove('invalid');
                  const firstTryCell = Array.from(cell.parentNode.cells).find(cell => cell.dataset.column === "Пройдена с первой попытки");
                  if (firstTryCell) {
                      firstTryCell.innerText = (cell.innerText == 1) ? 'Да' : 'Нет';
                  }
              }
              break;

          case "Комментарий", "Пройдена с первой попытки":
              cell.classList.remove('invalid');
              break;

          default:
              if (!cell.innerText) {
                  cell.classList.add('invalid');
              } else {
                  cell.classList.remove('invalid');
              }
              break;
      }
  }

    function saveTablesToLocalStorage() {
      const tablesData = [];
      const containers = resultContainer.querySelectorAll('.table-container');

      containers.forEach(container => {
          const tableData = [];
          const rows = container.querySelectorAll('.reportTable tr');

          rows.forEach((row, index) => {
              if (index === 0) return;

              const rowData = {};
              
              Array.from(row.cells).forEach((cell) => { 
                const columnName = cell.dataset.column; 
                if (columnName) {
                    rowData[columnName] = cell.textContent; 
                }
              });

              tableData.push(rowData);
          });
          
          tablesData.push({ gymName: container.querySelector("h2").innerText, rows: tableData });
      });

      localStorage.setItem("tables", JSON.stringify(tablesData));
    }

    function loadTablesFromLocalStorage() {
    const savedTablesData = localStorage.getItem("tables");
    if (!savedTablesData) return;

    const tablesData = JSON.parse(savedTablesData);

    tablesData.forEach(tableInfo => {
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');

        let tableHTML = `<h2>${tableInfo.gymName}</h2>
                         <button class="deleteTable">Удалить таблицу</button>
                         <button class="addRow">Добавить строку</button>
                         <table border='1' class="reportTable"><tr>
                         <th>Удалить</th>`;
        
        const columnNames = Object.keys(tableInfo.rows[0] || {});
        columnNames.forEach(columnName => {
            if (columnName) {
                tableHTML += `<th data-column="${columnName}">${columnName}</th>`;
            }
        });

        tableHTML += `</tr>`;
        tableContainer.innerHTML = tableHTML;
        resultContainer.appendChild(tableContainer);

        const table = tableContainer.querySelector('.reportTable');
        tableInfo.rows.forEach(rowData => {
            addRowToTable(table, 
                          columnNames.includes('Название трассы'),
                          columnNames.includes('Пройдена с первой попытки'),
                          columnNames.includes('Оценочная сложность'),
                          columnNames.includes('Комментарий'));
            
            Array.from(table.rows[table.rows.length - 1].cells).forEach((cell, index) => {
                const columnName = cell.dataset.column;
                if (rowData[columnName]) {
                    cell.innerText = rowData[columnName];
                }
            });
            
            Array.from(table.rows[table.rows.length - 1].cells).forEach(cell => {
                validateCell(cell);
            });
        });

        tableContainer.querySelector('.addRow').addEventListener('click', () => {
            addRowToTable(table,
                          columnNames.includes('Название трассы'),
                          columnNames.includes('Пройдена с первой попытки'),
                          columnNames.includes('Оценочная сложность'),
                          columnNames.includes('Комментарий'));
            makeCellsEditable(table);
            saveTablesToLocalStorage();
        });

        tableContainer.querySelector('.deleteTable').addEventListener('click', () => {
            resultContainer.removeChild(tableContainer);
            saveTablesToLocalStorage();
        });

        makeCellsEditable(table);
    });
}
});