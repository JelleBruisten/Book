export class JwtUtil {

  static decodeToken(accessToken: string) {
    let base64Url = accessToken.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let JwtDecode = JSON.parse(window.atob(base64));
    console.info('Decoded Token: ', JwtDecode);
    return JwtDecode;
  }

  static expirationTime(accessToken: string): number {
    let parseJwt = JwtUtil.decodeToken(accessToken);
    let expTime = parseJwt.exp;
    return expTime * 1000;
  }

  static isExpired(accessToken: string): Boolean {
    let expTime = JwtUtil.expirationTime(accessToken);
    console.log('Expiration time: ', expTime, new Date(expTime));
    let currentTimeInMilli = Date.now();
    console.log(
      'Current time: ',
      currentTimeInMilli,
      new Date(currentTimeInMilli)
    );
    if (expTime < currentTimeInMilli) {
      console.warn('Token Expired!');
      return true;
    }
    return false;
  }
}
