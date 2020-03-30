import ExtendableError from 'es6-error';

export default class JuristekException extends ExtendableError {
  toString() {
    return this.message;
  }
}
