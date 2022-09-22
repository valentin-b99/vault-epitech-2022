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
        'HomePage.helmet.title': 'Epitech CPool Events Dashboard',
        'app.components.LeftMenu.navbrand.title': 'Epitech CPool',
        'app.components.LeftMenu.navbrand.workplace': 'Events Dashboard',
        'Auth.form.welcome.title': 'Epitech CPool Events Dashboard',
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
