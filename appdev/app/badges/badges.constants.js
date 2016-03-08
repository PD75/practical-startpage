angular.module('ps.badges', [])
  .constant('badgeConstants', {
    badges: {
      gmail: {
        iconImage: "img/gmail-icon-128.png",
        directive: "gmail",
      },
      mail: {
        iconClass: "mail",
        directive: "balle",
      },
    },
  });
