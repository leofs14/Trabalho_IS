
class Auth extends API {
  
    static async auth(endpoint, params) {
      
      const response = await super.post(endpoint, params);
  
    
      return await response.json();
    }
  }