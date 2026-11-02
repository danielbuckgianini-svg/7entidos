# Confirmação da primeira turma

Status: código preparado, não instalado e sem envio de emails reais. Não publicar a pré-venda antes de conectar o cadastro e testar esta operação.

## Instalação na conta correta

1. Entrar no Google usando contato@7entidos.com.br. Criar uma planilha privada chamada “7ENTIDOS — Primeira turma”. Não publicar nem compartilhar por link.
2. Em Extensões → Apps Script, colar o conteúdo de Confirmacoes.gs. Salvar e executar prepararPlanilha; autorizar acesso à planilha e envio de email. O script exige essa conta como remetente; não basta ter outro Gmail conectado ao ChatGPT.
3. Reabrir a planilha. Aparece o menu 7ENTIDOS. Não instalar gatilhos e não publicar este script como app da Web.
4. Antes de usar com compradores, executar os testes abaixo com seu próprio email e uma cópia de teste da planilha.

## Operação

O cadastro do site ainda precisa de receptor privado conectado. Enquanto isso não existir, não há coleta online funcionando. Este script não recebe cadastros da Internet.

Preencher uma linha com nome, email, WhatsApp opcional, EndToEndId do Pix recebido (32 caracteres) e valor 24,90. Conferir no extrato bancário, selecionar a linha, abrir 7ENTIDOS → Confirmar Pix da linha selecionada e enviar email. Confirmar a pergunta do menu. O sistema reserva uma das vagas e envia a confirmação automaticamente nessa ação.

Não escrever CONFIRMADO manualmente esperando disparo: o envio ocorre pelo menu, após a conferência. Não alterar nem reutilizar vagas confirmadas. Não copiar cadastros ou comprovantes para este repositório público.

## Verificações antes da ativação

- Envio pelo contato@7entidos.com.br e recebimento na caixa de entrada; conferir também spam.
- Repetir a ação na mesma linha não envia novamente.
- Mesmo Pix ou email em outra linha é recusado.
- Confirmar a vaga 101 é recusado, inclusive após erro de envio em uma vaga reservada.
- Erro de quota não envia nem marca pagamento.
- Estado ENVIANDO ou ENVIO INCERTO exige verificar a caixa de saída; não há reenvio automático que possa duplicar email.

## Limites

O script não consulta banco, não reconhece Pix automaticamente, não emite nota fiscal e não cria usuário no aplicativo. O aceite da API de email não comprova entrega na caixa de entrada. O limite de vagas controla confirmações nesta planilha; uma chave Pix aberta não impede transferências adicionais. A oferta deve exigir confirmação de disponibilidade antes do pagamento e encerrar ao atingir 100 vagas. Eventuais pagamentos excedentes precisam de tratamento manual.

Referências oficiais: https://developers.google.com/apps-script/reference/mail/mail-app e https://developers.google.com/apps-script/guides/menus
