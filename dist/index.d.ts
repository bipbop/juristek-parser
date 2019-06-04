export as namespace JuristekParser;

interface ParserRepository {
  url: string;
  type: string;
}

interface ParserInformation {
  version: number;
  name: string;
  repository: ParserRepository;
}

interface ArrayParser<T> extends ParserInformation {
  response: T[];
}

interface ParserMetadata {
  _parserLoaded: Date;
  _parser: ParserInformation;
}

interface ProcessosObject extends ParserMetadata {
  processos: ProcessoData.RootObject[];
}

declare namespace ProcessoData {
  interface RootObject {
    dadosCaptura: DadosCaptura;
    numeroProcesso: string;

    advogados: Advogado[];
    partes: Parte[];
    documentos: Andamento[];
    andamentos: { [key: string]: Andamento };
    tags: { [key: string]: string };

    /**
     * String para datas inválidas
     */
    distribuicao?: string | Date;
    inscricao?: string | Date;
    transitoJulgado?: string | Date;
    ajuizamento?: string | Date;
    autuacao?: string | Date;
    andamentoInicial?: string | Date;
    dataValorCausa?: string | Date;
    adicional?: string;
    area?: string;
    assunto?: string;
    foro?: string;
    observacao?: string;
    classe?: string;
    instancia?: number;
    vara?: string;
    numeroVara?: number;
    eletronico?: boolean;
    valorCausa?: number;
    urlProcesso?: string;
    origemProcesso?: string;
    situacao?: string;
    orgao?: string;
    comarca?: string;
    incidente?: string;
    acao?: string;
    numeroProtocolo?: number;
    numeroAntigo?: string;
    localizacao?: string;
    cartorio?: string;
    descricao?: string;
    rito?: string;
    status?: string;
    fase?: string;
  }

  interface Advogado {
    parte?: string;
    nome: string;
    oab?: string;
    documento?: string;
  }

  interface Andamento {
    descricao: string;

    hash: string;
    data: string;
    format: string;

    tipoAndamento?: TipoAndamento;
    urlDocumento?: string;
    codigoNacional?: string;
    tipoDocumento?: string;
    instancia?: number;
    acao?: string;
    classe?: string;
    distribuicao?: string;
    autuacao?: string;
    ordenacao?: string;
    numeroAndamento?: number;
    setor?: string;
  }

  enum TipoAndamento {
    Andamento = "ANDAMENTO",
    Documento = "DOCUMENTO",
  }

  interface DadosCaptura {
    filter: string;
    id: string;
    origin?: string;
    databaseUrl?: string;
    databaseName?: string;
    databaseDescription?: string;
    tableName?: string;
    tableUrl?: string;
    tableDescription?: string;
    instancia?: number;
  }

  interface Parte {
    nome: string;
    tipo?: string;
    documento?: string;
    numero?: number;
    status?: string;
  }
}

declare namespace InfoData {
  interface RootObject {
    table: Table;
    database: Database;
    fields: Field[];
  }

  interface Field {
    name: string;
    caption: string;
    mask?: string;
    description: string;
    select: string;
    mainField: string;
    otherMasks: string[];
    options: Option[];
    default?: string;
  }

  interface Option {
    text: string;
    value?: string;
  }

  interface Database {
    name: string;
    url: string;
    description: string;
  }

  interface Table {
    name: string;
    url?: string;
    description?: string;
  }
}

declare namespace OABData {
  interface RootObject {
    numeroProcesso: string;
    tribunalNome: string;
    tribunalConsulta: string;
    parametros: Parametro[];
    query: string;
    numeroResultado?: string;
    urlProcesso?: string;
    dataUltimoAndamento?: string;
    ultimoAndamento?: string;
    numeroAntigo?: string;
    classe?: string;
    vara?: string;
    nome?: string;
    distribuicao?: string;
    rito?: string;
    autuacao?: string;
    autor?: string;
  }

  interface Parametro {
    name: string;
    parametro: string;
  }
}

export const ExceptionCodes: {
  E_ARCHIVED_PROCESS: number;
  E_AUTHENTICATION_FAILURE: number;
  E_BLOCKED_BY_CONFIG: number;
  E_BLOCKED_IP: number;
  E_BLOCKED_USER: number;
  E_CAPTCHA_BREAK_FAILED: number;
  E_DATABASE_NOT_FOUND: number;
  E_EMAIL_UNCHECKED: number;
  E_EXPECTED_DATA_NOT_FOUND: number;
  E_INTERNAL_EMAIL_UNCHECKED: number;
  E_INTERNAL_ERROR: number;
  E_INTERNAL_NOT_READY: number;
  E_INTERNAL_PUSH_LABEL: number;
  E_INTERNAL_SERVER_ERROR: number;
  E_INTERNAL_USER_BLOCKED: number;
  E_INVALID_ARGUMENT: number;
  E_JUSTICE_SECRET: number;
  E_LEGAL_REVIEW: number;
  E_LOAD_PAGE_FAILED: number;
  E_MISSING_ARGUMENT: number;
  E_MULTIPLE_RESULTS_FOUND: number;
  E_NOT_FOUND: number;
  E_OUTDATED: number;
  E_PASSWORD_REQUIRED: number;
  E_PROXY_CONFIGURATION_ERROR: number;
  E_QUERY_LIMIT: number;
  E_REMOTE_SITE_UNDER_MAINTENANCE: number;
  E_RESOURCE_UNAVAILABLE: number;
  E_SITE_MESSAGE: number;
  E_SYNTAX_ERROR: number;
  E_TABLE_NOT_FOUND: number;
  E_TIMEOUT: number;
  E_UNDER_MAINTENANCE: number;
  E_UNEXPECTED_HTTP_CODE: number;
  E_UNKNOWN: number;
  E_WITHOUT_PROCEEDINGS: number;
};

type ProcessosReturn = ArrayParser<ProcessoData.RootObject>;
type OABReturn = ArrayParser<OABData.RootObject>;
type InfoReturn = ArrayParser<InfoData.RootObject>;

class Parser<T = Cheerio> {
  constructor(u: Cheerio);
  load(): T & ParserInformation;
}

export class Info extends Parser<InfoReturn> {
  static openString(u: string): Info<InfoReturn>;
  static compatible(info: InfoData.RootObject[], procNumber: string, fieldName?: string): InfoData.RootObject[];
}

export class OAB extends Parser<OABReturn> {
  static openString(u: string): Info<OABReturn>;
}

export class Processos extends Parser<ProcessosReturn> {
  static openString(u: string): Info<ProcessosReturn>;
}

export class JuristekException extends Error {
  source?: string | null;
  log?: string | null;
  push?: boolean;
  code?: number;
  toString(): string;
}

export class JuristekInstanceException extends JuristekException { }
export class JuristekParserException extends JuristekException { }

export default Parser;
