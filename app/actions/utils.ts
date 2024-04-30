
import bcrypt from 'bcryptjs';

export function parseJwt(token: string | undefined) {
    if (!token || token === undefined || token.split('.').length<2 ) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedData = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(decodedData);
}


export function hashPassword(password: string) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);;
    return hash;
}