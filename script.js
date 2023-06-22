document.getElementById('transferButton').addEventListener('click', function () {
    // Verificar se a área de transferência é suportada pelo navegador
    if (!navigator.clipboard) {
        alert("A área de transferência não é suportada pelo seu navegador.");
        return;
    }

    // Obter os dados da área de transferência
    navigator.clipboard.readText()
        .then(function (text) {
            // Dividir o texto em linhas
            var lines = text.split('\n');

            // Preencher os inputs com os dados do Excel
            for (var i = 0; i < Math.min(lines.length, 10); i++) {
                var cells = lines[i].split('\t');
                for (var j = 0; j < Math.min(cells.length, 6); j++) {
                    var inputId = 'cell' + i + j;
                    var input = document.getElementById(inputId);
                    if (input) {
                        input.value = cells[j];
                    }
                }
            }
        })
        .catch(function (error) {
            console.error('Falha ao ler a área de transferência: ', error);
        });
});



function dentro_dos_padroes(button) {
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByClassName('cell');
    
    //Alterando o background
     for (var j = 0; j < Math.min(cells.length, 6); j++) {
        cells[j].classList.add("ok");   
        cells[j].classList.remove("erro");     
    }

    var texto = ' → Verificação realizada, protocolo dentro dos padrões NCC. ';
    var data = getFormattedDate();
    texto = data + texto + cells[5].value + ' às ' + cells[1].value + '.'
    navigator.clipboard.writeText(texto)

}

function fora_dos_padroes(button) {
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByClassName('cell');
    var texto = ' → Verificação realizada, protocolo anexado em relatório para análise da supervisão. ';
    var data = getFormattedDate();
    texto = data + texto + cells[5].value + ' às ' + cells[1].value + '.'
    navigator.clipboard.writeText(texto)
    console.log(texto)

    //Alterando o background
    for (var j = 0; j < Math.min(cells.length, 6); j++) {
        cells[j].classList.add("erro");        
        cells[j].classList.remove("ok");
    }
}


document.getElementById('cleanButton').addEventListener('click', function () {
    var cells = document.querySelectorAll(".cell");
    console.log(cells)
    cells.forEach(element => {
        element.value = ""
        element.classList.remove("ok");
        element.classList.remove("erro");
        //console.log(element)
    });
});



function getFormattedDate() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // Os meses em JavaScript são baseados em zero, então adicionamos 1
    var year = currentDate.getFullYear();

    // Formatação dos zeros à esquerda, se necessário
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    //var formattedDate = day + '/' + month + '/' + year;
    var formattedDate = day + '/' + month;
    return formattedDate;
}


function copiar_atalho(button) {
    var row = button.parentNode;
    var cells = row.getElementsByClassName('atalho');
    var texto = cells[0].value
    navigator.clipboard.writeText(texto)
    console.log(cells)
}