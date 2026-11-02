/** Instalar como script vinculado a uma planilha PRIVADA do contato@7entidos.com.br.
 * Não publicar este script como app da Web. Não há endpoint público de aprovação.
 * O menu só envia após confirmação explícita do operador sobre o Pix no banco.
 */
const PREVENDA = Object.freeze({ remetente:'contato@7entidos.com.br', limite:100, valor:24.90, aba:'Pre-venda', campanha:'dezembro de 2026' });
const COLUNAS = ['Nome','Email','WhatsApp','Pix EndToEndId','Valor confirmado','Estado','Vaga','Confirmado em','Email enviado em'];
function onOpen() {
  SpreadsheetApp.getUi().createMenu('7ENTIDOS')
    .addItem('Preparar planilha', 'prepararPlanilha')
    .addItem('Confirmar Pix da linha selecionada e enviar email', 'confirmarPixSelecionado')
    .addToUi();
}
function exigirConta_() {
  if (Session.getEffectiveUser().getEmail().toLowerCase() !== PREVENDA.remetente) {
    throw new Error('Use a conta '+PREVENDA.remetente+' para que o envio saia do remetente correto.');
  }
}
function prepararPlanilha() {
  exigirConta_();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(PREVENDA.aba);
  if (!sheet) sheet = ss.insertSheet(PREVENDA.aba);
  if (sheet.getLastRow() > 0) { validarCabecalho_(sheet); return; }
  sheet.getRange(1,1,1,COLUNAS.length).setValues([COLUNAS]);
  sheet.setFrozenRows(1);
  sheet.getRange('A:D').setNumberFormat('@');
  sheet.getRange('F:F').setNumberFormat('@');
  sheet.getRange('E:E').setNumberFormat('0.00');
  sheet.autoResizeColumns(1,COLUNAS.length);
}
function validarCabecalho_(sheet) {
  const actual = sheet.getRange(1,1,1,COLUNAS.length).getValues()[0];
  if (COLUNAS.some((c,i)=>c!==actual[i])) throw new Error('Colunas inesperadas. Não alterar a ordem dos cabeçalhos.');
}
function validarInscricao_(row) {
  const name = String(row[0] || '').trim(), email=String(row[1] || '').trim();
  const transaction=String(row[3] || '').trim(), amount=Number(row[4]);
  if (!name || name.length>80) throw new Error('Preencha o nome (até 80 caracteres).');
  if (!/^[^\s@,;<>\r\n]+@[^\s@,;<>\r\n]+\.[^\s@,;<>\r\n]+$/.test(email) || email.length>254) throw new Error('Informe um único email válido.');
  if (!/^[A-Za-z0-9]{32}$/.test(transaction)) throw new Error('Informe o EndToEndId completo do Pix (32 letras/números), conferido no banco.');
  if (!Number.isFinite(amount) || Math.round(amount*100)!==2490) throw new Error('O valor confirmado precisa ser R$ 24,90.');
  return {name,email,transaction,amount};
}
function proximaVaga_(rows, selectedIndex, input) {
  const occupied = [];
  rows.forEach((r,i)=>{
    if (i===selectedIndex) return;
    if (String(r[3]).trim()===input.transaction) throw new Error('Este Pix já foi vinculado a outro cadastro.');
    if (r[6]) {
      if (String(r[1]).trim().toLowerCase()===input.email.toLowerCase()) throw new Error('Este email já tem uma vaga.');
      occupied.push(Number(r[6]));
    }
  });
  const existing = Number(rows[selectedIndex][6]);
  if (existing) {
    if (!Number.isInteger(existing) || existing<1 || existing>PREVENDA.limite || occupied.includes(existing)) throw new Error('Número de vaga inconsistente. Revise a planilha.');
    return existing;
  }
  for(let i=1;i<=PREVENDA.limite;i++) if(!occupied.includes(i)) return i;
  throw new Error('As 100 vagas já estão preenchidas. Não confirmar outro pagamento; trate eventual devolução diretamente com o comprador.');
}
function confirmarPixSelecionado() {
  exigirConta_();
  const ui=SpreadsheetApp.getUi(), ss=SpreadsheetApp.getActiveSpreadsheet(), range=ss.getActiveRange();
  if (!range || range.getSheet().getName()!==PREVENDA.aba || range.getRow()<2 || range.getNumRows()!==1) throw new Error('Selecione uma única linha de cadastro na aba Pre-venda.');
  const sheet=range.getSheet(), number=range.getRow(); validarCabecalho_(sheet);
  const snapshot=sheet.getRange(number,1,1,COLUNAS.length).getValues()[0];
  const input=validarInscricao_(snapshot);
  if(snapshot[8]) {ui.alert('O email desta vaga já foi enviado. Nenhum novo envio foi feito.');return;}
  if(snapshot[5]==='ENVIANDO' || snapshot[5]==='ENVIO INCERTO') throw new Error('Envio anterior incerto. Verifique a caixa de saída antes de alterar o estado ou tentar novamente.');
  const consent=ui.alert('Confirmar recebimento do Pix', 'Você conferiu no extrato bancário o Pix de R$ 24,90 de '+input.name+'?\nO email será enviado para '+input.email+'.\nUm comprovante sozinho não confirma o recebimento.',ui.ButtonSet.YES_NO);
  if(consent!==ui.Button.YES)return;
  const lock=LockService.getDocumentLock();lock.waitLock(30000);
  try {
    const row=sheet.getRange(number,1,1,COLUNAS.length).getValues()[0];
    if(JSON.stringify(row)!==JSON.stringify(snapshot))throw new Error('A linha mudou durante a confirmação. Confira e tente novamente.');
    const rows=sheet.getRange(2,1,sheet.getLastRow()-1,COLUNAS.length).getValues();
    const seat=proximaVaga_(rows,number-2,input);
    if(MailApp.getRemainingDailyQuota()<1)throw new Error('Limite de envio do Google atingido. Nenhum email enviado. Tente em outro dia.');
    // Reserva a vaga antes do envio. Falhas não liberam vaga já paga.
    row[5]='ENVIANDO';row[6]=seat;row[7]=row[7]||new Date();
    sheet.getRange(number,1,1,COLUNAS.length).setValues([row]);SpreadsheetApp.flush();
    try {
      const message=mensagem_(input.name,seat);
      MailApp.sendEmail({to:input.email,subject:message.subject,body:message.text,htmlBody:message.html,name:'7ENTIDOS',replyTo:PREVENDA.remetente});
      row[5]='CONFIRMADO';row[8]=new Date();
      sheet.getRange(number,1,1,COLUNAS.length).setValues([row]);SpreadsheetApp.flush();
    } catch(error) {
      // Não repetir automaticamente: o Google pode ter aceitado a mensagem.
      row[5]='ENVIO INCERTO';sheet.getRange(number,1,1,COLUNAS.length).setValues([row]);SpreadsheetApp.flush();
      throw new Error('A vaga foi reservada, mas o envio ficou incerto. Verifique o email enviado antes de qualquer nova tentativa.');
    }
  } finally {lock.releaseLock();}
  ui.alert('Pagamento confirmado, vaga reservada e email enviado.');
}
function escapar_(value) {return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function mensagem_(name,seat) {
  const reference='7E-202612-'+String(seat).padStart(3,'0');
  const subject='Pagamento confirmado — sua vaga no 7ENTIDOS está garantida';
  const text='Olá, '+name+'!\n\nConfirmamos o recebimento do seu Pix de R$ 24,90, em pagamento único.\n\nSua participação na primeira turma de 100 pessoas do lançamento comercial do 7ENTIDOS está garantida.\nReferência da confirmação: '+reference+'.\n\nO acesso dessa turma está previsto para dezembro de 2026. Enviaremos para este email as instruções de acesso e a data de liberação.\n\nGuarde esta confirmação junto ao comprovante do Pix. Se precisar falar conosco, responda a este email.\n\nA vida é feita de boas sensações.\nEquipe 7ENTIDOS\ncontato@7entidos.com.br';
  const html='<div style="background:#141018;color:#F5F1E8;padding:32px;font:16px/1.7 Arial,sans-serif;max-width:580px"><p style="letter-spacing:4px;color:#F4C51F">7ENTIDOS</p><h1 style="font:32px Georgia,serif">Sua vaga está garantida.</h1><p>Olá, '+escapar_(name)+'!</p><p>Confirmamos seu Pix de <strong>R$ 24,90, em pagamento único</strong>.</p><p>Você faz parte da primeira turma de <strong>100 pessoas</strong> do lançamento comercial do 7ENTIDOS.</p><p>Referência: <strong>'+reference+'</strong></p><p>O acesso dessa turma está previsto para <strong>dezembro de 2026</strong>. Enviaremos para este email a data de liberação e as instruções de acesso.</p><p>Guarde esta confirmação junto ao comprovante. Para falar conosco, responda a este email.</p><p style="color:#F4C51F;font:italic 21px Georgia,serif">A vida é feita de boas sensações.</p><p>Equipe 7ENTIDOS<br>contato@7entidos.com.br</p></div>';
  return {subject,text,html};
}
