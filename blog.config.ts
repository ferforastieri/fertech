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
        value:
          "https://docs.google.com/document/d/1j93PsbvFdZ_y7pDpZ2mHGRevOjN-QTE1/edit?usp=sharing&ouid=104278206443109010114&rtpof=true&sd=true",
      },
      {
        name: "esports",
        value: "/esports",
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
            name: "Tech Ears",
            description:
              "Projeto OpenSource que criei com o objetivo de ajudar desenvolvedores a melhorarem seu inglês técnico por meio de um jogo estilo Wordle",
            link: "",
            github: "",
            status: "active",
          },
          {
            name: "TrilhaInfo",
            description:
              "Projeto OpenSource que participo com o objetivo de agregar e organizar conteúdos gratuitos em português para pessoas que querem ingressar na área de Tecnologia.",
            link: "https://trilha.info/",
            github: "",
            status: "active",
          },
      {
        name: "DentalDash",
        description:
          "UM ERP completo para a industria de odontologia, utlizando NestJs para a API  e front em NextJs",
        link: "",
        github: "",
        status: "dev",
      },
      {
        name: "WooviChallenge",
        description: "Resolucao dos desafios propostos pela fintech Woovi",
        link: "https://woovi.com",
        github: "",
        status: "dev",
      }
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
