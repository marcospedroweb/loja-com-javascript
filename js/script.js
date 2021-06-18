//dinheiro na carteira

// Produtos iniciais
let produtos = [
    {
        nome: 'Caneta',
        unidades: 20,
        valor: 2
    },
    {
        nome: 'Lapis',
        unidades: 0,
        valor: 1.5
    },
    {
        nome: 'Papel',
        unidades: 30,
        valor: 6
    }
]

// Produtos adicionados (base)
let novoNome = 'novoNome';
let novaUnidades = 0;
let novoPreco = 10;


window.onload = function () {
    //Modo
    let modoCliente = document.querySelector('#client');
    let modoAdmin = document.querySelector('#admin');

    //carteira
    let carteira = document.querySelector('#carteira');
    let carteiraDinheiro = 1000;

    //botões
    let botoes = document.querySelectorAll('.comprar');
    let adicionarProduto = document.querySelector('#adicionar-produto');
    //html dos dados
    let produtosNomes = document.querySelectorAll('.produto-nome');
    let produtosUnidades = document.querySelectorAll('.produto-unidades');
    let produtosPreco = document.querySelectorAll('.produto-preco');
    botoesComprar();//Adiciona ou re-adiciona o evento nos botões

    //Erro e sucesso na compra div
    let divErro = document.querySelector('.alert-danger');
    let divSuccess = document.querySelector('.alert-success');

    //Erro e sucesso na compra msg
    let compraErro = document.querySelector('#msg-erro');
    let compraSuccess = document.querySelector('#msg-compra');

    //Compras recentes
    let botaoRecentes = document.querySelector('.dropdown');
    let listaCompras = document.querySelector('.lista-compras');



    // html da linha da body da tabela
    let tabelaBody = document.querySelector('#linhaBody');

    let novoProdutoIndex = 3; //produto adicionado

    //Evento de trocar modo
    modoCliente.addEventListener('click', function () {
        if (modoCliente.checked) {
            aparecerCliente();
        }
    })

    modoAdmin.addEventListener('click', function () {
        if (modoAdmin.checked) {
            aparecerAdmin();
        }
    })

    //Função para adicionar/remover botoes ao alterar modo
    function aparecerAdmin() {
        if (adicionarProduto.classList.contains('d-none')) {
            adicionarProduto.classList.remove('d-none');
            carteira.classList.add('d-none');
            botaoRecentes.classList.add('d-none');
            botoes.forEach(function (btn) {
                btn.disabled = true;
            });
        }
    }

    //Função para adicionar/remover botoes ao alterar modo
    function aparecerCliente() {
        if (!(adicionarProduto.classList.contains('d-none'))) {
            adicionarProduto.classList.add('d-none');
            carteira.classList.remove('d-none');
            botaoRecentes.classList.remove('d-none');
            botoes.forEach(function (btn) {
                btn.disabled = false;
                btn.classList.remove('d-none');
            });
        }
    }

    //Evento de botão adicionar produto
    adicionarProduto.addEventListener('click', function () {

        if (produtos[3] == undefined) {
            produtos.push({
                nome: adicionarNome(), //chama função para verificar e adivicionar valor
                unidades: adicionarUnidades(), //chama função para verificar e adivicionar valor
                valor: adicionarValor() //chama função para verificar e adivicionar valor
            });
            adicionarDadosTabela(novoProdutoIndex); //adiciona todos os dados em uma nova linha da tabela, argumento: index do produto adicionado
        }
        else {
            novoProdutoIndex++;
            produtos.push({
                nome: adicionarNome(),
                unidades: adicionarUnidades(),
                valor: adicionarValor()
            });
            adicionarDadosTabela(novoProdutoIndex); //adiciona todos os dados em uma nova linha da tabela, argumento: index do produto adicionado
        }

        //Funções para verificar e adicionar valores ao objeto
        function adicionarNome() {
            do
                novoNome = prompt('Digite o nome do produto Ex: Caderno');
            while (novoNome.length == 0 || !(isNaN(novoNome))); //Verifica se o nome do produto é valido
            return novoNome; //Se for valido, retorna o nome para o objeto
        }
        function adicionarUnidades() {
            do
                novaUnidades = parseInt(prompt('Digite a quantidade de produtos Ex: 10'))
            while (novaUnidades == 0 || isNaN(novaUnidades));//Verifica se a quatnidade de estoque do produto é valido
            return novaUnidades; //Se for valido, retorna a quantidade de estoque para o objeto
        }
        function adicionarValor() {
            do
                novoPreco = parseFloat(prompt(`Digite o valor do produto Ex: 20.5`))
            while (novaUnidades == 0 || isNaN(novoPreco));//Verifica se o valor do produto é valido
            return novoPreco; //Se for valido, retorna o preço do protudo para o objeto
        }
    });

    //Função para adicionar/atualizar evento nos botões comprar 
    function botoesComprar() {
        //Evento dos botões de comprar
        botoes.forEach(function (btn, index) {
            btn.addEventListener('click', function () {
                if (produtos[index].unidades == 0 || carteiraDinheiro == 0) {
                    //Verifica se o usuario tem "dinheiro" virtual disponivel ou se há estoque de tal produto
                    //Div de situação da compra
                    if (divSuccess.classList.contains('d-block'))//remove msg de sucesso
                        divSuccess.classList.replace('d-block', 'd-none');
                    if (divErro.classList.contains('d-none'))//adiciona msg de erro
                        divErro.classList.replace('d-none', 'd-block');

                    //Tipo de erro da compra
                    (produtos[index].unidades == 0) ? (
                        compraErro.textContent = `ERRO na compra! Não há mais estoque de "${produtos[index].nome}"`
                    ) : (
                        compraErro.textContent = `ERRO na compra! Você não tem saldo o suficiente para realizar a compra. Seu saldo: R$ ${carteiraDinheiro}`
                    );

                }
                else {
                    if (divErro.classList.contains('d-block'))//remove msg de erro
                        divErro.classList.replace('d-block', 'd-none');

                    if (divSuccess.classList.contains('d-none')) {//adiciona e remove msg de sucesso na compra
                        compraSuccess.textContent = `Compra realizada com sucesso!`;
                        divSuccess.classList.replace('d-none', 'd-block');
                        setTimeout(
                            function () {
                                divSuccess.classList.replace('d-block', 'd-none');
                            }, 2000
                        );
                    }
                    produtos[index].unidades--;
                    adicionarRecentes(produtos[index].nome, carteiraDinheiro, produtos[index].valor);
                    atualizarTabela(produtos[index].valor);//Argumento: valor do produto
                }
            });
        });
    }

    //Função para atualizar a tabela com o novo produto
    function adicionarDadosTabela(index) {
        //Cria e adiciona todos os dados em uma nova linha na tabela

        //Cria a linha
        let linha = document.createElement('tr');
        linha.classList.add('text-center');

        //Cria a coluna de N°Produto
        let thProduto = document.createElement('th');//Cria o numero do produto
        thProduto.textContent = index;
        thProduto.classList.add('text-start');//Coloca a classe 

        //Cria a coluna de nome do produto
        let tdNome = document.createElement('td');//Cria a coluna nome do produto
        tdNome.textContent = produtos[index].nome; //Adiciona texto ou valor do produto
        tdNome.classList.add('produto-nome');//coloca classe

        //Cria a coluna de estoque do produto
        let tdEstoque = document.createElement('td');// cria a coluna estoque do produot
        tdEstoque.textContent = `${produtos[index].unidades} unidades`; //Adiciona texto ou valor do produto
        tdEstoque.classList.add('produto-unidades');//coloca classe

        //Cria a coluna de preço do produto
        let tdPreco = document.createElement('td');// cria a coluna preço do produto 
        tdPreco.textContent = `R$ ${produtos[index].valor}`; //Adiciona texto ou valor do produto
        tdPreco.classList.add('produto-preco');//coloca classe

        let tdButton = document.createElement('td'); //cria o td do botao comprar
        let buttonInner = document.createElement('button'); //cria o botao comprar
        //Cria a coluna de botão comprar
        if (modoAdmin.checked) {

            buttonInner.textContent = 'Comprar'; //Adiciona o texto
            buttonInner.classList.add('btn', 'btn-primary', 'comprar', 'd-none');//coloca classe
        }


        tdButton.appendChild(buttonInner);//adiciona o botão ao td

        linha.appendChild(thProduto);//A linha recebe coluna com n° do novo produto
        linha.appendChild(tdNome);//A linha recebe coluna com nome do novo produto
        linha.appendChild(tdEstoque);//A linha recebe coluna com quantidade de estoque do novo produto
        linha.appendChild(tdPreco);//A linha recebe coluna com o preço do novo produto
        linha.appendChild(tdButton);//A linha recebe coluna com o botão de comprar
        tabelaBody.appendChild(linha);//Adiciona a linha com todas as colunas a tabela

        //Renova todo o html dos dados
        atualizarBotoes();//Renova todo o html dos dados
        function atualizarBotoes() {
            //"Adiciona" os novos botões de compra e novos td com classes
            botoes = document.querySelectorAll('.comprar'); // Atualiza o botões de compra
            adicionarProduto = document.querySelector('#adicionar-produto'); // Atualiza as classe com colunas do nome dos produtos
            //html dos dados
            produtosNomes = document.querySelectorAll('.produto-nome'); // Atualiza o
            produtosUnidades = document.querySelectorAll('.produto-unidades');// Atualiza o
            produtosPreco = document.querySelectorAll('.produto-preco');// Atualiza o
            botoesComprar();//Atualiza os botões de compra e "adiciona" evento no novo botão de comprar
        };
    }

    //Função para atualizar os dados quando algum produto for comprado ou adicionado
    function atualizarTabela(precoProduto) {
        // Atualiza os nomes, estoques, valores dos produtos
        produtosNomes.forEach(function (nomeProduto, index) {
            nomeProduto.textContent = produtos[index].nome;
        })

        produtosUnidades.forEach(function (un, index) {
            un.textContent = `${produtos[index].unidades} unidades`;
        })

        produtosPreco.forEach(function (preco, index) {
            preco.textContent = `R$ ${produtos[index].valor}`;
        })

        // Atualiza a carteira
        carteira.textContent = `Carteira: R$ ${atualizarCarteira(precoProduto)} `;
    }

    //Função para subtrair a quantidade de "dinheiro" na carteira com o valor do produto 
    function atualizarCarteira(valor) {
        carteiraDinheiro -= valor;
        return carteiraDinheiro //Retorna a quantidade de "dinheiro" na carteira depois da compra
    }

    //Função para adicionar as comprar recentes
    function adicionarRecentes(nome, carteira, valor) {
        if (document.querySelector('.nadaCompra').classList.contains('d-block')) {
            document.querySelector('.nadaCompra').classList.replace('d-block', 'd-none');
            document.querySelector('.comprou').classList.replace('d-none', 'd-block');
        }

        if (listaCompras.classList.contains('d-none'))
            listaCompras.classList.replace('d-none', 'd-block')

        let ul = document.createElement('ul');
        ul.classList.add('list-inline', 'text-start');

        let liNome = document.createElement('li');
        liNome.classList.add('list-inline-item', 'fw-bold', 'text-success', 'py-1');
        liNome.textContent = nome;

        let liCarteira = document.createElement('li');
        liCarteira.classList.add('list-inline-item', 'fw-bold');

        let spanSuccess = document.createElement('span');
        spanSuccess.classList.add('text-success');
        spanSuccess.textContent = `R$ ${carteira}`;

        let spanDanger = document.createElement('span');
        spanDanger.classList.add('text-danger');
        spanDanger.textContent = ` - R$ ${valor}`;

        liCarteira.appendChild(spanSuccess);
        liCarteira.appendChild(spanDanger);

        ul.appendChild(liNome);
        ul.appendChild(liCarteira);

        listaCompras.appendChild(ul);
    }
};