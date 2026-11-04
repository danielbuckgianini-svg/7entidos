/* Robô da planilha · Jornada dos 7entidos (v5) */
const CONVITE = '7s0a4653';
const ABAS = {
  'Painel': null,
  'Participantes': ['ID','Início','Nome','Celular','Situação','Nota (0 a 10)','Perfil','As 7 forças','Atualizado em','Quer ir para a Fase 2?','Contato informado'],
  'Respostas': ['Data','ID','Nome','Celular','Nota (0 a 10)','Perfil','As 7 forças','Visão','Audição','Tato','Olfato','Paladar','Equilíbrio','Noção do corpo','Tempo por sentido (s)','As 5 descobertas'],
  'Pedidos para continuar': ['Data','ID','Nome','Celular','Contato informado','Perfil','Nota (0 a 10)','Atendimento'],
  'Avaliação da Jornada': ['Data','ID','Nome','Celular','Nota (0 a 10)','Perfil','1. Como foi','2. Tamanho','3. Opções tinham a ver','4. Sentido mais gostoso','5. Mapa tem a sua cara','6. As 5 descobertas','7. Indicaria','Comentário','5 coisas (concordância 0 a 10)'],
  'Convites': ['Data','ID','Nome','Celular','Perfil'],
  'Fase 2': ['Data','ID','Nome','Celular','Média das notas','Os seus 10','Notas por sentido','3 experiências','Sensação (0 a 10)'],
  'Fase 3': ['Data','ID','Nome','Celular','Lembranças (favorita de cada sentido)','O que se repete','Sensação (0 a 10)']
};

function configurar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone('America/Sao_Paulo');
  Object.keys(ABAS).forEach(function (nome, i) {
    let sh = ss.getSheetByName(nome) || ss.insertSheet(nome, i);
    const cab = ABAS[nome];
    if (cab) {
      sh.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#0A0F24').setFontColor('#F9CB39');
      sh.setFrozenRows(1);
    }
  });
  const p = ss.getSheetByName('Painel');
  p.clear();
  p.getRange('A1:B1').setValues([['Jornada dos 7entidos · Painel', '']]).setFontWeight('bold').setFontSize(14);
  p.getRange('A3:B12').setValues([
    ['Começaram', '=COUNTA(Participantes!A2:A)'],
    ['Completaram a Fase 1', '=COUNTUNIQUE(Respostas!B2:B)'],
    ['Nota média (0 a 10)', '=IFERROR(ROUND(AVERAGE(Participantes!F2:F),1),"-")'],
    ['Querem ir para a Fase 2', '=COUNTA(\'Pedidos para continuar\'!A2:A)'],
    ['Pedidos pendentes', '=COUNTIF(\'Pedidos para continuar\'!H2:H,"Pendente")'],
    ['Taxa de conclusão', '=IFERROR(TEXT(B4/B3,"0%"),"-")'],
    ['Pesquisas finalizadas', '=COUNTA(\'Avaliação da Jornada\'!A2:A)'],
    ['Convites enviados', '=COUNTA(Convites!A2:A)'],
    ['Fizeram a Fase 2', '=COUNTA(\'Fase 2\'!A2:A)'],
    ['Fizeram a Fase 3', '=COUNTA(\'Fase 3\'!A2:A)']
  ]);
  p.getRange('A3:A12').setFontWeight('bold');
  p.getRange('D2').setValue('Perfis mais comuns').setFontWeight('bold');
  p.getRange('D3').setFormula('=IFERROR(QUERY(Participantes!G2:G,"select G, count(G) where G <> \'\' group by G order by count(G) desc label count(G) \'Pessoas\'",0),"Ainda ninguém completou")');
  p.getRange('G2').setValue('Notas (0 a 10)').setFontWeight('bold');
  p.getRange('G3').setFormula('=IFERROR(QUERY(Participantes!F2:F,"select F, count(F) where F is not null group by F order by F label count(F) \'Pessoas\'",0),"Ainda sem notas")');
  p.setColumnWidth(1, 220); p.setColumnWidth(4, 220);
  const sobra = ss.getSheetByName('Página1') || ss.getSheetByName('Sheet1');
  if (sobra && ss.getSheets().length > 1) ss.deleteSheet(sobra);
}

function limpo(v) {
  v = v == null ? '' : String(v);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.c !== CONVITE) return resposta('negado');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const agora = new Date();
    if (d.tipo === 'fase2' || d.tipo === 'fase3' || /^fase[23]_/.test(d.tipo)) {
      const part = ss.getSheetByName('Participantes');
      const ids = part.getLastRow() > 1 ? part.getRange(2, 1, part.getLastRow() - 1, 1).getValues().map(function (r) { return r[0]; }) : [];
      const ln = ids.indexOf(d.id) + 2;
      const rot = d.tipo === 'fase2' ? 'fez a Fase 2' : d.tipo === 'fase3' ? 'fez a Fase 3' : d.tipo === 'fase2_inicio' ? 'começou a Fase 2' : d.tipo === 'fase3_inicio' ? 'começou a Fase 3' : 'na Fase 2: sentido ' + Math.min(7, (d.feitos || 0) + 1) + ' de 7';
      if (ln >= 2) { part.getRange(ln, 5).setValue(rot); part.getRange(ln, 9).setValue(agora); }
      else part.appendRow([limpo(d.id), agora, limpo(d.nome), limpo(d.cel), rot, '', '', '', agora, '', '']);
      if (d.tipo === 'fase2') ss.getSheetByName('Fase 2').appendRow([agora, limpo(d.id), limpo(d.nome), limpo(d.cel), d.media, (d.dez || []).map(limpo).join('\n'), (d.notas || []).map(limpo).join('\n'), (d.experiencias || []).map(limpo).join('\n'), d.sensacao]);
      if (d.tipo === 'fase3') ss.getSheetByName('Fase 3').appendRow([agora, limpo(d.id), limpo(d.nome), limpo(d.cel), (d.lembrancas || []).map(limpo).join('\n'), (d.padroes || []).map(limpo).join('\n'), d.sensacao]);
      return resposta('ok');
    }
    if (d.tipo === 'convite') {
      ss.getSheetByName('Convites').appendRow([agora, limpo(d.id), limpo(d.nome), limpo(d.cel), limpo(d.perfil)]);
      return resposta('ok');
    }
    if (d.tipo === 'avaliacao') {
      ss.getSheetByName('Avaliação da Jornada').appendRow([agora, limpo(d.id), limpo(d.nome), limpo(d.cel), d.nota, limpo(d.perfil)]
        .concat((d.avaliacao || []).map(limpo)).concat([limpo(d.comentario), (d.insights || []).map(limpo).join('\n')]));
      return resposta('ok');
    }
    const part = ss.getSheetByName('Participantes');
    const ids = part.getLastRow() > 1 ? part.getRange(2, 1, part.getLastRow() - 1, 1).getValues().map(function (r) { return r[0]; }) : [];
    const linha = ids.indexOf(d.id) + 2;
    const situacao = d.tipo === 'pedido' ? 'quer ir para a Fase 2' : (d.tipo === 'completa' ? 'completou' : (d.tipo === 'progresso' ? 'no sentido ' + Math.min(7, (d.feitos || 0) + 1) + ' de 7' : 'começou'));
    if (linha < 2) {
      part.appendRow([limpo(d.id), agora, limpo(d.nome), limpo(d.cel), situacao, d.nota == null ? '' : d.nota, limpo(d.perfil), limpo(d.forcas), agora, d.tipo === 'pedido' ? 'Sim' : 'Não', limpo(d.pede && d.pede.contato)]);
    } else {
      const atual = part.getRange(linha, 5).getValue();
      const sit = (atual === 'quer ir para a Fase 2' || (atual === 'completou' && d.tipo !== 'pedido')) ? atual : situacao;
      part.getRange(linha, 3, 1, 9).setValues([[limpo(d.nome), limpo(d.cel), sit, d.nota == null ? '' : d.nota, limpo(d.perfil), limpo(d.forcas), agora, (d.tipo === 'pedido' || atual === 'quer ir para a Fase 2') ? 'Sim' : 'Não', limpo(d.pede && d.pede.contato)]]);
    }
    if (d.tipo === 'completa') {
      ss.getSheetByName('Respostas').appendRow([agora, limpo(d.id), limpo(d.nome), limpo(d.cel), d.nota, limpo(d.perfil), limpo(d.forcas)]
        .concat((d.escolhas || []).map(limpo)).concat([(d.tempos || []).join(' · '), (d.descobertas || []).map(limpo).join('\n')]));
    }
    if (d.tipo === 'pedido') {
      ss.getSheetByName('Pedidos para continuar').appendRow([agora, limpo(d.id), limpo(d.nome), limpo(d.cel), limpo(d.pede && d.pede.contato), limpo(d.perfil), d.nota, 'Pendente']);
      const eu = Session.getEffectiveUser().getEmail();
      if (eu) MailApp.sendEmail(eu, '🔔 Jornada dos 7entidos: ' + d.nome + ' quer ir para a Fase 2',
        d.nome + ' pediu para ir para a Fase 2.\n\nCelular: ' + d.cel + '\nPerfil: ' + d.perfil + '\nNota da sensação: ' + d.nota + '\n\nPlanilha: ' + ss.getUrl());
    }
    return resposta('ok');
  } catch (err) {
    return resposta('erro');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return resposta('Robô da Jornada dos 7entidos funcionando.'); }
function resposta(t) { return ContentService.createTextOutput(t); }
