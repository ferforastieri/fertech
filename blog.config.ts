// Purpose: This file is used to configure the blog, including the author, title, description, and other settings.
import Intro from "./app/intro.mdx";

const siteData: any = {
  author: "Fernando", // author name
  title: "FerTech", // website title
  description:
    "Um blog minimalista para artigos e meu desenvolvimento pessoal", // website description
  theme: "light", // light | dark
  language: "pt-BR", // zh-CN | en
  githubRepo: "https://github.com/ferforastieri", // your blog's github repo

  // how to change the favicon of the website?
  // change the app/favicon.ico file directly，or refer to the document below
  // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

  //header config
  header: {
    logo: "/logo.png", //  /public/logo.png
    title: "FerTech", // header title

    // navigation bar
    routes: [
      {
        name: "Artigos",
        value: "/blog",
      },
      {
        name: "Projetos",
        value: "/projects",
      },

      {
        name: "Currículo",
        value: "/curriculum",
      },
    ],
  },

  home: {
    title: "Bem vindo ao FerTech",

    // introduction or about me
    intro: Intro, // file path of the introduction
    socials: {
      email: "fernandoforastieri2@gmail.com",
      github: "https://github.com/ferforastieri",
      linkedin: "www.linkedin.com/in/fernando-forastieri",
      facebook: "",
      instagram: "",
      youtube: "https://www.youtube.com/channel/UCD3Zn5P8s8ojIi3U5-oOBSQ",
    },
  },
  blog: {
    title: "Portifólio",
    description: "Toda a minha vida tech, documentada",
  },

  project: {
    title: "O que eu tenho feito e contribuido:",
    description:
      "Um resumo de todos os projetos e de participacoes ativas na comunidade Tech ao longo dos anos",

    // name, description, link are required
    // github: the address of the project's github repo
    // status: active | inactive
    // and so on
    // you can add more fields according to your needs ,but you need to modify the code in the projects/page.tsx file
    projects: [
        {
            name: "Vendedor Gold - Império Cerveja",
            description:
              "Sistema completo de gestão para vendedores da Império Cerveja. Desenvolvido em React Native com TypeScript, backend robusto em NestJS e interface web em React. Inclui controle de vendas, gestão de clientes, relatórios em tempo real e integração com sistemas ERP.",
            link: "https://clubepropintor.com.br",
            github: "",
            status: "active",
          },
          {
            name: "Parceiro Gold - Império Cerveja",
            description:
              "Plataforma mobile para distribuidores da Império Cerveja, disponível na Play Store. Desenvolvido com React Native, TypeScript e NestJS. Sistema de gestão de distribuição, controle de estoque, rastreamento de entregas e dashboard analítico para parceiros.",
            link: "https://parceirogold.com.br",
            github: "",
            status: "active",
          },
          {
            name: "GabrielPro - Arquitetura",
            description:
              "Site institucional e portfólio para empresa de arquitetura. Desenvolvido em Next.js com TypeScript, implementando Clean Architecture e Use Cases. Design responsivo, otimizado para SEO, galeria de projetos e sistema de contato integrado.",
            link: "https://gabrielpro.com.br",
            github: "",
            status: "active",
          },
          {
            name: "Ecossistema Sherwin Williams",
            description:
              "Sistema completo de gestão de cores e produtos para Sherwin Williams. Aplicativo mobile em Ionic, backend em JavaScript e versão web responsiva. Inclui catálogo de cores, calculadora de tintas, gestão de pedidos e integração com estoque.",
            link: "",
            github: "",
            status: "active",
          },
          {
            name: "E-Sports",
            description:
              "Minha Carreira Completa nos E-sports:",
            link: "https://konect.gg/vicio",
            github: "",
            status: "active",
          },
    ],
    // status color and text
    getStatus: (status: string) => {
      switch (status) {
        case "active":
          return {
            variant: "default",
            text: "ACTIVE",
          };
        case "inactive":
          return {
            variant: "secondary",
            text: "INACTIVE",
          };
        case "bug":
          return {
            variant: "destructive",
            text: "BUG",
          };
        case "dev":
          return {
            variant: "outline",
            text: "DEV",
          };
        default:
          return {
            variant: "default",
            text: "ACTIVE",
          };
      }
    },

    view: "list", // grid | list

    target: "_blank", // _blank | _self | _parent | _top
  },
};

export default siteData;
