
/*
 * @Author: dva
 * @Date: 2020-01-13 20:15:08
 * @LastEditTime : 2020-01-14 20:32:49
 * @LastEditors  : Please set LastEditors
 * @Description: 工具模块
 * @FilePath: \chatroom\client\src\utils\index.js
 */
  //RSA公钥
const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCK3siV2MKl7ADFMajEsbc/ZrST
fo9h37c6+m0cUHOTqGR4V+Ugzc5Wzpcrz6QGu7/umQBJRC3LZ8xRW8+J6Z1lI0+T
r6LT8NfLUeyBTBXkBI1j0BIzmEjsW/a1vDr2ahXn1RFvtnHeKs41lbICkY7mRA2c
AyiMWhrteM1d1MR3gQIDAQAB
-----END PUBLIC KEY-----`;

// 定义AES密钥
export const AES_KEY = "dvazxcvbnm888666"; //16个字符
export const AES_IV = "1234567890123456"; //16个字符

import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

  /**
   * @description: 处理cookie
   * @param {string} document.cookie like 
   * @return: Object
   */  
export function solveCookie(cookie) {
    
    let cookieArr = cookie.split(';')
    return cookieArr.reduce((pre, item) => {
      let index = item.indexOf('=');
      let key = item.substring(0,index).trim();
      let value = item.substring(index+1).trim()
      pre[key] = value;
      return pre;
    },{})


  }

/**
 * @description: rsa公钥加密
 * @param {String} 
 * @return: String 
 */
export function RSAEncrypt(msg) {
    let jse = new JSEncrypt();
    
    jse.setPublicKey(publicKey);
    // 加密内容

    return jse.encrypt(msg);
  
}

/**
 * @description: AES加密
 * @param {String} 明文
 * @return: String 密文
 */
export function AESEncrypt(msg) {
  var encrypted = CryptoJS.AES.encrypt(
    msg,
    CryptoJS.enc.Utf8.parse(AES_KEY),
    { iv: CryptoJS.enc.Utf8.parse(AES_IV) }
  );
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

/**
 * @description: AES解密
 * @param {String} 密文 
 * @return: String 明文
 */
export function AESDecrypt(ciphertext) {
  var decrypted = CryptoJS.AES.decrypt(
    ciphertext,
    CryptoJS.enc.Utf8.parse(AES_KEY),
    { iv: CryptoJS.enc.Utf8.parse(AES_IV) }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * @description: 随机产生一种颜色(不是黑白)
 * @param {none} 
 * @return: 16进制的颜色
 */
export function color16() {
  //十六进制颜色随机
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  var color = "#" + r.toString(16) + g.toString(16) + b.toString(16);
  if (color == "#ffffff" || color == "#000000") {
    return color16();
  }
  return color;
}


