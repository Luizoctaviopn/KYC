# KYC front-end

Interface leve em HTML/CSS/JS para enviar dados e documentos de verificação de identidade
para a API já existente do projeto. Ajuste a URL da API no arquivo `app.js` (constante
`API_BASE_URL`) ou salve `kyc_api_url` no `localStorage` para apontar para homologação ou
produção.

## Estrutura
- `index.html`: layout do formulário de cadastro, status e orientações de uso.
- `styles.css`: tema escuro, responsivo e com destaque para ações principais.
- `app.js`: coleta os dados, envia via `FormData` para o endpoint `/kyc/applications` e
  consulta o status do protocolo em `/kyc/applications/{protocol}`.

## Como usar localmente
1. Abra o `index.html` em um navegador moderno (ou sirva com `python -m http.server 8000`).
2. Ajuste a constante `API_BASE_URL` no `app.js` para apontar para o seu backend.
3. Envie o formulário com documentos e acompanhe o status pelo painel lateral.

## Publicação no Eventco.com.br
Como o Eventco utiliza hospedagem web tradicional, você pode fazer o deploy como
páginas estáticas.

1. **Crie uma pasta no servidor** (ex.: `/public_html/kyc/`).
2. **Envie os arquivos** `index.html`, `styles.css` e `app.js` via SFTP ou gerenciador de
   arquivos do Eventco.
3. **Configure a URL da API**: edite o `app.js` no servidor para apontar para a API
   existente ou salve no console do navegador `localStorage.setItem('kyc_api_url', 'https://sua-api');`.
4. **Teste** acessando `https://eventco.com.br/kyc/` (ou o caminho publicado) e envie uma
   simulação para verificar o retorno do backend.
5. **Cache/SSL**: garanta que o servidor entrega os arquivos com SSL habilitado e
   configure cabeçalhos de cache leves (ex.: 5-10 minutos) para facilitar atualizações.

## Checklist de integração
- [ ] Confirmar com o time back-end os endpoints definitivos e autenticação necessária.
- [ ] Validar se há necessidade de headers adicionais (token/bearer) e adicionar no
  `fetch` do `app.js`.
- [ ] Atualizar textos de consentimento e política de privacidade conforme jurídico.
- [ ] Adicionar monitoramento (ex.: Pixel/GA) se requerido pelo marketing.
