import bcrypt from 'bcrypt';

class Secure {
  static encrypt = async (plainText, round) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainText, round);
    return hash;
  };

  static compare = async (plainText, hash) => {
    return await bcrypt.compare(plainText, hash);
  };
}

export default Secure;
