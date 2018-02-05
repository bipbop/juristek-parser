const ExtendableError = require('es6-error');
const _ = require('lodash');

class JuristekException extends ExtendableError {} /* Erros de */
class JuristekInstanceException extends JuristekException {} /* Erros de Robô */
class JuristekParserException extends JuristekException {} /* Erros de Interpretação */

const errorCodes = {
  E_TABLE_NOT_FOUND: 1, // Tipo de consulta inexistente
  E_DATABASE_NOT_FOUND: 1, // Tribunal não suportado
  E_NOT_FOUND: 2, // Consulta não encontrada
  E_INVALID_ARGUMENT: 3, // Parâmetro de consulta inválido
  E_SYNTAX_ERROR: 3, // Erro de sintaxe
  E_MISSING_ARGUMENT: 4, // Parâmetro de consulta obrigatório inexistente
  E_MULTIPLE_RESULTS_FOUND: 5, // Consulta com múltiplos resultados
  E_BLOCKED_IP: 6, // IP do robô bloqueado
  E_UNEXPECTED_HTTP_CODE: 7, // Erro inesperado durante consulta ao site
  E_TIMEOUT: 7, // Ocorreu timeout durante a consulta
  E_LOAD_PAGE_FAILED: 7, // Erro de carregamento de página
  E_PROXY_CONFIGURATION_ERROR: 7, // Erro de configuração de proxy
  E_REMOTE_SITE_UNDER_MAINTENANCE: 8, // Site sob manutenção
  E_AUTHENTICATION_FAILURE: 9, // Erro ao logar no site
  E_INTERNAL_SERVER_ERROR: 11,
  E_INTERNAL_ERROR: 11, // Erro interno
  E_QUERY_LIMIT: 12, // Limite de consulta atingido
  E_PASSWORD_REQUIRED: 20, //
  E_JUSTICE_SECRET: 21,
  E_EXPECTED_DATA_NOT_FOUND: 24, // Erro durante a obtenção dos dados
  E_CAPTCHA_BREAK_FAILED: 25, // Não foi possível quebrar o captcha
  E_OUTDATED: 1522,
  E_ARCHIVED_PROCESS: 1522,
  E_WITHOUT_PROCEEDINGS: 1523, // Processos sem andamentos Office
  E_UNKNOWN: 0,
};

module.exports = errorCodes;

module.exports.codename = k => _.findKey(errorCodes, n => n === k) || 'E_UNKNOWN';

module.exports.Instance = JuristekInstanceException;
module.exports.Exception = JuristekException;
module.exports.Parser = JuristekParserException;
