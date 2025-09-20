import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Products API",
      version: "1.0.0",
      description: "Backend для продуктов, авторизации и корзины",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Локальный сервер",
      },
      {
        url: "https://productsback-production.up.railway.app/api",
        description: "Продакшен сервер",
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
