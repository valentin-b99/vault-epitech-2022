import Logo from './extensions/logo.png';
import favicon from './extensions/favicon.ico';

export default {
  config: {
    auth: {
      logo: Logo,
    },
    menu: {
      logo: Logo,
    },
    head: {
      favicon: favicon,
    },
    translations: {
      en: {
        'HomePage.helmet.title': 'Vault-Epitech Dashboard',
        'app.components.LeftMenu.navbrand.title': 'Vault-Epitech',
        'app.components.LeftMenu.navbrand.workplace': 'Events Dashboard',
        'Auth.form.welcome.title': 'Vault-Epitech Events Dashboard',
        'Auth.form.welcome.subtitle': 'Log in to a beautiful world',
      },
    },
    tutorials: false,
    notifications: {
      release: false,
    },
  },

  bootstrap() {},
};
