import { ObjectId } from 'mongodb';

class CodeChecker {
  constructor() {
    this.codeMap = new Map();
  }

  getCode = (userId) => this.codeMap.get(userId.toString());

  addCode = (userId, value) => this.codeMap.set(userId.toString(), value);

  generateCode = (digits) => Math.floor(Math.random() * Math.pow(10, digits));

  deleteCode = (userId) => this.codeMap.delete(userId.toString());
}

export default CodeChecker;
