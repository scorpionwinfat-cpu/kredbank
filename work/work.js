'use strict';
const $ = id => document.getElementById(id);
const steps = {
 sources:['Сначала — полный набор релевантных источников','Первый набор из шести корпоративных Telegram-каналов принят в DEV. Это не полный перечень источников. Почта и банковские подпапки требуют отдельного подключения.','На выходе','Материал с источником, датой и статусом проверки. Повторная доставка не создаёт дубликат.'],
 knowledge:['У каждого факта есть область действия','Банк, продукт, площадка, регион, сумма и срок — отдельные признаки. Старые версии сохраняются; сомнительное прочтение остаётся на проверке.','На выходе','Версия условия с доказательством, сроком актуальности и понятными ограничениями.'],
 matching:['Используем сведения, которые уже есть в лиде','Название, тип БГ, закон, сумма и срок извлекаются из заголовка. ИНН, закупка, регион и документы дополняются из карточки.','На выходе','Список банков и маршрутов с причинами исключения и недостающими данными. Первое применение уже проверено на реальном кейсе.'],
 offers:['Сравниваем предложения для одной заявки','Теледок, ВБЦ, YoFin и прямой банк могут дать разные условия. Публичная ставка, фактическая цена и вознаграждение агента учитываются отдельно.','На выходе','Сопоставимые предложения с ценой, сроком, документами и доступностью. Подключение живых расчётов — следующая веха.'],
 outcomes:['Результат возвращается в знания','Отказ, запрос документов, одобрение и выдача связываются с заявкой и маршрутом. История собственных выдач дополняет объявленные условия.','На выходе','Проверяемая практика и коммерческий результат. Исполнение заявки принадлежит модулю Автовыдача.']
};
function selectStep(key){
 document.querySelectorAll('[data-step]').forEach(b=>{const yes=b.dataset.step===key;b.classList.toggle('selected',yes);b.setAttribute('aria-selected',String(yes));});
 const content=steps[key];$('process-detail').replaceChildren();
 for(let i=0;i<4;i+=2){const d=document.createElement('div');const b=document.createElement('b');b.textContent=content[i];d.append(b,document.createTextNode(content[i+1]));$('process-detail').append(d);}
}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>selectStep(b.dataset.step)));
const banks=[
 {id:'lev',name:'Левобережный',symbol:'Л',routes:['Теледок','ВБЦ','YoFin','SimpleFinance'],note:'Маршруты показаны как структура будущей карточки; актуальный доступ и расчёт по каждому маршруту подтверждаются отдельно.',news:'YoFin описывает YFC-скидку с примером по Левобережному. Это предложение конкретной площадки; оно не переносится автоматически на другие маршруты.',url:'https://t.me/yofinpro/2138',date:'14.10.2026'},
 {id:'nbs',name:'НБС',symbol:'Н',routes:['YoFin','SimpleFinance'],note:'Сравнивайте правила каждой площадки отдельно. Неоднозначность исходного текста требует ручной проверки.',news:'YoFin объявил маршрут в НБС с охватом всех регионов. Применимость к конкретной заявке и базу ставки «от 3,5%» нужно подтвердить.',url:'https://t.me/yofinpro/2136',date:'12.10.2026'},
 {id:'psb',name:'ПСБ',symbol:'П',routes:['Теледок','ВБЦ','YoFin','SimpleFinance'],note:'Продукт, маршрут, регион и клиент определяют доступность. Агентские акции не являются тарифом клиента.',news:'Октябрьская акция ВБЦ разделяет коммерческие и законодательно регулируемые гарантии. Условия вознаграждения требуют проверки по типу заявки.',url:'https://t.me/vbcworkon/1319',date:'01.10.2026'},
 {id:'ural',name:'Уралсиб',symbol:'У',routes:['Теледок','ВБЦ','YoFin','SimpleFinance'],note:'В карточке сохраняются отдельные региональные и суммовые ограничения для каждого источника и маршрута.',news:'Уралсиб входит в опубликованный список октябрьской агентской акции ВБЦ. Участие банка в акции не подтверждает одобрение заявки.',url:'https://t.me/vbcworkon/1319',date:'01.10.2026'}
];
let currentBank='lev',currentTab='overview';
function el(tag,cls,content){const n=document.createElement(tag);if(cls)n.className=cls;if(content!==undefined)n.textContent=content;return n;}
function bankList(){
 const query=$('bank-search').value.toLocaleLowerCase('ru');$('bank-list').replaceChildren();
 const visible=banks.filter(b=>(b.name+' '+b.routes.join(' ')).toLocaleLowerCase('ru').includes(query));
 for(const b of visible){const button=el('button','bank-row'+(currentBank===b.id?' selected':''));button.type='button';button.setAttribute('aria-label','Карточка банка '+b.name);const label=el('span','bank-label');label.append(el('strong','',b.name),el('small','',b.routes.join(' · ')));button.append(el('span','bank-symbol',b.symbol),label,el('span','','↗'));button.addEventListener('click',()=>{currentBank=b.id;currentTab='overview';bankList();bankCard();});$('bank-list').append(button);}
 if(!visible.length)$('bank-list').append(el('p','inline-note','Совпадений в демонстрационном наборе нет. Полный реестр ещё не подключён к странице.'));
}
function bankCard(){
 const b=banks.find(b=>b.id===currentBank),card=$('bank-card');card.replaceChildren();
 const top=el('div','bank-card-top');top.append(el('span','bank-symbol',b.symbol),el('span','status-tag outline','Проект карточки банка'));
 card.append(top,el('h2','',b.name),el('div','card-subtitle','Банк → продукты → маршруты → условия → практика'));
 const tabs=el('div','card-tabs');for(const [id,label] of [['overview','Карточка'],['routes','Маршруты'],['news','Изменения'],['crm','Bitrix']]){const t=el('button',id===currentTab?'selected':'',label);t.type='button';t.addEventListener('click',()=>{currentTab=id;bankCard();});tabs.append(t);}card.append(tabs);
 const facts=el('div','card-facts');
 const entries=currentTab==='overview'?[['Идентичность','ИНН / ОГРН / номер ЦБ'],['Статус','Действующий / исторический'],['Регуляторный допуск','Минфин 44-ФЗ + дата проверки'],['Отношения с BFG','Договор / контакт / доступ']]:currentTab==='routes'?[['Продукты','44-ФЗ · 223-ФЗ · 615-ПП · КБГ'],['Правила','Регион, опыт, сумма, срок'],['Цена клиенту','Расчёт по заявке'],['Экономика агента','По маршруту и договору']]:currentTab==='news'?[['Последний источник',b.date],['Тип изменения','Новость площадки / на проверку'],['Связи','Карточка банка + площадки'],['История','Источник, дата, предыдущая версия']]:[['Банк','Существующая карточка компании'],['Данные','Управляемые поля BankMind'],['Лента','Одна запись со связями'],['Повторная доставка','Одна новость — без дублей']];
 for(const [k,v] of entries){const f=el('div','');f.append(el('small','',k),el('b','',v));facts.append(f);}card.append(facts);
 const pills=el('div','');for(const route of b.routes)pills.append(el('span','route-pill',route));card.append(pills);
 const callout=el('div','card-callout',currentTab==='news'?b.news:currentTab==='crm'?'План: обновлять только управляемые поля банка, сохранять ручные сведения и публиковать существенные изменения со связью с банком и площадкой. Публикации в Bitrix с этой страницы не выполняются.':b.note);
 if(currentTab==='news'){const a=el('a','',' Открыть источник ↗');a.href=b.url;a.target='_blank';a.rel='noopener';callout.append(a);}card.append(callout);
}
$('bank-search').addEventListener('input',bankList);
document.querySelectorAll('[data-bank]').forEach(b=>b.addEventListener('click',()=>{currentBank=b.dataset.bank;currentTab='news';bankList();bankCard();$('bank-card').scrollIntoView({behavior:'smooth',block:'center'});}));
const roleCopy={manager:'Рабочее место менеджера: видеть условия каждого банка и площадки, проверять ограничения и объяснять выбор по заявке.',agent:'Рабочее место агента: сравнивать цену клиенту и собственное вознаграждение по каждому маршруту. Начисления и выплаты подключаются на следующих этапах.',client:'Клиентский сценарий: передать параметры заявки, сравнить подходящие предложения и видеть документы и статус. Сейчас показана схема будущего кабинета.'};
$('role').addEventListener('change',()=>{const role=$('role').value;$('role-description').textContent=roleCopy[role];document.querySelectorAll('.agent-economics').forEach(e=>e.classList.toggle('hidden',role==='client'));});
function parseLeadTitle(title){
 const parts=title.split('/').map(x=>x.trim());if(parts.length!==6)throw new Error('Нужны 6 частей: компания / тип БГ / закон / сумма / часовой пояс / срок.');
 const [company,purpose,law,rawAmount,zone,rawTerm]=parts;
 if(!company)throw new Error('Укажите название компании.');
 const purposeNames={'БГИК':'Исполнение контракта','БГУ':'Участие','БГГО':'Гарантийные обязательства','БГВА':'Возврат аванса'};
 if(!purposeNames[purpose.toUpperCase()])throw new Error('Тип БГ не распознан. Пример: БГИК, БГУ, БГГО, БГВА.');
 if(!/^(44|223)\s*[-–]?\s*ФЗ$|^615\s*[-–]?\s*ПП$|^КБГ$/i.test(law))throw new Error('Закон не распознан: используйте 44-ФЗ, 223-ФЗ, 615-ПП или КБГ.');
 const amount=rawAmount.replace(/[\s\u00a0\u202f]/g,'').replace(/(?:руб\.?|р\.?|₽)$/i,'').replace(',','.');
 if(!/^\d+(?:\.\d{1,2})?$/.test(amount)||!Number.isFinite(Number(amount))||Number(amount)<=0)throw new Error('Сумма должна быть положительной, с точностью до копеек.');
 if(!/^\(?\s*Мск\s*[+-]\s*\d{1,2}\s*\)?$/i.test(zone))throw new Error('Часовой пояс не распознан. Пример: (Мск+0).');
 const term=rawTerm.match(/^(\d+)\s*(?:дн\.?|дней|день|дня)$/i);if(!term||Number(term[1])<1||Number(term[1])>36500)throw new Error('Укажите положительный срок в днях.');
 return {company,purpose:purposeNames[purpose.toUpperCase()],law,amount:Number(amount),zone,days:Number(term[1])};
}
function parseLead(){
 const box=$('parsed-lead');box.replaceChildren();
 try{const data=parseLeadTitle($('lead-title').value);box.append(el('h3','','Параметры распознаны'));const grid=el('div','parsed-data');for(const [k,v] of [['Компания',data.company],['Продукт',data.purpose],['Закон',data.law],['Сумма',new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB'}).format(data.amount)],['Срок',data.days+' дней'],['Часовой пояс',data.zone]]){const d=el('div','');d.append(el('small','',k),el('b','',v));grid.append(d);}box.append(grid,el('div','result-note','Дальше: дополнить ИНН, регион, номер закупки и точные даты из лида. Для коммерческого сравнения нужны реальные расчёты площадок. Здесь выполнен только локальный разбор текста.'));}
 catch(e){box.append(el('h3','','Проверьте заголовок'),el('p','result-note',e.message));}
}
$('parse-lead').addEventListener('click',parseLead);
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('nav a').forEach(n=>n.classList.remove('active'));a.classList.add('active');}));
selectStep('sources');bankList();bankCard();parseLead();
