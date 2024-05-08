document.getElementById('transferButton').addEventListener('click', function () {
    // Verificar se a área de transferência é suportada pelo navegador
    if (!navigator.clipboard) {
        alert("A área de transferência não é suportada pelo seu navegador.");
        return;
    }

    var qtd_linhas = contarElementosTR()
    // Obter os dados da área de transferência
    navigator.clipboard.readText()
        .then(function (text) {
            // Dividir o texto em linhas
            var lines = text.split('\n');

            // Preencher os inputs com os dados do Excel
            for (var i = 0; i < Math.min(lines.length, qtd_linhas); i++) {
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
    alert_copiado()

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
    alert_copiado()
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
    let notificacao = document.getElementById("notificacao")
    notificacao.innerHTML = '<div class="alert alert-danger" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Dados apagados!</strong> </div>'
    window.setTimeout(function () {
        notificacao.innerHTML = ""
    }, 3000);
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
    alert_copiado()
}


function alert_copiado() {
    let notificacao = document.getElementById("notificacao")
    notificacao.innerHTML = '<div class="alert alert-primary" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> <strong>Informação copiada com sucesso!</strong> </div>'
    window.setTimeout(function () {
        notificacao.innerHTML = ""
    }, 3000);
}


function link_protocolo(protocolo) {
    var largura = 1400; // Largura da nova janela em pixels
    var altura = 400; // Altura da nova janela em pixels
    var url = `http://adm.fasternet.com.br/tarefas_mostra.php?tarefa=${protocolo.value}`

    var left = (screen.width - largura) / 2;
    var top = (screen.height - altura) / 2;

    var nova_guia = document.getElementById('btnradio1')
    if (nova_guia.checked){
        window.open(url, '_blank', 'width=' + largura + ',height=' + altura + ',left=' + left + ',top=' + top);
    }else{
        window.open(url, 'width=' + largura + ',height=' + altura + ',left=' + left + ',top=' + top);
    }


    
}




// PEGANDO OS DADOS DO JSON

var dados
var nomes
var nomes_form
var protocolos
var protocolos_form


fetch('arq.JSON').then(response => response.json()) // ou response.text() se o arquivo não for um JSON válido
    .then(data => {
        dados = data[0];
        nomes = dados['nomes'];
        nomes_form = dados['nomes_form'];
        protocolos = dados['protocolos'];
        protocolos_form = dados['protocolos_form'];
        usuarios = dados['usuarios'];
        //console.log(nomes);
    })
    .catch(error => {
        // Trate quaisquer erros que possam ocorrer durante o processo
        console.error('Ocorreu um erro:', error);
    });





function link_formulario(button) {
    var row = button.parentNode.parentNode;
    var cells = row.getElementsByClassName('cell');
    console.log(cells)
    //var protocolo = retornarMaiorValor(cells[4].value, cells[5].value)
    //console.log(protocolo)

    var data_pro = cells[0].value
    console.log(data_pro)
    data_pro = transformarDataFormato(data_pro)
    console.log(data_pro)

    var nome_op = cells[5].value
    // var index_nome = nomes.indexOf(nome_op)
    // nome_op = nomes_form[index_nome]
    console.log(nome_op)

    var codigo = cells[2].value
    codigo = codigo.replace(" ", "+");


    // var index_cod = protocolos.indexOf(codigo)
    // codigo = protocolos_form[index_cod]
    console.log(codigo)

    // var protocolo = retornarMaiorValor(cells[3].value, cells[4].value)
    var protocolo = cells[3].value
    console.log(protocolo)

    var nome_verificador = document.getElementById("Verificador").value
    console.log(nome_verificador)
    /*
    var index_verif = usuarios.indexOf(nome_verificador)
    nome_verificador = nomes_form[index_verif]
    */

    //var nome_verificador=""

    if (cells[0].classList.contains('ok')) {
        var msg_erro = "Dentro dos padrões"
        // var link = `https://docs.google.com/forms/d/e/1FAIpQLSe3dQNujFwgZG-rdxdrqoF8i8NHb3BYH8yLZXgW7KF93gp_iA/viewform?usp=pp_url&entry.1247819090=Protocolo+dentro+dos+padr%C3%B5es+NCC&entry.1594760899=${msg_erro}&entry.479460712=${protocolo}&entry.1168750468=${codigo}&entry.150123755=${data_pro}&entry.670394469=${nome_verificador}&entry.1721606117=${nome_op}`
        var link = `https://docs.google.com/forms/d/e/1FAIpQLSeP8o1eHy_sQ9MWjEODxWbDFDLr1CT1s4k8DMTMb_Wdqn3Amw/viewform?usp=pp_url&entry.735788671=Protocolo+dentro+dos+padr%C3%B5es+NCC&entry.1236168930=${msg_erro}&entry.2105843070=${protocolo}&entry.1677983886=${codigo}&entry.1244179175=${data_pro}&entry.1948729703=${nome_verificador}&entry.695741277=${nome_op}`
    } else if (cells[0].classList.contains('erro')) {
        var msg_erro = ""
        var link = `https://docs.google.com/forms/d/e/1FAIpQLSeP8o1eHy_sQ9MWjEODxWbDFDLr1CT1s4k8DMTMb_Wdqn3Amw/viewform?usp=pp_url&entry.735788671=${""}&entry.1236168930=${msg_erro}&entry.2105843070=${protocolo}&entry.1677983886=${codigo}&entry.1244179175=${data_pro}&entry.1948729703=${nome_verificador}&entry.695741277=${nome_op}`
    } else {
        var msg_erro = ""
        var link = `https://docs.google.com/forms/d/e/1FAIpQLSeP8o1eHy_sQ9MWjEODxWbDFDLr1CT1s4k8DMTMb_Wdqn3Amw/viewform?usp=pp_url&entry.735788671=${""}&entry.1236168930=${msg_erro}&entry.2105843070=${protocolo}&entry.1677983886=${codigo}&entry.1244179175=${data_pro}&entry.1948729703=${nome_verificador}&entry.695741277=${nome_op}`
    }


    var largura = 1400; // Largura da nova janela em pixels
    var altura = 400; // Altura da nova janela em pixels    

    var left = (screen.width - largura) / 2;
    var top = (screen.height - altura) / 2;
    
    var nova_guia = document.getElementById('btnradio1')
    if (nova_guia.checked){
        window.open(link, '_blank', 'width=' + largura + ',height=' + altura + ',left=' + left + ',top=' + top);
    }else{
        window.open(link, 'width=' + largura + ',height=' + altura + ',left=' + left + ',top=' + top);
    }
}



function retornarMaiorValor(num1, num2) {
    if (num1 > num2) {
        return num1;
    } else {
        return num2;
    }
}


function transformarDataFormato(data) {
    // Divide a string da data em dia, mês e ano
    var partes = data.split('/');

    // Inverte a ordem para ano, mês, dia e une novamente com "-"
    var novaData = partes[2] + '-' + partes[1] + '-' + partes[0];

    return novaData;
}


function addLinhas() {
    var tabela = document.getElementById("linhas")
    var qtd_linhas = contarElementosTR()
    tabela.innerHTML = tabela.innerHTML + `<tr> <td><span class="num_posi"></span></td> <td><input type="text" class="cell" id="cell${qtd_linhas}0"></td> <td><input type="text" class="cell" id="cell${qtd_linhas}1"></td> <td><input type="text" class="cell" id="cell${qtd_linhas}2"></td> <td><input type="text" class="cell" id="cell${qtd_linhas}3" ondblclick="link_protocolo(this)"></td> <td><input type="text" class="cell" id="cell${qtd_linhas}4"></td> <td><input type="text" class="cell" id="cell${qtd_linhas}5"></td> <td><button class="btnn btn btn-warning" name="dentro_dos_padroes" onclick="dentro_dos_padroes(this)">Dentro dos padrões</button></td> <td><button class="btnn btn btn-warning" name="fora_dos_padroes" onclick="fora_dos_padroes(this)">Fora dos padrões</button></td> <td><button class="btnn btn btn-info" onclick="link_formulario(this)">Formulario</button></td> </tr>`
    atualizar_posi()
}



function contarElementosTR() {
    var div = document.getElementById('linhas');
    if (div) {
        var trElements = div.getElementsByTagName('tr');
        return trElements.length;
    } else {
        //console.log('A div com o ID ' + divId + ' não foi encontrada.');
        return 0;
    }
}

function atualizar_posi(){
    var campos = document.querySelectorAll('[class=num_posi]')
    cont = 1;
    campos.forEach(element => {
        element.innerHTML = cont+" - ";
        cont++ ;
    });
}


function alterarMouse(){
    var tipo = window.document.getElementById("mouse").value
    
    if (tipo=="1"){
        document.getElementsByTagName("body")[0].style.cursor = "url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto";
        console.log(tipo)
    }

    if (tipo=="2"){
        document.getElementsByTagName("body")[0].style.cursor = "url('https://cursor.style/cursors/2068-zombie-cursor.svg'), auto"; 
        console.log(tipo)
    }

    if (tipo=="3"){
        document.getElementsByTagName("body")[0].style.cursor = "url('https://cursor.style/cursors/2078-blue-pointer-cursor.svg'), auto";                 
        console.log(tipo)
    }

    if (tipo=="4"){
        document.getElementsByTagName("body")[0].style.cursor = "url('https://cursor.style/cursors/1848-mouse-and-owl-cursor.svg'), auto";                 
        console.log(tipo)
    }

    if (tipo=="5"){
        document.getElementsByTagName("body")[0].style.cursor = "url('https://cursor.style/cursors/2047-harry-potter-cursor.svg'), auto";                 
        console.log(tipo)
    }
         
}





// Abri o Como usar após 5 segundos
function abrirLinkAposCincoSegundos(url) {
    setTimeout(function() {
      window.open(url, "_blank");
    }, 5000);
  }

  
  //abrirLinkAposCincoSegundos("https://ncc.drozbase.cx/docs/Verificacao-de-protocolos-p0h3nf5c80fssyep3yjaccebg1?utm_source=share");
