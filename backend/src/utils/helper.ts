import * as bcrypt from 'bcrypt';
import { readFile } from 'fs';

const saltOrRounds = process.env.SALT_ROUNDS;

export const createHash = (password: string): string => {
  const hash = bcrypt.hashSync(password, parseInt(saltOrRounds));
  return hash;
};

export const match = (hash: string, password: string): boolean => {
  const isMatch = bcrypt.compareSync(password, hash);
  return isMatch;
};

export async function readFilePromise(filePath): Promise<string> {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, html) => {
      if (!err) {
        resolve(html);
      } else {
        reject(err);
      }
    });
  });
}
