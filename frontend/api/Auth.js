// A classe Auth é uma extensão da classe API. Ela herda todos os métodos e funcionalidades da classe API.
class Auth extends API {
    // O método auth é um método estático da classe Auth. Ele é usado para fazer requisições de autenticação,
    // como login ou registro, encapsulando chamadas POST específicas para endpoints de autenticação.
    static async auth(endpoint, params) {
      // Chama o método post da classe pai (API) usando `super`, passando o endpoint e os parâmetros necessários.
      // Isso envia uma requisição POST para o endpoint especificado com os parâmetros fornecidos.
      const response = await super.post(endpoint, params);
  
      // Aguarda a resposta do servidor e converte-a em JSON para uso posterior.
      // Como o método `post` da classe API já trata redirecionamentos e erros, esta linha assume que a resposta
      // será bem-sucedida e no formato JSON.
      return await response.json();
    }
  }