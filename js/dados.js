/* Conteúdo da página — edite aqui para mudar textos, equipamentos e conjuntos. */

/* Dados da empresa. Campo vazio = não aparece no site.
   whatsapp: DDI + DDD + número, só dígitos (ex.: '5549999998888'). Vazio = o WhatsApp abre e a pessoa escolhe o contato. */
window.EMPRESA = {
  whatsapp: '5549991219464',
  telefone: '',            // ex.: '(49) 3300-0000'
  endereco: 'R. Borges de Medeiros, 1995-E · Passo dos Fortes · Chapecó/SC · 89805-570',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Mestre+das+M%C3%A1quinas+R.+Borges+de+Medeiros+1995-E+Chapec%C3%B3',
  horario: 'Seg a sex, 8h–12h e 13h30–17h30 · Sáb, 8h–12h',
  instagram: 'mmestredasmaquinas',
  // ⚠️ confirmar o raio real de entrega
  cidades: ['Chapecó', 'Guatambu', 'Cordilheira Alta', 'Nova Itaberaba', 'Arvoredo', 'Xaxim', 'Coronel Freitas', 'Planalto Alegre', 'Caxambu do Sul', 'Seara']
};
window.WHATSAPP = window.EMPRESA.whatsapp;

/* Dúvidas frequentes (respostas do kit do Google Meu Negócio). */
window.FAQ = [
  { p: 'Vocês entregam na obra?', r: 'Sim. Entregamos e retiramos na obra em Chapecó e região. Chama no WhatsApp com o endereço que a gente passa o valor da entrega.' },
  { p: 'Dá para alugar por um dia só?', r: 'Dá. A locação é por diária, semana ou mês: você paga só o período que usar.' },
  { p: 'Não sei qual máquina preciso. Vocês ajudam?', r: 'Ajudamos. Manda uma foto ou descreve o serviço no WhatsApp que a gente indica a máquina certa e passa o valor.' },
  { p: 'Quais cidades vocês atendem?', r: 'Chapecó e região: {cidades}. Sua obra é em outra cidade? Pergunte no WhatsApp.' },
  { p: 'Onde vocês ficam?', r: 'Na R. Borges de Medeiros, 1995-E, Passo dos Fortes, Chapecó/SC. Você pode retirar o equipamento com a gente ou pedir a entrega na obra.' },
  { p: 'Qual o horário de atendimento?', r: 'De segunda a sexta, das 8h às 12h e das 13h30 às 17h30, e no sábado das 8h às 12h. Mandou mensagem fora do horário? A gente responde logo no primeiro horário.' },
  { p: 'Não achei o equipamento no site. Vocês têm?', r: 'No site estão só os mais pedidos. A frota tem mais de 100 itens: pergunte no WhatsApp que a gente confere na hora.' }
  // ⚠️ quando definir, incluir: { p: 'Que documentos preciso para alugar?', r: '...' } e { p: 'Precisa de caução?', r: '...' }
];

/* Equipamentos para locação. foto = midia/produtos/<id>.webp · fases = em quais fases da obra ele é usado.
   destaque = aparece com o selo "Mais pedido". */
window.EQUIPAMENTOS = {
  betoneira: { nome: 'Betoneira', det: '400 litros', fases: [1, 2, 3], destaque: true },
  sapo: { nome: 'Compactador tipo sapo', fases: [1], destaque: true },
  placa: { nome: 'Placa vibratória', fases: [1] },
  rompedor: { nome: 'Martelete rompedor', det: '5 a 30 kg', fases: [1, 3], destaque: true },
  mini_escavadeira: { nome: 'Mini escavadeira', fases: [1] },
  vibrador: { nome: 'Vibrador de concreto', fases: [1, 2], destaque: true },
  andaime: { nome: 'Andaime', fases: [2, 3, 4], destaque: true },
  escora: { nome: 'Escora metálica', fases: [2], destaque: true },
  guincho: { nome: 'Guincho de coluna', fases: [2, 3] },
  misturador: { nome: 'Misturador de argamassa', fases: [2, 3, 4] },
  serra_marmore: { nome: 'Serra mármore', fases: [2, 3, 4] },
  nivel_laser: { nome: 'Nível a laser', fases: [1, 2, 3, 4] },
  martelete: { nome: 'Martelete perfurador', det: 'SDS Plus', fases: [3] },
  furadeira: { nome: 'Furadeira e parafusadeira', fases: [2, 3, 4] },
  cortadora_parede: { nome: 'Cortadora de parede', fases: [3] },
  escada: { nome: 'Escada', fases: [3] },
  plataforma: { nome: 'Plataforma elevatória', fases: [2, 3, 4] },
  projetora: { nome: 'Projetora de argamassa', fases: [3] },
  cortadora_piso: { nome: 'Cortadora de piso', fases: [4] },
  vibrador_porcelanato: { nome: 'Vibrador para porcelanato', fases: [4] },
  girafa: { nome: 'Lixadeira de parede', det: 'girafa', fases: [3, 4] },
  airless: { nome: 'Pintura airless', fases: [4] },
  aspirador: { nome: 'Aspirador industrial', det: 'pó e líquidos', fases: [3, 4] },
  lavadora: { nome: 'Lavadora de alta pressão', fases: [2, 3, 4] },
  enceradeira: { nome: 'Enceradeira industrial', fases: [4] }
};

/* Os 4 capítulos do filme de abertura. titulo = manchete; destaques = 4 equipamentos mostrados. */
window.FASES = [
  { n: 1, nome: 'Terreno e fundações', curto: 'Fundação', titulo: ['Firme desde', 'a base.'],
    destaques: ['mini_escavadeira', 'sapo', 'rompedor', 'betoneira'],
    texto: 'Preparação do local, escavação, compactação e os elementos que levam as cargas da obra até o solo.' },
  { n: 2, nome: 'Estrutura e alvenaria', curto: 'Estrutura', titulo: ['Deixe a obra', 'subir.'],
    destaques: ['andaime', 'escora', 'guincho', 'vibrador'],
    texto: 'Fôrmas, concretagem, paredes e laje. É aqui que a obra ganha forma e altura.' },
  { n: 3, nome: 'Instalações e revestimentos', curto: 'Instalações', titulo: ['Por dentro', 'e por fora.'],
    destaques: ['martelete', 'cortadora_parede', 'misturador', 'plataforma'],
    texto: 'Água, energia e climatização passam pelas paredes, e as superfícies são preparadas por dentro e por fora.' },
  { n: 4, nome: 'Acabamentos e entrega', curto: 'Acabamento', titulo: ['Pronta para', 'entregar.'],
    destaques: ['cortadora_piso', 'girafa', 'lavadora', 'aspirador'],
    texto: 'Pisos, pintura e a limpeza final para entregar o imóvel pronto para morar.' }
];

window.CONJUNTOS = [
  { nome: 'Fundação', fase: 1, itens: ['sapo', 'placa', 'betoneira', 'vibrador'] },
  { nome: 'Estrutura e laje', fase: 2, itens: ['escora', 'andaime', 'betoneira', 'vibrador', 'guincho'] },
  { nome: 'Alvenaria', fase: 2, itens: ['betoneira', 'misturador', 'serra_marmore', 'andaime'] },
  { nome: 'Instalações', fase: 3, itens: ['martelete', 'furadeira', 'cortadora_parede', 'escada'] },
  { nome: 'Reboco', fase: 3, itens: ['betoneira', 'misturador', 'projetora', 'andaime'] },
  { nome: 'Pisos e porcelanato', fase: 4, itens: ['cortadora_piso', 'misturador', 'vibrador_porcelanato', 'nivel_laser'] },
  { nome: 'Pintura', fase: 4, itens: ['girafa', 'aspirador', 'airless', 'andaime'] },
  { nome: 'Limpeza pós-obra', fase: 4, itens: ['lavadora', 'aspirador', 'enceradeira'] }
];
